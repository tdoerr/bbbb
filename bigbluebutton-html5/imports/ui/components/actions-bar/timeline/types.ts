export type EventList = {
    meeting_time: number;
    events: (PlayVideoEvent | StarPollEvent | SendTextEvent | SetPresentationEvent | SetTimerEvent)[];
};

type EventBase = {
    eventId: number;
    timestamp: number;
};

export type PlayVideoEvent = EventBase & {
    event_type: 1;
    external_video_link: string;
};

export type StarPollEvent = EventBase & {
    event_type: 2;
    is_anonymous: boolean;
    question: string;
    is_multiple_response: boolean;
    answers: string[];
};

export type SendTextEvent = EventBase & {
    event_type: 3;
    text: string; 
};

export type SetPresentationEvent = EventBase & {
    event_type: 4;
    presentation_name: string; 
};

export type SetTimerEvent = EventBase & {
    event_type: 5;
    duration: number; 
};

export type MarkerEvent = {
    timestamp: number, 
    event: (PlayVideoEvent | StarPollEvent | SendTextEvent);
}
