import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import * as yup from "yup";

import { useCreateContract } from "../../hooks/data-hook";
import { colors, fonts } from "../../utils/theme";
import PrimaryInput from "../inputs/primary-input";
import PrimaryButton from "../buttons/primary-button";
import ErrorAlert from "../alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useUI } from "../../context/ui.context";

const schema = yup.object({
  name: yup.string().required("Please enter contract name"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ContractModal = ({ open, id, handleClose }) => {
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();
  const { user } = useUI();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    mutate: CreateContract,
    isLoading,
    isError,
    error,
  } = useCreateContract();

  const onSubmit = (values) => {
    CreateContract(
      {
        name: values.name,
        agentId: user.id,
        templateId: id,
      },
      {
        onSuccess: () => {
          showSuccessToast("Contract created successfully!");
          reset();
          handleClose();
          setTimeout(() => {
            navigate("/documents");
          }, 1500);
        },
      }
    );
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
              <h3>Create Contract</h3>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    placeholder="Enter your contract name"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
            </div>
            <ErrorAlert
              show={isError}
              error={error}
              message="Can't create contract now"
            />
            <PrimaryButton type="submit" isLoading={isLoading}>
              Create
            </PrimaryButton>
          </form>
        </SendDialog>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;

const SendDialog = styled.div`
  .close-btn {
    background-color: transparent;
    border: none;
  }

  form {
    div.input-container {
      margin-bottom: 12px;
      h3 {
        text-align: center;
        margin-bottom: 1rem;
        font-family: ${fonts.medium};
        font-size: 1.75rem;
      }
    }
  }
`;
