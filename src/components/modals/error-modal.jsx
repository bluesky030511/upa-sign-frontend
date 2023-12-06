import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PrimaryButton from "../buttons/primary-button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import { useUI } from "../../context/ui.context";
import Slide from "@mui/material/Slide";
import { deleteUserToken } from "../../utils/token-manager";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ErrorModal = () => {
  const { authModal, closeAuthModal, removeUser } = useUI();
  const handleClose = () => {
    removeUser();
    deleteUserToken();
    closeAuthModal();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={authModal}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          maxWidth: "400px",
          borderRadius: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <SuccessContent>
          <div className="icon-circle">
            <ErrorOutlineIcon sx={{ color: "#FD6B6B", fontSize: 56 }} />
          </div>
          <h4>Session Expired</h4>
          <p>Your previous session has been expired. Please sign in again</p>
          <PrimaryButton
            onClick={handleClose}
            sx={{
              bgcolor: colors.themeBlue,
              boxShadow: "none",
              mt: 3,
              width: "40%",
              textTransform: "none",
              "&:hover": {
                bgcolor: colors.themeBlue,
                boxShadow: "none",
              },
            }}
          >
            Sign in
          </PrimaryButton>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 96px;
    height: 96px;
    background-color: #ffe3e3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.semibold};
    font-size: 28px;
    color: #fd6b6b;
    margin-block: 24px;
  }
  p {
    font-family: ${fonts.regular};
    color: ${colors.foreBlack};
    font-size: 16px;
    text-align: center;
  }

  .btn-container {
    width: 100%;
  }
`;
