import { useState, useEffect } from "react";
import * as React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../buttons/primary-button";
import { useGetUserProfile, useUpdateUserProfile } from '../../hooks/user-hook';
import { useAddAccessPermission, useDeleteAccessPermission } from "../../hooks/data-hook";
import { useToast } from "../../context/toast.context";
import { Loader } from "../../shared-components/loader/loader";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { visuallyHidden } from "@mui/utils";
import { 
  Box,
  TextField, 
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: colors.lightBlue,
    color: colors.mediumBlack,
    fontFamily: fonts.medium,
    fontSize: 14,
    borderRight: "1px solid rgba(0,0,0,0.21)",
    padding: "6px 6px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      padding: "6px 6px",
    },
    "&:last-child": {
      borderRight: "none",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    color: colors.black,
    fontFamily: fonts.medium,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",

    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
}));

export const StyledTableRow = muiStyled(TableRow)(({ theme }) => ({
  backgroundColor: colors.background,
  borderBottom: 0,
  "& .MuiTableCell-root": {
    paddingInline: "6px",
    paddingBlock: "10px",
    borderRight: "1px solid rgba(0,0,0,0.21)",
    borderBottom: "1px solid rgba(0,0,0,0.21)",
    [theme.breakpoints.down("sm")]: {
      padding: 8,
      paddingInline: 12,
    },
    "&:last-child": {
      borderRight: "none",
    },
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    borderRight: "1px solid rgba(0,0,0,0.21)",
    borderBottom: "none",
  },
}));

const headCells = [
  {
    id: "name",
    label: "Name",
    align: "center",
    width: "35%",
    type: "string",
  },
  {
    id: "email",
    label: "Email",
    align: "center",
    width: "35%",
    type: "string",
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property, type) => (event) => {
    onRequestSort(event, property, type);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell align="center" sx={{ width: "10%" }}>
          S.No
        </StyledTableCell>
        {headCells.map((cell) => (
          <StyledTableCell
            key={cell.id}
            align={cell.align}
            sortDirection={orderBy === cell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={orderBy === cell.id ? order : "asc"}
              onClick={createSortHandler(cell.id, cell.type)}
            >
              {cell.label}
              {orderBy === cell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
        <StyledTableCell align="center" sx={{ width: "20%" }}>
          Action
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const AccessPermissionModal = ({ open, handleClose, handleAction, loading }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [type, setType] = useState("string");
  const { isFetching, isSuccess, data, isError, error:prfileError } = useGetUserProfile({ id: null });
  const { mutate: AddAccessPermission, isLoading } = useAddAccessPermission();
  const { mutate: DeleteAccessPermission, isLoading: isDeleting } = useDeleteAccessPermission();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const [ deleteEmail, setDeleteEmail ] = useState('');
  const { showSuccessToast, showErrorToast } = useToast();

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
      console.log('Valid email:', email);
      addAccessPermission();
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteEmail(item.email)
    deleteAccessPermission(item.email);
  }

  useEffect(() => {
    console.log("data: ", data);
    setVisibleRows(data ? data.permission ? data.permission : [] : []);
  }, [data]);

  // const visibleRows = [
  //   { name: "Justn Miller", email: "risingstar1231@brightlight.fun" },
  //   { name: "James Josey", email: "risingstar1231@brightlight.fun" },
  //   { name: "David Li", email: "risingstar1231@brightlight.fun" },
  //   { name: "John Smith", email: "risingstar1231@brightlight.fun" },
  //   { name: "Donald Abbot", email: "risingstar1231@brightlight.fun" },
  // ];

  const addAccessPermission = () => {
    AddAccessPermission({
      email: email
    }, {
      onSuccess: (data) => {
        console.log("data: ", data);
        setEmail('');
        setVisibleRows(data ? data.permission ? data.permission : [] : []);
      },
      onError: (error) => {
        showErrorToast(error.response.data.message);
      }
    });
  }

  const deleteAccessPermission = (email) => {
    DeleteAccessPermission({
      email: email
    }, {
      onSuccess: (data) => {
        setVisibleRows(data ? data.permission ? data.permission : [] : []);
        setDeleteEmail('');
      },
      onError: (error) => {
        showErrorToast(error.response.data.message);
      }
    });
  }

  const handleRequestSort = (event, property, type) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setType(type);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          minWidth: "800px",
          borderRadius: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <SuccessContent>
          {/* <div className="icon-circle">
            <CheckRoundedIcon sx={{ color: colors.checkGreen, fontSize: 56 }} />
          </div> */}
          <h4>Access Permission</h4>
          <p>{'Add user for permission to access your signed documents'}</p>

          {/* <Divider flexItem/> */}

          <div className="btn-container">
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
              startIcon={<AddRoundedIcon />}
              onClick={handleAddClick}
            >
              {isLoading ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: colors.white }}
                  />
                ) : (
                  "Add"
                )}
            </Button>
          </div>

          {isFetching ? (
            <div className="loader-container">
              <Loader size={48} />
            </div>
          ) : (
            <Paper sx={{ boxShadow: 'none', overflow: 'hidden' }}>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: 'none', borderRadius: 0 }}
              >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {isSuccess &&
                      visibleRows.map((row, index) => {                      
                        // console.log("row: ", row);
                        let item = JSON.parse(row);
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell align="center">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {item.email}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Box 
                                sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                              >
                                <Button
                                  sx={{
                                    bgcolor: "#FD6B6B",
                                    boxShadow: "none",
                                    color: colors.white,
                                    textTransform: "none",
                                    px: { xs: "8px", sm: "17px" },
                                    py: { xs: "2px", sm: "6px" },
                                    fontSize: "11px",
                                    fontFamily: fonts.medium,
                                    "&:hover": {
                                      bgcolor: "#FD6B6B",
                                      boxShadow: "none",
                                    },
                                    "& .MuiButton-endIcon": {
                                      marginLeft: 0,
                                      marginRight: 0,
                                    },
                                  }}
                                  onClick={() => handleDeleteClick(item)}
                                >
                                  {isDeleting && item.email == deleteEmail ? (
                                    <CircularProgress
                                      size={18}
                                      sx={{ color: colors.white }}
                                    />
                                  ) : (
                                    "Delete"
                                  )}
                                </Button>
                              </Box>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
          <div className="btn-wrap">
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
                Close
              </PrimaryButton>
            </div>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default AccessPermissionModal;

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
    justify-content: end;
    // margin-left: -24px;
    .btn-container {
      width: 30%;
      // margin-left: 30px;
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
