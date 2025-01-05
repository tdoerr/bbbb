import { gql } from '@apollo/client';

export interface TimelineData {
  active: boolean;
}

export const GET_TIMELINE = gql`
  subscription Timeline{
    timeline {
      active
    }
  }
`;

export default GET_TIMELINE
