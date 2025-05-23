import React from 'react'
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import PrimaryButton from "../../../components/buttons/primary-button";
import PrimaryInput from "../../../components/inputs/primary-input";
import { colors, fonts } from "../../../utils/theme";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorAlert from "../../../components/alerts/error-alert";
import { useToast } from "../../../context/toast.context";
import { useNavigate, useParams } from 'react-router-dom';
import { useChangePassword } from '../../../hooks/user-hook';

const schema = yup.object({
  newPassword: yup.string().required("Please enter new password"),
  retypePassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});


const ChangeUserPassword = () => {
  const { showSuccessToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    mutate: ChangePassword,
    isLoading,
    error,
    isError
  } = useChangePassword();
  
  const { control, handleSubmit } = useForm({
    defaultValues: {
      newPassword: "",
      retypePassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await ChangePassword(
      {
        id: id,
        ...data,
      },
      {
        onSuccess: () => {
          showSuccessToast("Password changed successfully!");
          navigate(`/users/${id}`);
        },
      }
    );
  };
  return (
    <Wrapper>
      <form className="inner-box" onSubmit={handleSubmit(onSubmit)}>
        <h3>Reset Password</h3>
        <div className="input-box">
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="New Password"
                type="password"
                {...field}
                error={fieldState.error && fieldState.error.message}
              />
            )}
          />
          <Controller
            name="retypePassword"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="Retype Password"
                type="password"
                {...field}
                error={fieldState.error && fieldState.error.message}
              />
            )}
          />
          <div className="btn-container">
            <PrimaryButton isLoading={isLoading} type="submit">
              Done
            </PrimaryButton>
          </div>
          <ErrorAlert
            show={isError}
            error={error}
            message="Can't change password right now"
          />
        </div>
      </form>
    </Wrapper>
  )
}

export default ChangeUserPassword;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  .inner-box {
    max-width: 510px;
    padding: 54px 76px;
    background-color: ${colors.white};
    border-radius: 18px;
    box-shadow: 0px 4px 25px -4px rgba(0, 0, 0, 0.25);
    h3 {
      color: ${colors.black};
      font-family: ${fonts.semibold};
      font-size: 32px;
      margin-bottom: 35px;
      text-align: center;
    }
    .btn-container {
      margin-top: 40px;
    }
  }

  @media screen and (max-width: 600px) {
    .inner-box {
      border-radius: 8px;
      padding: 12px;
      h3 {
        font-size: 24px;
        margin-bottom: 24px;
      }
      .btn-container {
        margin-top: 24px;
      }
    }
  }
`;