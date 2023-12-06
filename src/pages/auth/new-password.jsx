import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { colors, fonts } from "../../utils/theme";
import Sign from "../../assets/images/sign.svg";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";

const NewPassword = () => {
    return (
        <Layout>
            <Wrapper>
                <Grid container sx={{ height: "100%" }}>
                    <Grid
                        item
                        xs={8}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <div className="image-container">
                            <h2>Welcome to our UPA Sign</h2>
                            <img src={Sign} alt="ai-bot" />
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <FormWrapper className="input-container">
                            <h2>
                                New Password
                            </h2>
                            <PrimaryInput placeholder="New password" type="password" />
                            <PrimaryInput placeholder="New password" type="password" />
                            <Link to="/documents">
                                <PrimaryButton>Done</PrimaryButton>
                            </Link>
                        </FormWrapper>
                    </Grid>
                </Grid>
            </Wrapper>
        </Layout>
    );
};
export default NewPassword;

const Wrapper = styled.div`
  padding-top: 86px;
  width: 100%;
  height: 100vh;

  .image-container {
    h2 {
      font-family: ${fonts.semibold};
      font-style: italic;
      font-size: 49px;
      color: ${colors.themeBlue};
      max-width: 431px;
    }
    img {
      margin-left: 72px;
    }
  }
`;

const FormWrapper = styled.div`
    max-width: 357px;
    h2{
        font-size: 32px;
        font-family:${fonts.semibold};
        margin-bottom: 10px;
    }
    p{
        font-size: 14px;
        font-family: ${fonts.regular};
        margin-bottom: 30px;
        color:${colors.black}BD;
    }
    a{
        margin-top: 30px;
        display: block;
    }
`;
