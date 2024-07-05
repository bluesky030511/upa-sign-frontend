import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useWindowWidth } from '@wojtekmaj/react-hooks';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { ResizableBox } from "react-resizable";
import dayjs, { Dayjs } from 'dayjs';
import { Link, useLocation, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { API_ENDPOINTS, BASE_URL } from "../../../utils/variables";
import { useCreateTemplate } from "../../../hooks/data-hook";
import { useToast } from '../../../context/toast.context';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQueryClient } from "react-query";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Tooltip from "@mui/material/Tooltip";
import CreateTemplateModal from "../../../components/modals/create-template-modal";

import 'react-resizable/css/styles.css';

import DashboardHeader from "../../../components/dashboard/header";
import { colors, fonts } from "../../../utils/theme";
import EditDrawer from "./layout";


const Field = ({ id, left, top, isResizing, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SIGN_FIELD',
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  }), [id, left, top, isResizing]);

  return (
    <div 
      ref={drag} 
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children}
    </div>
  );
}

const DroppablePage = ({ pageNumber, onDrop, width, fields, moveField, setFields, handleProperty, item }) => {
  const maxWidth = 1363;
  const [sizes, setSizes] = useState({});
  const [isResizing, setIsResizing] = useState(false);

  
  const [, drop] = useDrop({
    accept: 'SIGN_FIELD',
    drop: (item, monitor) => {
      if(!monitor.didDrop()) {
          if(fields.findIndex(field => field.id == item.id) != -1) {
            const delta = monitor.getDifferenceFromInitialOffset();
            if(item.dataLabel != '')
              moveField(item, Math.round(item.left + delta.x), Math.round(item.top + delta.y  + 8));
            else  
              moveField(item, Math.round(item.left + delta.x), Math.round(item.top + delta.y  + 5));
          }
          else {
            const clientOffset = monitor.getClientOffset();
            const targetRect = document.getElementById('pdfContainer').getBoundingClientRect();
            const x = clientOffset.x - targetRect.left - 100;
            const y = clientOffset.y - targetRect.top - (targetRect.height + 10) * (pageNumber - 1) - 10;
            onDrop(item, pageNumber, x, y);
          }
      }
    }
  });

  const handleText = (event, item) => {
    setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? {...field, value: event.target.value} : field
    ));
  }

  const handleClick = (id) => {
    if(id && sizes[id]) {
      setFields((prevFields) => 
        prevFields.map(field => 
          field.id === id ? {...field, width: sizes[id].width ? sizes[id].width : 200 } : field
      ));
    }
  }

  const handleResize = (id, size) => {
    setSizes((prevSizes) => ({
      ...prevSizes,
      [id]: size,
    }));
  };

  function handleVale(item, field){
    if(item && item.value && item.id === field.id) {
      if(item.name == 'date' && item.value != 'date') return dayjs(item.value).format("ddd MMM DD YYYY");
      if(item.name == 'time' && item.value != 'time') return dayjs(item.value).format('hh:mm A');
      return item.value
    } else {
      if(field.name == 'date' && field.value != 'date') return dayjs(field.value).format("ddd MMM DD YYYY");
      if(field.name == 'time' && field.value != 'time') return dayjs(field.value).format('hh:mm A');
       return field.value
    }
  }

  return (
    <div ref={drop} style={{ position: 'relative' }}>
      <PDF id="pdfContainer" >
        <Page pageNumber={pageNumber} width={width} />
        {fields.map((field) => (
          <Field
            key={field.id}
            id={field.id}
            left={field.left}
            top={field.top}
            isResizing={isResizing}
          >
            <ResizableBox
              width={ field.name == "month" || field.name == "count" ? 100: (sizes[field.id] || { width: 200, height: 40 }).width}

              minConstraints={field.name == "month" || field.name == "count" ? [50, 40] : [100, 30]}
              maxConstraints={field.name == "month" || field.name == "count" ? [120, 40] : [800, 80]}
              onResize={ (e, data) => handleResize(field.id, data.size)}
              onResizeStart={() => setIsResizing(true)}
              onResizeStop={() => {setIsResizing(false); handleClick(field.id)}}
              onClick={(e) => handleClick(field.id)}
            >
              <TextField 
                variant="outlined"
                value={handleVale(item, field)}
                label = {'' || field.dataLabel}
                size="small"
                fullWidth
                sx={{ 
                  input: {
                    cursor: "move", 
                    fontSize: `${width / maxWidth * (item && item.fontSize && item.id === field.id ? (22 + (item.fontSize - 11)) : (22 + (field.fontSize - 11)))}px`, 
                    p: '2px', 
                    px: '4px'
                  }, 
                }}
                InputProps={{ readOnly: true }}
                onClick={(e) => {
                  if(field) 
                    handleProperty(true, field);
                }}
              />
            </ResizableBox>
          </Field>
        ))}
      </PDF>
    </div>
  );
}


