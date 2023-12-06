import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { colors, fonts } from "../../utils/theme";
import Sign from "../../assets/images/sign.svg";
import EastRoundedIcon from "@mui/icons-material/EastRounded";

const NotFound = () => {
  return (
    <Layout>
      <Wrapper>
        <Grid container sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            lg={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="image-container">
              <img src={Sign} alt="ai-bot" />
            </div>
          </Grid>
          <Grid
            item
            lg={4}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "flex-start", sm: "center" },
            }}
          >
            <div className="error-wrap">
              <h2>404</h2>
              <h4>Looks like you are lost</h4>
              <p>The page you are looking for is not available!</p>
              <Link to="/">
                <button>
                  Go to home
                  <EastRoundedIcon />
                </button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </Wrapper>
    </Layout>
  );
};
export default NotFound;

const Wrapper = styled.div`
  padding-top: 86px;
  width: 100%;
  height: 100vh;

  .image-container {
    img {
      margin-left: 72px;
    }
  }

  .error-wrap {
    h2 {
      font-size: 124px;
      font-family: "Barlow", sans-serif;
      color: ${colors.themeBlue};
    }

    h4 {
      font-size: 24px;
      font-family: ${fonts.regular};
      color: ${colors.foreBlack};
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      font-size: 16px;
      font-family: ${fonts.regular};
      color: ${colors.foreBlack};
      opacity: 0.8;
    }
    button {
      border: none;
      outline: none;
      margin-top: 24px;
      background-color: transparent;
      color: ${colors.themeBlue};
      font-family: ${fonts.regular};
      display: flex;
      align-items: center;
      font-size: 16px;
      svg {
        margin-left: 8px;
        font-size: 18px;
        transition: transform 0.2s ease;
      }
      &:hover {
        svg {
          transform: translateX(8px);
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    padding-top: 64px;
    .image-container {
      display: flex;
      flex-direction: column;
      img {
        width: 232.5px;
        height: 169px;
        margin-inline: auto;
      }
    }
    .error-wrap {
      text-align: center;
      h2 {
        font-size: 72px;
      }
      h4 {
        font-size: 16px;
        margin-top: 16px;
        margin-bottom: 8px;
      }
      p {
        font-size: 14px;
      }

      button {
        margin-inline: auto;
      }
    }
  }
`;
