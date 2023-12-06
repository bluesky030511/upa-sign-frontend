import { AppBar, Box } from "@mui/material";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Person } from "@mui/icons-material";
import Stack from "@mui/system/Stack";
import { Link } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import BrandLogo from "../../../assets/images/logo black upa-03.svg";
import { colors, fonts } from "../../../utils/theme";
import ProfileAvatar from "../../../assets/images/profile.png";
import ProfileFemaleAvatar from "../../../assets/images/profile_female.png";
import { deleteUserToken } from "../../../utils/token-manager";
import { useUI } from "../../../context/ui.context";
import { useToast } from "../../../context/toast.context";
import styled from "styled-components";
import { SHOWN } from "../../../utils/variables";

const DashboardHeader = ({ handleDrawerToggle }) => {
  const { user, removeUser } = useUI();
  const { showSuccessToast } = useToast();

  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = 252;

  const handleClick = (event) => {
    if (user.isShadow) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    deleteUserToken();
    removeUser();
    sessionStorage.removeItem(SHOWN);
    showSuccessToast("Logged out");
  };

  const open = Boolean(anchorEl);
  const id = open ? "header-popover" : undefined;
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, sm: `${drawerWidth}px` },
        backgroundColor: colors.white,
        px: { xs: "20px", sm: 3 },
        py: { xs: "12px", sm: "20px" },
        boxShadow: "0px 4px 26px -10px rgba(0,0,0,0.25)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!user.isShadow && (
          <Toolbar sx={{ p: 0, minHeight: "unset" }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              sx={{ display: { sm: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon sx={{ color: colors.foreBlack }} />
            </IconButton>
          </Toolbar>
        )}
        <Box sx={{ width: "25%" }}>
          <Link to="/">
            <Logo src={BrandLogo} alt="UPA Sign" />
          </Link>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Stack direction="row" divider={null} alignItems="center" spacing={4}>
            <Button
              onClick={handleClick}
              aria-describedby={id}
              sx={{
                "&:hover": { bgcolor: "transparent" },
                p: 0,
                minWidth: 40,
              }}
            >
              <Avatar
                sx={{
                  boxShadow: "0px 0px 10px -4px rgba(0,0,0,0.35)",
                  border: "1px solid",
                  borderColor: colors.translucentBlue,
                }}
                src={
                  user.gender
                    ? user.gender === "MALE"
                      ? ProfileAvatar
                      : ProfileFemaleAvatar
                    : ProfileAvatar
                }
              >
                <Person />
              </Avatar>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              PaperProps={{
                sx: {
                  width: 109,
                  maxWidth: 109,
                },
              }}
            >
              {user.role === "AGENT" && (
                <MenuItem
                  sx={{
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    p: 0,
                    minHeight: 24,
                    "& a": {
                      fontFamily: fonts.medium,
                      fontSize: "11px",
                      color: colors.foreBlack,
                      p: "8px 16px",
                      width: "100%",
                    },
                  }}
                >
                  <Link to="/profile">Profile</Link>
                </MenuItem>
              )}
              <MenuItem
                sx={{
                  fontFamily: fonts.medium,
                  minHeight: 24,
                  fontSize: "11px",
                  color: colors.foreBlack,
                }}
                onClick={handleLogout}
              >
                Sign out
              </MenuItem>
            </Popover>
          </Stack>
        </Box>
      </Box>
    </AppBar>
  );
};
export default DashboardHeader;

const Logo = styled.img`
  width: 144px;
  height: 44px;
  height: auto;

  @media screen and (max-width: 600px) {
    width: 115.2px;
    height: 35.2px;
  }
`;
