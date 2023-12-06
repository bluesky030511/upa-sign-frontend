import React from "react";
import { colors, fonts } from "../../utils/theme";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

const PrimaryInput = React.forwardRef(
  ({ spaced = true, size, error, maxLength, readOnly, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    return (
      <>
        {!(props.type === "password") && (
          <TextField
            ref={ref}
            fullWidth
            variant="filled"
            inputProps={{
              maxLength: maxLength,
              readOnly: readOnly,
              sx: {
                py: "17px",
                px: "20px",
                color: colors.foreBlack,
                fontFamily: fonts.medium,
                fontSize: size ? `${size}px` : "16px",
                bgcolor: colors.translucentBlue,
                borderRadius: "7px",
                "&::placeholder": {
                  color: colors.fadeBlack,
                },
              },
            }}
            sx={{
              mt: spaced ? "25px" : 0,
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                {
                  display: "none",
                },
              "& .MuiInputBase-root, & .MuiFilledInput-root.Mui-focused": {
                bgcolor: "transparent",
              },
              "& .MuiInputBase-root:hover": {
                bgcolor: "transparent",
              },
              "& .MuiInputBase-root:focus": {
                bgcolor: "transparent",
              },
            }}
            FormHelperTextProps={{
              sx: {
                color: "red",
                ml: 1,
                fontFamily: fonts.regular,
              },
            }}
            {...props}
          />
        )}
        {props.type === "password" && (
          <FormControl fullWidth error>
            <TextField
              ref={ref}
              fullWidth
              variant="filled"
              sx={{
                mt: spaced ? "25px" : 0,
                bgcolor: colors.translucentBlue,
                borderRadius: "7px",
                "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                  {
                    display: "none",
                  },
                "& .MuiInputBase-root, & .MuiFilledInput-root.Mui-focused": {
                  bgcolor: "transparent",
                },
                "& .MuiInputBase-root:hover": {
                  bgcolor: "transparent",
                },
                "& .MuiInputBase-root:focus": {
                  bgcolor: "transparent",
                },
              }}
              InputProps={{
                inputProps: {
                  type: showPassword ? "text" : "password",
                  sx: {
                    py: "17px",
                    px: "20px",
                    color: colors.foreBlack,
                    fontFamily: fonts.medium,

                    fontSize: size ? `${size}px` : "16px",
                    "&::placeholder": {
                      color: colors.fadeBlack,
                    },
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 1 }}
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: colors.fadeBlack, fontSize: 18 }}
                        />
                      ) : (
                        <Visibility
                          sx={{ color: colors.fadeBlack, fontSize: 18 }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...props}
            />
            <FormHelperText
              sx={{ color: "red !important", ml: 1, fontFamily: fonts.regular }}
            >
              {error}
            </FormHelperText>
          </FormControl>
        )}
      </>
    );
  }
);

export default PrimaryInput;
