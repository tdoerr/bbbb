import styled from 'styled-components';
import {
  colorText, colorGrayLighter, colorPrimary, colorGrayLight, colorWhite,
} from '/imports/ui/stylesheets/styled-components/palette';
import { smPaddingX } from '/imports/ui/stylesheets/styled-components/general';
import Button from '/imports/ui/components/common/button/component';

const UploadButton = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  
  button {
    width: 100%;
    height: 36px;
    margin: 0;
    font-size: 14px;
    border-radius: 4px;
    padding: 0 1rem;
    font-weight: 600;
    text-transform: none;
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const TimelineSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${colorWhite};
  width: 340px;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${smPaddingX};
  flex-grow: 1;
  overflow-y: auto;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: ${smPaddingX};
`;

const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colorWhite};
  border-left: 3px solid ${colorPrimary}40;
  padding-left: 1rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -6px;
    top: 24px;
    width: 9px;
    height: 9px;
    background: ${colorWhite};
    border: 2px solid ${colorPrimary};
    border-radius: 50%;
  }

  &:hover {
    border-left-color: ${colorPrimary};
    
    &:before {
      background: ${colorPrimary};
    }
  }
`;

const TimeStamp = styled.div`
  font-size: 0.85em;
  font-weight: 600;
  color: ${colorPrimary};
  margin-bottom: 0.5rem;
`;

const EventContent = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  background: ${colorGrayLighter};
  padding: 0.75rem;
  border-radius: 8px;
  
  i {
    color: ${colorPrimary};
    font-size: 1.2em;
    flex-shrink: 0;
  }
`;

const PollContainer = styled.div`
  width: 100%;
`;

const PollQuestion = styled.div`
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const PollDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  
  span {
    font-size: 0.8em;
    background: ${colorWhite};
    padding: 2px 8px;
    border-radius: 12px;
    color: ${colorGrayLight};
  }
`;

const PollAnswers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  div {
    padding: 0.5rem 0.75rem;
    background: ${colorWhite};
    border-radius: 6px;
    transition: transform 0.2s ease;
    cursor: pointer;
    
    &:hover {
      transform: translateX(4px);
      background: ${colorWhite};
    }
  }
`;

const TextResource = styled.div`
  font-style: italic;
  color: ${colorText};
  width: 100%;
`;

const PresentationFile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  
  span {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &:after {
    content: 'PDF';
    font-size: 0.7em;
    background: ${colorPrimary}20;
    color: ${colorPrimary};
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }
`;

const VideoLink = styled.a`
  color: ${colorPrimary};
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin: ${smPaddingX} 0;
  background: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  color: #d32f2f;
  
  i {
    color: #d32f2f;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin: ${smPaddingX} 0;
`;

const ActionButton = styled(Button)`
  flex: 1;
  height: 36px;
  margin: 0;
  font-size: 14px;
  border-radius: 4px;
  padding: 0 1rem;
  font-weight: 600;
  text-transform: none;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export default {
  TimelineSidebarContent,
  TimelineContent,
  TimelineList,
  TimelineItem,
  TimeStamp,
  EventContent,
  PollContainer,
  PollQuestion,
  PollDetails,
  PollAnswers,
  TextResource,
  PresentationFile,
  VideoLink,
  UploadButton,
  ErrorMessage,
  ButtonGroup,
  ActionButton,
};
