import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetFilePreview } from "../../../hooks/data-hook";

const Documents = () => {
  const { id } = useParams();
  const { isFetching, data } = useGetFilePreview(id);
  const previewRef = useRef(null);

  useEffect(() => {
    if (data) {
      const file = new Blob([data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      previewRef.current.src = fileUrl + "#toolbar=0";
    }
  }, [data]);
  return (
    <DocumentWrapper>
      <div className="pdf-page">
        {!isFetching && <iframe ref={previewRef} />}
      </div>
    </DocumentWrapper>
  );
};
export default Documents;

const DocumentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  .pdf-page {
    width: 487px;
    height: 80vh;
    border: none;
    margin-top: 40px;

    iframe {
      width: 487px;
      height: 80vh;
    }

    &:first-of-type {
      margin-top: 0;
    }
  }
`;
