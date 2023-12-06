import React from "react";
import styled from "styled-components";
import Empty from "../../assets/images/empty.png";
import { fonts } from "../../utils/theme";
import PrimaryButton from "../../components/buttons/primary-button";

const EmptyFeedback = ({ message, btnText, action }) => {
  return (
    <Figure>
      <img src={Empty} alt="data-not-found" />
      <h4>{message}</h4>
      {btnText && (
        <div className="btn-container">
          <PrimaryButton
            onClick={action}
            sx={{
              width: "max-content",
              px: { xs: 3, sm: 4 },
              fontSize: { xs: 12, sm: 15 },
            }}
          >
            {btnText}
          </PrimaryButton>
        </div>
      )}
    </Figure>
  );
};

export default EmptyFeedback;

const Figure = styled.figure`
  margin: 0;
  max-width: 428.75px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  h4 {
    text-align: center;
    font-family: ${fonts.semibold};
    font-size: 1.5rem;
    color: #c5c5c5;
    margin-top: 1rem;
  }
  .btn-container {
    margin-top: 1.25rem;
    width: max-content;
    margin-inline: auto;
  }

  @media screen and (max-width: 600px) {
    max-width: 274.4px;
    h4 {
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    .btn-container {
      margin-top: 0.75rem;
    }
  }
`;
