import styled from 'styled-components';
import {
  borderSize,
  borderSizeLarge,
  smPaddingX,
  toastContentWidth,
  borderRadius,
} from '../../../stylesheets/styled-components/general';
import {
  colorGrayDark,
  colorGrayLighter,
  colorGrayLightest,
  colorGray,
  colorBlueLight,
  colorWhite,
  colorPrimary,
} from '../../../stylesheets/styled-components/palette';
import { TextElipsis } from '../../../stylesheets/styled-components/placeholders';
import Button from '/imports/ui/components/common/button/component';

const TimelineSidebarContent = styled.div`
  background-color: ${colorWhite};
  padding: ${smPaddingX};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  height: 100%;
  transform: translateZ(0);
`;

const TimelineHeader = styled.header`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TimelineTitle = styled.div`
  ${TextElipsis};
  flex: 1;

  & > button, button:hover {
    max-width: ${toastContentWidth};
  }
`;
// @ts-ignore - JS code
const TimelineMinimizeButton = styled(Button)`
  position: relative;
  background-color: ${colorWhite};
  display: block;
  margin: ${borderSizeLarge};
  margin-bottom: ${borderSize};
  padding-left: 0;
  padding-right: inherit;

  [dir="rtl"] & {
    padding-left: inherit;
    padding-right: 0;
  }

  > i {
      color: ${colorGrayDark};
      font-size: smaller;

      [dir="rtl"] & {
        -webkit-transform: scale(-1, 1);
        -moz-transform: scale(-1, 1);
        -ms-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        transform: scale(-1, 1);
      }
  }

  &:hover {
      background-color: ${colorWhite};
  }
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TimelineCurrent = styled.span`
  border-bottom: 1px solid ${colorGrayLightest};
  border-top: 1px solid ${colorGrayLightest};
  display: flex;
  font-size: xxx-large;
  justify-content: center;
`;

const TimelineType = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 2rem;
`;
// @ts-ignore - JS code
const TimelineSwitchButton = styled(Button)`
  width: 100%;
  height: 2rem;
  margin: 0 .5rem;
`;

const TimelineRow = `
  display: flex;
  flex-flow: row;
  flex-grow: 1;
`;

const TimelineCol = `
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  flex-basis: 0;
`;

const TimelineControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 4rem;
`;
// @ts-ignore - JS code
const TimelineControlButton = styled(Button)`
  width: 6rem;
  margin: 0 1rem;
`;

const TimelineInput = styled.input`
  flex: 1;
  border: 1px solid ${colorGrayLighter};
  width: 50%;
  text-align: center;
  padding: .25rem;
  border-radius: ${borderRadius};
  background-clip: padding-box;
  outline: none;

  &::placeholder {
    color: ${colorGray};
    opacity: 1;
  }

  &:focus {
    border-radius: ${borderSize};
    box-shadow: 0 0 0 ${borderSize} ${colorBlueLight}, inset 0 0 0 1px ${colorPrimary};
  }

  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: .75;
    background-color: rgba(167,179,189,0.25);
  }
`;

export default {
  TimelineSidebarContent,
  TimelineHeader,
  TimelineTitle,
  TimelineMinimizeButton,
  TimelineContent,
  TimelineCurrent,
  TimelineType,
  TimelineSwitchButton,
  TimelineRow,
  TimelineCol,
  TimelineControls,
  TimelineControlButton,
  TimelineInput
};
