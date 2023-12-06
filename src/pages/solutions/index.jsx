import React from "react";
import styled from "styled-components";

import Layout from "../../components/layout";
import { getRem } from "../../utils/helper";
import Signature0 from "../../assets/images/bordered1.jpg";
import Signature1 from "../../assets/images/bordered0.jpg";
import { colors, fonts } from "../../utils/theme";
import Footer from "../../components/footer";
import Banner from "../../components/banners/overlay-banner";

const Solutions = () => {
  return (
    <Layout full>
      <SolutionsWrapper>
        <Banner>Solutions</Banner>
        <div className="blog-container">
          <div>
            <h6>Simplify & Accelerate</h6>
            <h4>Collaboration Made Easy</h4>
            <p className="blog-text">
              Streamline your document signing process with our advanced
              e-signature software. Our robust platform offers a wide range of
              solutions designed to simplify and accelerate your business
              operations. Say goodbye to the hassle of paper-based signatures
              and embrace the convenience of secure and legally binding
              electronic signatures. Our e-signature solution eliminates the
              need for printing, scanning, and manual paperwork. With just a few
              clicks, you can send documents for signature, track progress in
              real-time, and receive signed agreements promptly. Experience the
              convenience of streamlined workflows and accelerated turnaround
              times.
            </p>
          </div>
          <figure className="right">
            <img src={Signature0} alt="person-checking" />
          </figure>
        </div>
        <div className="blog-container spaced">
          <figure className="left">
            <img src={Signature1} alt="person-signing" />
          </figure>

          <div>
            <h6>Enhanced Security and Compliance</h6>
            <h4>Protection and Integration</h4>
            <p className="blog-text">
              Our e-signature software employs robust security measures,
              including advanced encryption, tamper-proof audit trails, and
              compliance with industry-standard security protocols. Rest assured
              that your documents and data are safe and meet legal and
              regulatory requirements. Integrate our e-signature software
              seamlessly with your existing business tools to enhance your
              workflow efficiency. Whether you use CRM systems, document
              management platforms, or cloud storage services, our software can
              be easily integrated, eliminating the need for manual data entry,
              and ensuring a smooth transition.
            </p>
          </div>
        </div>
      </SolutionsWrapper>
      <Footer />
    </Layout>
  );
};

export default Solutions;

const SolutionsWrapper = styled.section`
  padding-top: ${getRem(85)};
  margin-bottom: ${getRem(85)};

  .blog-container {
    padding-inline: 8.61%;
    max-width: 1536px;
    margin-inline: auto;
    display: flex;
    align-items: center;
    margin-top: ${getRem(88)};

    h4 {
      font-family: ${fonts.semibold};
      font-size: ${getRem(40)};
      line-height: ${getRem(48)};
      color: ${colors.black};
      margin-bottom: ${getRem(24)};
    }

    h6 {
      font-family: ${fonts.medium};
      font-size: ${getRem(16)};
      color: ${colors.themeBlue};
      margin-bottom: ${getRem(12)};
    }

    &.spaced {
      margin-top: ${getRem(120)};
    }

    .blog-text {
      font-family: ${fonts.regular};
      font-size: ${getRem(16)};
      line-height: ${getRem(24)};
      color: ${colors.foreBlack};
    }
    figure {
      margin: 0;

      img {
        width: 100%;
        height: 100%;
      }

      &.right {
        min-width: ${getRem(548)};
        height: ${getRem(490)};
        margin-left: ${getRem(122)};
      }

      &.left {
        min-width: ${getRem(548)};
        height: ${getRem(548)};
        margin-right: ${getRem(96)};
      }
    }
  }

  @media screen and (max-width: 600px) {
    padding-top: ${getRem(79)};

    .blog-container {
      margin-top: ${getRem(42)};
      padding-inline: ${getRem(20)};
      flex-direction: column-reverse;
      h4 {
        font-size: ${getRem(24)};
        line-height: ${getRem(32)};
        margin-bottom: ${getRem(8)};
      }
      h6 {
        font-size: ${getRem(12)};
        margin-bottom: ${getRem(4)};
      }
      .blog-text {
        font-size: ${getRem(14)};
        line-height: ${getRem(20)};
      }

      figure {
        margin-bottom: ${getRem(12)};
        &.right,
        &.left {
          margin-inline: 0;
          width: 80%;
          min-width: unset;
          min-height: unset;
          height: auto;
        }
      }
      &.spaced {
        flex-direction: column;
        margin-top: ${getRem(40)};
      }
    }
  }
`;
