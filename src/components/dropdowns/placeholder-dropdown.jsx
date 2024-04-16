
import { Button } from '@mui/material';
import React, { useState } from 'react'
import { colors, fonts } from '../../utils/theme';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ConfirmationModal from '../modals/confirmation-modal';
import PlaceholderConfirmationModal from '../modals/placeholder-confirmation-modal';
import PlaceholderModal from '../modals/placeholder-modal';

const PlaceholderDropdown = ({ id, dataKey, name, value, refetch, filledBy}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [placeholderConfirmationModal, setplaceholderConfirmationModal] = useState({
    open: false,
    type: 'DELETE'
  })

  const [placeholderEditModal, setPlaceholderEditModal] = useState({
    open: false,
    id: id
  })
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPlaceholderEditModal = () => {
    setPlaceholderEditModal({
      open: true,
      id
    })
    handleClose()
  }

  const closePlaceholderEditModal = () => {
    setPlaceholderEditModal({
      open: false,
      id
    })
  }

  const openPlaceholderConfirmationModal = () => {
    setplaceholderConfirmationModal({
      open: true,
      type: 'DELETE'
    })
    handleClose()
  }

  const closePlaceholderConfirmationModal = () => {
    setplaceholderConfirmationModal({ open: false, type: ConfirmationModal.type })
  }

  return (
    <>
      <PlaceholderModal 
        open={placeholderEditModal.open}
        id={id}
        key={`placeholder-${id}`}
        dataKey={dataKey}
        name={name}
        value={value}
        filledBy={filledBy}
        handleClose={closePlaceholderEditModal}
        refetch={refetch}
      />
      <PlaceholderConfirmationModal
        open={placeholderConfirmationModal.open}
        id={id}
        key={`placeholder-confirmation-${id}`}
        handleClose={closePlaceholderConfirmationModal}
        type={placeholderConfirmationModal.type}
        refetch={refetch}
      />
      <Button
        id="basic-menu"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          bgcolor: colors.translucentGreen,
          boxShadow: "none",
          color: colors.foreGreen,
          textTransform: "none",
          px: { xs: "8px", sm: "17px" },
          py: { xs: "2px", sm: "6px" },
          fontSize: "11px",
          fontFamily: fonts.medium,
          "&:hover": {
            bgcolor: colors.translucentGreen,
          },
          "& .MuiButton-endIcon": {
            marginLeft: 0,
            marginRight: 0,
          },
        }}
        endIcon={<ArrowDropDownIcon />}
      >
        Action
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            py: 0,
          },
        }}
        PaperProps={{
          sx: {
            width: 109,
            maxWidth: 109,
            boxShadow: "none",
            border: "1px solid rgba(0,0,0,0.1)",
          },
        }}
      >
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
          <a
            onClick={openPlaceholderEditModal}
          >
            Edit
          </a>
        </MenuItem>
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
          <a
            onClick={openPlaceholderConfirmationModal}
          >
            Delete
          </a>
        </MenuItem>
      </Menu>
    </>
  )
}

export default PlaceholderDropdown;