import { useState } from "react";
import * as React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../buttons/primary-button";
import Divider from '@mui/material/Divider';
import { 
  TextField, 
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAssignSignature } from "../../hooks/data-hook";
import { useToast } from "../../context/toast.context";

const AssignSignatureModal = ({ open, handleClose, handleAction, inviteData }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const { mutate: AssignSignature, isLoading } = useAssignSignature();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(false); 
  };

  const assignSignature = () => {
    AssignSignature({
      contractId: inviteData.contractId,
      data: {
        agentEmail: email,
        ...inviteData,
      },
    }, {
      onSuccess: (data) => {
        setEmail('');
        handleClose();
      },
      onError: (error) => {
        showErrorToast(error.response.data.message);
      }
    });
  }

  const handleAddClick = () => {
    if (!validateEmail(email)) {
      setError(true);
    } else {
      setError(false);
      assignSignature();
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          <h4>{'Would you like to assign this pending document to another person for signature?'}</h4>
          <Divider flexItem/>
            <div className="btn-container">
              <TextField 
                variant="standard"
                size="small"
                label="User Email"
                type="email"
                value={email}
                sx={{ pr: 2, width: "80%" }}
                error={error}
                helperText={error ? 'Please enter a valid email' : ''}
                onChange={(event) => handleEmailChange(event)}
              />
            </div>  
          <div className="btn-wrap">
            <div className="btn-container">
              <PrimaryButton
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
                isLoading={isLoading}
                onClick={handleAddClick}
              >
                Confirm
              </PrimaryButton>
            </div>
            <div className="btn-container">
              <PrimaryButton
                onClick={handleClose}
                sx={{
                  bgcolor: "transparent",
                  boxShadow: "none",
                  color: colors.foreBlack,
                  textTransform: "none",
                  py: "4px",
                  border: "2px solid",
                  borderColor: colors.foreBlack,
                  borderRadius: "24px",
                  "&:hover": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
              >
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSignatureModal;

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
    font-size: 20px;
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
    justify-content: space-between;
    gap: 2;
    margin-left: -24px;
    .btn-container {
      width: 50%;
      margin-left: 24px;
    }
  }
  .btn-container {
    margin-top: 24px;
    margin-bottom: 24px;
    width: 100%;
    display: flex;
    justify-content: center;
    // padding-right: 30px;
  }
  .field-wrap {
    margin-top: 20px;
    width: 100%;
    // display: flex;
    min-height: 100px;
    .btn-container {
      display: flex;
      justify-content: right;
      margin-top: 10px;
      width: 100%;
    }
    .field-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
`;
