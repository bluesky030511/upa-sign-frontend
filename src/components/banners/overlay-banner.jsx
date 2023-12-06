import React from "react";
import styled from "styled-components";
import BannerImage from "../../assets/images/signing-banner.png";
import { colors, fonts } from "../../utils/theme";
import { getRem } from "../../utils/helper";
const Banner = ({ children }) => {
  return (
    <BannerWrapper>
      <div className="overlay">
        <h1>{children}</h1>
      </div>
    </BannerWrapper>
  );
};

export default Banner;

const BannerWrapper = styled.div`
  width: 100%;
  height: ${getRem(588)};
  background-image: url(${BannerImage});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 12;

    h1 {
      font-family: ${fonts.semibold};
      font-size: ${getRem(56)};
      color: ${colors.white};
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(50, 96, 241, 0.54);
  }

  @media screen and (max-width: 600px) {
    height: ${getRem(240)};
    background-position: center;
    .overlay {
      h1 {
        font-size: ${getRem(40)};
      }
    }
  }
`;
