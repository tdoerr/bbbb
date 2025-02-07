import React, { useState, useEffect } from 'react';
import { Timeline, Progress, Marker } from './styles';
import ConfirmationModal from '../../common/modal/confirmation/component';
import { startWatching } from '../../external-video-player/external-video-player-graphql/modal/component';
import { useMutation } from '@apollo/client';
import { EXTERNAL_VIDEO_START } from '../../external-video-player/mutations';
import { EventList, MarkerEvent } from './types'
import { startPoll } from '../../poll/components/StartPollButton';
import { POLL_CREATE } from '../../poll/mutations';
import { layoutDispatch } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';
import Session from '../../../services/storage/in-memory'
import { textToMarkdown } from '../../chat/chat-graphql/chat-message-form/service';
import { CHAT_SEND_MESSAGE } from '../../chat/chat-graphql/chat-message-form/mutations';
import useDeduplicatedSubscription from '../../../core/hooks/useDeduplicatedSubscription';
import { PROCESSED_PRESENTATIONS_SUBSCRIPTION } from '../../whiteboard/queries';
import { PRESENTATION_SET_CURRENT } from '../../presentation/mutations';
import { activateTimer_ } from '../actions-dropdown/container';
import { TIMER_ACTIVATE, TIMER_SET_TIME, TIMER_START, TIMER_SWITCH_MODE } from '../../timer/mutations';

/**
 * The props represent the timline-config-file 
 */
type ProgressBarTimelineProps = {
    eventsData: EventList;
}

/**
 * This is the implementation of the timeline which appears above the actions-bar. 
 * 
 * @param eventsData 
 * @returns Timline component
 */
