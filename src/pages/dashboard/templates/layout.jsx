import React, { useState } from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import {
  Avatar,
  Divider,
  Box,
  Grid,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ListItemAvatar,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useDrag } from "react-dnd";
import ImageIcon from '@mui/icons-material/Image';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import {
  DescriptionOutlined,
  AutoAwesomeMosaicOutlined,
  Settings,
  PlaceOutlined,
} from "@mui/icons-material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BoyIcon from '@mui/icons-material/Boy';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import TransgenderIcon from '@mui/icons-material/Transgender';
import HomeIcon from '@mui/icons-material/Home';
import PolicyIcon from '@mui/icons-material/Policy';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import styled from "styled-components";

import { colors, fonts } from "../../../utils/theme";
import { useUI } from "../../../context/ui.context";

const SignField = ({ item, selectedUser }) => {
  const { user } = useUI();

  const dragConfig = React.useMemo(() => ({
    type: 'SIGN_FIELD',
    item: { id: item.id, name: selectedUser === 0 ? 
      // user[item.id] ? user[item.id] : 
      // item.id == 'full_name' ? `${user.firstname} ${user.lastname}` : 
      `{agent_${item.id}}` : `{client_${item.id}}` },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item, selectedUser]);

  const [{ isDragging }, drag] = useDrag(dragConfig)

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Tooltip title={item.name} followCursor>
        <TextField 
          variant="outlined" 
          id={item.id}
          defaultValue={item.name}
          size="small" 
          focused
          sx={{ input: {cursor: "move", fontSize: "12px"} }}
          InputProps={{
            readOnly: true,
            sx:{px: "4px", cursor:"move"},
            startAdornment: <InputAdornment position="start" sx={{ width:"24px" }} ><DragIndicatorIcon/></InputAdornment>,
            endAdornment: <InputAdornment position="end" sx={{ width:"24px" }} >{item.icon}</InputAdornment>
          }}
        />
      </Tooltip>
    </div>
  );
}

const EditDrawer = (props) => {
  const { window, handleDrawerToggle, mobileOpen } = props;
  const { user } = useUI();
  const drawerWidth = 360;

  console.log("user: ", user);

  const [selectedUser, setSelectedUser] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedUser(index);
  }

  const drawer = (
    <Stack
      sx={{ py:5, px:3 }}
      direction="column"
      justifyContent="center"
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
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader"
              sx={{ backgroundColor: colors.themeBlue, color: colors.white, fontSize: 18 }}
            >
              Recipients
            </ListSubheader>
          }
        >
          <ListItemButton 
            selected={selectedUser === 0}
            onClick={(event) => handleListItemClick(event, 0)}
            sx={{ backgroundColor: colors.white }} 
          >
            <ListItemAvatar>
              <Avatar sx={{ width:40, height:40, bgcolor: colors.checkGreen }}>L</Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Prefill by you" 
              secondary={<React.Fragment>{user.email}</React.Fragment>}
            />
          </ListItemButton>
          <ListItemButton 
            selected={selectedUser === 1}
            onClick={(event) => handleListItemClick(event, 1)}
            sx={{ backgroundColor: colors.white }} 
          >
            <ListItemAvatar>
              <Avatar sx={{ width:40, height:40, bgcolor: colors.themeBlue }}>C</Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Client" 
              // secondary={<React.Fragment>{"light.unicon@gmail.com"}</React.Fragment>}
            />
          </ListItemButton>
        </List>
      </ListWrapper>
      <ListWrapper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader"
              sx={{ backgroundColor: colors.themeBlue, color: colors.white, fontSize: 18 }}
            >
              Fields
            </ListSubheader>
          }
        >
          <Box sx={{ backgroundColor: colors.white, width: "100%", minHeight: 200, p:1}} >
            <Grid container sx={{ }} rowSpacing={1} columnSpacing={2}>
              <Grid item xs={6}>
                <SignField item={{ id:"signature", name:"Signature", icon: <DriveFileRenameOutlineIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"full_name", name:"Full name", icon:<BoyIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"phone_number", name:"Phone Number", icon:<PhoneIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"email", name:"Email", icon:<MailIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"address", name:"Street Address", icon:<HomeIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"country", name:"Country", icon:<PublicIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"state", name:"State", icon:<LocationCityIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"city", name:"City", icon:<ApartmentIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"zipCode", name:"Zip Code", icon:<AttachEmailIcon/>}} selectedUser={selectedUser} />
              </Grid>
              <Grid item xs={6}>
                <SignField item={{ id:"gender", name:"Gender", icon:<TransgenderIcon/>}} selectedUser={selectedUser} />
              </Grid>
              {selectedUser === 0 && (<Grid item xs={6}>
                <SignField item={{ id:"sign_date", name:"Sign Date", icon:<CalendarMonthIcon/>}} selectedUser={selectedUser} />
              </Grid>)}
              
              {selectedUser === 1 && (
              <>
                <Grid item xs={6}>
                  <SignField item={{ id:"insurance_company", name:"Insurance Company", icon:<BusinessIcon/>}} selectedUser={selectedUser} />
                </Grid>
                <Grid item xs={6}>
                  <SignField item={{ id:"policy_number", name:"Policy", icon:<PolicyIcon/>}} selectedUser={selectedUser} />
                </Grid>
                <Grid item xs={6}>
                  <SignField item={{ id:"claim", name:"Claim", icon:<PlaylistAddCheckIcon/>}} selectedUser={selectedUser} />
                </Grid>
                <Grid item xs={6}>
                  <SignField item={{ id:"contract_date", name:"Contract Date", icon:<CalendarMonthIcon/>}} selectedUser={selectedUser} />
                </Grid>
                <Grid item xs={6}>
                  <SignField item={{ id:"cause_of_loss", name:"Cause of loss", icon:<TrendingDownIcon/>}} selectedUser={selectedUser} />
                </Grid>
                <Grid item xs={6}>
                  <SignField item={{ id:"sign_date", name:"Sign Date", icon:<TrendingDownIcon/>}} selectedUser={selectedUser} />
                </Grid>
              </>)}
            </Grid>
          </Box>
        </List>
      </ListWrapper>
    </Stack>
  );

  const container = window !== undefined ? window().document.body : undefined;

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
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );

}

const ListWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

EditDrawer.propTypes = {
  window: PropTypes.func,
};

export default EditDrawer;