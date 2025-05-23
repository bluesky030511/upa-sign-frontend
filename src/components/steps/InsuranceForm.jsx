import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import PrimaryButton from "../buttons/primary-button";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useUI } from "../../context/ui.context";

const schema = yup.object({
  insuranceCompany: yup.string().required("Please enter insurance company"),
  policyNumber: yup.string().required("Please enter policy"),
  claimNo: yup.string().required("Please enter claim number"),
  dateOfLoss: yup
    .date()
    .nullable()
    .required("Please enter date of loss")
    .default(undefined),
  causeOfLoss: yup.string().required("Please enter cause of loss"),
  mortgage: yup.string().required("Please enter mortgage"),
  initials: yup.string().required("Please enter initials"),
  contingencyFee: yup.string().required("Please enter contingencyFee"),
  lossAddress: yup.string().required("Please enter loss address"),
  lossCity: yup.string().required("Please enter loss city"),
  lossState: yup.string().required("Please enter loss state"),
  lossZipCode: yup.string().required("Please enter loss ZipCode"),
  agentInitials: yup.string().required("Please enter agent initials"),
  // publicAdjusterLicense: yup.string().required("Please enter Public Adjuster License number"),
});
const InsuranceForm = ({ handleInviteData, handleOpenModal, inviteData, fields }) => {
  const { user, setUser } = useUI();
  const [licenses, setLicenses] = useState([{ region: '', number: '' }]); 
  const [licnese, setLicense] = useState("");

  useEffect(() => {
    if( user.licenses )
      setLicenses(user.licenses.map(license => { return typeof license == "string" ? JSON.parse(license) : license}))
    else
      setLicenses( [{ region: '', number: '' }]);
  }, [])
  const [additionalFields, setAdditionalFields] = useState([]);
  useEffect(() => {
    setAdditionalFields(prevFields => {
      const uniqueFields = fields.filter(field => 
        !field.name.includes("agent") && !field.name.includes("client") &&
        !prevFields.some(prevField => prevField.id === field.id)
      );
      return [...prevFields, ...uniqueFields];
    });
  }, [fields]);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      insuranceCompany: (inviteData && inviteData.insuranceCompany) || "",
      policyNumber: (inviteData && inviteData.policyNumber) || "",
      claimNo: (inviteData && inviteData.claimNo) || "",
      dateOfLoss: (inviteData && inviteData.dateOfLoss) || "",
      causeOfLoss: (inviteData && inviteData.causeOfLoss) || "",
      mortgage: (inviteData && inviteData.mortgage) || "",
      initials: (inviteData && inviteData.initials) || "",
      lossAddress: (inviteData && inviteData.lossAddress) || "",
      lossCity: (inviteData && inviteData.lossCity) || "",
      lossState: (inviteData && inviteData.lossState) || "",
      lossZipCode: (inviteData && inviteData.lossZipCode) || "",
      agentInitials: (inviteData && inviteData.agentInitials) || "",
      // publicAdjusterLicense: (inviteData && inviteData.publicAdjusterLicense) || "",
      contingencyFee: (inviteData && inviteData.contingencyFee) || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit =(data) => {
    handleInviteData({...data, publicAdjusterLicense: licnese});
    handleOpenModal({...data, publicAdjusterLicense: licnese});
  };

  const handleChange = (event) => {
    setLicense(event.target.value)
  }
  return (
    <Form className="profile-box" onSubmit={handleSubmit(onSubmit)}>
      <h3>Insurance</h3>
      <Controller
        name="insuranceCompany"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Insurance Company"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="policyNumber"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Policy #"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="claimNo"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Claim #"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="dateOfLoss"
        control={control}
        render={({ field, fieldState }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              {...field}
              label="Date of loss"
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  inputProps: {
                    placeholder: "Client Date of loss",
                    sx: {
                      fontFamily: fonts.medium,
                      fontSize: 16,
                      "&:placeholder": {
                        color: colors.fadeBlack,
                      },
                    },
                  },
                  sx: {
                    bgcolor: colors.translucentBlue,
                    borderRadius: 1,
                    mt: "25px",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                },
              }}
            />
            {fieldState.error && (
              <FormHelperText
                sx={{
                  color: "red !important",
                  ml: 1,
                  fontFamily: fonts.regular,
                }}
              >
                {fieldState.error.message}
              </FormHelperText>
            )}
          </LocalizationProvider>
        )}
      />
      <Controller
        name="causeOfLoss"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Cause of Loss"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="lossAddress"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Loss Address"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Grid container spacing={1}>
        <Grid item lg={4} xs={12}>
          <Controller
            name="lossCity"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="Client Loss City"
                {...field}
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Controller
            name="lossState"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="Client Loss State"
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Controller
            name="lossZipCode"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="Client Loss ZipCode"
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Controller
        name="mortgage"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Mortgage"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="initials"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Initials"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="agentInitials"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Agent Initials"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="publicAdjusterLicense"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl variant="standard" sx={{ width:"100%" }} >
            <InputLabel sx={{ 
              px: "20px", 
              py:"15px", 
              fontFamily: fonts.medium, 
              fontSize: "16px",  
            }} 
            >License Number</InputLabel>
          <Select 
            value={licnese}
            label="License Number"
            onChange={handleChange}
            inputProps={{
              sx: {
                py: "17px",
                px: "20px",
                color: colors.foreBlack,
                fontFamily: fonts.medium,
                fontSize: "16px",
                bgcolor: colors.translucentBlue,
                borderRadius: "7px",
                "&::placeholder": {
                  color: colors.fadeBlack,
                },
              },
            }}
            sx={{
              mt: "25px",
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                {
                  display: "none",
                },
              "& .MuiInputBase-root, & .MuiFilledInput-root.Mui-focused": {
                bgcolor: "transparent",
              },
              "& .MuiInputBase-root:hover": {
                bgcolor: "transparent",
              },
              "& .MuiInputBase-root:focus": {
                bgcolor: "transparent",
              },
              width: "100%"
            }}
          >
            {licenses.map(license => <MenuItem value={license.number}>{license.region} : {license.number}</MenuItem>)}
          </Select>
          </FormControl>
        )}
      />
      <Controller
        name="contingencyFee"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Client Contingency fee %"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      {additionalFields.map((additionalField, index) => (
        <Controller
          key={index}
          name={String(additionalField.id)}
          control={control}
          render={({ field, fieldState }) => (
            additionalField.name != 'date' && additionalField.name != 'time' ? (<PrimaryInput
              placeholder={additionalField.dataLabel}
              {...field}
              helperText={fieldState.error && fieldState.error.message}
            />) : (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {additionalField.name == "date" ? (<DatePicker
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      inputProps: {
                        placeholder: additionalField.dataLabel,
                        sx: {
                          fontFamily: fonts.medium,
                          fontSize: 16,
                          "&:placeholder": {
                            color: colors.fadeBlack,
                          },
                        },
                      },
                      sx: {
                        bgcolor: colors.translucentBlue,
                        borderRadius: 1,
                        mt: "25px",
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    },
                  }}
                />) : (<TimePicker 
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      inputProps: {
                        placeholder: additionalField.dataLabel,
                        sx: {
                          fontFamily: fonts.medium,
                          fontSize: 16,
                          "&:placeholder": {
                            color: colors.fadeBlack,
                          },
                        },
                      },
                      sx: {
                        bgcolor: colors.translucentBlue,
                        borderRadius: 1,
                        mt: "25px",
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    },
                  }}
                />)}
                {fieldState.error && (
                  <FormHelperText
                    sx={{
                      color: "red !important",
                      ml: 1,
                      fontFamily: fonts.regular,
                    }}
                  >
                    {fieldState.error.message}
                  </FormHelperText>
                )}
              </LocalizationProvider>
            )
          )}
        />
      ))}
      <div className="btn-container">
        <PrimaryButton type="submit">Save</PrimaryButton>
      </div>
    </Form>
  );
};

export default InsuranceForm;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  margin-inline: auto;
  background-color: ${colors.white};
  padding: 50px 70px;
  box-shadow: 0px 0px 15px -4px rgba(0, 0, 0, 0.25);

  h3 {
    font-family: ${fonts.semibold};
    font-size: 32px;
    color: ${colors.black};
    text-align: center;
    margin-bottom: 24px;
  }

  .btn-container {
    margin-top: 32px;
  }

  .role-select-container {
    margin-top: 12px;
    span {
      font-family: ${fonts.medium};
      font-size: 13px;
      color: ${colors.foreBlack};
    }
  }

  .signature-canvas {
    width: 100%;
    max-width: 362px;
    height: 181px;
    background-color: ${colors.white};
    margin-left: 64px;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    h4 {
      font-size: 32px;
      font-family: "Signature";
      color: ${colors.foreBlack};
    }
  }

  .change-password-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  span.error-text {
    font-family: ${fonts.regular};
    font-size: 0.75rem;
    color: red;
    margin-left: 8px;
  }

  @media screen and (max-width: 600px) {
    padding: 18px 12px;
    h3 {
      font-size: 24px;
    }
  }
`;
