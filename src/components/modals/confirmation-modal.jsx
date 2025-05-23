import axios from "axios";
import React, {useRef, useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import DialogContent from "@mui/material/DialogContent";
import PrimaryButton from "../buttons/primary-button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import Tooltip from "@mui/material/Tooltip";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import { useDeleteContract, useSignContract } from "../../hooks/data-hook";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { isComplete } from "../../utils/helper";
import { useUI } from "../../context/ui.context";
import { useToast } from "../../context/toast.context";

const ConfirmationModal = ({ open, handleClose, id, inviteId, type, accessToken }) => {
  const confirm = type === "CONFIRM";
  const { user, setUser, removeUser } = useUI();
  const { showSuccessToast } = useToast();
  const [fields, setFields] = useState([]);
  const { mutate: DeleteContract, isLoading } = useDeleteContract();
  const { mutate: SignContract, isLoading: isSigning } = useSignContract();
  const [inviteData, setInviteData] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleInviteData = (values) => {
    setInviteData({ ...inviteData, ...values });
  };

  const getContract = async () => {
    if(!accessToken || accessToken == "") return null;
    const { data } = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  };

  const getProfile = async () => {
    if(!accessToken || accessToken == "") return null;
    const { data } = await axios.get(`${BASE_URL}${API_ENDPOINTS.PROFILE}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  };
  const { data, isFetching } = useQuery("contract-invite", getContract, {
    onSuccess: (data) => {
      if(data != null)
        setFields(data.fields);
    },
  });

  const { isFetching: isProfileFetching } = useQuery(
    "customer-profile",
    getProfile,
    {
      onSuccess: (data) => {
        if(data != null) 
          handleInviteData({
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            address: data.address,
            gender: "MALE",
            phoneNumber: data.phoneNumber,
            country: data.country,
            city: data.city,
            state: data.state,
          });
      },
    }
  );

  const handleAction = () => {
    if (confirm) {
      SignContract(
        {
          contractId: id,
          inviteId: inviteId,
          accessToken: accessToken || "",
          data: {
            status: "APPROVED",
            ...inviteData,
            ...{fields:fields},
          },
        },
        {
          onSuccess: () => {
            showSuccessToast("Contract signed successfully!");
            queryClient.invalidateQueries(["get-contracts"]);
            handleClose();
          },
        }
      );
    } else {
      DeleteContract(id, {
        onSuccess: () => {
          showSuccessToast("Contract deleted successfully!");
          queryClient.invalidateQueries(["get-contracts"]);
          handleClose();
        },
      });
    }
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
          <h4>{confirm ? "Sign Contract?" : "Delete Contract?"}</h4>
          <p>
            {confirm
              ? "Are you sure you want to sign this contract?"
              : "Are you sure you want to delete this contract?"}
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
                      isLoading={isSigning}
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
                  isLoading={isLoading}
                >
                  Delete
                </PrimaryButton>
              )}
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

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
