import React, { useState } from "react";
import { colors } from "../../../utils/theme";
import LeftDrawer from "../drawer";
import DashboardHeader from "../header";
import styled from "styled-components";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <LeftDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <DashboardHeader handleDrawerToggle={handleDrawerToggle} />
      <ContentWrapper>
        <div className="inner-content">{children}</div>
      </ContentWrapper>
    </>
  );
};
export default DashboardLayout;

const ContentWrapper = styled.div`
  margin-left: 252px;
  margin-top: 88px;
  background-color: ${colors.background};
  min-height: calc(100vh - 88px);

  .inner-content {
    padding: 78px 62px;
  }
  @media screen and (max-width: 600px) {
    margin-left: 0;
    margin-top: 64px;

    .inner-content {
      padding: 48px 20px;
    }
  }
`;
