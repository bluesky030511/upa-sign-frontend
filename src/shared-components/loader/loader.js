import React from "react";
import styled from "styled-components";
import { colors } from "../../utils/theme";
export const Loader = ({ size }) => {
  return (
    <Wrapper>
      <LoaderDiv size={size} />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const LoaderDiv = styled.div`
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid ${colors.themeBlue}; /* Blue */
  border-radius: 50%;
  width: ${(props) => (props.size ? props.size : 25)}px;
  height: ${(props) => (props.size ? props.size : 25)}px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
