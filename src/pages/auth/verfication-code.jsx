import React, { useState } from "react";
import styled from "styled-components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams, Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { Controller, useForm } from "react-hook-form";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";
import { useResetPassword } from "../../hooks/user-hook.jsx";
import ErrorAlert from "../../components/alerts/error-alert";
import { getRem } from "../../utils/helper";

const schema = yup.object({
  key: yup.string().required("Please enter verification code"),
});

const VerificationScreen = () => {
  const [successModal, setSuccessModal] = useState(false);
  const [searchParams] = useSearchParams();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      key: searchParams.get("key"),
    },
    resolver: yupResolver(schema),
  });

  const {
    mutate: ResetPassword,
    isLoading,
    isError,
    error,
  } = useResetPassword();

  const handleOpen = () => {
    setSuccessModal(true);
  };

  const handleClose = () => {
    setSuccessModal(false);
  };

  const onSubmit = (values) => {
    ResetPassword(
      {
        key: values.key,
      },
      {
        onSuccess: () => {
          handleOpen();
        },
      }
    );
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={successModal}
        PaperProps={{
          sx: {
            maxWidth: "400px",
            borderRadius: 4,
          },
        }}
      >
        <DialogContent>
          <SuccessContent>
            <div className="icon-circle">
              <EmailRoundedIcon
                sx={{ color: colors.themeBlue, fontSize: 56 }}
              />
            </div>
            <h4>Verified!</h4>
            <p>
              Successfully verified. Your new password has been sent to your
              email.
            </p>
            <div className="btn-container">
              <Link to="/login">
                <PrimaryButton>OKAY</PrimaryButton>
              </Link>
            </div>
          </SuccessContent>
        </DialogContent>
      </Dialog>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Verification code</h2>
        <p className="desc-text">Submit the autofill six digit code below</p>
        <Controller
          name="key"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              {...field}
              placeholder="Enter verification code"
              helperText={fieldState.error && fieldState.error.message}
              readOnly
            />
          )}
        />
        <div className="btn-container">
          <PrimaryButton isLoading={isLoading} type="submit">
            Submit
          </PrimaryButton>
        </div>
        <ErrorAlert show={isError} error={error} />
      </Form>
    </>
  );
};
export default VerificationScreen;

const Form = styled.form`
  min-width: 357px;
  max-width: 357px;
  h2 {
    font-size: 32px;
    font-family: ${fonts.semibold};
    margin-bottom: 10px;
  }
  p.desc-text {
    font-size: 14px;
    font-family: ${fonts.regular};
    margin-bottom: 30px;
    color: ${colors.black}BD;
  }
  .btn-container {
    margin-top: 30px;
  }
  @media screen and (max-width: 600px) {
    min-width: unset;
    margin-top: ${getRem(32)};
    h2 {
      font-size: 24px;
    }
    p.desc-text {
      font-size: 12px;
      margin-bottom: 0px;
    }
  }
`;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 96px;
    height: 96px;
    background-color: ${colors.translucentBlue};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.semibold};
    font-size: 36px;
    color: ${colors.themeBlue};
    margin-block: 24px;
  }
  p {
    font-family: ${fonts.regular};
    color: ${colors.foreBlack};
    font-size: 14px;
    text-align: center;
  }

  .btn-container {
    width: 40%;
    margin-inline: auto;
    margin-top: 24px;
  }
`;
