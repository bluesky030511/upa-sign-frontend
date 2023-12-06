import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../buttons/primary-button";

const SignModal = ({ open, handleClose, handleSignContract, loading }) => {
  const handleAction = () => {
    handleSignContract();
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
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
            <CheckRoundedIcon sx={{ color: colors.checkGreen, fontSize: 56 }} />
          </div>
          <h4>Confirm?</h4>
          <p>Are you sure you want to sign this contract?</p>
          <div className="btn-wrap">
            <div className="btn-container">
              <PrimaryButton
                onClick={handleAction}
                sx={{
                  bgcolor: "transparent",
                  boxShadow: "none",
                  color: colors.checkGreen,
                  textTransform: "none",
                  py: "4px",
                  border: "2px solid",
                  borderColor: colors.checkGreen,
                  borderRadius: "24px",
                  "&:hover": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
                isLoading={loading}
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default SignModal;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 84px;
    height: 84px;
    background-color: transparent;
    border: 4px solid;
    border-color: ${colors.checkGreen};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.regular};
    font-size: 28px;
    color: ${colors.black};
    margin-block: 24px;
  }
  p {
    font-family: ${fonts.regular};
    color: ${colors.foreBlack};
    font-size: 16px;
    text-align: center;
  }
  .btn-wrap {
    margin-top: 24px;
    width: 100%;
    display: flex;
    justify-content: center;
    .btn-container {
      width: 50%;
    }
  }
`;
