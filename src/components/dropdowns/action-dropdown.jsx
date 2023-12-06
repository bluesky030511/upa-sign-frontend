import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { colors, fonts } from "../../utils/theme";
import { Link } from "react-router-dom";
import ConfirmationModal from "../modals/confirmation-modal";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { useUI } from "../../context/ui.context";

const ActionDropDown = ({ id, file, inviteId, signed }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    type: "DELETE",
  });
  const open = Boolean(anchorEl);
  const { user } = useUI();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openConfirmationModal = () => {
    setConfirmationModal({
      open: true,
      type: user.isAgent ? "DELETE" : "CONFIRM",
    });
    handleClose();
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ open: false, type: confirmationModal.type });
  };

  return (
    <>
      <ConfirmationModal
        open={confirmationModal.open}
        id={id}
        handleClose={closeConfirmationModal}
        type={confirmationModal.type}
        inviteId={inviteId}
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
            href={`${BASE_URL}${API_ENDPOINTS.FILE}/f/view/preview.pdf?id=${file}`}
          >
            Preview
          </a>
        </MenuItem>
        {user.isAgent && (
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
            <Link to={`details/${id}`}>Detail</Link>
          </MenuItem>
        )}
        {!signed && (
          <MenuItem
            onClick={openConfirmationModal}
            sx={{
              minHeight: 24,
              fontFamily: fonts.medium,
              fontSize: "11px",
              color: colors.foreBlack,
            }}
          >
            {user.isAgent ? "Delete" : "Sign"}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ActionDropDown;