const TemplateEdit = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { id, name } = useParams();
  const [numPages, setNumPages] = useState(null);
  const width = useWindowWidth();
  const [fields, setFields] = useState([]);
  const { mutate: CreateTemplate, isLoading: isCreating } = useCreateTemplate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [currentItem, setCurrentItem] = useState(null);
  const [oldWidth, setOldWidth] = useState(0);
  const [showProp, setShowProp] = useState(false);
  const [item, setItem] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [state, setState] = useState('private');
  const [teams, setTeams] = useState([]);

  const handleDrop = (item, pageNumber, x, y) => {
    setFields([
      ...fields, 
      {
        id: fields.length > 0 ? fields[fields.length - 1].id + 1 : 0, 
        name: item.name, 
        value: item.name, 
        pageNumber: pageNumber, 
        left: x, 
        top: y,
        fontSize: 11,
        dataLabel: item.name == "text" || item.name == "date" || item.name == "time" ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase() : "",
        width: item.name == "month" || item.name == "count" ? 100 : 200,
      }
    ]);
    setCurrentItem({id: fields.length > 0 ? fields[fields.length - 1].id + 1 : 0, name: item.name, pageNumber: pageNumber, left: x, top: y});
  }

  const moveField = (item, x, y) => {
    setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? {...field, left: x, top: y} : field
    ));
    setCurrentItem(item);
  }

  useEffect(() => {
    setFields((prevFields) => 
      prevFields.map(field => {
        return  {
          ...field, 
          left: Math.min( width > 600 ? width-485 : width - 40, 3000)/oldWidth * field.left, 
          top: Math.min( width > 600 ? width-485 : width - 40, 3000)/oldWidth * field.top
        };
      }
    ));
    setOldWidth(Math.min( width > 600 ? width-485 : width - 40, 3000));

  }, [width]);

  useEffect(() => {
    setOldWidth(Math.min( width > 600 ? width-485 : width - 40, 3000));
  }, []);

  const handleKeyDown = (event) => {
    if(event.key == 'Delete') {
      if(currentItem != null) {
        const newItems = fields.filter((field) => field.id != currentItem.id);
        setFields(newItems);
        setCurrentItem(newItems[newItems.length - 1]);
      }
    }
  }

  const handleProperty = async (state, item) => {
    setShowProp(state);
    await setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? {...field, fontSize: item.fontSize, value: item.value, dataLabel: item.dataLabel,} : field
    ));
    state == true ? setItem(item) : setItem(null);
  }

  const deleteItem = (item) => {
    setShowProp(false);
    const newItems = fields.filter((field) => field.id != item.id);
    setFields(newItems);
    setItem(null);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fields, currentItem]);

  const url = `${BASE_URL}/${id}.pdf`;
  pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const handleOpenModal = () => {
    setCreateModal(true);
  }

  const handleCloseModal = () => {
    setCreateModal(false);
  }

  const createTemplate = () => {
    const targetRect = document.getElementById('pdfContainer').getBoundingClientRect();
    console.log("creating...");
    CreateTemplate({ 
      id: id, 
      tempData: { 
        name: name, 
        state: state,
        teams: teams.map(item => item.value),
        fields: fields.map((field) => ({...field, left: field.left / targetRect.width, top: field.top / targetRect.height 
      }))} 
    }, {
      onSuccess: () => {
        handleCloseModal();
        console.log("Success...");
        navigate("/templates");
      },
      onError: (error) => {
        showErrorToast(error.response.data.message);
        handleCloseModal();
      }
    });
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <EditDrawer 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle} 
        showProp={showProp}
        handleProperty={handleProperty}
        item={item}
        setItem={setItem}
        deleteItem={deleteItem}
        setFields={setFields}
      />
      <CreateTemplateModal 
        open={createModal}
        handleClose={handleCloseModal}
        handleAction={createTemplate}
        loading={isCreating}
        state={state}
        setState={setState}
        teams={teams}
        setTeams={setTeams}
      />
      <DashboardHeader handleDrawerToggle={handleDrawerToggle} width={360} />
      <TemplateEditWrapper>
        <div className="inner-content">
          <Stack spacing={1}>
            <Stack direction="row" sx={{ justifyContent: "end" }} spacing={2} >
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: colors.themeBlue, 
                  fontFamily: fonts.medium, 
                  textTransform: "none",
                }} 
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/templates")}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: colors.themeBlue, 
                  fontFamily: fonts.medium, 
                  textTransform: "none",
                }} 
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenModal}
              >
                {isCreating ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: colors.white }}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </Stack>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess} >
              {Array.from(new Array(numPages), (el, index) => (
                <DroppablePage
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  onDrop={handleDrop}
                  width={Math.min( width > 600 ? width-485 : width - 40, 3000)}
                  fields={fields.filter((field) => field.pageNumber === index + 1)}
                  moveField={moveField}
                  setFields={setFields}
                  handleProperty={handleProperty}
                  item={item}
                />
              ))}
            </Document>
          </Stack>
        </div>
      </TemplateEditWrapper>
    </DndProvider>
  );
}

const TemplateEditWrapper = styled.div`
  margin-left: 360px;
  margin-top: 88px;
  background-color: ${colors.background};
  min-height: calc(100vh - 88px);

  .inner-content {
    padding: 78px 62px;
  }
  @media screen and (max-width: 600px) {
    margin-left: 0;
    margin-top: 64px;

    .inner-content {
      padding: 48px 20px;
    }
  }
`;

const PDF = styled.div`
  margin-top: 10px;
  justify-content: center;
  display: flex;
`;

export default TemplateEdit;