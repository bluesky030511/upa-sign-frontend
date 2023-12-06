import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useToast } from "../../context/toast.context";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ErrorToast = () => {
  const { errorToast, hideErrorToast } = useToast();

  return (
    <Snackbar
      open={errorToast.open}
      autoHideDuration={3000}
      onClose={hideErrorToast}
    >
      <Alert severity="error" sx={{ width: "100%" }} onClose={hideErrorToast}>
        {errorToast.message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorToast;
