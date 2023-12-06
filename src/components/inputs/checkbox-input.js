import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import React from 'react';
import { fonts } from "../../utils/theme";

const CheckboxInput = React.forwardRef(
  ({ size, error, maxLength, readOnly, ...props }, ref) => {

    return (
      <>
        <FormControlLabel
          
          control={
            <Checkbox
              ref={ref}
              checked={props.value}
              value={props.value}
              {...props}
            />
          }
          label={props.placeholder}
        />
        <FormHelperText
              sx={{ color: "red !important", ml: 1, fontFamily: fonts.regular }}
            >
              {error}
            </FormHelperText>
      </>
    )
  }
)

export default CheckboxInput;