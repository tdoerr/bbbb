import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '/imports/ui/components/common/icon/component';
import Styled from '../timer/styles';
import { ACTIONS, PANELS } from '../../../layout/enums';

type TimelineProps = {
  sidebarContentPanel: string,
  layoutContextDispatch: Function
}

const intlMessages = defineMessages({
  title: {
    id: 'app.userList.timelineTitle',
    description: 'Title for the timeline',
  },
  timeline: {
    id: 'app.timeline.title',
    description: 'Title for the timeline',
  },
});

const Timeline = ({
  sidebarContentPanel,
  layoutContextDispatch
}: TimelineProps) => {
  const intl = useIntl()

  return (
    <Styled.Messages>
      <Styled.Container>
        <Styled.SmallTitle>
          {intl.formatMessage(intlMessages.title)}
        </Styled.SmallTitle>
      </Styled.Container>
      <Styled.ScrollableList>
        <Styled.List>
          <Styled.ListItem
            role="button"
            tabIndex={0}
            // @ts-ignore
            active={sidebarContentPanel === PANELS.TIMELINE}
            onClick={() => {
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                value: sidebarContentPanel !== PANELS.TIMELINE
              })
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                value: sidebarContentPanel === PANELS.TIMELINE
                  ? PANELS.NONE
                  : PANELS.TIMELINE
              })
            }}
          >
            <Icon iconName="time"/>
            <span>
              {intl.formatMessage(intlMessages.timeline)}
            </span>
          </Styled.ListItem>
        </Styled.List>
      </Styled.ScrollableList>
    </Styled.Messages>
  )
}

export default Timeline;
