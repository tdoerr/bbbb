import { gql } from '@apollo/client';

export const TIMELINE_ACTIVATE = gql`
  mutation timelineActivate{
    timelineActivate
  }
`;

export const TIMELINE_DEACTIVATE = gql`
  mutation timelineDeactivate{
    timelineDeactivate
  }
`;

export default {
  TIMELINE_ACTIVATE,
  TIMELINE_DEACTIVATE
}
