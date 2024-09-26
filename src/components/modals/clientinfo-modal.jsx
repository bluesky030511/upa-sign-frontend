import React, {useEffect, useState} from "react";
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
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import PrimaryButton from "../buttons/primary-button";
import ErrorAlert from "../alerts/error-alert";
import { useToast } from "../../context/toast.context";
import { useUI } from "../../context/ui.context";
import { Grid, Typography, Button, TextField } from "@mui/material";
import { useGetUserProfile, useGetUserData, useGetUserProfilebyEmail} from '../../hooks/user-hook';
import jsPDF from "jspdf";

const schema = yup.object({
  name: yup.string().required("Please enter contract name"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ClientInfoModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const [ deleteEmail, setDeleteEmail ] = useState('');
  const { showSuccessToast, showErrorToast } = useToast();
  const [data, setData] = useState({});

  const { mutate: GetUserProfile, isLoading: isFetching, isSuccess } = useGetUserData();
  const { mutate: GetUserProfilebyEmail, isLoading } = useGetUserProfilebyEmail();

  const generatePDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");

    doc.text(`Client Information:`, 50, 40);
    doc.text(`Name: ${data ? data.firstname : ""} ${data ? data.lastname : ""}`, 20, 60);
    doc.text(`Email: ${data ? data.email : ""}`, 20, 70);
    doc.text(`Address: ${data ? data.address : ""} ${data ? data.city : ""} ${data ? data.state : ""} ${data ? data.country : ""} `, 20, 80);
    doc.text(`Phone Number: ${data ? data.phoneNumber : ""}`, 20, 90);
    
    doc.save("client_information.pdf");
  }



  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(false); 
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddClick = () => {
    if (!validateEmail(email)) {
      setError(true);
    } else {
      setError(false);
      getUserProfilebyEmail(email)
    }
  };

  const getUserProfilebyEmail = (email) => {
    GetUserProfilebyEmail({
      email}, {
        onSuccess: (data) => {
          console.log("data: ", data);
            setData(data);       
        },
        onError: (error) => {
          showErrorToast(error.response.data.message);
        }
    });
  }

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
          minWidth: { xs: "100%", sm: 577 },
          maxWidth: "100%",
          padding: { xs: "12px", sm: "21px 24px 40px" },
        },
      }}
      PaperProps={{
        sx: {
          maxWidth: { xs: "100%", sm: 600 },
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
          <div className="input-container">
            <div className="input-container" style={{ alignContent: "center" }}>
              <h3 style={{ textAlign: "center" }}>
                Client Information
              </h3>
              <div style={{ display:"flex", justifyContent: "right", marginRight: "20px", paddingBottom: "20px", marginTop:"25px", gap:3 }}>
                <div className="btn-container" style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
                  <TextField 
                    variant="standard"
                    size="small"
                    label="User Email"
                    type="email"
                    value={email}
                    sx={{ pr: 2 }}
                    error={error}
                    helperText={error ? 'Please enter a valid email' : ''}
                    onChange={(event) => handleEmailChange(event)}
                  />
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: colors.themeBlue, 
                      fontFamily: fonts.medium, 
                      textTransform: "none",
                      maxHeight: "40px"
                    }} 
                    onClick={handleAddClick}
                  >
                    Find Client
                  </Button>
                </div>
                <IconButton
                  sx={{
                    bgcolor: colors.white,
                    boxShadow: "none",
                    color: colors.black,
                    borderRadius: 2,
                    pl: "10px"
                  }}
                  onClick={() => generatePDF()}
                >
                    <DownloadIcon size="large" />
                  </IconButton>
              </div>

              <Box display="flex" justifyContent="center" alignItems="center">
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ pl: "50px", pb:"30px", pt: "50px" }}
                  // Adjust this style as needed
                >
                  {/* First Field and Value */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Name :</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.firstname : ""} {data ? data.lastname : ""}
                    </Typography>{" "}
                  </Grid>

                  {/* Second Field and Value */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.email : ""}
                    </Typography>
                  </Grid>
                  {/* Third Field and Value */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Address:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.address : ""} {data ? data.city : ""} {data ? data.state : ""} {data ? data.country : ""} 
                    </Typography>{" "}
                  </Grid>
                  {/* Fourth Field and Value */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Phone Number:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.phoneNumber : ""}
                    </Typography>{" "}
                  </Grid>
                  {/* Fifth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Gender:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_gender : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Sixth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Insurance Company:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_insurance_company : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Seventh Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Policy Number:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_policy_number : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Eighth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Cause of Loss:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_cause_of_loss : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Claim:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_claim : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Date of Loss:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_date_of_loss : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Mortgage:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_mortgage : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Initials:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_initials : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Contingency Fee:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_contingency_fee : ""}
                    </Typography>{" "}
                  </Grid> */}
                  {/* Nineth Field and Value */}
                  {/* <Grid item xs={4}>
                    <Typography variant="subtitle1">Loss Address:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {data ? data.client_loss_full_address : ""}
                    </Typography>{" "}
                  </Grid> */}
                </Grid>
              </Box>
            </div>
          </div>
        </SendDialog>
      </DialogContent>
    </Dialog>
  );
};

export default ClientInfoModal;

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
    .btn-container {
      margin-top: 24px;
      margin-bottom: 24px;
      width: 100%;
      display: flex;
      justify-content: end;
      padding-right: 30px;
    }
  }
`;
