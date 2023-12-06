import React from "react";
import styled from "styled-components";
import { colors } from "../../utils/theme";

const PageLoader = ({ children }) => {
  return <Container>{children}</Container>;
};

export default PageLoader;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: ${colors.white};
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
