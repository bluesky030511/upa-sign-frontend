import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useQueryClient } from "react-query";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Tooltip from "@mui/material/Tooltip";

import DashboardLayout from "../../../components/dashboard/layout";
import { colors, fonts } from "../../../utils/theme";
import { useDeleteTemplate, useGetTemplates, useGetAccessUserList } from "../../../hooks/data-hook";
import male from "../../../assets/images/profile.png";
import female from "../../../assets/images/profile_female.png";
import heroIcon from "../../../assets/images/hero.png";
import { useUI } from "../../../context/ui.context";
import { useToast } from "../../../context/toast.context";
import { API_ENDPOINTS, S3_BUCKET_URL } from "../../../utils/variables";
import SubscriptionAlert from "../../../components/alerts/subscription-alert";
import { useSubscription } from "../../../context/subscription.context";
import { isSubscribed } from "../../../utils/helper";

const SignDocuments = () => {
  const { user } = useUI();
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();
  // const { subscription } = useSubscription();
  const { isFetching, data, isSuccess } = useGetAccessUserList();

  useEffect(() => {
    console.log("data: ", data);
  }, [data])

  return (
    <DashboardLayout>
      {isFetching ? (
        <Grid
          container
          spacing={{ xs: 4, sm: 8 }}
          sx={{
            justifyContent: {
              xs: "center",
              sm: "flex-start",
            },
          }}
        >
          {Array.from([1, 2, 3, 4, 5], (x) => (
            <Grid item key={x}>
              <Stack spacing={1}>
                <Skeleton variant="rounded" width={178} height={251} />
                <Skeleton variant="text" sx={{ fontSize: 16, width: "45%" }} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : (
        <SignDocumentsWrapper>
          <Grid
            container
            spacing={{ xs: 4, sm: 8 }}
            sx={{
              justifyContent: {
                xs: "center",
                sm: "flex-start",
              },
            }}
          >
            {isSuccess &&
              data.map((item, index) => (
                <Grid item key={index}>
                  <div className="item-btn">
                    <figure
                      // onClick={() =>
                      //   user.role === "ADMIN" ? openDetails(template) : null
                      // }
                    >
                      <div className="overlay">
                        <div className="inner-content">
                          <Tooltip
                            // title={
                            //   isSubscribed(subscription)
                            //     ? ""
                            //     : "Please first subscribe to UPA sign."
                            // }
                            slotProps={{
                              tooltip: {
                                sx: {
                                  fontFamily: fonts.medium,
                                  fontSize: 12,
                                },
                              },
                            }}
                          >
                            <span>
                              <Button
                                variant="outlined"
                                // disabled={!isSubscribed(subscription)}
                                sx={{
                                  color: colors.themeBlue,
                                  borderColor: colors.themeBlue,
                                  textTransform: "none",
                                  fontFamily: fonts.medium,
                                  minHeight: "36px",
                                  "&:hover": {
                                    borderColor: colors.themeBlue,
                                    bgcolor: colors.themeBlue,
                                    color: colors.white,
                                  },
                                }}
                                onClick={() =>
                                  navigate(`/sign-document/${item.id}`)
                                }
                              >
                                Open
                              </Button>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                      <img src={item.gender == "FMALE" ? female : male} alt="item" style={{width:"160px"}} />
                    </figure>
                    <span className="item-name">{`${item.firstname} ${item.lastname}`}</span>
                  </div>
                </Grid>
              ))}
          </Grid>
        </SignDocumentsWrapper>
      )}
    </DashboardLayout>
  );
};
export default SignDocuments;

const SignDocumentsWrapper = styled.div`
  width: 100%;

  .item-btn {
    border: none;
    background-color: transparent;
    display: flex;
    flex-direction: column;

    figure {
      box-shadow: 0px 0px 24px -7px rgba(0, 0, 0, 0.1);
      width: 178px;
      height: 251px;
      margin: 0;
      position: relative;
      cursor: pointer;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 70%;
        height: auto;
        object-fit: contain;
        transition: all 0.5s ease-in;
      }

      .overlay {
        z-index: 1;
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        transition: opacity 0.5s ease-in-out;
        display: flex;
        flex-direction: column;

        .inner-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          flex-grow: 1;
        }
      }

      &:hover {
        img {
          filter: blur(1px);
        }

        .overlay {
          opacity: 1;
        }
      }
    }
    .item-name {
      font-family: ${fonts.medium};
      color: ${colors.mediumBlack};
      font-size: 12px;
      margin-top: 11px;
    }
  }
`;
