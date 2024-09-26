import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Controller, useForm } from "react-hook-form";
import { useInviteCustomer } from "../../hooks/data-hook";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorAlert from "../alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useSubscription } from "../../context/subscription.context";
import { useSendMail } from "../../hooks/data-hook";
import Tooltip from "@mui/material/Tooltip";
import { isSubscribed } from "../../utils/helper";

const schema = yup.object({
  title: yup.string().required("Please enter issue title"),
  content: yup.string().required("Please enter issue content"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const SendMailModal = ({ open, id, handleClose, refetch, userData }) => {
  const { showSuccessToast } = useToast();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
    resolver: yupResolver(schema),
  });
  // const {
  //   mutate: InviteCustomer,
  //   isLoading,
  //   error,
  //   isError,
  // } = useInviteCustomer();

  const { mutate: SendMail, isLoading, error, isError } = useSendMail();

  const onSubmit = (values) => {
    SendMail({
      user: userData.user,
      title: values.title,
      content: values.content
    },
    {
      onSuccess: () => {
        reset();
        showSuccessToast("Email sent successfully");
        handleClose();
      },
    })
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
              <p className="label">Send Mail:</p>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    placeholder="Title"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    placeholder="Enter your mail content"
                    multiline
                    rows={5}
                    sx={{
                      '& .MuiInputBase-root': { px:0 },
                    }}
                    {...field}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
            </div>
            <ErrorAlert
              show={isError}
              error={error}
              message="Can't send invite right now"
            />
            <span style={{ display: 'flex', justifyContent: "end" }}>
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
                  "Send"
                )}
              </Button>
            </span>
          </form>
        </SendDialog>
      </DialogContent>
    </Dialog>
  );
};

export default SendMailModal;

const SendDialog = styled.div`
  .close-btn {
    background-color: transparent;
    border: none;
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
  }
`;
