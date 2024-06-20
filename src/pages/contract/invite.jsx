import axios from "axios";
import React, {useRef, useEffect, useState} from "react";
import { useWindowWidth } from '@wojtekmaj/react-hooks';
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack"; 
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { useMutation, useQuery } from "react-query";
import { Box, Button, TextField } from "@mui/material";
import styled from "styled-components";

import { colors, fonts } from "../../utils/theme";
import SignModal from "../../components/modals/sign-modal";
import { useUI } from "../../context/ui.context";
import { Loader } from "../../shared-components/loader/loader";
import PageLoader from "../../shared-components/loader/page-loader";
import { useGetPlaceholdersByContractId, useSignContract } from "../../hooks/data-hook";
import { min } from "date-fns";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const DroppablePage = ({ pageNumber, width, fields, setFields }) => {
  const maxWidth = 1363;
  const pdfContainerRef = useRef(null);
  const [fieldDimensions, setFieldDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (pdfContainerRef.current) {
        const targetRect = pdfContainerRef.current.getBoundingClientRect();
        setFieldDimensions({ width: targetRect.width, height: targetRect.height });
      }
    };
    setTimeout(() => {
      updateDimensions();
    }, 100);

    updateDimensions();

  }, []);

  const handleText = (event, item) => {
    setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? {...field, value: event.target.value} : field
    ));
  }

  const handleTime = (value, item) => {
    setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? { ...field, value: value } : field
    ));
  }

  return (
    <div style={{ position: 'relative' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PDF ref={pdfContainerRef} >
          <Page pageNumber={pageNumber} width={width} />
          {fields.map((field) => (
            <div
              style={{
                position: 'absolute',
                left: `${fieldDimensions.width * field.left}px`,
                top: field.name == "date" || field.name == "time" ? `${fieldDimensions.height * field.top - 5}px`  : `${fieldDimensions.height * field.top}px`
              }}
              key={field.id}            
            >
              {field.name != 'date' && field.name != 'time' && (<TextField 
                  variant="outlined"
                  defaultValue={field.value}
                  label={field.dataLabel}
                  size="small"
                  sx={{ 
                    input: {fontSize: `${width / maxWidth * (22 + (field.fontSize - 11))}px`, p: '2px', px: '4px'}, 
                    width: field.width,
                    height: `${width / maxWidth * 20}px` 
                  }}
                  InputProps={{ readOnly: field.name == "text" ? false : true }}
                  onChange={event => {handleText(event, field);}}
                />)}
                <DemoContainer components={['DatePicker', 'TimePicker']}>
                  {field.name == 'date' && (<DatePicker 
                    label={field.dataLabel} 
                    defaultValue={field.value && dayjs(field.value)} 
                    sx={{ 
                      input: { py: '10px', px: '4px' }, 
                      width: '50px',  
                    }}
                    onChange={(value) => handleTime(value.toString(), field)} 
                  />)}
                  {field.name == 'time' && (<TimePicker 
                    label={field.dataLabel} 
                    defaultValue={field.value && dayjs(field.value)} 
                    sx={{ 
                      input: { py: '10px', px: '4px' }, 
                      width: '50px',  
                    }} 
                    onChange={(value) => handleTime(value, field)} 
                  />)}
                </DemoContainer>
            </div>
          ))}
        </PDF>
      </LocalizationProvider>
    </div>
  );
}

const Invite = () => {
  const width = useWindowWidth();
  const [searchParam] = useSearchParams();
  const { setUser, removeUser } = useUI();
  let accessToken = searchParam.get("accessToken");
  let contractId = searchParam.get("contractId");
  const [inviteData, setInviteData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigate = useNavigate();
  // const { data: placeholders } = useGetPlaceholdersByContractId(contractId, accessToken)
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const [fields, setFields] = useState(null);

  const handleInviteData = (values) => {
    setInviteData({ ...inviteData, ...values });
  };

  const url = `${BASE_URL}/${contractId}.pdf`;
  pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

  const [numPages, setNumPages] = useState(null);

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
      setFields(data.fields);
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

  // const signContract = async (input) => {
  //   const knownFields = [ 'email', 'firstname', 'lastname', 'address', 'gender', 'phoneNumber', 'country', 'city', 'state', 'zipCode', 'insuranceCompany', 'policyNumber', 'claimNo', 'dateOfLoss', 'causeOfLoss', 'status' ]
  //   let additionalFields = {}
  //   Object.keys(input.data).forEach(key => {
  //     if(!knownFields.includes(key)) {
  //       additionalFields[key] = input.data[key]
  //       delete input.data[key]
  //     } 
  //   })
  //   console.log("input.data: ", input.data);
  //   const { data } = await axios.post(
  //     `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${input.contractId}/invite/${input.inviteId}/status`,
  //     {...input.data, additionalFields},
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   return data; 
  // };

  const { 
    mutate: SignContract, 
    isLoading: isSigning 
  } = useSignContract();

  const handleSignContract = () => {
    SignContract(
      {
        contractId: data.id,
        inviteId: data.invite[0].id,
        accessToken: accessToken,
        data: {
          status: "APPROVED",
          ...inviteData,
          ...{fields:fields},
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
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mb:4, gap: 3}} >
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
              <DroppablePage
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={Math.min( width > 600 ? width-485 : width - 40, 3000)}
                fields={fields.filter((field) => 
                  field.pageNumber === index + 1 && (field.name === "text" || field.name == "date" || field.name == "time" || field.name === "client_signature" || field.name === "client_contract_date" || field.name === "client_sign_date")
                )}
                setFields={setFields}
              />
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
  margin-top: 10px;
  justify-content: center;
  display: flex;
`;