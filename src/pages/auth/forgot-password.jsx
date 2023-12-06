import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";
import { useForm, Controller } from "react-hook-form";
import { useForgotPassword } from "../../hooks/user-hook.jsx";
import ErrorAlert from "../../components/alerts/error-alert";
import { getRem } from "../../utils/helper";

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter valid email"),
});

const ForgotPassword = () => {
  const [successModal, setSuccessModal] = useState(false);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    mutate: ForgotPassword,
    isLoading,
    isError,
    error,
  } = useForgotPassword();

  const handleOpen = () => {
    setSuccessModal(true);
  };

  const handleClose = () => {
    setSuccessModal(false);
  };
  const onSubmit = (values) => {
    ForgotPassword(values, {
      onSuccess: () => {
        handleOpen();
      },
    });
  };
  return (
    <>
      <Dialog
        onClose={handleClose}
        open={successModal}
        PaperProps={{
          sx: {
            maxWidth: "400px",
            borderRadius: { xs: 2, sm: 4 },
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
            <h4>Email sent</h4>
            <p>
              An email has been sent to <strong>{watch("email")}</strong> for
              verification. Please verify and get your new password.
            </p>
            <div className="btn-container">
              <Link to="/auth">
                <PrimaryButton>OKAY</PrimaryButton>
              </Link>
            </div>
          </SuccessContent>
        </DialogContent>
      </Dialog>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Reset your password</h2>
        <p className="desc-text">
          The verification email will be send to the mailbox. please check it.
        </p>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              {...field}
              placeholder="Enter your email address"
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <div className="btn-container">
          <PrimaryButton type="submit" isLoading={isLoading}>
            Send
          </PrimaryButton>
        </div>
        <ErrorAlert show={isError} error={error} />
      </Form>
    </>
  );
};
export default ForgotPassword;

const Form = styled.form`
  max-width: 410px;
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
