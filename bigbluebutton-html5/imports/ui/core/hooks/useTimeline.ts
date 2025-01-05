import createUseSubscription from './createUseSubscription';
import GET_TIMELINE, { TimelineData } from '../graphql/queries/timeline';

const useTimelineSubscription = createUseSubscription<TimelineData>(GET_TIMELINE, {}, true);

export const useTimeline = (fn: (c: Partial<TimelineData>) => Partial<TimelineData> = (t) => t) => {
  const response = useTimelineSubscription(fn);
  return {
    ...response,
    data: response.data?.[0],
  };
};

export default useTimeline;
