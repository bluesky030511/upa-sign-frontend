import axios from "axios";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack"; 
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { useMutation, useQuery } from "react-query";
import { Box, Button } from "@mui/material";
import styled from "styled-components";

import { colors, fonts } from "../../utils/theme";
import SignModal from "../../components/modals/sign-modal";
import { useUI } from "../../context/ui.context";
import { Loader } from "../../shared-components/loader/loader";
import PageLoader from "../../shared-components/loader/page-loader";
import { useGetPlaceholdersByContractId } from "../../hooks/data-hook";

const Invite = () => {
  const [searchParam] = useSearchParams();
  const { setUser, removeUser } = useUI();
  let accessToken = searchParam.get("accessToken");
  let contractId = searchParam.get("contractId");
  const [inviteData, setInviteData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();
  const { data: placeholders } = useGetPlaceholdersByContractId(contractId, accessToken)
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleInviteData = (values) => {
    setInviteData({ ...inviteData, ...values });
  };

  const url = `${BASE_URL}/${contractId}.pdf`;
  pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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
    const knownFields = [ 'email', 'firstname', 'lastname', 'address', 'gender', 'phoneNumber', 'country', 'city', 'state', 'zipCode', 'insuranceCompany', 'policyNumber', 'claimNo', 'dateOfLoss', 'causeOfLoss', 'status' ]
    let additionalFields = {}
    Object.keys(input.data).forEach(key => {
      if(!knownFields.includes(key)) {
        additionalFields[key] = input.data[key]
        delete input.data[key]
      } 
    })
    const { data } = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${input.contractId}/invite/${input.inviteId}/status`,
      {...input.data, additionalFields},
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
          handleAction={handleSignContract}
          loading={isSigning}
        />
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mb:4, gap: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button variant="contained" 
              size="large"
              sx={{
                bgcolor: colors.themeBlue,
                textTransform: "none",
                fontFamily: fonts.medium,
                minWidth: 120,
                borderRadius: 1,
              }} 
              onClick={handleOpenModal}
            >
              Sign
            </Button>
          </Box>
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} >
            {Array.from(new Array(numPages), (el, index) => (
              <PDF>
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width="800"
                />  
              </PDF>
            ))}
          </Document>
        </Box>
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
const PDF = styled.div`
  margin-top: 10px
`;