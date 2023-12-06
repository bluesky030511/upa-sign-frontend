import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { getRem } from "../../utils/helper";
import DashboardLayout from "../../components/dashboard/layout";
import { colors, fonts } from "../../utils/theme";

const Tutorial = () => {
  return (
    <DashboardLayout>
      <TutorialWrapper>
        <h1>A Step-by-Step Guide on How UPA sign Works</h1>
        <p>
          Welcome to our comprehensive product tutorial video! In this
          step-by-step guide, we will walk you through how our innovative{" "}
          <Link to="/">UPA sign</Link> works and showcase its incredible
          features. Whether you're a new user or simply curious about the inner
          workings of our product, this tutorial video will provide you with a
          clear understanding of its functionality and demonstrate how it can
          benefit you. Join us as we delve into the intricacies of{" "}
          <Link to="/">UPA sign</Link>, empowering you to make the most of this
          cutting-edge solution.
        </p>
        <div className="sub-title">
          <h4 className="h4">Template Uploading</h4>
        </div>
        <div className="video-container">
          <video controls={true} autoPlay>
            <source src="https://ai-sign-tech-storage.s3.us-west-2.amazonaws.com/tutorial/upload-templete.mp4" />
          </video>
        </div>
        <div className="sub-title">
          <h4 className="h4">Creating And Sending Contract</h4>
        </div>
        <div className="video-container">
          <video controls={true}>
            <source src="https://ai-sign-tech-storage.s3.us-west-2.amazonaws.com/tutorial/create-and-sent-contract.mp4" />
          </video>
        </div>
        <div className="sub-title">
          <h4 className="h4">Siging Contract</h4>
        </div>
        <div className="video-container">
          <video controls={true}>
            <source src="https://ai-sign-tech-storage.s3.us-west-2.amazonaws.com/tutorial/sign-contract.mp4" />
          </video>
        </div>
        
      </TutorialWrapper>
    </DashboardLayout>
  );
};

export default Tutorial;

const TutorialWrapper = styled.div`
  h1 {
    font-family: ${fonts.semibold};
    font-size: ${getRem(32)};
    color: ${colors.black};
  }
  p {
    margin-top: ${getRem(12)};
    margin-bottom: ${getRem(24)};
    font-family: ${fonts.regular};
    font-size: ${getRem(16)};
    color: ${colors.foreBlack};
    line-height: ${getRem(24)};

    a {
      color: ${colors.themeBlue};

      &:hover {
        text-decoration: underline;
      }
    }
  }
  .video-container {
    width: 100%;
    display: flex;
    justify-content: center;
    width: 100%;
    video {
      max-height: ${getRem(540)};
      height: auto;
    }
  }
  .sub-title {
    width: 100%;
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-variant: petite-caps;
    h4 {
      font-family: ${fonts.medium};
      color: ${colors.themeBlue};
    }
  }

  @media screen and (max-width: 600px) {
    h1 {
      font-size: ${getRem(24)};
    }

    p {
      font-size: ${getRem(14)};
      line-height: ${getRem(20)};
    }
    .video-container {
      video {
        width: 80%;
      }
    }
    .sub-title {
      font-size: 18px;
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }
`;
