import styled from 'styled-components';
import {
    mdPaddingX,
  } from '/imports/ui/stylesheets/styled-components/general';
  import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

const PrivateNotesWindow = styled.div`
  background-color: ${colorWhite};
  padding: ${mdPaddingX};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #343a40;
  color: #fff;
  border-radius: 8px 8px 0 0;
`;

const Content = styled.div`
  flex: 1;
  padding: 10px;

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    outline: none;
    padding: 5px;
  }
`;

export default {
  PrivateNotesWindow,
  Header,
  Content,
};
