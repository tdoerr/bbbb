import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';

import { defineMessages, useIntl } from 'react-intl';
import Header from '/imports/ui/components/common/control-header/component';
import Styled from './styles';
import ButtonBase from '/imports/ui/components/common/button/component';
import Icon from '/imports/ui/components/common/icon/component';
import { notify } from '/imports/ui/services/notification';
import { eventBus } from "../../../../utils/eventBus";

import { layoutDispatch } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';

export const TIMELINE_STORAGE_KEY = 'bbb-timeline-data';

const intlMessages = defineMessages({
  deactivateTimelineLabel: {
    id: 'app.timeline.deactivateTimelineLabel',
    description: 'Label for hiding timeline button'
  },
  timeline: {
    id: 'app.timeline.title',
    description: 'Label for timeline'
  },
  uploadJSON: {
    id: 'app.timeline.uploadJSON',
    description: 'Label for JSON upload button'
  },
  invalidJSON: {
    id: 'app.timeline.invalidJSON',
    description: 'Error message for invalid JSON format'
  },
  invalidFormat: {
    id: 'app.timeline.invalidFormat',
    description: 'Error message for invalid timeline format'
  },
  externalVideo: {
    id: 'app.timeline.externalVideo',
    description: 'External video event'
  },
  poll: {
    id: 'app.timeline.poll',
    description: 'Poll event'
  },
  textResource: {
    id: 'app.timeline.textResource',
    description: 'Text resource event'
  },
  presentation: {
    id: 'app.timeline.presentation',
    description: 'Presentation event'
  },
  jsonLoaded: {
    id: 'app.timeline.jsonLoaded',
    description: 'Success message for JSON upload'
  },
  jsonLoadedFromStorage: {
    id: 'app.timeline.jsonLoadedFromStorage',
    description: 'Success message for loading from storage'
  },
  clearTimeline: {
    id: 'app.timeline.clearTimeline',
    description: 'Clear timeline button label'
  }
});

enum EventType {
  EXTERNAL_VIDEO = 1,
  POLL = 2,
  TEXT_RESOURCE = 3,
  PRESENTATION = 4
}

interface TimelineEvent {
  eventId: number;
  event_type: EventType;
  timestamp: number;
  external_video_link?: string;
  is_anonymous?: boolean;
  question?: string;
  is_multiple_response?: boolean;
  answers?: string[];
  text?: string;
  presentation_name?: string;
}

interface TimelineData {
  meeting_time: number;
  events: TimelineEvent[];
}

