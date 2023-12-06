import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
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
import compareDesc from "date-fns/compareDesc";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { visuallyHidden } from "@mui/utils";

import { colors, fonts } from "../../../utils/theme";
import { useGetContracts } from "../../../hooks/data-hook";
import { Loader } from "../../../shared-components/loader/loader";
import ActionDropDown from "../../../components/dropdowns/action-dropdown";
import { API_ENDPOINTS, BASE_URL, PLAN } from "../../../utils/variables";
import { useUI } from "../../../context/ui.context";
import SubscriptionAlert from "../../../components/alerts/subscription-alert";
import EmptyFeedback from "../../../shared-components/empty/empty-feedback";
import SearchInput from "../../../components/inputs/search-input";
import PaymentModal from "../../../components/modals/payment-modal";
import { useSubscription } from "../../../context/subscription.context";
import { isSubscribed } from "../../../utils/helper";

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
    width: "25%",
    type: "string",
  },
  {
    id: "totalInvite",
    label: "Total Customers",
    align: "center",
    width: "25%",
    type: "numeric",
  },
  {
    id: "createdAt",
    label: "Created At",
    align: "center",
    width: "25%",
    type: "date",
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
        <StyledTableCell align="center" sx={{ width: "5%" }}>
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

export const descendingComparator = (a, b, orderBy, type) => {
  if (type === "numeric") {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  if (type === "string") {
    if (b[orderBy].toUpperCase() < a[orderBy].toUpperCase()) {
      return -1;
    }
    if (b[orderBy].toUpperCase() > a[orderBy].toUpperCase()) {
      return 1;
    }
  }
  if (type === "date") {
    return compareDesc(new Date(b[orderBy]), new Date(a[orderBy]));
  }
  return 0;
};

export const getComparator = (order, orderBy, type) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, type)
    : (a, b) => -descendingComparator(a, b, orderBy, type);
};

const stableSort = (array, comparator) => {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [el, index]);
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

function filterList(list, query) {
  if (!query || !list.length) {
    return list;
  }
  const regex = new RegExp(`${query.trim()}`, "i");
  return list.filter((item) => item.name.search(regex) >= 0);
}

const DocumentsListing = () => {
  const { user } = useUI();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [type, setType] = useState("string");
  const [searchText, setSearchText] = useState("");
  const { isFetching, isSuccess, data } = useGetContracts({
    name: searchText,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { subscription } = useSubscription();
  const visibleRows = useMemo(() => {
    if (data) {
      const filteredList = filterList(data, searchText);
      return stableSort(
        filteredList,
        getComparator(order, orderBy, type)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return [];
  }, [data, searchText, order, orderBy, page, rowsPerPage]);

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem(PLAN);
  };

  const populateQueries = () => {
    if (localStorage.getItem(PLAN)) {
      setSearchParams({
        plan: localStorage.getItem(PLAN),
      });
      if (!isSubscribed(subscription)) {
        setTimeout(() => {
          handleOpen();
        }, 1500);
      }
    }
  };

  useEffect(() => {
    populateQueries();
    if (!isSubscribed(subscription) && searchParams.get("plan")) {
      setTimeout(() => {
        handleOpen();
      }, 1500);
    }
  }, []);

  return (
    <>
      <>
        <PaymentModal
          open={open}
          handleClose={handleClose}
          plan={searchParams.get("plan") || localStorage.getItem(PLAN)}
        />
        <SubscriptionAlert />
        <ListingWrapper>
          <div className="search-container">
            <SearchInput
              placeholder="Search"
              id="search-contracts"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          {isFetching ? (
            <div className="loader-container">
              <Loader size={48} />
            </div>
          ) : data && data.length ? (
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
                              {row.name}
                            </StyledTableCell>
                            {user.isAgent && (
                              <StyledTableCell align="center">
                                {row.totalInvite}
                              </StyledTableCell>
                            )}
                            {!user.isAgent && (
                              <StyledTableCell align="center">
                                {row.invite[0].status === "PENDING"
                                  ? row.invite[0].status
                                  : "SIGNED"}
                              </StyledTableCell>
                            )}
                            <StyledTableCell align="center">
                              {date}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {user.isAgent ||
                              row.invite[0].status === "PENDING" ? (
                                <ActionDropDown
                                  id={row.id}
                                  file={
                                    user.isAgent
                                      ? row.file
                                      : row.invite[0].file
                                      ? row.invite[0].file
                                      : row.file
                                  }
                                  inviteId={
                                    user.isAgent ? null : row.invite[0].id
                                  }
                                  signed={
                                    user.isAgent
                                      ? false
                                      : row.invite[0].status === "APPROVED"
                                  }
                                />
                              ) : (
                                <a
                                  href={`${BASE_URL}${API_ENDPOINTS.FILE}/f/view/preview.pdf?id=${row.invite[0].file}`}
                                >
                                  <Button
                                    id="basic-menu"
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
                                        marginLeft: 1,
                                        marginRight: 0,
                                        "& svg": {
                                          fontSize: 16,
                                        },
                                      },
                                    }}
                                    endIcon={<VisibilityOutlinedIcon />}
                                  >
                                    Preview
                                  </Button>
                                </a>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Contracts per page"
              />
            </Paper>
          ) : (
            <div className="loader-container">
              <EmptyFeedback
                message="You don't have any contracts yet."
                btnText="Create Contract"
                action={() => navigate("/templates")}
              />
            </div>
          )}
        </ListingWrapper>
      </>
    </>
  );
};

export default DocumentsListing;

const ListingWrapper = styled.div`
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

  @media screen and (max-width: 600px) {
    padding: 12px;
  }
`;
