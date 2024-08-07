import React from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import {
  DescriptionOutlined,
  AutoAwesomeMosaicOutlined,
  Settings,
  PlaceOutlined,
} from "@mui/icons-material";
import DvrIcon from "@mui/icons-material/Dvr";
import styled from "styled-components";
import BugReportIcon from '@mui/icons-material/BugReport';
import { Box } from "@mui/system";

import { colors } from "../../../utils/theme";
import { useUI } from "../../../context/ui.context";

function CustomLink({ to, item }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: false });

  return (
    <Link to={to}>
      <ListItem
        disablePadding
        sx={{
          backgroundColor: match ? colors.themeBlue : colors.translucentBlue,
          marginBottom: 2,
          borderRadius: 1,
        }}
      >
        <ListItemButton>
          <ListItemIcon
            sx={{
              color: match ? colors.white : colors.themeBlue,
              width: "auto",
              minWidth: "auto",
              marginRight: 2,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            sx={{
              color: match ? colors.white : colors.themeBlue,
            }}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

const LeftDrawer = (props) => {
  const { window, handleDrawerToggle, mobileOpen } = props;
  const { user } = useUI();
  const drawerWidth = 252;

  const drawer = (
    <Stack
      sx={{ py: 5, px: 3 }}
      direction="column"
      justifyContent={"center"}
      alignItems="center"
    >
      <Box sx={{ mb: 4 }}>
        <Avatar
          sx={{ width: 56, height: 56, backgroundColor: colors.themeBlue }}
        >
          <AutoAwesomeMosaicOutlined color={colors.white} />
        </Avatar>
      </Box>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{ backgroundColor: colors.translucentBlue }}
      />
      <ListWrapper>
        {!user.isShadow && (
          <List>
            {user.role === "AGENT" && (
              <>
                <CustomLink
                  to="/documents"
                  item={{ name: "Documents", icon: <DescriptionOutlined /> }}
                />
                <CustomLink 
                  to="/sign-documents"
                  item={{ name: "Sign Documents", icon: <AutoAwesomeMosaicOutlined /> }}
                />
                {/* <CustomLink
                  to="/Placeholders"
                  item={{ name: "Placeholders", icon: <PlaceOutlined /> }}
                /> */}
              </>
            )}

            {user.role !== "CUSTOMER" && (
              <>
                <CustomLink
                  to="/templates"
                  item={{
                    name: "Templates",
                    icon: <AutoAwesomeMosaicOutlined />,
                  }}
                />
              </>
            )}
            {user.role === "CUSTOMER" && (
              <>
                <CustomLink
                  to="/documents"
                  item={{
                    name: "Documents",
                    icon: <AutoAwesomeMosaicOutlined />,
                  }}
                />
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <CustomLink 
                  to="/sign-documents"
                  item={{ name: "Sign Documents", icon: <AutoAwesomeMosaicOutlined /> }}
                />
                <CustomLink 
                  to="/reports"
                  item={{ name: "Reports", icon: <AutoAwesomeMosaicOutlined /> }}
                />
                <CustomLink 
                  to="/ticket"
                  item={{ name: "Tickets", icon: <AutoAwesomeMosaicOutlined /> }}
                />
                <CustomLink
                  to="/users"
                  item={{ name: "Users", icon: <Settings /> }}
                />
              </>
            )}
            {(user.role === "AGENT" ||
              user.role === "CUSTOMER") && (
              <>
                <CustomLink
                  to="/submit-issue"
                  item={{ name: "Submit Issue", icon: <BugReportIcon /> }}
                />
              </>
            )}
            {(user.role === "AGENT" ||
              user.role === "ADMIN" ||
              user.role === "CUSTOMER") && (
              <>
                <CustomLink
                  to="/profile"
                  item={{ name: "Profile", icon: <Settings /> }}
                />
                {/* <CustomLink
                  to="/tutorial"
                  item={{ name: "Tutorial", icon: <DvrIcon /> }}
                /> */}
              </>
            )}
          </List>
        )}
      </ListWrapper>
    </Stack>
  );

  const container = window !== undefined ? window().document.body : undefined;

  // alert(user.role);
  return (
    <>
      {!user.isShadow && (
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: colors.translucentBlue,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

const ListWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

LeftDrawer.propTypes = {
  window: PropTypes.func,
};

export default LeftDrawer;
