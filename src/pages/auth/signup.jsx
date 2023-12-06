import React from "react";
import styled from "styled-components";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";
import { useRegister } from "../../hooks/auth-hook";
import { setUserToken } from "../../utils/token-manager";
import { PLAN, TOKEN } from "../../utils/variables";
import { useUI } from "../../context/ui.context";
import ErrorAlert from "../../components/alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useSubscription } from "../../context/subscription.context";
import { useGetSubscription } from "../../hooks/user-hook";
import { getRem } from "../../utils/helper";

const schema = yup.object({
  firstname: yup.string().required("Please enter first name"),
  lastname: yup.string().required("Please enter last name"),
  address: yup.string().required("Please enter your address"),
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter valid email"),
  phoneNumber: yup.string().required("Please enter phone number"),
  password: yup.string().required("Please enter password"),
  city: yup.string().required("Please enter your city"),
  country: yup.string().required("Please enter your country"),
  state: yup.string().required("Please enter your state"),
  zipCode: yup.string().required("Please enter your zip code"),
});

const Signup = () => {
  const { user, setUser } = useUI();
  const { showSuccessToast } = useToast();
  const { subscriptionSuccess, subscriptionError } = useSubscription();
  const [searchParams] = useSearchParams();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      gender: "MALE",
      address: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "AGENT",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    resolver: yupResolver(schema),
  });

  const { refetch } = useGetSubscription({
    subscriptionSuccess,
    subscriptionError,
  });

  const { mutate: Register, isLoading, isError, error } = useRegister();
  const onSubmit = (data) => {
    Register(data, {
      onSuccess: (data) => {
        setUserToken(data.user);
        localStorage.setItem(TOKEN, data.accessToken);
        if (searchParams.get("plan")) {
          localStorage.setItem(PLAN, searchParams.get("plan"));
        }
        setUser({
          ...data.user,
          loggedIn: true,
          isAgent: data.user.role === "ADMIN" || data.user.role === "AGENT",
          isShadow: false,
        });
        showSuccessToast("Account created successfully!");
        refetch();
      },
    });
  };

  if (user && !user["loggedIn"]) {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        <p className="desc">
          Unlock the power of secure and efficient document signing by
          registering for our intuitive e-signature platform.
        </p>
        <div className="input-row">
          <div className="input-container">
            <Controller
              name="firstname"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  placeholder="First Name"
                  {...field}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
          </div>
          <div className="input-container">
            <Controller
              name="lastname"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  placeholder="Last Name"
                  {...field}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
          </div>
        </div>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              fullWidth
              sx={{
                bgcolor: colors.translucentBlue,
                marginTop: "27px",
                fontFamily: fonts.medium,
                color: colors.fadeBlack,
                fontSize: 16,
                "& fieldset": {
                  display: "none",
                },
              }}
              inputProps={{
                sx: {
                  color: colors.foreBlack,
                },
              }}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              placeholder="Address"
              {...field}
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              type="email"
              placeholder="Enter your email address"
              {...field}
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
          required
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              placeholder="Password"
              type="password"
              {...field}
              error={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              placeholder="Enter your phone number"
              {...field}
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <PrimaryInput
              placeholder="Country"
              {...field}
              helperText={fieldState.error && fieldState.error.message}
            />
          )}
        />
        <div className="shrinked-input-row">
          <div className="shrinked-input-container">
            <Controller
              name="state"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  placeholder="State"
                  {...field}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
          </div>
          <div className="shrinked-input-container">
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  placeholder="City"
                  {...field}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
          </div>
          <div className="shrinked-input-container">
            <Controller
              name="zipCode"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <PrimaryInput
                    placeholder="Zip Code"
                    {...field}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                </>
              )}
            />
          </div>
        </div>
        {/* Role selection feature which needs to be commented out for now */}
        {/* <div className="role-select-container">
          <span>Sign up as a:</span>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                sx={{
                  bgcolor: colors.translucentBlue,
                  marginTop: 1,
                  fontFamily: fonts.medium,
                  color: colors.fadeBlack,
                  fontSize: 16,
                  "& fieldset": {
                    display: "none",
                  },
                }}
                inputProps={{
                  sx: {
                    color: colors.foreBlack,
                  },
                }}
              >
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="AGENT">Agent</MenuItem>
              </Select>
            )}
          />
        </div> */}
        <div className="btn-container">
          <PrimaryButton type="submit" isLoading={isLoading}>
            Sign up
          </PrimaryButton>
        </div>
        <ErrorAlert
          show={isError}
          error={error}
          message="Can't register right now"
        />
      </Form>
    );
  } else {
    return <Navigate to="/documents" />;
  }
};
export default Signup;

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
  .input-row {
    display: flex;
    margin-left: -27px;
    .input-container {
      margin-left: 27px;
    }
  }
  .shrinked-input-row {
    display: flex;
    margin-left: -5px;
    .shrinked-input-container {
      margin-left: 5px;
    }
  }

  .btn-container {
    margin-top: 48px;
  }

  .role-select-container {
    margin-top: 12px;
    span {
      font-family: ${fonts.medium};
      font-size: 13px;
      color: ${colors.foreBlack};
    }
  }
  @media screen and (max-width: 600px) {
    .input-row {
      flex-wrap: wrap;
      .input-container {
        width: 100%;
      }
    }
    .shrinked-input-row {
      flex-wrap: wrap;
      .shrinked-input-container {
        width: 100%;
      }
    }
  }
`;
