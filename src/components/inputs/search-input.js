import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { colors, fonts } from "../../utils/theme";

const SearchInput = ({ ...props }) => {
  return (
    <TextField
      InputProps={{
        inputProps: {
          sx: {
            fontFamily: fonts.medium,
            fontSize: "14px",
            color: colors.foreBlack,
          },
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon sx={{ fontSize: 18 }} />
          </InputAdornment>
        ),
      }}
      variant="standard"
      {...props}
    />
  );
};

export default SearchInput;
