import React from "react";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import PrimaryButton from "../buttons/primary-button";
import { FormHelperText } from "@mui/material";

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
});
const InsuranceForm = ({ handleInviteData, handleOpenModal }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      insuranceCompany: "",
      policyNumber: "",
      claimNo: "",
      dateOfLoss: null,
      causeOfLoss: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    handleInviteData(data);
    handleOpenModal();
  };
  return (
    <Form className="profile-box" onSubmit={handleSubmit(onSubmit)}>
      <h3>Insurance</h3>
      <Controller
        name="insuranceCompany"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Insurance Company"
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
            placeholder="Policy #"
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
            placeholder="Claim #"
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
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  inputProps: {
                    placeholder: "Date of loss",
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
            placeholder="Cause of Loss"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
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
