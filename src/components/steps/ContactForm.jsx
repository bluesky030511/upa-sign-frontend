import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import PrimaryButton from "../buttons/primary-button";

const schema = yup.object({
  firstname: yup.string().required("Please enter first name"),
  lastname: yup.string().required("Please enter last name"),
  address: yup.string().required("Please enter your address"),
  gender: yup.string().required("Please enter your gender"),
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter valid email"),
  phoneNumber: yup.string().required("Please enter phone number"),
  city: yup.string().required("Please enter your city"),
  country: yup.string().required("Please enter your country"),
  state: yup.string().required("Please enter your state"),
  zipCode: yup.string().required("Please enter your zip code"),
});
const ContactForm = ({ handleNext, handleInviteData, inviteData }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstname: (inviteData && inviteData.firstname) || "",
      lastname: (inviteData && inviteData.lastname) || "",
      gender: (inviteData && inviteData.gender) || "",
      address: (inviteData && inviteData.address) || "",
      email: (inviteData && inviteData.email) || "",
      phoneNumber: (inviteData && inviteData.phoneNumber) || "",
      city: (inviteData && inviteData.city) || "",
      state: (inviteData && inviteData.state) || "",
      country: (inviteData && inviteData.country) || "",
      zipCode: (inviteData && inviteData.zipCode) || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    handleInviteData(data);
    handleNext();
  };
  return (
    <Form className="profile-box" onSubmit={handleSubmit(onSubmit)}>
      <h3>Contact</h3>
      <Grid container spacing={2}>
        <Grid item lg={6} xs={12}>
          <Controller
            name="firstname"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="First Name"
                spaced={false}
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
        <Grid item lg={6} xs={12}>
          <Controller
            name="lastname"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="Last Name"
                {...field}
                spaced={false}
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
      </Grid>
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
      <Grid container spacing={1}>
        <Grid item lg={4} xs={12}>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="State"
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
        <Grid item lg={4} xs={12}>
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
        </Grid>
        <Grid item lg={4} xs={12}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="Zip Code"
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Select
              displayEmpty
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
              <MenuItem value="">Gender</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
            <span className="error-text">
              {fieldState.error && fieldState.error.message}
            </span>
          </>
        )}
      />

      <div className="btn-container">
        <PrimaryButton type="submit">Save</PrimaryButton>
      </div>
      {/* <ErrorAlert
        show={isError}
        error={error}
        message="Can't update your profile right now"
      /> */}
    </Form>
  );
};

export default ContactForm;

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
