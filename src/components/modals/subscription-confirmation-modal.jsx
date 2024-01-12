import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { colors, fonts } from "../../utils/theme";
import styled from "styled-components";
import PrimaryButton from "../buttons/primary-button";
import { useDeleteSubscription } from '../../hooks/data-hook';
import DeleteIcon from "@mui/icons-material/Delete";

const SubscriptionConfirmationModal = ({ open, id, handleClose, refetch }) => {
  const { mutate: DeleteSubscription, isLoading } = useDeleteSubscription();
  const handleAction = () => {
    DeleteSubscription(id, {
      onSuccess: () => {
        refetch()
        handleClose()
      }
    })
  }
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
        <SuccessContent confirm={true}>
          <div className="icon-circle">
            <DeleteIcon sx={{ color: "#FD6B6B", fontSize: 56 }} />
          </div>
          <h4>Delete Subscription?</h4>
          <p>
            Are you sure you want to delete this subscription?
          </p>
          <div className="btn-wrap">
            <div className="btn-container">
              <PrimaryButton
                onClick={handleClose}
                sx={{
                  bgcolor: "transparent",
                  boxShadow: "none",
                  color: colors.foreBlack,
                  border: "1px solid",
                  borderColor: colors.foreBlack,
                  "&:hover": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
              >
                Cancel
              </PrimaryButton>
            </div>
            <div className="btn-container">
              <PrimaryButton
                onClick={handleAction}
                sx={{
                  bgcolor: "#FD6B6B",
                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#FD6B6B",
                    boxShadow: "none",
                  },
                }}
                isLoading={isLoading}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionConfirmationModal;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 96px;
    height: 96px;
    background-color: ${(props) =>
    props.confirm ? colors.translucentBlue : "#ffe3e3"};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.semibold};
    font-size: 28px;
    color: ${(props) => (props.confirm ? colors.themeBlue : "#fd6b6b")};
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
    margin-left: -24px;

    .btn-container {
      width: 100%;
      margin-left: 24px;
    }
  }
`;