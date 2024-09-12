import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import format from "date-fns/format";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { useToast } from '../../context/toast.context';

import { useGetAllContract, useGetAllIssue, useUpdateIssueStatus } from "../../hooks/data-hook";
import DashboardLayout from "../../components/dashboard/layout";
import InviteModal from "../../components/modals/invite-modal";
import SendMailModal from "../../components/modals/send-mail-modal";
import AssignSignatureModal from "../../components/modals/assign-signature-modal";
import { Loader } from "../../shared-components/loader/loader";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { StyledTableCell, StyledTableRow } from "./documents/documents-listing";
import SubscriptionAlert from "../../components/alerts/subscription-alert";
import EmptyFeedback from "../../shared-components/empty/empty-feedback";
import { getComparator } from "./documents/documents-listing";
import SearchInput from "../../components/inputs/search-input";

const columns = [
  {
    id: "firstname",
    label: "Name",
    width: "10%",
    align: "center",
    type: "string",
  },
  {
    id: "title",
    label: "Title",
    width: "10%",
    align: "center",
    type: "string",
  },
  {
    id: "content",
    label: "Content",
    width: "50%",
    align: "center",
    type: "string",
  },
  {
    id: "createdAt",
    label: "Submition time",
    width: "10%",
    align: "center",
    type: "date",
  },
  {
    id: "status",
    label: "Status",
    width: "8%",
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
        <StyledTableCell align="center" sx={{ width: "16%" }}></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const stableSort = (array, comparator) => {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [
      { ...el, firstname: el.firstname, email: el.email },
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
      item.firstname.search(regex) >= 0 ||
      (Boolean(item.lastname) &&
        item.lastname.search(regex) >= 0) ||
      item.email.search(regex) >= 0 ||
      item.status.search(regex) >= 0
  );
}

const TicketList = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [type, setType] = useState("date");
  const [searchText, setSearchText] = useState("");
  // const { isFetching, data, refetch } = useGetAllContract();
  const { showSuccessToast, showErrorToast } = useToast();
  const { isFetching, data, refetch } = useGetAllIssue();
  const { mutate: UpdateStatus } = useUpdateIssueStatus();
  const [userData, setUserData] = useState({});

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

  const handleClose = () => {
    setUserData({});
    setOpen(false);
  };

  const handleOpen = (data) => {
    setUserData(data)
    setOpen(true);
  };

  const handleChange = (event, issue) => {
    data.map((item, index) => {
      if(item.id === issue.id)
        item.status = event.target.value;
    });
    UpdateStatus(
      {
        id: issue.id,
        value: {
          status: event.target.value
        }
      },
      {
        onSuccess: () => {
          console.log("Success...");
        },
        onError: (error) => {
          showErrorToast(error.response.data.message);
        }
      }
    )
  }

  return (
    <DashboardLayout>
      <SubscriptionAlert />
      {/* <AssignSignatureModal 
        open={open}
        handleClose={handleClose}
        inviteData={inviteData}
      /> */}
      <SendMailModal 
        open={open}
        handleClose={handleClose}
        userData={userData}
      />
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
        ) : (
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
                  {visibleRows.map((issue, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center" sx={{ width: "2%" }}>
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          width: "10%",
                          maxWidth: 200,
                        }}
                      >
                        {`${issue.user.firstname} ${
                          Boolean(issue.user.lastname)
                            ? issue.user.lastname
                            : ""
                        }`}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          width: "10%",
                          maxWidth: 164,
                        }}
                      >
                        <Tooltip
                          title={issue.title}
                          slotProps={{
                            tooltip: {
                              sx: {
                                fontFamily: fonts.medium,
                                fontSize: 12,
                              },
                            },
                          }}
                        >
                          <span>{issue.title}</span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "40%" }}>
                        {issue.content}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "10%" }}>
                        {format(
                          new Date(issue.createdAt),
                          "dd MMM, yyyy hh:mm a"
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "10%" }}>
                        <FormControl size="small"
                        >
                          <Select
                            defaultValue={issue.status}
                            onChange={(value) => handleChange(value, issue)}
                            sx={{
                              boxShadow: "none",
                              textTransform: "none",
                              fontSize: "11px",
                              fontFamily: fonts.medium,
                            }}
                          >
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                          </Select>
                        </FormControl>
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ maxWidth: "10%" }}>
                        <Box sx={{display:"flex", alignContent:"center", justifyContent:'center', gap: 1}}>
                          {/* {invite.file && (
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
                                {invite.status == "APPROVED" ? "View" : "Preview"}
                              </Button>
                            </a>
                          )} */}
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
                            onClick={() => {handleOpen(issue);}}
                          >
                            Send Email
                          </Button>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
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
              labelRowsPerPage="Reportss per page"
            />
          </Paper>
        )}
      </ListingWrapper>
    </DashboardLayout>
  );
};

export default TicketList;

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
