import React, { useMemo, useState } from 'react';
import { styled as muiStyled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import styled from "styled-components";
import { colors, fonts } from "../../../utils/theme";
import { Box, Paper, Table, TableContainer, TableHead, TableRow, TableSortLabel, TableBody, Button, TablePagination } from '@mui/material';
import { compareDesc, format } from 'date-fns';
import { useUI } from '../../../context/ui.context';
import { visuallyHidden } from "@mui/utils";
import { useGetSubscriptions } from '../../../hooks/data-hook';
import EmptyFeedback from '../../../shared-components/empty/empty-feedback';
import SearchInput from '../../../components/inputs/search-input';
import { useParams } from 'react-router-dom';
import { Loader } from '../../../shared-components/loader/loader';
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SubscriptionConfirmationModal from '../../../components/modals/subscription-confirmation-modal';
import { usePostSubscription } from '../../../hooks/user-hook';
import { useToast } from '../../../context/toast.context';

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
    id: "createdAt",
    label: "Created At",
    align: "center",
    width: "25%",
    type: "date",
  },
  {
    id: "expiryAt",
    label: "Expiry At",
    align: "center",
    width: "25%",
    type: "date",
  },
  {
    id: "price",
    label: "Price",
    align: "center",
    width: "25%",
    type: "string",
  },
  {
    id: "status",
    label: "Status",
    align: "center",
    width: "25%",
    type: "string",
  },
  {
    id: "type",
    label: "Type",
    align: "center",
    width: "25%",
    type: "string",
  },
  {
    id: "transactionId",
    label: "Transaction ID",
    align: "center",
    width: "25%",
    type: "string",
  },
  {
    id: "couponCode",
    label: "Coupon Code",
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
        <StyledTableCell align="center" sx={{ width: "2%" }}>
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
        <StyledTableCell align="center" sx={{ width: "16%" }}></StyledTableCell>
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
    if(!b[orderBy] || !a[orderBy]) {
      return 0
    }
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
    const stabilizedThis = array.map((el, index) => [
      { ...el },
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
      // item.transactionId.search(regex) >= 0 ||
      item.expiredAt.search(regex) >= 0 ||
      item.createdAt.search(regex) >= 0
  );
}


const Subscriptions = () => {
  const { user } = useUI();
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const { isFetching, isSuccess, data, refetch } = useGetSubscriptions(id);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [type, setType] = useState("string");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmationModal, setConfirmationModal] = useState(false)
  const { showErrorToast, showSuccessToast } = useToast()
  const { mutate: CreateSubscription, isLoading } = usePostSubscription()

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

  const handleConfirmationModalClose = () => {
    setConfirmationModal(false);
  }

  const visibleRows = useMemo(() => {
    if (data) {
      const filteredList = filterList(data, searchText);
      return stableSort(
        filteredList,
        getComparator(order, orderBy, type)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return [];
  }, [data, searchText, order, orderBy, page, rowsPerPage, type]);

  const handleRequestSort = (event, property, type) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setType(type);
  };

  const onCreate = () => {
    CreateSubscription(
      {
        agentId: id,
        price: '0',
        type: 'ADMIN'
      }, {
      onSuccess: () => {
        showSuccessToast('Can\'t create subscription')
        refetch()
      },
      onError: () => {
        showErrorToast('Can\'t create subscription')
      }
    })
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: colors.themeBlue,
            textTransform: "none",
            fontFamily: fonts.medium,
          }}
          startIcon={<AddRoundedIcon />}
          onClick={onCreate}
        >
          Create Subscription
        </Button>
      </Box>
      {user && (user.role === 'ADMIN') && (

        <ListingWrapper>
          <div className="search-container">
            <SearchInput
              placeholder="Search"
              id="search-contracts"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          {
            isFetching ? (
              <div className="loader-container">
                <Loader size={48} />
              </div>
            ) : data && data.length ? (
              <Paper sx={{ boxShadow: 'none', overflow: 'hidden' }}>
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
                      {isSuccess &&
                        visibleRows.map((row, index) => {
                          // const lastSeen = format(new Date(row.lastseen), "dd MMM, yyyy hh:mm a")
                          const expiredAt = format(new Date(row.expiredAt), "dd MMM, yyyy hh:mm a");
                          const date = format(
                            new Date(row.createdAt),
                            "dd MMM, yyyy hh:mm a"
                          );
                          return (
                            <>
                              <SubscriptionConfirmationModal
                                key={`subscription-confirmation-${row.id}`}
                                open={confirmationModal}
                                refetch={refetch}
                                id={row.id}
                                handleClose={handleConfirmationModalClose}
                              />
                              <StyledTableRow key={index}>
                                <StyledTableCell align="center">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {date}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {expiredAt}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.price}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.status}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.type}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.transactionId}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.couponCode}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Button onClick={() => { setConfirmationModal(true) }} variant='contained' className='btn'>delete</Button>
                                </StyledTableCell>

                              </StyledTableRow>
                            </>
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
                  labelRowsPerPage="Users per page"
                />
              </Paper>
            ) : (
              <div>
                <div className="loader-container">
                  <EmptyFeedback
                    message="You don't have any subscriptions yet"
                  // btnText='Create Placeholder'
                  // action={() => setPlaceholderModal(true)}
                  />
                </div>
              </div>
            )}
        </ListingWrapper>
      )}
    </>
  )
}
export default Subscriptions;

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