const TimelinePanel = () => {
  const intl = useIntl()
  const layoutContextDispatch = layoutDispatch()
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(320); // Default Breite
  const timelineRef = useRef<HTMLDivElement>(null);

  const calculateRequiredWidth = useCallback(() => {
    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll('[data-timeline-item]');
      let maxRequiredWidth = 320; // Minimale Breite

      timelineItems.forEach((item) => {
        const timestampElement = item.querySelector('[data-timestamp]');
        if (timestampElement) {
          // Berechne benötigten Platz für Timestamp + Timeline + Content
          const timestampWidth = timestampElement.getBoundingClientRect().width;
          const requiredWidth = timestampWidth + 120; // 120px für Timeline und Abstände
          maxRequiredWidth = Math.max(maxRequiredWidth, requiredWidth);
        }
      });

      // Setze neue Breite mit etwas Puffer
      setSidebarWidth(maxRequiredWidth + 40);
    }
  }, []);

  useEffect(() => {
    calculateRequiredWidth();
    // Resize Observer für dynamische Anpassungen
    const resizeObserver = new ResizeObserver(() => {
      calculateRequiredWidth();
    });

    if (timelineRef.current) {
      resizeObserver.observe(timelineRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [timelineData]);

  useEffect(() => {
    const storedData = sessionStorage.getItem(TIMELINE_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTimelineData(parsedData);
        eventBus.emit("timelineUpdate", "added")
        notify(intl.formatMessage(intlMessages.jsonLoadedFromStorage), 'info', 'upload');
      } catch (e) {
        console.error('Fehler beim Laden der Timeline-Daten:', e);
        sessionStorage.removeItem(TIMELINE_STORAGE_KEY);
      }
    }
  }, []);

  const saveTimelineData = (data: TimelineData) => {
    try {
      sessionStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Fehler beim Speichern der Timeline-Daten:', e);
    }
  };

  const closePanel = useCallback(() => {
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
      value: false
    })
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: PANELS.NONE
    })
  }, [])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result as string);
        setTimelineData(json);
        sessionStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(json));
        notify(intl.formatMessage(intlMessages.jsonLoaded), 'success', 'upload');
        eventBus.emit("timelineUpdate", "added")
      } catch (error) {
        console.error('JSON Parse Error:', error);
      }
    };

    reader.readAsText(file);
  };

  const handleClearTimeline = () => {
    setTimelineData(null);
    sessionStorage.removeItem(TIMELINE_STORAGE_KEY);
    eventBus.emit("timelineUpdate", "removed")
    notify(intl.formatMessage(intlMessages.clearTimeline), 'info', 'delete');
  };

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor(timestamp);
    const seconds = Math.round((timestamp - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderEventContent = (event: TimelineEvent) => {
    switch (event.event_type) {
      case EventType.EXTERNAL_VIDEO:
        return (
          <Styled.EventContent>
            <Icon iconName="video" />
            <Styled.VideoLink
              href={event.external_video_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.external_video_link}
            </Styled.VideoLink>
          </Styled.EventContent>
        );

      case EventType.POLL:
        return (
          <Styled.EventContent>
            <Icon iconName="polling" />
            <Styled.PollContainer>
              <Styled.PollQuestion>{event.question}</Styled.PollQuestion>
              <Styled.PollDetails>
                {event.is_anonymous && <span>Anonym</span>}
                {event.is_multiple_response && <span>Mehrfachauswahl</span>}
              </Styled.PollDetails>
              <Styled.PollAnswers>
                {event.answers?.map((answer, index) => (
                  <div key={index}>{answer}</div>
                ))}
              </Styled.PollAnswers>
            </Styled.PollContainer>
          </Styled.EventContent>
        );

      case EventType.TEXT_RESOURCE:
        return (
          <Styled.EventContent>
            <Icon iconName="file-text" />
            <Styled.TextResource>{event.text}</Styled.TextResource>
          </Styled.EventContent>
        );

      case EventType.PRESENTATION:
        return (
          <Styled.EventContent>
            <Icon iconName="file" />
            <Styled.PresentationFile>
              <span>{event.presentation_name}</span>
            </Styled.PresentationFile>
          </Styled.EventContent>
        );

      default:
        return null;
    }
  };

  return (
    <Styled.TimelineSidebarContent data-test="timelineContainer">
      <Header
        leftButtonProps={{
          onClick: closePanel,
          'aria-label': intl.formatMessage(intlMessages.deactivateTimelineLabel),
          label: intl.formatMessage(intlMessages.timeline),
        }}
      />

      <Styled.TimelineContent>
        <Styled.ButtonGroup>
          <Styled.UploadButton>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="jsonFileUpload"
            />
            <ButtonBase
              color="primary"
              onClick={() => document.getElementById('jsonFileUpload')?.click()}
              label={intl.formatMessage(intlMessages.uploadJSON)}
            />
          </Styled.UploadButton>

          <Styled.ActionButton
            color="danger"
            onClick={handleClearTimeline}
            label={intl.formatMessage(intlMessages.clearTimeline)}
          />
        </Styled.ButtonGroup>

        {error && (
          <Styled.ErrorMessage>
            <Icon iconName="warning" />
            {error}
          </Styled.ErrorMessage>
        )}

        {timelineData?.events && timelineData.events.length > 0 && (
          <Styled.TimelineList>
            {timelineData.events
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((event) => (
                <Styled.TimelineItem key={event.eventId}>
                  <Styled.TimeStamp>
                    {formatTime(event.timestamp)}
                  </Styled.TimeStamp>
                  {renderEventContent(event)}
                </Styled.TimelineItem>
              ))}
          </Styled.TimelineList>
        )}
      </Styled.TimelineContent>
    </Styled.TimelineSidebarContent>
  );
};

const TimelinePanelContainer = () => {
  return (
    <TimelinePanel />
  );
};

export default TimelinePanelContainer;
