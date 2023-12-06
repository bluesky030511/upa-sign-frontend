import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { colors, fonts } from "../../../utils/theme";
import PrimaryInput from "../../../components/inputs/primary-input";
import PrimaryButton from "../../../components/buttons/primary-button";
import ProfileAvatar from "../../../assets/images/profile.png";
import ProfileFemaleAvatar from "../../../assets/images/profile_female.png";
import { useUpdateUserProfile } from "../../../hooks/user-hook.jsx";
import { setUserToken } from "../../../utils/token-manager";
import { useUI } from "../../../context/ui.context";
import ErrorAlert from "../../../components/alerts/error-alert";
import { useToast } from "../../../context/toast.context";

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

const Settings = () => {
  const { user, setUser } = useUI();
  const { showSuccessToast } = useToast();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstname: (user && user.firstname) || "",
      lastname: (user && user.lastname) || "",
      gender: (user && user.gender) || "",
      address: (user && user.address) || "",
      email: (user && user.email) || "",
      phoneNumber: (user && user.phoneNumber) || "",
      city: (user && user.city) || "",
      state: (user && user.state) || "",
      country: (user && user.country) || "",
      zipCode: (user && user.zipCode) || "",
    },
    resolver: yupResolver(schema),
  });
  var signedFirstName = watch("firstname").replace(/[0-9]/g, "");
  var signedLastName = watch("lastname").replace(/[0-9]/g, "");
  const { mutate: Update, isLoading, isError, error } = useUpdateUserProfile();

  const onSubmit = async (data) => {
    await Update(
      {
        id: user.id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        gender: data.gender,
        address: data.address,
        phoneNumber: data.phoneNumber,
        role: user.role,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
      },
      {
        onSuccess: (data) => {
          setUserToken(data);
          setUser({
            ...data,
            loggedIn: true,
            isAgent: data.role === "ADMIN" || data.role === "AGENT",
          });
          showSuccessToast("Profile updated successfully!");
        },
      }
    );
  };
  return (
    <SettingsWrapper>
      <form className="profile-box" onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid
            item
            xs={12}
            lg={5}
            sx={{
              paddingBlock: { xs: "54px 24px", sm: "93px 49px" },
              position: "relative",
            }}
          >
            <div className="avatar-container">
              <div className="profile-avatar">
                <img
                  src={
                    user.gender
                      ? user.gender === "MALE"
                        ? ProfileAvatar
                        : ProfileFemaleAvatar
                      : ProfileAvatar
                  }
                  alt="profile"
                />
              </div>
            </div>
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
                  placeholder="Enter your email address"
                  {...field}
                  helperText={fieldState.error && fieldState.error.message}
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
            <div className="change-password-wrap">
              <Button
                sx={{
                  textTransform: "none",
                  "& a": {
                    fontFamily: fonts.medium,
                    color: colors.foreBlack,
                    fontSize: 12,
                    transition: "color 0.2s ease-in-out",
                  },
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  "&:hover a": {
                    color: colors.themeBlue,
                  },
                }}
              >
                <Link to="change-password">Change Password</Link>
              </Button>
            </div>
            <div className="btn-container">
              <PrimaryButton type="submit" isLoading={isLoading}>
                Save
              </PrimaryButton>
            </div>
            <ErrorAlert
              show={isError}
              error={error}
              message="Can't update your profile right now"
            />
          </Grid>
          <Grid
            item
            lg={7}
            xs={12}
            sx={{ paddingBlock: { xs: 0, sm: "93px 49px" } }}
          >
            <div className="signature-canvas">
              <h4>{signedFirstName}</h4>
              <h4>{signedLastName}</h4>
            </div>
          </Grid>
        </Grid>
      </form>
    </SettingsWrapper>
  );
};
export default Settings;

const SettingsWrapper = styled.div`
  width: 100%;

  .profile-box {
    width: 100%;
    max-width: 974px;
    margin-inline: auto;
    background-color: ${colors.offWhite};
    padding: 0 66px;
    margin-top: 36px;

    .avatar-container {
      position: absolute;
      width: 100%;
      top: -60px;
      display: flex;
      justify-content: center;

      .profile-avatar {
        width: 133px;
        height: 133px;
        border-radius: 50%;
        border: 8px solid ${colors.white};
        background-color: ${colors.white};
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
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
  }

  @media screen and (max-width: 600px) {
    .profile-box {
      padding: 0 12px;
      .avatar-container {
        top: -40px;
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-width: 4px;
        }
      }
      .signature-canvas {
        margin-left: 0;
        margin-bottom: 24px;
        h4 {
          font-size: 22px;
        }
      }
    }
  }
`;
