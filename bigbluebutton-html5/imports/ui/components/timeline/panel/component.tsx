import React, {
  useCallback,
} from 'react';

import { defineMessages, useIntl } from 'react-intl';
import Header from '/imports/ui/components/common/control-header/component';
import Styled from './styles';

import { layoutDispatch } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';

const intlMessages = defineMessages({
  deactivateTimelineLabel: {
    id: 'app.timeline.deactivateTimelineLabel',
    description: 'Label for hiding timeline button'
  },
  timeline: {
    id: 'app.timeline.title',
    description: 'Label for hiding timeline button'
  },
});

const TimelinePanel = () => {
  const intl = useIntl()
  const layoutContextDispatch = layoutDispatch()

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

  return (
    <Styled.TimelineSidebarContent data-test="timelineContainer">
    {/* @ts-ignore - JS code */}
      <Header
        leftButtonProps={{
          onClick: closePanel,
          'aria-label': intl.formatMessage(intlMessages.deactivateTimelineLabel),
          label: intl.formatMessage(intlMessages.deactivateTimelineLabel),
        }}
      data-test="timelineHeader"
      />
    </Styled.TimelineSidebarContent>
  )
};

const TimelinePanelContainer = () => {
  return (
    <TimelinePanel/>
  );
};

export default TimelinePanelContainer;
