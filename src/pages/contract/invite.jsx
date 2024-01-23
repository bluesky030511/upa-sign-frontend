import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { useMutation, useQuery } from "react-query";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box } from "@mui/material";
import styled from "styled-components";

import ContactForm from "../../components/steps/ContactForm";
import InsuranceForm from "../../components/steps/InsuranceForm";
import SignModal from "../../components/modals/sign-modal";
import { useUI } from "../../context/ui.context";
import { Loader } from "../../shared-components/loader/loader";
import PageLoader from "../../shared-components/loader/page-loader";

const Invite = () => {
  const [searchParam] = useSearchParams();
  const { setUser, removeUser } = useUI();
  let accessToken = searchParam.get("accessToken");
  let contractId = searchParam.get("contractId");
  const [inviteData, setInviteData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleInviteData = (values) => {
    setInviteData({ ...inviteData, ...values });
  };

  const handleOpenModal = () => {
    setConfirmModal(true);
  };
  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const getContract = async () => {
    const { data } = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${contractId}`,
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
      removeUser();
      setUser({
        loggedIn: false,
        isAgent: false,
        isShadow: true,
      });
      if (
        Boolean(data.invite[0].approvedAt) &&
        Boolean(data.invite[0].file[0])
      ) {
        navigate(`detail/${contractId}/${accessToken}`);
      }
    },
  });

  const { isFetching: isProfileFetching } = useQuery(
    "customer-profile",
    getProfile,
    {
      onSuccess: (data) => {
        handleInviteData({
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          address: data.address,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          country: data.country,
          city: data.city,
          state: data.state,
        });
      },
      enabled: !!accessToken,
    }
  );

  const signContract = async (input) => {
    const { data } = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${input.contractId}/invite/${input.inviteId}/status`,
      input.data,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  };

  const { mutate: SignContract, isLoading: isSigning } =
    useMutation(signContract);

  const handleSignContract = () => {
    SignContract(
      {
        contractId: data.id,
        inviteId: data.invite[0].id,
        data: {
          status: "APPROVED",
          ...inviteData,
        },
      },
      {
        onSuccess: () => {
          navigate(`detail/${contractId}/${accessToken}`);
        },
      }
    );
  };

  return Boolean(accessToken) && Boolean(contractId) ? (
    isFetching || isProfileFetching ? (
      <PageLoader>
        <Loader size={64} />
      </PageLoader>
    ) : (
      <Container>
        <SignModal
          open={confirmModal}
          handleClose={handleCloseModal}
          handleSignContract={handleSignContract}
          loading={isSigning}
        />
        <Box sx={{ width: 500, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step sx={{ "& svg": { width: 24, height: 24 } }}>
              <StepLabel>Contact</StepLabel>
            </Step>
            <Step>
              <StepLabel>Insurance</StepLabel>
            </Step>
          </Stepper>
        </Box>
        {activeStep === 0 && (
          <ContactForm
            handleNext={handleNext}
            handleInviteData={handleInviteData}
            inviteData={inviteData}
          />
        )}
        {activeStep === 1 && (
          <InsuranceForm
            handleInviteData={handleInviteData}
            handleOpenModal={handleOpenModal}
            inviteData={inviteData}
          />
        )}
      </Container>
    )
  ) : (
    <Navigate to="/not-found" />
  );
};

export default Invite;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
