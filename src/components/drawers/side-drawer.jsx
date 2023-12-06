import React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import BrandLogo from "../../assets/images/logo black upa-03.svg";
import styled from "styled-components";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

import { colors, fonts } from "../../utils/theme";
import { useUI } from "../../context/ui.context";
import { PricingLink, getRem } from "../../utils/helper";
import { PLAN_KEYS } from "../../utils/variables";

function CustomLink({ children, to, primary }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to}>
      <ListItemButton
        sx={{
          minWidth: 120,
          background: match ? colors.themeBlue : "transparent",
          borderRadius: "27px",
        }}
      >
        <ListItemText
          primary={primary}
          primaryTypographyProps={{
            sx: {
              fontFamily: fonts.medium,
              fontSize: 14,
              color: match ? colors.white : colors.foreBlack,
              textAlign: "center",
            },
          }}
        />
      </ListItemButton>
    </Link>
  );
}

function CustomNavLink({ children, to, primary }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to} style={{ width: "100%" }}>
      <ListItemButton
        sx={{
          background: match ? colors.translucentBlue : "transparent",
          borderRadius: "10px",
        }}
      >
        <ListItemText
          primary={primary}
          primaryTypographyProps={{
            sx: {
              fontFamily: fonts.medium,
              fontSize: 14,
              color: colors.foreBlack,
              textAlign: "center",
            },
          }}
        />
      </ListItemButton>
    </Link>
  );
}

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Solutions",
    to: "/solutions",
  },
  {
    label: "Plans & Pricing",
    to: "/plans-pricing",
  },
  {
    label: "Blogs",
    to: "/blogs",
  },
  {
    label: "FAQs",
    to: "/faqs",
  },
];

const SideDrawer = ({ open, toggleDrawer, onPress }) => {
  const { user } = useUI();
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      <Box
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
        sx={{ width: 250, height: "100%" }}
      >
        <DrawerContent>
          <Link to="/">
            <img className="drawer-logo" src={BrandLogo} alt="ai-signtec" />
          </Link>
          <div className="nav-panel">
            <List>
              {links.map((link, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{ justifyContent: "center" }}
                >
                  <CustomNavLink to={link.to} primary={link.label} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {user.loggedIn ? (
                <ListItem sx={{ justifyContent: "center", p: 0 }}>
                  <Link to="/documents">
                    <ListItemButton
                      sx={{
                        minWidth: 120,
                        background: "transparent",
                        borderRadius: "27px",
                      }}
                    >
                      <ListItemText
                        primary="Dashboard"
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: fonts.medium,
                            fontSize: 14,
                            color: colors.foreBlack,
                            textAlign: "center",
                          },
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ) : (
                <>
                  <ListItem sx={{ justifyContent: "center", p: 0 }}>
                    <CustomLink to="/auth" primary="Sign in" />
                  </ListItem>
                  <ListItem sx={{ justifyContent: "center", p: 0 }}>
                    <CustomLink to="/auth/register" primary="Register" />
                  </ListItem>
                </>
              )}
              <ListItem sx={{ justifyContent: "center", p: 0 }}>
                <PricingLink pricingKey={PLAN_KEYS.free}>
                  <button className="try-btn">Try for free</button>
                </PricingLink>
              </ListItem>
            </List>
          </div>
        </DrawerContent>
      </Box>
    </SwipeableDrawer>
  );
};

export default SideDrawer;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  height: 100%;

  .drawer-logo {
    width: 115.2px;
    height: 35.2px;
    height: auto;
  }
  .nav-panel {
    width: 100%;
    margin-top: ${getRem(12)};

    .ss-item {
      width: 100%;
    }

    .active-scroll-spy {
      background-color: ${colors.translucentBlue};
    }
  }

  .link-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .try-btn {
    background-color: transparent;
    border: none;
    outline: none;
    font-family: ${fonts.semibold};
    font-size: ${getRem(16)};
    color: ${colors.themeBlue};
    text-decoration: underline;
    text-underline-offset: 2px;
    margin-top: ${getRem(16)};
  }
`;
