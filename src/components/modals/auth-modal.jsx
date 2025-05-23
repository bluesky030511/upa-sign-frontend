import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Controller, useForm } from "react-hook-form";
import { useInviteCustomer, useVerifyUser } from "../../hooks/data-hook";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorAlert from "../alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useSubscription } from "../../context/subscription.context";
import Tooltip from "@mui/material/Tooltip";
import { isSubscribed } from "../../utils/helper";

const schema = yup.object({
  // email: yup
  //   .string()
  //   .required("Please enter your email")
  //   .email("Please enter valid email"),
  // password: yup.string().required("Please enter password"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AuthModal = ({ open, id, handleClose, handleAction, inviteData }) => {
  const { showSuccessToast, showErrorToast } = useToast();
  const { subscription } = useSubscription();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: inviteData.email,
      // password: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    mutate: VerifyUser,
    isLoading,
    error,
    isError,
  } = useVerifyUser();

  const onSubmit = (values) => {
    // VerifyUser(
    //   {
    //     email: inviteData.email,
    //     // password: values.password,
    //   },
    //   {
    //     onSuccess: () => {
          reset();
          // showSuccessToast("Customer verified");
          handleClose();
          handleAction();
    //     },
    //     onError: (error) => {
    //       showErrorToast(error.response.data.message);
    //     }
    //   }
    // );
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
              <p className="label">Confirm Customer:</p>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    readOnly
                    InputProps={{
                      readOnly: true,
                    }}                    
                    value={inviteData.email}
                    placeholder="Enter your email address"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
              {/* <Controller
                name="password"
                control={control}
                render={({field, fieldState}) => (
                    <PrimaryInput
                        placeholder="Password"
                        type={"password"}
                        {...field}
                        error={fieldState.error && fieldState.error.message}
                    />
                )}
              /> */}
            </div>
            <ErrorAlert
              show={isError}
              error={error}
              message="Can't send invite right now"
            />
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
              <span style={{ display: 'flex', justifyContent: "end" }}>
                <Button
                  type="submit"
                  disabled={!isSubscribed(subscription)}
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
                    "Confirm"
                  )}
                </Button>
              </span>
            </Tooltip>
          </form>
        </SendDialog>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

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
