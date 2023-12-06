import React from "react";
import Header from "./header";
import styled from "styled-components";
const Layout = ({ children, full }) => {
  return (
    <LayoutContainer full={full}>
      <Header />
      {children}
    </LayoutContainer>
  );
};
export default Layout;

const LayoutContainer = styled.div`
  padding-inline: ${(props) => (props.full ? 0 : "8.61%")};
  max-width: ${(props) => (props.full ? "unset" : "1536px")};
  margin-inline: auto;

  @media screen and (max-width: 600px) {
    padding-inline: ${(props) => (props.full ? 0 : "20px")};
  }
`;
