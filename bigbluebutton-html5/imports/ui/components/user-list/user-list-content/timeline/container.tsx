import React from 'react';
import Timeline from './component';
import { layoutSelectInput, layoutDispatch } from '../../../layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes'
// import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useTimeline from '/imports/ui/core/hooks/useTimeline';

const TimelineContainer = () => {
  const sidebarContentPanel = layoutSelectInput((i: Input) => i.sidebarContent);
  // const { sidebarContentPanel } = sidebarContent;
  const layoutContextDispatch = layoutDispatch();
  // const { data: currentUserData } = useCurrentUser((user) => ({
  //   isModerator: user.isModerator,
  // }));
  const {
    data: timelineData,
  } = useTimeline();

  if (!timelineData) return null;
  // const { active } = timelineData;
  // const isModerator = currentUserData?.isModerator;

  return (
    <Timeline {
      ...{
        layoutContextDispatch,
        sidebarContentPanel
      }
    }
    />
  );
};

export default TimelineContainer;
