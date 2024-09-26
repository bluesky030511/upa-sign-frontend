import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import format from "date-fns/format";
import { visuallyHidden } from "@mui/utils";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useSubscription } from "../../../context/subscription.context";
import { getComparator } from "../documents/documents-listing";
import { StyledTableCell, StyledTableRow } from "../documents/documents-listing";
import SearchInput from "../../../components/inputs/search-input";

import DashboardLayout from "../../../components/dashboard/layout";
import { colors, fonts } from "../../../utils/theme";
import { useDeleteTemplate, useGetTemplates, useGetAccessUserList } from "../../../hooks/data-hook";
import { useUI } from "../../../context/ui.context";
import { useToast } from "../../../context/toast.context";

const columns = [
  {
    id: "firstname",
    label: "Name",
    width: "20%",
    align: "center",
    type: "string",
  },
  {
    id: "email",
    label: "Email",
    width: "35%",
    align: "center",
    type: "string",
  },
  {
    id: "role",
    label: "Role",
    width: "20%",
    align: "center",
    type: "string",
  },
  {
    id: "detail",
    label: "",
    width: "20%",
    align: "center",
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
        {columns.map((cell) => (
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
        {/* <StyledTableCell align="center" sx={{ width: "16%" }}></StyledTableCell> */}
      </TableRow>
    </TableHead>
  );
};

const stableSort = (array, comparator) => {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [
      { ...el, /*firstname: el.customer.firstname, email: el.customer.email*/ },
      index,
    ]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    const stabilizedList = stabilizedThis.map((el) => el[0]);
    return stabilizedList;
  }
  return [];
};

function filterList(list, query, queryFilter) {
  if (!list.length || (queryFilter === "ALL" && !query) ) {
    return list;
  }
  let regex = "------------------------------";
  if(query)
    regex = new RegExp(`${query.trim()}`, "i");

  return list.filter(
    (item) =>
      item.firstname.search(regex) >= 0 ||
      (Boolean(item.lastname) &&
        item.lastname.search(regex) >= 0) ||
      item.email.search(regex) >= 0 ||
      item.role.search(queryFilter) >= 0
  );
}

const SignDocuments = () => {
  const { user } = useUI();
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();
  // const { subscription } = useSubscription();
  const { isFetching, data, isSuccess } = useGetAccessUserList();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [type, setType] = useState("string");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("ALL");
  // const { isFetching, isSuccess, data } = useGetContracts({
  //   name: searchText,
  // });
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { subscription } = useSubscription();

  const handleFilter = (e) => {
    setFilter(e.target.value);
  }

  const visibleRows = useMemo(() => {
    if (data) {
      const filteredList = filterList(data, searchText, filter);
      return stableSort(
        filteredList,
        getComparator(order, orderBy, type)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return [];
  }, [data, searchText, order, orderBy, page, rowsPerPage, filter]);

  const handleRequestSort = (event, property, type) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setType(type);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <DashboardLayout>
      {isFetching ? (
        <Grid
          container
          spacing={{ xs: 4, sm: 8 }}
          sx={{
            justifyContent: {
              xs: "center",
              sm: "flex-start",
            },
          }}
        >
          {Array.from([1, 2, 3, 4, 5], (x) => (
            <Grid item key={x}>
              <Stack spacing={1}>
                <Skeleton variant="rounded" width={178} height={251} />
                <Skeleton variant="text" sx={{ fontSize: 16, width: "45%" }} />
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : (
        <SignDocumentsWrapper>
          {/* <Grid
            container
            spacing={{ xs: 4, sm: 8 }}
            sx={{
              justifyContent: {
                xs: "center",
                sm: "flex-start",
              },
            }}
          >
            {isSuccess &&
              data.map((item, index) => (
                <Grid item key={index}>
                  <div className="item-btn">
                    <figure
                    >
                      <div className="overlay">
                        <div className="inner-content">
                          <Tooltip
                            slotProps={{
                              tooltip: {
                                sx: {
                                  fontFamily: fonts.medium,
                                  fontSize: 12,
                                },
                              },
                            }}
                          >
                            <span>
                              <Button
                                variant="outlined"
                                // disabled={!isSubscribed(subscription)}
                                sx={{
                                  color: colors.themeBlue,
                                  borderColor: colors.themeBlue,
                                  textTransform: "none",
                                  fontFamily: fonts.medium,
                                  minHeight: "36px",
                                  "&:hover": {
                                    borderColor: colors.themeBlue,
                                    bgcolor: colors.themeBlue,
                                    color: colors.white,
                                  },
                                }}
                                onClick={() =>
                                  navigate(`/sign-document/${item.id}`)
                                }
                              >
                                Open
                              </Button>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                      <img src={item.gender == "FMALE" ? female : male} alt="item" style={{width:"160px"}} />
                    </figure>
                    <span className="item-name">{`${item.firstname} ${item.lastname}`}</span>
                  </div>
                </Grid>
              ))}
          </Grid> */}
          <div className="search-container">
            <FormControl size="small"
              sx={{ mr: "10px" }}
              variant="standard"
            >
              <Select
                value={filter}
                onChange={handleFilter}
                sx={{
                  boxShadow: "none",
                  textTransform: "none",
                  fontSize: "16px",
                  fontFamily: fonts.medium,
                  color: colors.foreBlack,
                }}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="AGENT">AGENT</MenuItem>
                <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
              </Select>
            </FormControl>
            <SearchInput
              placeholder="Search"
              id="search-contracts"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <Paper sx={{ boxShadow: "none", overflow: "hidden" }}>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: "none", borderRadius: 0 }}
            >
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={data.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {isSuccess &&
                    visibleRows.map((row, index) => {
                      const date = format(
                        new Date(row.createdAt),
                        "dd MMM, yyyy hh:mm a"
                      );
                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.firstname} {row.lastname}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.email}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.role}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Box 
                              sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                            >
                              <Button
                                sx={{
                                  bgcolor: colors.translucentGreen,
                                  boxShadow: "none",
                                  color: colors.foreGreen,
                                  textTransform: "none",
                                  px: { xs: "8px", sm: "17px" },
                                  py: { xs: "2px", sm: "6px" },
                                  fontSize: "11px",
                                  fontFamily: fonts.medium,
                                  "&:hover": {
                                    bgcolor: colors.translucentGreen,
                                  },
                                  "& .MuiButton-endIcon": {
                                    marginLeft: 0,
                                    marginRight: 0,
                                  },
                                }}
                                onClick={() => navigate(`/sign-document/${row.id}`)}
                              >
                                View Detail
                              </Button>
                            </Box>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Contracts per page"
            />
          </Paper>
        </SignDocumentsWrapper>
      )}
    </DashboardLayout>
  );
};
export default SignDocuments;

const SignDocumentsWrapper = styled.div`
  background-color: ${colors.white};
  width: 100%;
  padding: 35px 23px;
  border-radius: 7px;
  box-shadow: 0px 4px 21px -8px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;

  div.search-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
  }

  div.loader-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-btn {
    border: none;
    background-color: transparent;
    display: flex;
    flex-direction: column;

    figure {
      box-shadow: 0px 0px 24px -7px rgba(0, 0, 0, 0.1);
      width: 178px;
      height: 251px;
      margin: 0;
      position: relative;
      cursor: pointer;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 70%;
        height: auto;
        object-fit: contain;
        transition: all 0.5s ease-in;
      }

      .overlay {
        z-index: 1;
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        transition: opacity 0.5s ease-in-out;
        display: flex;
        flex-direction: column;

        .inner-content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          flex-grow: 1;
        }
      }

      &:hover {
        img {
          filter: blur(1px);
        }

        .overlay {
          opacity: 1;
        }
      }
    }
    .item-name {
      font-family: ${fonts.medium};
      color: ${colors.mediumBlack};
      font-size: 12px;
      margin-top: 11px;
    }
  }
`;
