import React, { useEffect } from 'react';
import Button from "@mui/material/Button";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import { Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Link, useParams } from "react-router-dom";
import PrimaryInput from '../../components/inputs/primary-input';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useGetUserProfile, useUpdateUserProfile } from '../../hooks/user-hook';
import { useSubmitIssue } from '../../hooks/data-hook';
import ProfileAvatar from "../../assets/images/profile.png";
import ProfileFemaleAvatar from "../../assets/images/profile_female.png";
import PrimaryButton from "../../components/buttons/primary-button";
import ErrorAlert from "../../components/alerts/error-alert";
import DashboardLayout from "../../components/dashboard/layout";
import { useToast } from '../../context/toast.context';

const schema = yup.object({
  title: yup.string().required("Please enter issue title"),
  content: yup.string().required("Please enter issue content"),
});

const SubmitIssue = () => {
  // const { id } = useParams();
  const { showSuccessToast, showErrorToast } = useToast();
  // const { data, isError, error } = useGetUserProfile({ id: id ? id : null });
  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
    resolver: yupResolver(schema),
  });

  // const { mutate: Update, isLoading } = useUpdateUserProfile();
  const { mutate: SubmitIssue, isLoading } = useSubmitIssue();

  const onSubmit = async (data) => {
    await SubmitIssue(
      {
        title: data.title,
        content: data.content,
      },
      {
        onSuccess: () => {
          setValue("title", "");
          setValue("content", "");
          showSuccessToast("We have received the inquiry and will get back to them shortly.");
        },
        onError: (error) => {
          showErrorToast(error.message);
        }
      })
  }

  return (
    <DashboardLayout>
      <SettingsWrapper>
        <form className="profile-box" onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid
              item
              xs={12} 
              lg={12}
              sx={{ paddingBlock: { xs: "54px 24px", sm: "45px 0px" }, }}
            >
            <h4>Submit Issue</h4>
            </Grid>
            <Grid
              item
              xs={12}
              lg={12}
              sx={{
                paddingBlock: { xs: "54px 24px", sm: "12px 49px" },
                position: "relative",
              }}
            >
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    placeholder="Title"
                    {...field}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    placeholder="Enter your issue content"
                    multiline
                    rows={8}
                    sx={{
                      '& .MuiInputBase-root': { px:0 },
                    }}
                    {...field}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
              
              <div className="btn-container">
                <PrimaryButton type="submit" isLoading={isLoading}>
                  Submit
                </PrimaryButton>
              </div>
              {/* <ErrorAlert
                show={isError}
                error={error}
                message="Can't update your profile right now"
              /> */}
            </Grid>
          </Grid>
        </form>
      </SettingsWrapper>
    </DashboardLayout>
  );
};

const SettingsWrapper = styled.div`
  width: 100%;

  .profile-box {
    width: 80%;
    max-width: 974px;
    margin-inline: auto;
    background-color: ${colors.offWhite};
    padding: 0 66px;
    margin-top: 36px;
    h4 {
        font-size: 24px;
        // font-family: "Signature";
        color: ${colors.foreBlack};
      }

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

    .change-payment-gateway-wrap {
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


export default SubmitIssue;