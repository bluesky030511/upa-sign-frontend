import React, { useState } from "react";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../../components/buttons/primary-button";
import { useParams } from "react-router-dom";
import { useUI } from "../../context/ui.context";
import axios from "axios";
import { API_ENDPOINTS, BASE_URL } from "../../utils/variables";
import { useQuery } from "react-query";
import { Loader } from "../../shared-components/loader/loader";
import PageLoader from "../../shared-components/loader/page-loader";

const ContractDetail = () => {
  const { id, token } = useParams();
  const { setUser, removeUser } = useUI();
  const [file, setFile] = useState("");
  const [inviteId, setInviteId] = useState("");
  const getContract = async () => {
    const { data } = await axios.get(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };

  const { data, isFetching } = useQuery("contract-invite", getContract, {
    onSuccess: (data) => {
      removeUser();
      setUser({
        loggedIn: false,
        isAgent: false,
        isShadow: true,
      });
      setFile(data.invite[0].file);
      setInviteId(data.invite[0].id);
    },
  });

  return (
    <Container>
      {isFetching ? (
        <PageLoader>
          <Loader size={64} />
        </PageLoader>
      ) : (
        <div className="preview-box">
          <h3>Signed</h3>
          <p className="description">
            Congratulations, you have successfully signed the contract. You may
            now preview the contract, as well as review the contract disclaimer.
          </p>
          <div className="btn-wrap">
            <div className="btn-container">
              {data && (
                <a
                  href={`${BASE_URL}${API_ENDPOINTS.FILE}/f/view/preview.pdf?id=${file}`}
                >
                  <PrimaryButton
                    sx={{
                      bgcolor: colors.themeBlue,
                      boxShadow: "none",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: colors.themeBlue,
                        boxShadow: "none",
                      },
                    }}
                  >
                    Preview
                  </PrimaryButton>
                </a>
              )}
            </div>
            <div className="btn-container">
              <a
                href={`${BASE_URL}${API_ENDPOINTS.FILE}/f/view/disclaimer.pdf?inviteId=${inviteId}`}
              >
                <PrimaryButton
                  sx={{
                    bgcolor: colors.themeBlue,
                    boxShadow: "none",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: colors.themeBlue,
                      boxShadow: "none",
                    },
                  }}
                >
                  Disclaimer
                </PrimaryButton>
              </a>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ContractDetail;

const Container = styled.div`
  display: flex;
  justify-content: center;
  .preview-box {
    width: 500px;
    background-color: ${colors.white};
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: 0px 0px 15px -4px rgba(0, 0, 0, 0.25);
    padding: 34px 20px;
    h3 {
      font-family: ${fonts.semibold};
      font-size: 32px;
      color: ${colors.black};
    }
    p.description {
      font-family: ${fonts.regular};
      font-size: 15px;
      color: ${colors.black};
      text-align: center;
      margin-top: 27px;
    }
    .btn-wrap {
      margin-top: 24px;
      width: 70%;
      display: flex;
      margin-left: -24px;
      justify-content: center;

      .btn-container {
        width: 100%;
        margin-left: 24px;
      }
    }
  }
`;
