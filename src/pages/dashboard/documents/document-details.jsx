import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { colors, fonts } from "../../../utils/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useParams } from "react-router-dom";
import format from "date-fns/format";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";

import { useGetContractById } from "../../../hooks/data-hook";
import InviteModal from "../../../components/modals/invite-modal";
import { Loader } from "../../../shared-components/loader/loader";
import { API_ENDPOINTS, BASE_URL } from "../../../utils/variables";
import { StyledTableCell, StyledTableRow } from "./documents-listing";
import SubscriptionAlert from "../../../components/alerts/subscription-alert";
import EmptyFeedback from "../../../shared-components/empty/empty-feedback";
import { getComparator } from "./documents-listing";
import SearchInput from "../../../components/inputs/search-input";

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
    width: "17%",
    align: "center",
    type: "string",
  },
  {
    id: "status",
    label: "Status",
    width: "8%",
    align: "center",
    type: "string",
  },
  {
    id: "createdAt",
    label: "Invitation time",
    width: "18%",
    align: "center",
    type: "date",
  },
  {
    id: "approvedAt",
    label: "Approved time",
    width: "18%",
    align: "center",
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
        <StyledTableCell align="center" sx={{ width: "2%" }}>
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
        <StyledTableCell align="center" sx={{ width: "16%" }}>
          Phone
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: "16%" }}></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const stableSort = (array, comparator) => {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [
      { ...el, firstname: el.customer.firstname, email: el.customer.email },
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

function filterList(list, query) {
  if (!query || !list.length) {
    return list;
  }
  const regex = new RegExp(`${query.trim()}`, "i");
  return list.filter(
    (item) =>
      item.customer.firstname.search(regex) >= 0 ||
      (Boolean(item.customer.lastname) &&
        item.customer.lastname.search(regex) >= 0) ||
      item.customer.email.search(regex) >= 0
  );
}

const DocumentDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstname");
  const [type, setType] = useState("string");
  const [searchText, setSearchText] = useState("");
  const { isFetching, data, refetch } = useGetContractById(id);

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <>
      <InviteModal
        open={open}
        handleClose={handleClose}
        id={id}
        refetch={refetch}
      />
      <SubscriptionAlert />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: colors.themeBlue,
            textTransform: "none",
            fontFamily: fonts.medium,
          }}
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
        >
          Invite
        </Button>
      </Box>
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
              sx={{
                boxShadow: "none",
                borderRadius: 0,
                width: "100%",
                height: "max-content",
              }}
            >
              <Table
                sx={{ minWidth: 700, height: "max-content" }}
                aria-label="customized table"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={data.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {visibleRows.map((invite, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center" sx={{ width: "2%" }}>
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          maxWidth: 100,
                        }}
                      >
                        {`${invite.customer.firstname} ${
                          Boolean(invite.customer.lastname)
                            ? invite.customer.lastname
                            : ""
                        }`}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          maxWidth: 164,
                        }}
                      >
                        <Tooltip
                          title={invite.customer.email}
                          slotProps={{
                            tooltip: {
                              sx: {
                                fontFamily: fonts.medium,
                                fontSize: 12,
                              },
                            },
                          }}
                        >
                          <span>{invite.customer.email}</span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "8%" }}>
                        {invite.status}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "18%" }}>
                        {format(
                          new Date(invite.createdAt),
                          "dd MMM, yyyy hh:mm a"
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "18%" }}>
                        {Boolean(invite.approvedAt) &&
                          format(
                            new Date(invite.approvedAt),
                            "dd MMM, yyyy hh:mm a"
                          )}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "16%" }}>
                        {invite.customer.phoneNumber}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "16%" }}>
                        {invite.file && (
                          <a
                            href={`${BASE_URL}${API_ENDPOINTS.FILE}/f/view/preview.pdf?id=${invite.file}`}
                          >
                            <Button
                              id="basic-menu"
                              sx={{
                                bgcolor: colors.translucentGreen,
                                boxShadow: "none",
                                color: colors.foreGreen,
                                textTransform: "none",
                                px: { xs: 1, sm: "17px" },
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
                  ))}
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
              labelRowsPerPage="Invites per page"
            />
          </Paper>
        ) : (
          <div className="loader-container">
            <EmptyFeedback
              message="You haven't invited anyone to sign this contract."
              btnText="Invite"
              action={handleOpen}
            />
          </div>
        )}
      </ListingWrapper>
    </>
  );
};

export default DocumentDetails;

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
