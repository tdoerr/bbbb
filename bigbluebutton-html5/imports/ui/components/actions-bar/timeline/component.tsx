



import React, { useState, useEffect } from 'react';
import { Timeline, Progress, Marker } from './styles';
import ConfirmationModal from '../../common/modal/confirmation/component';
import { useIntl } from 'react-intl';

const resourceData = {
    meeting_time: 3,
    resources: [
        {
            resource_type: 1,
            external_video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            timestamp: 0.5,
        },
        {
            resource_type: 2,
            is_anonymous: false,
            question: 'What is your favorite color?',
            is_multiple_response: false,
            answers: ['Red', 'Green', 'Blue'],
            timestamp: 1,
        },
        {
            resource_type: 3,
            text: 'Here is a plain text resource.',
            timestamp: 1.5,
        },
        {
            resource_type: 2,
            is_anonymous: true,
            question: 'What are your hobbies?',
            is_multiple_response: true,
            answers: ['Reading', 'Swimming', 'Gardening'],
            timestamp: 2,
        },
    ],
};

const ProgressBarTimeline = ({
    onMarkerReached,
    onComplete,
}) => {
    const totalSeconds = resourceData.meeting_time * 60;
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [reachedMarkers, setReachedMarkers] = useState(new Set());
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('dds');
    const [modalDescription, setModalDescription] = useState('dds');
    const [markerPositions, setMarkerPositions] = useState(
        resourceData.resources.map((resource) => ({
            timestamp: resource.timestamp * 60,
            resource,
        }))
    );
    const intl = useIntl();


    const getMarkerColor = (type) => {
        switch (type) {
            case 1:
                return 'red';
            case 2:
                return 'blue';
            case 3:
                return 'green';
            default:
                return 'gray';
        }
    };

    const hasNextMarker = markerPositions.some((marker) => marker.timestamp > elapsedSeconds);
    const hasPreviousMarker = markerPositions.some((marker) => marker.timestamp < elapsedSeconds);

    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setElapsedSeconds((prev) => {
                    const nextTime = prev + 1;

                    markerPositions.forEach((marker) => {
                        if (nextTime === marker.timestamp && !reachedMarkers.has(marker.timestamp)) {
                            setReachedMarkers((prevMarkers) => new Set(prevMarkers).add(marker.timestamp));


                            const { resource_type, question, text } = marker.resource;
                            setModalTitle(`Resource Type: ${resource_type}`);
                            setModalDescription(question || text || 'External video available.');

                            setIsOpen(true);
                            setIsPlaying(false);
                            if (onMarkerReached) onMarkerReached(marker.timestamp);
                        }
                    });

                    if (nextTime >= totalSeconds) {
                        clearInterval(interval);
                        if (onComplete) onComplete();
                        return totalSeconds;
                    }

                    return nextTime;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPlaying, markerPositions, reachedMarkers, totalSeconds, onMarkerReached, onComplete]);

    useEffect(() => {
        const handleBackdrop = () => {
            const backdrop = document.querySelector('.kUuWWa');
            if (!isOpen && backdrop) {
                backdrop.remove();
            }
        };


        handleBackdrop();


        const observer = new MutationObserver(handleBackdrop);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [isOpen]);

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

    const handleCloseModal = () => {
        setIsOpen(false);
        togglePlayPause();
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
        const newTimestamp = ((e.clientX - timelineRect.left) / timelineRect.width) * totalSeconds;

        setMarkerPositions((prevPositions) => {
            const updatedPositions = [...prevPositions];
            updatedPositions[markerIndex] = {
                ...updatedPositions[markerIndex],
                timestamp: Math.min(Math.max(newTimestamp, 0), totalSeconds),
            };
            return updatedPositions;
        });
    };


    const progressPercentage = (elapsedSeconds / totalSeconds) * 100;

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ConfirmationModal
                    intl={intl}
                    isOpen={isOpen}
                    onRequestClose={handleCloseModal}
                    onConfirm={jumpToNextMarker}
                    title={modalTitle}
                    description={modalDescription}
                    confirmButtonColor="primary"
                    confirmButtonLabel="Next"
                    cancelButtonLabel="Dismiss"
                />

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
                                    backgroundColor: getMarkerColor(marker.resource.resource_type),
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