const ProgressBarTimeline = ({ eventsData }: ProgressBarTimelineProps) => {
    // #### INIT #### //
    const dispatch = layoutDispatch()
    //@ts-ignore
    const CHAT_CONFIG = window.meetingClientSettings.public.chat
    const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id
    const PUBLIC_GROUP_CHAT_ID = CHAT_CONFIG.public_group_id
    const [currentReachedEventId, setCurrentReachedEventId] = useState<number>()
    const totalSeconds = eventsData.meeting_time * 60
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [reachedMarkers, setReachedMarkers] = useState(new Set())
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>('title')
    const [modalDescription, setModalDescription] = useState<string>('description')
    const [markerPositions, setMarkerPositions] = useState<MarkerEvent[]>(
        eventsData.events.map((event) => ({
            timestamp: event.timestamp * 60,
            event,
        }))
    );
    // #### MUTATIONS #### //
    const [startExternalVideo] = useMutation(EXTERNAL_VIDEO_START)
    const [createPoll] = useMutation(POLL_CREATE)
    const [chatSendMessage] = useMutation(CHAT_SEND_MESSAGE)
    const [timerStart] = useMutation(TIMER_START)
    const [timerSwitchMode] = useMutation(TIMER_SWITCH_MODE)
    const [timerSetTime] = useMutation(TIMER_SET_TIME)
    const [timerActivate] = useMutation(TIMER_ACTIVATE)
    const [presentationSetCurrent] = useMutation(PRESENTATION_SET_CURRENT)
    //@ts-ignore
    const { data: presentationData } = useDeduplicatedSubscription(
        PROCESSED_PRESENTATIONS_SUBSCRIPTION,
    );
    const presentations = presentationData?.pres_presentation || []
    const setPresentation = (presentationId: string) => {
        presentationSetCurrent({ variables: { presentationId } })
    }

    const hasNextMarker = markerPositions.some((marker) => marker.timestamp > elapsedSeconds);
    const hasPreviousMarker = markerPositions.some((marker) => marker.timestamp < elapsedSeconds);

    // #### USE-EFFECT-HOOKS #### //
    useEffect(() => {
        let interval: number
        if (isPlaying) {
            interval = setInterval(() => {
                setElapsedSeconds((prev) => {
                    const nextTime = prev + 1;
                    markerPositions.forEach((marker) => {
                        if (nextTime === marker.timestamp && !reachedMarkers.has(marker.timestamp)) {
                            setReachedMarkers((prevMarkers) => new Set(prevMarkers).add(marker.timestamp));
                            //@ts-ignore
                            const { eventId, event_type } = marker.event;
                            setCurrentReachedEventId(eventId)
                            setModalTitle(`Event triggered - type: ${event_type}`);
                            setModalDescription(getModalDescription(marker));
                            setIsOpen(true);
                            setIsPlaying(false);
                        }
                    });
                    if (nextTime >= totalSeconds) {
                        clearInterval(interval);
                        return totalSeconds;
                    }
                    return nextTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, markerPositions, reachedMarkers, totalSeconds]);

    useEffect(() => {
        if (!isOpen) {
            togglePlayPause()
        }
    }, [isOpen])

    useEffect(() => {
        setIsPlaying(false)
    }, [])

    // #### SERVICE-FUNCTIONS #### // 

    const getMarkerColor = (type: number) => {
        switch (type) {
            case 1:
                return 'red'
            case 2:
                return 'blue'
            case 3:
                return 'green'
            case 4:
                return 'yellow'
            case 5:
                return 'black'
            default:
                return 'gray'
        }
    }

    const getModalDescription = (marker: MarkerEvent) => {
        //@ts-ignore
        const { eventId, event_type, question, text, external_video_link, presentation_name, duration } = marker.event;
        switch (event_type) {
            case 1:
                return `Play video: ${external_video_link}?`
            case 2:
                return `Send poll with question: ${question}?`
            case 3:
                return `Send this text to public chat: ${text}?`
            case 4:
                return `Change presentation to: ${presentation_name}?`
            case 5:
                return `Set timer to duration: ${duration}?`
            default:
                return ''
        }
    }
    const jumpToNextMarker = () => {
        setIsOpen(false);
        const nextMarker = markerPositions.find((marker) => marker.timestamp > elapsedSeconds);
        if (nextMarker) {
            setElapsedSeconds(nextMarker.timestamp);
        }
    };

    const jumpToPreviousMarker = () => {
        const previousMarker = [...markerPositions].reverse().find((marker) => marker.timestamp < elapsedSeconds);
        if (previousMarker) {
            setElapsedSeconds(previousMarker.timestamp);
        }
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };


    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('markerIndex', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const markerIndex = e.dataTransfer.getData('markerIndex');
        const timelineRect = e.currentTarget.getBoundingClientRect();
        const newTimestamp = Math.round(
            ((e.clientX - timelineRect.left) / timelineRect.width) * totalSeconds
        );

        setMarkerPositions((prevPositions) => {
            const updatedPositions = [...prevPositions];
            updatedPositions[markerIndex] = {
                ...updatedPositions[markerIndex],
                timestamp: Math.min(Math.max(newTimestamp, 0), totalSeconds),
            };
            return updatedPositions;
        });
    };

    const onModalConfirm = () => {
        setIsOpen(false)
        const event = eventsData.events[currentReachedEventId! - 1]
        if (event.event_type === 1) {
            startWatching(event.external_video_link!, startExternalVideo)
        } else if (event.event_type === 2) {
            startPoll('CUSTOM',
                event.is_anonymous,
                event.question,
                event.is_multiple_response,
                createPoll,
                true,
                PUBLIC_CHAT_KEY,
                event.answers
            );
            dispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                value: true,
            });
            dispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                value: PANELS.POLL,
            });
            Session.setItem('forcePollOpen', true);
            Session.setItem('pollInitiated', true);
        } else if (event.event_type === 3) {
            chatSendMessage({
                variables: {
                    chatMessageInMarkdownFormat: textToMarkdown(event.text),
                    chatId: PUBLIC_GROUP_CHAT_ID,
                    replyToMessageId: null,
                },
            })
                .then((response: any) => console.log("Auto message sent:", response))
                .catch((error: any) => console.error("Auto message error:", error));
        } else if (event.event_type === 4) {
            const presentation = presentations.find((p) => p.name === event.presentation_name)
            setPresentation(presentation.presentationId)
        } else if (event.event_type === 5) {
            activateTimer_(timerActivate, dispatch, event.duration, timerStart, timerSwitchMode, timerSetTime)
        }

    }
    const progressPercentage = (elapsedSeconds / totalSeconds) * 100;

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isOpen && (
                    <ConfirmationModal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        onConfirm={onModalConfirm}
                        setIsOpen={setIsOpen}
                        title={modalTitle}
                        description={modalDescription}
                        confirmButtonColor="primary"
                        confirmButtonLabel="Next"
                        priority="low"
                        cancelButtonLabel="Dismiss"
                    />
                )}
                <Timeline
                    style={{ flex: 1 }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <Progress style={{ width: `${progressPercentage}%` }} />

                    {markerPositions.map((marker, index) => {
                        const markerPosition = (marker.timestamp / totalSeconds) * 100;
                        return (
                            <Marker
                                key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                style={{
                                    left: `${markerPosition}%`,
                                    backgroundColor: getMarkerColor(marker.event.event_type),
                                }}
                            />
                        );
                    })}
                </Timeline>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={jumpToPreviousMarker}
                        aria-label="Back"
                        disabled={!hasPreviousMarker}
                        style={{
                            ...iconButtonStyle,
                            opacity: hasPreviousMarker ? 1 : 0.5,
                            cursor: hasPreviousMarker ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M10 17l-5-5 5-5v10zm5 0l-5-5 5-5v10z" />
                        </svg>
                    </button>
                    <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} style={iconButtonStyle}>
                        {isPlaying ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 19h3V5H8v14zm5-14v14h3V5h-3z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={jumpToNextMarker}
                        aria-label="Forward"
                        disabled={!hasNextMarker}
                        style={{
                            ...iconButtonStyle,
                            opacity: hasNextMarker ? 1 : 0.5,
                            cursor: hasNextMarker ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M13 17l5-5-5-5v10zm-5 0l5-5-5-5v10z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

const iconButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
    padding: '5px',
    fontSize: '24px',
    transition: 'color 0.2s',
};

export default ProgressBarTimeline;
