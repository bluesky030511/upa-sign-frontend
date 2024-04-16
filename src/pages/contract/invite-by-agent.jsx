import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import http from '../../utils/http';
import { API_ENDPOINTS } from '../../utils/variables';
import PageLoader from '../../shared-components/loader/page-loader';
import { Loader } from '../../shared-components/loader/loader';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box } from "@mui/material";
import ContactForm from '../../components/steps/ContactForm';
import InsuranceForm from '../../components/steps/InsuranceForm';
import { useGetPlaceholdersByContractId, useInviteCustomer } from '../../hooks/data-hook';
import SignModal from '../../components/modals/sign-modal';
import { useToast } from '../../context/toast.context';

const InviteByAgent = () => {
  const { contractId } = useParams()
  const [inviteData, setInviteData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();

  const {
    mutate: InviteCustomer,
    error,
    isError,
  } = useInviteCustomer()

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleInviteData = (values) => {
    setInviteData({ ...inviteData, ...values });
  };

  const getContract = async () => {
    const { data } = await http.get(`${API_ENDPOINTS.CONTRACT}/${contractId}`);
    return data;
  }

  const handleOpenModal = () => {
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const { data, isLoading } = useQuery('contract-invite', getContract, {
    onSuccess: (data) => {
      console.log(data)
    },
    onerror: (error) => {
      console.log(error)
    }
  });

  const { data: placeholders } = useGetPlaceholdersByContractId(contractId)

  const onSubmit = () => {
    const knownFields = [ 'email', 'firstname', 'lastname', 'address', 'gender', 'phoneNumber', 'country', 'city', 'state', 'zipCode', 'insuranceCompany', 'policyNumber', 'claimNo', 'dateOfLoss', 'causeOfLoss', 'status' ]
    let additionalFields = {}
    Object.keys(inviteData).forEach(key => {
      if(!knownFields.includes(key)) {
        additionalFields[key] = inviteData[key]
        delete inviteData[key]
      }
    })
    InviteCustomer(
      {
        id: contractId,
        input: {
          ...inviteData,
          ...additionalFields
        },
      },
      {
        onSuccess: () => {
          showSuccessToast("Invite sent");
          handleCloseModal();
          navigate(`/documents/details/${contractId}`)
        },
      }
    );
  }

  return Boolean(contractId) ?
    (
      isLoading ? (
        <PageLoader>
          <Loader size={64} />
        </PageLoader>
      ) :
        (
          <Container>
            <SignModal
              open={confirmModal}
              handleClose={handleCloseModal}
              handleAction={onSubmit}
              loading={false}
              actionText="Are you sure you want to send invite?"
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
              additionalFields={placeholders}
              />
            )}
            {activeStep === 1 && (
              <InsuranceForm
                handleInviteData={handleInviteData}
                handleOpenModal={handleOpenModal}
                inviteData={inviteData}
              />
            )}
          </Container >
        )
    ) :
    (
      <Navigate to='/not-found' />
    )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;


export default InviteByAgent;