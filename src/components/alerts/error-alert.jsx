import React from "react";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import { fonts } from "../../utils/theme";
import { renderError } from "../../utils/helper";

const ErrorAlert = ({ show, error, message }) => {
  const errorText = renderError(error, message);
  return (
    <Collapse in={show} sx={{ mt: 3 }}>
      <Alert
        severity="error"
        sx={{ mb: 2, fontFamily: fonts.medium, bgcolor: "rgb(255 211 211)" }}
      >
        {Array.isArray(errorText) ? (
          <ul>
            {errorText.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ) : (
          errorText
        )}
      </Alert>
    </Collapse>
  );
};

export default ErrorAlert;
