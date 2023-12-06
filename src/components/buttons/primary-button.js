import React from "react";
import Button from "@mui/material/Button";
import { colors, fonts } from "../../utils/theme";
import { Loader } from "../../shared-components/loader/loader";

const PrimaryButton = ({ children, isLoading, type, disabled, ...props }) => {
  const { onClick } = props;
  return (
    <Button
      variant="contained"
      fullWidth
      type={type}
      sx={{
        bgcolor: colors.themeBlue,
        fontFamily: fonts.semibold,
        color: colors.white,
        fontSize: 15,
        py: "12px",
        borderRadius: 2,
        ...props.sx,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <Loader /> : children}
    </Button>
  );
};

export default PrimaryButton;
