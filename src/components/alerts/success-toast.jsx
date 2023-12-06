import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useToast } from "../../context/toast.context";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuccessToast = () => {
  const { successToast, hideSuccessToast } = useToast();

  return (
    <Snackbar
      open={successToast.open}
      autoHideDuration={3000}
      onClose={hideSuccessToast}
    >
      <Alert
        severity="success"
        sx={{ width: "100%" }}
        onClose={hideSuccessToast}
      >
        {successToast.message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessToast;
