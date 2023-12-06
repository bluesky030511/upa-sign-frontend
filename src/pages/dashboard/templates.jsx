import React, { useState } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useQueryClient } from "react-query";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Tooltip from "@mui/material/Tooltip";

import DashboardLayout from "../../components/dashboard/layout";
import { colors, fonts } from "../../utils/theme";
import { useDeleteTemplate, useGetTemplates } from "../../hooks/data-hook";
import FileInvoice from "../../assets/images/file-invoice-solid_x.svg";
import { useUI } from "../../context/ui.context";
import TemplateModal from "../../components/modals/template-modal";
import GuideLinesModal from "../../components/modals/guidelines-modal";
import { useToast } from "../../context/toast.context";
import { API_ENDPOINTS, LIVE_URL } from "../../utils/variables";
import ContractModal from "../../components/modals/contract-modal";
import SubscriptionAlert from "../../components/alerts/subscription-alert";
import { useSubscription } from "../../context/subscription.context";
import { isSubscribed } from "../../utils/helper";

const Templates = () => {
  const { user } = useUI();
  const { showSuccessToast } = useToast();
  const { subscription } = useSubscription();
  const { isFetching, data, isSuccess } = useGetTemplates();
  const { mutate: DeleteTemplate, isLoading: isDeleting } = useDeleteTemplate();
  const [open, setOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [contractModal, setContractModal] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleShowGuideLine = () => {
    setShowGuidelines(true);
  };

  const handleCloseGuideLine = () => {
    setShowGuidelines(false);
  };

  const handleOpenContractModal = (id) => {
    setTemplateId(id);
    setContractModal(true);
  };

  const handleCloseContractModal = () => {
    setContractModal(false);
  };

  // Delete Template
  const deleteTemplate = (id) => () => {
    DeleteTemplate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"]);
        showSuccessToast("Template deleted!");
      },
    });
  };

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
        <TemplatesWrapper>
          <TemplateModal open={open} handleClose={handleClose} />
          <ContractModal
            open={contractModal}
            handleClose={handleCloseContractModal}
            id={templateId}
          />
          <GuideLinesModal
            open={showGuidelines}
            handleClose={handleCloseGuideLine}
          />
          <SubscriptionAlert />
          {user && (user.role === "ADMIN" || user.role === "AGENT") && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: { xs: 4, sm: 2 },
                p: 0,
              }}
            >
              <Button
                variant="text"
                sx={{
                  textTransform: "none",
                  fontFamily: fonts.medium,
                  mr: 3,
                  color: colors.themeBlue,
                }}
                onClick={handleShowGuideLine}
              >
                Guidelines
              </Button>
              <Tooltip
                title={
                  user.role === "ADMIN" || isSubscribed(subscription)
                    ? ""
                    : "Please first subscribe to UPA sign."
                }
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
                    disabled={
                      user.role === "AGENT" && !isSubscribed(subscription)
                    }
                    variant="contained"
                    sx={{
                      bgcolor: colors.themeBlue,
                      textTransform: "none",
                      fontFamily: fonts.medium,
                      "&:disabled": {
                        bgcolor: colors.translucentBlue,
                      },
                    }}
                    startIcon={<AddRoundedIcon />}
                    onClick={handleOpen}
                  >
                    Add
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
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
              data.map((template, index) => (
                <Grid item key={index}>
                  <div className="template-btn">
                    <figure>
                      <div className="overlay">
                        <div className="inner-content">
                          {user.role === "AGENT" && (
                            <Tooltip
                              title={
                                isSubscribed(subscription)
                                  ? ""
                                  : "Please first subscribe to UPA sign."
                              }
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
                                  disabled={!isSubscribed(subscription)}
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
                                    handleOpenContractModal(template.id)
                                  }
                                >
                                  Create
                                </Button>
                              </span>
                            </Tooltip>
                          )}

                          {user &&
                            template.createdby &&
                            (template.createdby.role === user.role ||
                              user.role === "ADMIN") && (
                              <Button
                                variant="outlined"
                                sx={{
                                  color: colors.red,
                                  borderColor: colors.red,
                                  textTransform: "none",
                                  fontFamily: fonts.medium,
                                  minHeight: "36px",
                                  mt: 2,
                                  "&:hover": {
                                    borderColor: colors.red,
                                    bgcolor: !isDeleting
                                      ? colors.red
                                      : "transparent",
                                    color: !isDeleting
                                      ? colors.white
                                      : colors.red,
                                  },
                                }}
                                onClick={deleteTemplate(template.id)}
                              >
                                {isDeleting ? (
                                  <CircularProgress
                                    size={18}
                                    sx={{ color: colors.red }}
                                  />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            )}
                          {user.role === "ADMIN" ||
                            (user.role === "AGENT" && (
                              <Tooltip title="Download">
                                <IconButton
                                  aria-label="upload picture"
                                  component="a"
                                  href={`${LIVE_URL}${API_ENDPOINTS.DOCUMENT}/${template.id}/${template.filename}`}
                                  sx={{
                                    position: "absolute",
                                    top: 2,
                                    right: 2,
                                  }}
                                  disabled={!isSubscribed(subscription)}
                                >
                                  <FileDownloadOutlinedIcon
                                    sx={{
                                      color: isSubscribed(subscription)
                                        ? colors.themeBlue
                                        : colors.fadeBlack,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ))}
                        </div>
                      </div>
                      <img src={FileInvoice} alt="template" />
                    </figure>
                    <span className="template-name">{template.name}</span>
                  </div>
                </Grid>
              ))}
          </Grid>
        </TemplatesWrapper>
      )}
    </DashboardLayout>
  );
};
export default Templates;

const TemplatesWrapper = styled.div`
  width: 100%;

  .template-btn {
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
    .template-name {
      font-family: ${fonts.medium};
      color: ${colors.mediumBlack};
      font-size: 12px;
      margin-top: 11px;
    }
  }
`;
