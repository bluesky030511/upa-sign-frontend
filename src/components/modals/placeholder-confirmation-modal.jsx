import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useToast } from "../../context/toast.context";
import { useUI } from "../../context/ui.context";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import Tooltip from "@mui/material/Tooltip";
import { isComplete } from "../../utils/helper";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryButton from "../buttons/primary-button";
import { useDeletePlaceholder } from '../../hooks/data-hook';

const PlaceholderConfirmationModal = ({ open, handleClose, id, type, refetch }) => {
  const confirm = type === 'CONFIRM'
  const { user } = useUI();
  const { showSuccessToast, showErrorToast } = useToast()
  const { mutate: DeletePlaceholder } = useDeletePlaceholder()

  const handleAction = () => {
    DeletePlaceholder(id, {
      onSuccess: () => {
        refetch()
        handleClose()
        showSuccessToast('Placeholder deleted');
      },
      onError: () => {
        showErrorToast('Can\'t delete placeholder')
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
        <SuccessContent confirm={confirm}>
          <div className="icon-circle">
            {confirm ? (
              <BorderColorRoundedIcon
                sx={{ color: colors.themeBlue, fontSize: 56 }}
              />
            ) : (
              <DeleteIcon sx={{ color: "#FD6B6B", fontSize: 56 }} />
            )}
          </div>
          <h4>Delete Placeholder</h4>
          <p>
            Are you sure you want to delete this placeholder?
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
              {confirm ? (
                <Tooltip
                  title={
                    isComplete(user) ? "" : "Please complete your profile first"
                  }
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontFamily: fonts.medium,
                        fontSize: 12,
                      },
                    },
                  }}
                >
                  <span>
                    <PrimaryButton
                      onClick={handleAction}
                      sx={{
                        bgcolor: colors.themeBlue,
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: colors.themeBlue,
                          boxShadow: "none",
                        },
                      }}
                      // isLoading={isSigning}
                      disabled={!isComplete(user)}
                    >
                      Sign
                    </PrimaryButton>
                  </span>
                </Tooltip>
              ) : (
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
                // isLoading={isLoading}
                >
                  Delete
                </PrimaryButton>
              )}
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  )
}

export default PlaceholderConfirmationModal;

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