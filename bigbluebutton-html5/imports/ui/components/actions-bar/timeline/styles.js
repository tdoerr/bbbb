import styled from 'styled-components';

export const Timeline = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
    `;

export const Progress = styled.div`
  width: 0%; 
  height: 100%;
  background-color: #007bff;

  transition: width 1s linear; 
`;

export const Marker = styled.div`
  position: absolute;
  top: -5px; 
  height: 20px;
  width: 2px;
  background-color: #ff0000; 
  transform: translateX(-50%); 
`;

export const ControlButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

