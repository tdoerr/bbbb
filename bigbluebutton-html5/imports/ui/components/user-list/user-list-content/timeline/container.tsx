import React from 'react';
import Timeline from './component';
import { layoutSelectInput, layoutDispatch } from '../../../layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes'
// import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';

const TimelineContainer = () => {
  const sidebarContentPanel = layoutSelectInput((i: Input) => i.sidebarContent);
  const layoutContextDispatch = layoutDispatch();

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
