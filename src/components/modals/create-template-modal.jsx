import { useState, useEffect } from "react";
import * as React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../buttons/primary-button";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { 
  TextField, 
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useUI } from "../../context/ui.context";


const CreateTemplateModal = ({ open, handleClose, handleAction, loading, state, setState, teams, setTeams }) => {
  const { user } = useUI();
  const handleChange = (event) => {
    setState(event.target.value);
  };

  useEffect(() => {
    if(user.role == "AGENT") setState("private");
  }, [])

  const addUser = () => {
    setTeams([
      ...teams, 
      {
        id: teams.length > 0 ? teams[teams.length - 1].id + 1 : 0, 
        value: ''
      }
    ]);
  }

  const handleValue = async (event, item) => {
    await setTeams((prevItem) => 
      prevItem.map(field =>
        field.id == item.id ? {...field, value: event.target.value} : field
      ));
  }

  const handleDeleteItem = (item) => {
    const newItems = teams.filter((field) => field.id != item.id);
    setTeams(newItems);
  }
  
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "400px",
          borderRadius: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <SuccessContent>
          <div className="icon-circle">
            <CheckRoundedIcon sx={{ color: colors.checkGreen, fontSize: 56 }} />
          </div>
          {/* <p>{'Are you sure you want to sign this contract?'}</p> */}
          {user.role == "ADMIN" && (<>
            <h4>Share Template?</h4>
            <FormControl>
              <FormLabel >{'Would you like to make this template public or share it with specific agents?'}</FormLabel>
              <RadioGroup
                row
                name="row-radio-buttons-group"
                value={state}
                onChange={handleChange}
                sx={{ display:'flex', justifyContent:'space-around' }}
              >
                {/* <FormControlLabel value="private" control={<Radio />} label="Private" /> */}
                <FormControlLabel value="public" control={<Radio />} label="Public" />
                <FormControlLabel value="share" control={<Radio />} label="Share" />
              </RadioGroup>
            </FormControl>
            <Divider flexItem/>
          </>)}
          {user.role == "AGENT" && (<>
            <h4>Create Template</h4>
            <p>{'Do you want to create this template'}</p>

          </>)}
          
          {state == "share" && (<div className="field-wrap" >
            <p>{'Please add user\'s email that give access'}</p>
            <div className="btn-container">
              <Button
                variant="contained" 
                sx={{ 
                  backgroundColor: colors.themeBlue, 
                  fontFamily: fonts.medium, 
                  textTransform: "none",
                  mr:'15px',
                }} 
                onClick={addUser}
              >
                Add User
              </Button>
            </div>
              {teams.map((item, index) => {
                return (
                  <div key={index} className="field-container">
                    <TextField 
                      variant="outlined"
                      size="small"
                      type="email"
                      value={item.value}
                      onChange={(event) => handleValue(event, item)}
                      InputProps={{
                        endAdornment: 
                          <InputAdornment position="end" sx={{ width:"24px" }} >
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handleDeleteItem(item)}
                              edge="end"
                            >
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                      }}
                    />
                  </div>
                );
              })}
          </div>)}
          <div className="btn-wrap">
            <div className="btn-container">
              <PrimaryButton
                onClick={handleAction}
                sx={{
                  bgcolor: "transparent",
                  boxShadow: "none",
                  color: colors.checkGreen,
                  textTransform: "none",
                  py: "4px",
                  border: "2px solid",
                  borderColor: colors.checkGreen,
                  borderRadius: "24px",
                  "&:hover": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
                isLoading={loading}
              >
                Confirm
              </PrimaryButton>
            </div>
            <div className="btn-container">
              <PrimaryButton
                onClick={handleClose}
                sx={{
                  bgcolor: "transparent",
                  boxShadow: "none",
                  color: colors.foreBlack,
                  textTransform: "none",
                  py: "4px",
                  border: "2px solid",
                  borderColor: colors.foreBlack,
                  borderRadius: "24px",
                  "&:hover": {
                    bgcolor: "transparent",
                    boxShadow: "none",
                  },
                }}
              >
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 84px;
    height: 84px;
    background-color: transparent;
    border: 4px solid;
    border-color: ${colors.checkGreen};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.regular};
    font-size: 28px;
    color: ${colors.black};
    margin-block: 24px;
  }
  p {
    font-family: ${fonts.regular};
    color: ${colors.foreBlack};
    font-size: 16px;
    text-align: center;
  }
  .btn-wrap {
    margin-top: 24px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-left: -24px;
    .btn-container {
      width: 50%;
      margin-left: 24px;
    }
  }
  .field-wrap {
    margin-top: 20px;
    width: 100%;
    // display: flex;
    min-height: 100px;
    .btn-container {
      display: flex;
      justify-content: right;
      margin-top: 10px;
      width: 100%;
    }
    .field-container {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
`;
