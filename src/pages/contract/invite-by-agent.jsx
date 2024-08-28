import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useWindowWidth } from '@wojtekmaj/react-hooks';
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack"; 
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import http from '../../utils/http';
import PageLoader from '../../shared-components/loader/page-loader';
import { Loader } from '../../shared-components/loader/loader';
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { 
  TextField,
  Select,
  FormControl,
  InputLabel, 
  MenuItem,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Button } from "@mui/material";
import { colors, fonts } from "../../utils/theme";
import ContactForm from '../../components/steps/ContactForm';
import InsuranceForm from '../../components/steps/InsuranceForm';
import { useGetPlaceholdersByContractId, useInviteCustomer } from '../../hooks/data-hook';
import SignModal from '../../components/modals/sign-modal';
import AuthModal from '../../components/modals/auth-modal';
import ClientInfoModal from "../../components/modals/clientinfo-modal";
import { useToast } from '../../context/toast.context';
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
    }, 500);

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
                top: `${fieldDimensions.height * field.top}px`
              }}
              key={field.id}            
            >
              
              {/* {field.name != 'date' && field.name != 'time' && field.name != 'month' && ( */}
              <TextField 
                variant="outlined"
                defaultValue={field.value == 'count' ? 0 : field.value }
                label={field.name == "agent_initials" ? 
                "Agent initials" : field.dataLabel}
                size="small"
                sx={{ 
                  input: {fontSize: `${width / maxWidth * (22 + (field.fontSize - 11))}px`, p: '2px', px: '4px'}, 
                  width: field.width,
                  height: `${width / maxWidth * 20}px` 
                }}
                // type={ field.name == 'count' ? 'number' : 'text' }
                InputProps={{ 
                  readOnly: true //field.name == "text" || field.name == "agent_initials" || field.name == "month" || field.name == "count"  ? false : true 
                }}
                onChange={event => {handleText(event, field);}}
              />
              {/* )} */}
              {/* { field.name == 'month' && (
                <FormControl size='small'>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={field? field.value : ''}
                    onChange={event => {handleText(event, field);}}
                    sx={{ width: field.width, }}
                  >
                    <MenuItem value="January" >January</MenuItem>
                    <MenuItem value="February" >February</MenuItem>
                    <MenuItem value="March" >March</MenuItem>
                    <MenuItem value="April" >April</MenuItem>
                    <MenuItem value="May" >May</MenuItem>
                    <MenuItem value="June" >June</MenuItem>
                    <MenuItem value="July" >July</MenuItem>
                    <MenuItem value="August" >August</MenuItem>
                    <MenuItem value="September" >September</MenuItem>
                    <MenuItem value="October" >October</MenuItem>
                    <MenuItem value="November" >November</MenuItem>
                    <MenuItem value="December" >December</MenuItem>
                  </Select>
                </FormControl>
              )}
              <DemoContainer components={['DatePicker', 'TimePicker']}>
                {field.name == 'date' && (<DatePicker 
                  label={field.dataLabel} 
                  defaultValue={field.value && dayjs(field.value)} 
                  sx={{ 
                    input: { py: '10px', px: '4px' }, 
                    width: field.width,  
                  }}
                  onChange={(value) => handleTime(value.toString(), field)} 
                />)}
                {field.name == 'time' && (<TimePicker 
                  label={field.dataLabel} 
                  defaultValue={field.value && dayjs(field.value)} 
                  sx={{ 
                    input: { py: '10px', px: '4px' }, 
                    width: field.width,  
                  }} 
                  onChange={(value) => handleTime(value, field)} 
                />)}
              </DemoContainer> */}
            </div>
          ))}
        </PDF>
      </LocalizationProvider>
    </div>
  );
}

