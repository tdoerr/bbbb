import React, {
  useCallback,
  useEffect,
  // useMemo,
  // useRef,
  // useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';
// import {
//   useMutation,
// } from '@apollo/client';
import Header from '/imports/ui/components/common/control-header/component';
import Styled from './styles';
import { TimelineData } from '../../../core/graphql/queries/timeline';
// import logger from '/imports/startup/client/logger';
import { layoutDispatch } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';

// const MAX_HOURS = 23;
// const MILLI_IN_HOUR = 3600000;
// const MILLI_IN_MINUTE = 60000;
// const MILLI_IN_SECOND = 1000;

const intlMessages = defineMessages({
  hideTimelineLabel: {
    id: 'app.timeline.hideTimelineLabel',
    description: 'Label for hiding timeline button'
  },
  timeline: {
    id: 'app.timeline.title',
    description: 'Label for hiding timeline button'
  },
});

const TimelinePanel = ({
  active,
}: TimelineData) => {
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

  useEffect(() => {
    if (!active) {
      closePanel()
    }
  }, [active])
  
  return (
    <Styled.TimelineSidebarContent data-test="timelineContainer">
    {/* @ts-ignore - JS code */}
      <Header
        leftButtonProps={{
          onClick: closePanel,
          'aria-label': intl.formatMessage(intlMessages.hideTimelineLabel),
          label: intl.formatMessage(intlMessages.hideTimelineLabel),
        }}
      data-test="timelineHeader"
      />
    </Styled.TimelineSidebarContent>
  )
};

const TimelinePanelContainer = () => {
  return (
    <TimelinePanel
      active={true}
    />
  );
};

export default TimelinePanelContainer;
