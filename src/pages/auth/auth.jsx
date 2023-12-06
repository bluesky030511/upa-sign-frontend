import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { Navigate, Outlet } from "react-router-dom";

import Layout from "../../components/layout";
import { colors, fonts } from "../../utils/theme";
import Office from "../../assets/images/office-bordered.jpg";
import { useUI } from "../../context/ui.context";

const Auth = () => {
  const { user } = useUI();

  if (user && !user["loggedIn"]) {
    return (
      <Layout>
        <LoginContainer>
          <Grid
            container
            columnSpacing={{ sm: 6 }}
            sx={{ height: "100%", minHeight: "calc(100vh - 85px)" }}
          >
            <Grid
              item
              lg={6}
              xs={12}
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
              }}
            >
              <div className="image-container">
                <img src={Office} alt="office" />
              </div>
            </Grid>
            <Grid
              item
              lg={6}
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: { xs: "flex-start", sm: "center" },
                alignItems: { sm: "center" },
              }}
            >
              <Outlet />
            </Grid>
          </Grid>
        </LoginContainer>
      </Layout>
    );
  } else {
    return (
      <Navigate to={user.role === "AGENT" ? "/documents" : "/templates"} />
    );
  }
};
export default Auth;

const LoginContainer = styled.div`
  padding-top: 85px;
  width: 100%;
  min-height: 100vh;

  .image-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    h2 {
      font-family: ${fonts.semibold};
      font-style: italic;
      font-size: 49px;
      color: ${colors.themeBlue};
      max-width: 431px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }

  .input-container {
    max-width: 357px;
    .login-actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-block: 10px 30px;
      .checkbox-container {
        display: flex;
        align-items: center;
      }
      a {
        font-family: ${fonts.medium};
        color: ${colors.foreBlack};
        font-size: 12px;
        transition: color 0.2s ease-in-out;
        &:hover {
          color: ${colors.themeBlue};
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    height: auto;
    padding-top: 24px;
    margin-top: 64px;
    .image-container {
      padding-top: 0;
      display: flex;
      flex-direction: column;
      h2 {
        font-size: 24px;
        max-width: 211px;
      }
      img {
        width: 232.5px;
        height: 169px;
        margin-inline: auto;
      }
    }
  }
`;
