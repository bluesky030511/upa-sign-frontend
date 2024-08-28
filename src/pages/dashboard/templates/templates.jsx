import React, { useState, useMemo } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useQueryClient } from "react-query";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import format from "date-fns/format";

import DashboardLayout from "../../../components/dashboard/layout";
import { colors, fonts } from "../../../utils/theme";
import { useDeleteTemplate, useGetTemplates } from "../../../hooks/data-hook";
import { StyledTableCell, StyledTableRow, getComparator } from "../documents/documents-listing";
import FileInvoice from "../../../assets/images/file-invoice-solid_x.svg";
import { useUI } from "../../../context/ui.context";
import TemplateModal from "../../../components/modals/template-modal";
import GuideLinesModal from "../../../components/modals/guidelines-modal";
import { useToast } from "../../../context/toast.context";
import { API_ENDPOINTS, S3_BUCKET_URL } from "../../../utils/variables";
import ContractModal from "../../../components/modals/contract-modal";
import SubscriptionAlert from "../../../components/alerts/subscription-alert";
import { useSubscription } from "../../../context/subscription.context";
import SearchInput from "../../../components/inputs/search-input";
import { isSubscribed } from "../../../utils/helper";
import ContractDetailsModal from "../../../components/modals/contract-details-modal";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    id: "firstname",
    label: "Name",
    width: "20%",
    align: "center",
    type: "string",
  },
  {
    id: "agentName",
    label: "Agent Name",
    width: "20%",
    align: "center",
    type: "string",
  },
  {
    id: "createdAt",
    label: "Creation time",
    width: "20%",
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
        <StyledTableCell align="center" sx={{ width: "25%" }}></StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const stableSort = (array, comparator) => {
  if (Array.isArray(array)) {
    const stabilizedThis = array.map((el, index) => [
      { ...el, },
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
      item.name.search(regex) >= 0 ||
      (Boolean(item.lastname) &&
        item.lastname.search(regex) >= 0) ||
      item.creatorName.search(regex) >= 0

  );
}

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useUI();
  const { showSuccessToast } = useToast();
  const { subscription } = useSubscription();
  const { isFetching, data, isSuccess } = useGetTemplates();
  const { mutate: DeleteTemplate, isLoading: isDeleting } = useDeleteTemplate();
  const [open, setOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [contractModal, setContractModal] = useState(false);
  const [contractDetailsModal, setContractDetailsModal] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [modalTemplate, setModalTemplate] = useState();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("date");

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

  const openDetails = (template) => {
    setModalTemplate(template);
    setContractDetailsModal(true);
  };
  const closeDetails = () => {
    setContractDetailsModal(false);
  };

  const handleShowGuideLine = () => {
    setShowGuidelines(true);
  };

  const handleCloseGuideLine = () => {
    setShowGuidelines(false);
  };

  const handleOpenContractModal = (id) => {
    setTemplateId(id);
    setContractModal(true);
  };

  const handleCloseContractModal = () => {
    setContractModal(false);
  };

  // Delete Template
  const deleteTemplate = (id) => () => {
    DeleteTemplate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"]);
        showSuccessToast("Template deleted!");
      },
    });
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
        <ListingWrapper>
          <TemplateModal open={open} handleClose={handleClose} />
          <ContractModal
            open={contractModal}
            handleClose={handleCloseContractModal}
            id={templateId}
          />
          <ContractDetailsModal
            open={contractDetailsModal}
            handleClose={closeDetails}
            id={templateId}
            data={modalTemplate}
          />
          <GuideLinesModal
            open={showGuidelines}
            handleClose={handleCloseGuideLine}
          />
          <div className="search-container">
            <SearchInput
              placeholder="Search"
              id="search-contracts"
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          {user.role === "ADMIN" ? null : <SubscriptionAlert />}
          {user && (user.role === "ADMIN" || user.role === "AGENT") && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: { xs: 4, sm: 2 },
                p: 0,
              }}
            >
              {/* <Button
                variant="text"
                sx={{
                  textTransform: "none",
                  fontFamily: fonts.medium,
                  mr: 3,
                  color: colors.themeBlue,
                }}
                onClick={handleShowGuideLine}
              >
                Guidelines
              </Button> */}
              <Tooltip
                title={
                  user.role === "ADMIN" || isSubscribed(subscription)
                    ? ""
                    : "Please first subscribe to UPA sign."
                }
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
                    disabled={
                      user.role === "AGENT" && !isSubscribed(subscription)
                    }
                    variant="contained"
                    sx={{
                      bgcolor: colors.themeBlue,
                      textTransform: "none",
                      fontFamily: fonts.medium,
                      "&:disabled": {
                        bgcolor: colors.translucentBlue,
                      },
                    }}
                    startIcon={<AddRoundedIcon />}
                    onClick={handleOpen}
                  >
                    Add
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
          {/* <Grid
            container
            spacing={{ xs: 4, sm: 8 }}
            sx={{
              justifyContent: {
                xs: "center",
                sm: "flex-start",
              },
            }}
          > */}
            {isSuccess && (
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
                    {visibleRows.map((temp, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center" sx={{ width: "10%" }}>
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ maxWidth: "20%" }}
                        >
                          {temp.name}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ maxWidth: "20%" }}
                        >
                          {temp.creatorName}
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ maxWidth: "20%" }}>
                          {format(
                            new Date(temp.createdAt),
                            "dd MMM, yyyy hh:mm a"
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ maxWidth: "20%" }}>
                          <Box sx={{display:"flex", alignContent:"center", justifyContent:'center', gap: 1}}>
                            {user.role === "AGENT" && (
                              <Button
                                sx={{
                                  bgcolor: colors.translucentGreen,
                                  boxShadow: "none",
                                  color: colors.foreGreen,
                                  textTransform: "none",
                                  px: { xs: 1, sm: "17px" },
                                  py: { xs: "2px", sm: "6px" },
                                  fontSize: "12px",
                                  // height: "40px",
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
                                onClick={() => handleOpenContractModal(temp.id)}
                              >
                                Create
                              </Button>
                            )}
                            {user.role === "ADMIN" && (
                              <Button
                                sx={{
                                  bgcolor: colors.translucentGreen,
                                  boxShadow: "none",
                                  color: colors.foreGreen,
                                  textTransform: "none",
                                  px: { xs: 1, sm: "17px" },
                                  py: { xs: "2px", sm: "6px" },
                                  fontSize: "12px",
                                  // height: "40px",
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
                                onClick={() => { navigate(`/template-edit/${temp.filename.replace(/\.[^/.]+$/, "")}/${temp.name}`);}}
                              >
                                Edit
                              </Button>
                            )}
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[20, 30, 50]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Templates per page"
                />
              </Paper>
              )
              // data.map((template, index) => (
              //   <Grid item key={index}>
              //     <div className="template-btn">
              //       <figure
              //         onClick={() =>
              //           user.role === "ADMIN" ? openDetails(template) : null
              //         }
              //       >
              //         <div className="overlay">
              //           <div className="inner-content">
              //             {user.role === "AGENT" && (
              //               <Tooltip
              //                 title={
              //                   isSubscribed(subscription)
              //                     ? ""
              //                     : "Please first subscribe to UPA sign."
              //                 }
              //                 slotProps={{
              //                   tooltip: {
              //                     sx: {
              //                       fontFamily: fonts.medium,
              //                       fontSize: 12,
              //                     },
              //                   },
              //                 }}
              //               >
              //                 <span>
              //                   <Button
              //                     variant="outlined"
              //                     disabled={!isSubscribed(subscription)}
              //                     sx={{
              //                       color: colors.themeBlue,
              //                       borderColor: colors.themeBlue,
              //                       textTransform: "none",
              //                       fontFamily: fonts.medium,
              //                       minHeight: "36px",
              //                       "&:hover": {
              //                         borderColor: colors.themeBlue,
              //                         bgcolor: colors.themeBlue,
              //                         color: colors.white,
              //                       },
              //                     }}
              //                     onClick={() =>
              //                       handleOpenContractModal(template.id)
              //                     }
              //                   >
              //                     Create
              //                   </Button>
              //                 </span>
              //               </Tooltip>
              //             )}
              //             {user.role === "ADMIN" && (
              //               <Box sx={{ display:'flex', justifyContent:'center' }}>
              //                 <Button
              //                   variant="outlined"
              //                   sx={{
              //                     color: colors.themeBlue,
              //                     borderColor: colors.themeBlue,
              //                     textTransform: "none",
              //                     fontFamily: fonts.medium,
              //                     minHeight: "36px",
              //                     "&:hover": {
              //                       borderColor: colors.themeBlue,
              //                       bgcolor: colors.themeBlue,
              //                       color: colors.white,
              //                     },
              //                   }}
              //                   onClick={() => { navigate(`/template-edit/${template.filename.replace(/\.[^/.]+$/, "")}/${template.name}`);}}
              //                 >
              //                   Edit
              //                 </Button>
              //               </Box>
              //             )}
              //             {user &&
              //               template.createdby &&
              //               (template.createdby.role === user.role ||
              //                 user.role === "ADMIN") && (
              //                 <Button
              //                   variant="outlined"
              //                   sx={{
              //                     color: colors.red,
              //                     borderColor: colors.red,
              //                     textTransform: "none",
              //                     fontFamily: fonts.medium,
              //                     minHeight: "36px",
              //                     mt: 2,
              //                     "&:hover": {
              //                       borderColor: colors.red,
              //                       bgcolor: !isDeleting
              //                         ? colors.red
              //                         : "transparent",
              //                       color: !isDeleting
              //                         ? colors.white
              //                         : colors.red,
              //                     },
              //                   }}
              //                   onClick={deleteTemplate(template.id)}
              //                 >
              //                   {isDeleting ? (
              //                     <CircularProgress
              //                       size={18}
              //                       sx={{ color: colors.red }}
              //                     />
              //                   ) : (
              //                     "Delete"
              //                   )}
              //                 </Button>
              //               )}
              //             {user.role === "ADMIN" || user.role === "AGENT" ? (
              //               <Tooltip title="Download">
              //                 <IconButton
              //                   aria-label="upload picture"
              //                   component="a"
              //                   href={`${S3_BUCKET_URL}/${template.id}/${template.filename}`}
              //                   sx={{
              //                     position: "absolute",
              //                     top: 2,
              //                     right: 2,
              //                   }}
              //                   disabled={
              //                     !(
              //                       isSubscribed(subscription) ||
              //                       user.role === "ADMIN"
              //                     )
              //                   }
              //                 >
              //                   <FileDownloadOutlinedIcon
              //                     sx={{
              //                       color: isSubscribed(subscription)
              //                         ? colors.themeBlue
              //                         : colors.fadeBlack,
              //                     }}
              //                   />
              //                 </IconButton>
              //               </Tooltip>
              //             ) : null}
              //           </div>
              //         </div>
              //         <img src={FileInvoice} alt="template" />
              //       </figure>
              //       <span className="template-name">{template.name}</span>
              //     </div>
              //   </Grid>
              // ))
            }
          {/* </Grid> */}
        </ListingWrapper>
      )}
    </DashboardLayout>
  );
};
export default Templates;

const TemplatesWrapper = styled.div`
  width: 100%;

  .template-btn {
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
    .template-name {
      font-family: ${fonts.medium};
      color: ${colors.mediumBlack};
      font-size: 12px;
      margin-top: 11px;
    }
  }
`;

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
