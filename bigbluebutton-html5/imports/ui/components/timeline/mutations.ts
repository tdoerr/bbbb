import { gql } from '@apollo/client';

export const TIMELINE_SHOW = gql`
  mutation timelineShow {
    timelineShow
  }
`;

export const TIMELINE_HIDE = gql`
  mutation timelineHide {
    timelineHide
  }
`;

export default {
  TIMELINE_SHOW,
  TIMELINE_HIDE
}
