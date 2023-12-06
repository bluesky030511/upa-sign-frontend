import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Controller, useForm } from "react-hook-form";
import { useUploadTemplate } from "../../hooks/data-hook";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorAlert from "../alerts/error-alert";
import IconButton from "@mui/material/IconButton";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useToast } from "../../context/toast.context";
import { useQueryClient } from "react-query";

const MAX_FILE_SIZE = 5242880; // 5 MB

const validFileExtensions = ["doc", "docx"];

function isValidFileType(fileName) {
  const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
  return validFileExtensions.includes(extension);
}

const schema = yup.object({
  name: yup.string().required("Please enter template name"),
  file: yup
    .mixed()
    .required("Please upload template")
    .test("is-valid-type", "Invalid file type", (value) =>
      isValidFileType(value && value[0].name.toLowerCase())
    )
    .test(
      "is-valid-size",
      "File size is too large",
      (value) => value && value[0].size <= MAX_FILE_SIZE
    ),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TemplateModal = ({ open, handleClose }) => {
  const { showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      file: null,
    },
    resolver: yupResolver(schema),
  });
  const {
    mutate: UploadTemplate,
    isLoading,
    error,
    isError,
  } = useUploadTemplate();

  const resetFile = () => {
    setValue("file", null);
    setError("file", null);
  };

  const onSubmit = (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("file", values.file[0]);
    UploadTemplate(data, {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["templates"]);
        showSuccessToast("Template Uploaded");
        handleClose();
      },
    });
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        "& .MuiDialog-container": {
          justifyContent: "center",
          alignItems: "flex-start",
        },
        "& .MuiDialogContent-root": {
          minWidth: { xs: "100%", sm: 377 },
          maxWidth: "100%",
          padding: { xs: "12px", sm: "21px 24px 40px" },
        },
      }}
      PaperProps={{
        sx: {
          maxWidth: { xs: "100%", sm: 400 },
          width: "100%",
          mx: { xs: 2, sm: 4 },
          mt: 15,
        },
      }}
    >
      <DialogContent>
        <SendDialog>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <button onClick={handleClose} className="close-btn">
              <CloseRoundedIcon
                sx={{ colors: colors.fadeBlack, fontSize: 18 }}
              />
            </button>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-container">
              <p className="label">Name:</p>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    placeholder="Template Name"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              {Boolean(watch("file")) ? (
                <div className="file-detail">
                  <div className="file-name">
                    <FilePresentOutlinedIcon
                      sx={{ fontSize: 18, color: colors.themeBlue }}
                    />
                    <span className="file">
                      {Boolean(watch("file")) && watch("file")[0].name}
                    </span>
                  </div>
                  <button className="close-btn" onClick={resetFile}>
                    <DeleteOutlineOutlinedIcon
                      sx={{ color: "red", fontSize: 18 }}
                    />
                  </button>
                </div>
              ) : (
                <>
                  <p className="file-info">
                    Upload your template here <br />
                    Only .doc and .docx file is allowed
                    <br />
                    Max size 5 MB
                  </p>
                  <IconButton aria-label="upload template" component="label">
                    <input
                      hidden
                      accept=".doc,.docx"
                      type="file"
                      {...register("file")}
                      name="file"
                    />
                    <UploadFileOutlinedIcon sx={{ color: colors.themeBlue }} />
                  </IconButton>
                </>
              )}
            </Box>
            {errors.file && (
              <span
                style={{
                  color: "red",
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  marginLeft: 8,
                }}
              >
                {errors.file.message}
              </span>
            )}
            <ErrorAlert
              show={isError}
              error={error}
              message="Can't upload template right now"
            />
            <Button
              type="submit"
              sx={{
                minHeight: "35px",
                bgcolor: colors.successGreen,
                textTransform: "none",
                py: "5px",
                px: "20px",
                color: colors.foreGreen,
                "&:hover": {
                  backgroundColor: colors.successGreen,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress color="success" size={16} />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </SendDialog>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;

const SendDialog = styled.div`
  .close-btn {
    background-color: transparent;
    border: none;
    height: 18px;
  }

  form {
    div.input-container {
      margin-bottom: 12px;
      p.label {
        font-family: ${fonts.medium};
        font-size: 14px;
        color: ${colors.foreBlack};
        margin-bottom: 10px;
      }
    }
    p.file-info {
      font-family: ${fonts.medium};
      color: ${colors.foreBlack};
      font-size: 12px;
      line-height: 18px;
      margin-right: 16px;
    }

    .file-detail {
      padding: 8px;
      border: 1px solid ${colors.themeBlue};
      border-radius: 4px;
      background-color: ${colors.translucentBlue};
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .file-name {
        display: flex;
        align-items: center;

        span.file {
          margin-left: 6px;
          font-family: ${fonts.medium};
          font-size: 12px;
          color: ${colors.foreBlack};
        }
      }
    }
  }
`;
