  import styled from 'styled-components';
  import {
      mdPaddingX,
    } from '/imports/ui/stylesheets/styled-components/general';
    import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

    export const Container = styled.div`
    display: flex;
    padding: ${mdPaddingX};
    flex-direction: column;
    margin: auto;
    background-color: ${colorWhite};
      height: 100%;
  `;

  export const Title = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
  `;

  export const TextArea = styled.textarea`
    width: 100%;
    height: 150px;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    background: white;
    color: #333;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
    }
  `;

  export default {
    Container,
    Title,
    TextArea,
  };