const InviteByAgent = () => {
  const width = useWindowWidth();
  const { contractId } = useParams()
  const [inviteData, setInviteData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [clientinfoModal, setClientinfoModal] = useState(false);
  const [url, setUrl] = useState(null);
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [fields, setFields] = useState([]);
  const [step, setStep] = useState(0);
  const [clientInfo, setClientInfo] = useState({});

  pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

  const {
    mutate: InviteCustomer,
    error,
    isError,
    isLoading: isInviting,
  } = useInviteCustomer()

  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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

  const handleOpenInfoModal = () => {
    setClientinfoModal(true);
  }

  const handleCloseInfoModal = () => {
    setClientinfoModal(false);
  }


  const handleStep = async (values) => {
    const data = {
      client_signature: "client_signature",
      client_full_name: `${inviteData.firstname} ${inviteData.lastname}`,
      client_phone_number: inviteData.phoneNumber,
      client_email: inviteData.email,
      client_full_address: `${inviteData.address}, ${inviteData.city}, ${inviteData.state}, ${inviteData.zipCode}` || 'N/A',
      client_street_address: inviteData.address,
      // client_country: inviteData.country,
      client_state: inviteData.state,
      client_city: inviteData.city,
      client_zipCode: inviteData.zipCode,
      client_gender: "MALE",
      client_insurance_company: values.insuranceCompany,
      client_policy_number: values.policyNumber,
      client_claim: values.claimNo,
      client_contract_date: "client_contract_date",
      client_sign_date: "client_sign_date",
      client_cause_of_loss: values.causeOfLoss,
      client_date_of_loss: new Date(values.dateOfLoss).toDateString(),
      client_mortgage: values.mortgage,
      client_initials: values.initials,
      client_contingency_fee: `${values.contingencyFee}%`,
      client_loss_full_address: `${values.lossAddress}, ${values.lossCity}, ${values.lossState}, ${values.lossZipCode}` || 'N/A',
      client_loss_street_address:values.lossAddress,
      client_loss_city: values.lossCity,
      client_loss_state: values.lossState,
      client_loss_zipCode: values.lossZipCode,
      agent_initials: values.agentInitials,
      client_day_of_loss: String(new Date(values.dateOfLoss).getDate()),
      client_month_of_loss: String(new Date(values.dateOfLoss).getMonth() + 1),
      client_year_of_loss: String(new Date(values.dateOfLoss).getFullYear() % 100),
    };
    
    setClientInfo(data);

    setStep(1);
    await fields.forEach(field => {
      if(field.name.includes("client") || field.name == "agent_initials") {
        field.value = data[field.name] ? data[field.name] : field.value;
      }
      if(values[field.id]) {
        if (field.name == "date")
          field.value =  new Date(values[field.id]).toDateString();
        else if (field.name == "time") 
          field.value = dayjs(values[field.id]).format('hh:mm A');
        else
          field.value = values[field.id];
      }
    });
    setFields([...fields]);
  }

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  const handleCloseAhtuModal = () => {
    setAuthModal(false);
  }

  const handleInPerson = () => {
    setConfirmModal(false);
    setAuthModal(true);
  }

  const { data, isLoading } = useQuery('contract-invite', getContract, {
    onSuccess: async (data) => {
      setUrl(`${BASE_URL}/${data.template.filename}`);
      let date = new Date();
      let value = {
        agent_sign_date: date.toDateString(),
        agent_full_name: data.agent.firstname + ' ' + data.agent.lastname,
        agent_signature: "agent_signature",
        agent_full_address: `${data.agent.address}, ${data.agent.city}, ${data.agent.state}, ${data.agent.zipCode}` || 'N/A',
        agent_street_address: data.agent.address,
        agent_phone_number: data.agent.phoneNumber,
        agent_email: data.agent.email,
        agent_city: data.agent.city,
        agent_state: data.agent.state,
        agent_public_adjuster_license: data.agent.license,

        agent_zipCode: data.agent.zipCode,
        agent_gender: "MALE",
      }
      await data.fields.forEach(field => {
        if(field.name.includes("agent")) {
          field.value = value[field.name] ? value[field.name] : field.value;
        }
      });
      setFields(data.fields);
    },
    onerror: (error) => {
      console.log(error)
    }
  });

  const { data: placeholders } = useGetPlaceholdersByContractId(contractId)

  const onSubmit = (method) => {
    const knownFields = [ 'email', 'firstname', 'lastname', 'address', 'gender', 'phoneNumber',  'city', 'state', 'zipCode', 'insuranceCompany', 'policyNumber', 
      'claimNo', 'dateOfLoss', 'causeOfLoss', 'status', 'mortgage', 'initials', 'contingencyFee', 'lossAddress', 'lossCity', 'lossState', 'lossZipCode' ];
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
          ...additionalFields,
          ...{fields: fields},
          method: method
        },
      },
      {
        onSuccess: (data) => {
          if(method != 'InPerson') {
            showSuccessToast("Invite sent");
            handleCloseModal();
            navigate(`/documents/details/${contractId}`)
          }
          else
            navigate(data.url);
        },
        onError: (error, variables, context) => {
          showErrorToast(error.response.data.message);
          handleCloseModal();
          navigate(`/documents/details/${contractId}`)
        }
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
              handleAction={() => onSubmit('Remote')}
              handleInPerson={handleInPerson}
              loading={isInviting}
              actionText="Would you rather sign the contract with your client remotely or meet in person?"
            />
            <ClientInfoModal
              open={clientinfoModal}
              handleClose={handleCloseInfoModal}
              data={clientInfo}
            />
            <AuthModal 
              open={authModal}
              handleClose={handleCloseAhtuModal}
              inviteData={inviteData}
              handleAction={() => onSubmit('InPerson')}
            />
            {step === 0 && (<><Box sx={{ width: 500, mb: 4 }}>
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
                handleOpenModal={handleStep}
                inviteData={inviteData}
                fields = {fields}
              />
            )}</>)}
            {step === 1 && (<Box sx={{ display:"flex", flexDirection:"column", justifyContent:"center", mb:4, gap:3 }}>
              <Box sx={{ display:"flex", justifyContent:"right", gap: 2 }} >
                <Button variant="contained" 
                  size="large"
                  sx={{
                    bgcolor: colors.themeBlue,
                    textTransform: "none",
                    fontFamily: fonts.medium,
                    minWidth: 120,
                    borderRadius: 1,
                  }}
                  onClick={handleOpenInfoModal}
                >
                  View Client Info
                </Button>
                <Button variant="contained"
                  size='large'
                  sx={{
                    bgcolor: colors.themeBlue,
                    textTransform: "none",
                    fontFamily: fonts.medium,
                    minWidth: 120,
                    borderRadius: 1,
                  }} 
                  onClick={handleOpenModal}
                  
                >
                  {isInviting ? <Loader /> : "Invite"}
                </Button>
              </Box>
              {url && <Document file={url} onLoadSuccess={onDocumentLoadSuccess} >
                {Array.from(new Array(numPages), (el, index) => (
                  <DroppablePage
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={Math.min( width > 600 ? width-485 : width - 40, 3000)}
                    fields={fields.filter((field) => field.pageNumber === index + 1)}
                    setFields={setFields}
                  />
                ))}
              </Document>}
            </Box>)}
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
const PDF = styled.div`
  margin-top: 10px;
  justify-content: center;
  display: flex;
  position: relative;
`;

export default InviteByAgent;