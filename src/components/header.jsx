import React, { useState } from "react";
import Box from "@mui/material/Box";
import styled from "styled-components";
import BrandLogo from "../assets/images/logo black upa-03.svg";
import { fonts, colors } from "../utils/theme";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useUI } from "../context/ui.context";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SideDrawer from "./drawers/side-drawer";
import { getRem, PricingLink } from "../utils/helper";
import { PLAN_KEYS } from "../utils/variables";

function CustomLink({ children, to }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to}>
      <AuthButton match={match}>{children}</AuthButton>
    </Link>
  );
}

function CustomNavLink({ children, to }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to} className="nav-link">
      <span className={`ss-item ${match ? "active" : ""}`}>{children}</span>
    </Link>
  );
}

const Header = () => {
  const { user } = useUI();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen((prevOpen) => !prevOpen);
  };

  const onPress = (e) => {
    const target = window.document.getElementById(
      e.currentTarget.href.split("#")[1]
    );
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <HeaderWrapper>
      <SideDrawer open={open} toggleDrawer={toggleDrawer} onPress={onPress} />
      <div className="header-content">
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Box>
            <Link to="/">
              <img src={BrandLogo} alt="UPA Sign" className="header-logo" />
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
              },
              marginBottom: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CustomNavLink to="/">Home</CustomNavLink>
              <CustomNavLink to="/solutions">Solutions</CustomNavLink>
              <CustomNavLink to="/plans-pricing">Plans & Pricing</CustomNavLink>
              <CustomNavLink to="/blogs">Blogs</CustomNavLink>
              <CustomNavLink to="/faqs">FAQs</CustomNavLink>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {user.loggedIn ? (
              <>
                <Link to={user.role === "AGENT" ? "/documents" : "/templates"}>
                  <AuthButton>Dashboard</AuthButton>
                </Link>
              </>
            ) : (
              <>
                <CustomLink to="/auth">Sign in</CustomLink>
                <CustomLink to="/auth/register">Register</CustomLink>
              </>
            )}
            <PricingLink pricingKey={PLAN_KEYS.free}>
              <button className="try-btn">Try for free</button>
            </PricingLink>
          </Box>
        </Box>
        <button className="ham-btn" onClick={toggleDrawer}>
          <MenuRoundedIcon sx={{ color: colors.foreBlack }} />
        </button>
      </div>
    </HeaderWrapper>
  );
};
export default Header;

const HeaderWrapper = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${colors.white};
  z-index: 999;
  border-bottom: 1px solid #e2e2e2;

  .header-content {
    padding-block: ${getRem(10)};
    padding-inline: 8.61%;
    margin-inline: auto;
    max-width: 1536px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-logo {
      width: 144px;
      height: 44px;
      height: auto;
    }
    .ham-btn {
      background-color: transparent;
      border: none;
      height: 18px;
      display: none;

      svg {
        font-size: 24px;
      }
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
      margin-left: ${getRem(24)};
    }
  }

  .nav-link {
    margin-left: ${getRem(32)};

    .ss-item {
      font-family: ${fonts.semibold};
      font-size: ${getRem(16)};
      color: ${colors.foreBlack};
      transition: color 0.3s ease-in-out;
      position: relative;
      &:after {
        content: "";
        width: 0;
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        height: 2px;
        background-color: ${colors.themeBlue};
        border-radius: 2px;
        transition: width 0.2s ease-in;
      }
      &:hover {
        color: ${colors.themeBlue};

        &:after {
          width: 100%;
        }
      }
      &.active {
        color: ${colors.themeBlue};

        &:after {
          width: 100%;
        }
      }
    }

    /* .active-scroll-spy {
      color: ${colors.themeBlue};

      &:after {
        width: 100%;
      }
    } */
  }

  @media screen and (max-width: 600px) {
    .header-content {
      padding-block: 12px;
      padding-inline: 20px;
      .header-logo {
        width: 115.2px;
        height: 35.2px;
        height: auto;
      }
      .ham-btn {
        display: block;
      }
    }
  }
`;

const AuthButton = styled.div`
  margin-left: 32px;
  box-shadow: 0px 4px 28px -7px rgba(0, 0, 0, 0.25);
  padding: 12px 28px;
  background-color: ${(props) =>
    props.match ? colors.themeBlue : colors.white};
  border-radius: 27px;
  font-family: ${fonts.medium};
  font-size: 16px;
  color: ${(props) => (props.match ? colors.white : colors.foreBlack)};
`;
