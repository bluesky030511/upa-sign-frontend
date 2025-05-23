import React from 'react';
import * as yup from "yup";
import { useToast } from '../../context/toast.context';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Dialog, DialogContent, MenuItem, Select, Slide, Tooltip } from '@mui/material';
import { colors, fonts } from "../../utils/theme";
import styled from 'styled-components';
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrimaryInput from '../inputs/primary-input';
import ErrorAlert from '../alerts/error-alert';
import { useSubscription } from '../../context/subscription.context';
import { isSubscribed } from '../../utils/helper';
import { useCreatePlaceholder, useUpdatePlaceholder } from '../../hooks/data-hook';
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import CheckboxInput from '../inputs/checkbox-input';

const schema = yup.object({
  key: yup
    .string()
    .required('Please enter a valid key'),
  filledBy: yup.
    string().required('Filled By is a required field'),
  name: yup
    .string()
    .required('Please enter a valid name'),
  value: yup
    .string()
    .when('filledBy', {
      is: 'STATIC',
      then: (schema) => schema.required('Please enter valid value'),
      otherwise: (schema) => schema.optional()
    })
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
})

const PlaceholderModal = ({ open, id, handleClose, refetch, dataKey, value, name, filledBy }) => {

  const { showSuccessToast, showErrorToast } = useToast();
  const { subscription } = useSubscription();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      key: dataKey || "",
      value: value || "",
      name: name || "",
      filledBy: filledBy
    },
    resolver: yupResolver(schema)
  })

  const documentFilledBy = watch('filledBy')

  const {
    mutate: CreatePlaceholder,
    isLoading,
    error,
    isError,

  } = useCreatePlaceholder();

  const { mutate: UpdatePlaceholder } = useUpdatePlaceholder()

  const onSubmit = ({ key, value, name, filledBy }) => {
    if (id) {
      UpdatePlaceholder({
        id,
        key,
        value,
        name,
        filledBy
      }, {
        onSuccess: () => {
          reset();
          refetch();
          showSuccessToast('Placeholder Updated');
          handleClose();
        },
        onError: (error) => {
          showErrorToast('Can\'t update placeholder');
        }
      })
    } else {
      CreatePlaceholder(
        {
          key,
          value,
          name,
          filledBy
        }, {
        onSuccess: () => {
          reset();
          refetch();
          showSuccessToast('Placeholder Created');
          handleClose();
        },
        onError: (error) => {
          showErrorToast('Can\'t create placeholder');
        }
      }
      )
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby='placeholder-dialog-slide-description'
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
        <PlaceholderDialog>
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
              <p className="label">Key:</p>
              <Controller
                name="key"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    placeholder="Enter your key"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
            </div>
            <div className="input-container">
              <p className="label">Name:</p>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <PrimaryInput
                    {...field}
                    placeholder="Enter your name"
                    spaced={false}
                    size={13}
                    helperText={fieldState.error && fieldState.error.message}
                  />
                )}
              />
            </div>
            <div className='input-container'>
              <p className="label">Filled By:</p>
              <Controller
                name="filledBy"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      displayEmpty
                      placeholder='Filled By'
                      {...field}
                      fullWidth
                      sx={{
                        bgcolor: colors.translucentBlue,
                        // marginTop: "27px",
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
                      <MenuItem value="AGENT">AGENT</MenuItem>
                      <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                      <MenuItem value="STATIC">STATIC</MenuItem>
                    </Select>
                    <span className="error-text">
                      {fieldState.error && fieldState.error.message}
                    </span>
                  </>
                )}
              />
            </div>
            {documentFilledBy === 'STATIC' ? (
              <div className="input-container">
                <p className="label">Value:</p>
                <Controller
                  name="value"
                  control={control}
                  render={({ field, fieldState }) => (
                    <PrimaryInput
                      {...field}
                      placeholder="Enter your value"
                      spaced={false}
                      size={13}
                      helperText={fieldState.error && fieldState.error.message}
                    />
                  )}
                />
              </div>
            ) : ''}

            <ErrorAlert
              show={isError}
              error={error}
              message="Can't create placeholder right now"
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
              <span>
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
                    id ? 'Update Placeholder' : "Create Placeholder"
                  )}
                </Button>
              </span>
            </Tooltip>
          </form>
        </PlaceholderDialog>
      </DialogContent>
    </Dialog>
  )
}

export default PlaceholderModal

const PlaceholderDialog = styled.div`
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
