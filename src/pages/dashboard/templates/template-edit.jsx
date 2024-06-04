import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useWindowWidth } from '@wojtekmaj/react-hooks';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { Link, useLocation, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { API_ENDPOINTS, BASE_URL } from "../../../utils/variables";
import { useCreateTemplate } from "../../../hooks/data-hook";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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


import DashboardHeader from "../../../components/dashboard/header";
import { colors, fonts } from "../../../utils/theme";
import EditDrawer from "./layout";

const Field = ({ id, left, top, children }) => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SIGN_FIELD',
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }));

  const [, drop] = useDrop({
    accept: 'SIGN_FIELD',
    drop: (item, monitor) => {
      const delta = monitor.getDropResult();
    },
  });

  useEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, [children]);

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      style={{
        position: 'absolute',
        left: `${left - dimensions.width/2}px`,
        top: `${top - dimensions.height/2}px`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children}
    </div>
  );
}

const DroppablePage = ({ pageNumber, onDrop, width, fields, moveField }) => {
  const [, drop] = useDrop({
    accept: 'SIGN_FIELD',
    drop: (item, monitor) => {
      if(!monitor.didDrop()) {
        const clientOffset = monitor.getClientOffset();
        if(clientOffset) {
          const targetRect = document.getElementById('pdfContainer').getBoundingClientRect();
          const x = clientOffset.x - targetRect.left;
          const y = clientOffset.y - targetRect.top - (targetRect.height + 10) * (pageNumber - 1);
          if(fields.findIndex(field => field.id == item.id) != -1)
            moveField(item, x, y);
          else
            onDrop(item, pageNumber, x, y);
        }
      }
    }
  });

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
            moveField={moveField}
          >
            {field.name}
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

  const handleDrop = (item, pageNumber, x, y) => {
    console.log("item: ", item, "clientOffset: ", x, y);
    setFields([...fields, {id: fields.length, name: item.name, pageNumber: pageNumber, left: x, top: y}]);
    console.log("fields: ", fields);
  }

  const moveField = (item, x, y) => {
    setFields((prevFields) => 
      prevFields.map(field => 
        field.id === item.id ? {...field, left: x, top: y} : field
    ));
    console.log("id: ", id, "x: ", x, "y: ", y);
  }

  const url = `${BASE_URL}/${id}.pdf`;
  pdfjs.GlobalWorkerOptions.workerSrc =  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

  console.log("id: ", id);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const createTemplate = () => () => {
    const targetRect = document.getElementById('pdfContainer').getBoundingClientRect();
    console.log("width: ", targetRect.width, "height: ", targetRect.height);
    console.log("creating...");
    CreateTemplate({ id: id, tempData: { name: name, fields: fields.map((field) => ({...field, left: field.left / targetRect.width, top: field.top / targetRect.height }))} }, {
      onSuccess: () => {
        console.log("Success...");
        navigate("/templates");
      }
    });
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <EditDrawer 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle} 
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
                onClick={createTemplate()}
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
                  width={Math.min( width > 600 ? width-485 : width - 40, 1000)}
                  fields={fields.filter((field) => field.pageNumber === index + 1)}
                  moveField={moveField}
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