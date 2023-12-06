import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";
import { useLogin } from "../../hooks/auth-hook";
import { setUserToken } from "../../utils/token-manager";
import { TOKEN } from "../../utils/variables";
import { useUI } from "../../context/ui.context";
import ErrorAlert from "../../components/alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useSubscription } from "../../context/subscription.context";
import { useGetSubscription } from "../../hooks/user-hook";
import { getRem } from "../../utils/helper";

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter valid email"),
  password: yup.string().required("Please enter password"),
});

const Login = () => {
  const { setUser } = useUI();
  const { showSuccessToast } = useToast();
  const { subscriptionSuccess, subscriptionError } = useSubscription();

  const { refetch } = useGetSubscription({
    subscriptionSuccess,
    subscriptionError,
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate: Login, isLoading, error, isError } = useLogin();

  const onSubmit = (values) => {
    Login(values, {
      onSuccess: (data) => {
        localStorage.setItem(TOKEN, data.accessToken);
        setUserToken(data.user);
        setUser({
          ...data.user,
          loggedIn: true,
          isAgent: data.user.role === "ADMIN" || data.user.role === "AGENT",
          isShadow: false,
        });
        showSuccessToast("Logged in successfully!");
        refetch();
      },
    });
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign In</h2>
      <p className="desc">
        Unlock the power of secure and efficient document signing by signing in
        to our intuitive e-signature platform.
      </p>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Enter your email address"
            {...field}
            helperText={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <PrimaryInput
            placeholder="Password"
            type={"password"}
            {...field}
            error={fieldState.error && fieldState.error.message}
          />
        )}
      />
      <div className="login-actions">
        <Link to="forgot-password">Recover Password</Link>
      </div>

      <div className="btn-container">
        <PrimaryButton type="submit" isLoading={isLoading}>
          Login
        </PrimaryButton>
      </div>
      <ErrorAlert
        show={isError}
        error={error}
        message="Can't login right now"
      />
    </Form>
  );
};
export default Login;

const Form = styled.form`
  max-width: 410px;

  h2 {
    font-family: ${fonts.semibold};
    font-size: ${getRem(40)};
    color: ${colors.black};
    margin-top: ${getRem(32)};
  }

  p.desc {
    font-family: ${fonts.regular};
    font-size: ${getRem(16)};
    color: ${colors.foreBlack};
    line-height: ${getRem(24)};
    margin-top: ${getRem(18)};
    margin-bottom: ${getRem(32)};
  }

  .login-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-block: 10px 30px;
    .checkbox-container {
      display: flex;
      align-items: center;
    }
    a {
      font-family: ${fonts.medium};
      color: ${colors.foreBlack};
      font-size: 12px;
      transition: color 0.2s ease-in-out;
      &:hover {
        color: ${colors.themeBlue};
      }
    }
  }
`;
