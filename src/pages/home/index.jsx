import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { colors, fonts } from "../../utils/theme";
import HeroBackground from "../../assets/images/hero-background.png";
import Illustration from "../../assets/images/flow_Trim_cropped.mp4";
import ComputerSignature from "../../assets/images/computer-signature-x.svg";
import Customize from "../../assets/images/customize.png";
import Verified from "../../assets/images/verified.png";
import Workflow from "../../assets/images/workflow.png";
import PrimaryButton from "../../components/buttons/primary-button";
import LeftQuote from "../../assets/images/quote.svg";
import ProfileAvatar from "../../assets/images/profile.png";
import ProfileFemaleAvatar from "../../assets/images/profile_female.png";
import Footer from "../../components/footer";
import { PricingLink, getRem } from "../../utils/helper";
import { PLAN_KEYS } from "../../utils/variables";

const features = [
  {
    id: 0,
    title: "Customization",
    description:
      "Customize the signing experience to reflect your brand identity, including adding logos, colors, and personalized email templates, creating a consistent and professional impression.",
    icon: Customize,
    placement: "flex-start",
  },
  {
    id: 1,
    title: "Security",
    description:
      "Rest assured that your sensitive information is protected with our robust security measures, including advanced encryption and compliance with industry-standard security protocols.",
    icon: Verified,
    placement: "center",
  },
  {
    id: 2,
    title: "Workflow",
    description:
      "Gain control over your workflow with automated reminders, notifications, and document status tracking, ensuring nothing falls through the cracks.",
    icon: Workflow,
    placement: "flex-end",
  },
];

const testimonials = [
  {
    id: 0,
    name: "Emily Johnson",
    review:
      "I've been using this e-signature software for my real estate business, and it has been a game-changer! It saves me so much time and hassle, and my clients love the convenience of signing documents electronically. Highly recommended!",
    gender: "FEMALE",
  },
  {
    id: 1,
    name: "Michael Anderson",
    review:
      "As a legal professional, I rely on efficient and secure document signing. This e-signature software has exceeded my expectations. The interface is intuitive, the audit trails provide peace of mind, and the customer support team has been outstanding. A must-have tool for any law firm!",
    gender: "MALE",
  },
  {
    id: 2,
    name: "Olivia Roberts",
    review:
      "I run a small business, and this e-signature software has been a lifesaver. It's incredibly user-friendly, and the ability to customize the signing experience with our branding has made a positive impact on our professional image. I can't imagine going back to manual paperwork!",
    gender: "FEMALE",
  },
  {
    id: 3,
    name: "Ethan Thompson",
    review:
      "I've tried several e-signature solutions, and this software stands out from the rest. The integration capabilities with other business tools have streamlined our workflow, and the pricing plans are flexible and affordable. It has truly transformed the way we handle contracts and agreements",
    gender: "MALE",
  },
  {
    id: 4,
    name: "Ava Mitchell",
    review:
      "I was initially hesitant about adopting e-signatures, but this software made the transition seamless. The security measures in place, including encryption and tamper-proof audit trails, gave me confidence in the process. It's a time-saving tool that I now recommend to my colleagues.",
    gender: "FEMALE",
  },
];

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 2560, min: 1921 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 1920, min: 1025 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.play();
  }, []);
  return (
    <Layout full>
      <HomeWrapper>
        {/* Hero Section */}
        <section
          className="hero"
          id="home"
          style={{
            backgroundImage: `url(${HeroBackground})`,
          }}
        >
          <div className="content-container">
            <Grid container sx={{ height: "100%" }}>
              <Grid item lg={6} xs={12}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h1>Sign, Paperless.</h1>
                    <h5>
                      A Complete Electronic Signature Solution for Seamless,
                      Secure Documentation.
                    </h5>
                    <div className="btn-wrap">
                      <PricingLink pricingKey={PLAN_KEYS.free}>
                        <PrimaryButton
                          sx={{
                            borderRadius: `${getRem(10)}`,
                            textTransform: "none",
                            py: { xs: 1, sm: "12px" },
                            width: `${getRem(124)}`,
                            marginTop: {
                              xs: `${getRem(8)}`,
                              sm: `${getRem(24)}`,
                            },
                          }}
                        >
                          Try for Free
                        </PrimaryButton>
                      </PricingLink>
                    </div>
                  </div>
                </Box>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                  }}
                >
                  <div className="hero-image">
                    <video ref={videoRef} autoPlay loop muted>
                      <source src={Illustration} />
                    </video>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </div>
        </section>
        {/* About Section */}
        <div id="about"></div>
        <div id="about-drawer"></div>
        <section className="about">
          <div className="about-content">
            <Grid container spacing={{ xs: 4 }}>
              <Grid item lg={6} xs={12}>
                <Box
                  sx={{
                    display: { xs: "flex" },
                    justifyContent: { xs: "center" },
                  }}
                >
                  <div className="about-image">
                    <img src={ComputerSignature} alt="computer-signature" />
                  </div>
                </Box>
              </Grid>
              <Grid
                item
                lg={6}
                xs={12}
                sx={{
                  alignSelf: "center",
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <div>
                  <h6>Why use UPA Sign?</h6>
                  <h4>Streamline Your Signing Process</h4>
                  <p>
                    Accelerate your business operations and enhance efficiency
                    with our cutting-edge e-signature (aka e-sign) software. Say
                    goodbye to time-consuming paperwork and embrace the
                    convenience of secure and legally binding electronic
                    signatures.
                  </p>
                  <div className="btn-wrap">
                    <Link to="/auth/register">
                      <PrimaryButton
                        sx={{
                          borderRadius: `${getRem(10)}`,
                          textTransform: "none",
                          py: { xs: 1, sm: "12px" },
                          width: `${getRem(144)}`,
                        }}
                      >
                        Register Now
                      </PrimaryButton>
                    </Link>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>
        {/* Feature Section */}
        <section className="feature">
          <Grid container spacing={{ xs: 4 }}>
            {features.map((feature, index) => (
              <Grid
                item
                lg={4}
                xs={12}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: feature.placement },
                }}
              >
                <div className="feature-card">
                  <img src={feature.icon} alt={feature.title} />
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </Grid>
            ))}
          </Grid>
        </section>
        {/* Get Started Section */}
        <section className="get-started">
          <div className="get-started-content">
            <h3>Unlock the power of UPA Sign</h3>
            <p>
              Try out our e-signature software for free today and experience the
              transformative benefits firsthand.
            </p>
            <div className="btn-wrap">
              <PricingLink pricingKey={PLAN_KEYS.free}>
                <PrimaryButton
                  sx={{
                    borderRadius: `${getRem(10)}`,
                    textTransform: "none",
                    py: { xs: 1, sm: "12px" },
                    width: `${getRem(156)}`,
                  }}
                >
                  Try for Free
                </PrimaryButton>
              </PricingLink>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="testimonials">
          <div className="title-wrap">
            <h4>Testimonials</h4>
            <h3>Explore Feedback from Our Users</h3>
          </div>
          <Carousel
            responsive={responsive}
            infinite={true}
            showDots={true}
            containerClass="carousel-container"
            autoPlay={true}
            autoPlaySpeed={3000}
          >
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="content">
                  <div className="quote-wrap">
                    <img src={LeftQuote} alt="left-quote" />
                  </div>
                  <div className="indicator right"></div>
                  <div className="indicator left"></div>
                  <div className="review-description">
                    <Rating value={5} readOnly size="small" />
                    <p>{testimonial.review}</p>
                    <Avatar
                      alt={testimonial.name}
                      src={
                        testimonial.gender
                          ? testimonial.gender === "MALE"
                            ? ProfileAvatar
                            : ProfileFemaleAvatar
                          : ProfileAvatar
                      }
                      sx={{
                        width: { xs: 48, sm: 66 },
                        height: { xs: 48, sm: 66 },
                      }}
                    />
                    <h4>{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      </HomeWrapper>
      <Footer />
    </Layout>
  );
};
export default Home;

const HomeWrapper = styled.div`
  width: 100%;

  section.hero {
    height: 100vh;
    background-size: 100% 100%;
    background-position: bottom;
    background-repeat: no-repeat;
    overflow: hidden;
    .content-container {
      height: 100%;
      padding-inline: 8.61%;
      margin-inline: auto;
      max-width: 1536px;

      h1 {
        font-family: ${fonts.semibold};
        font-size: ${getRem(56)};
        color: ${colors.black};
        max-width: ${getRem(431)};
        line-height: ${getRem(64)};
      }
      h5 {
        margin-block: ${getRem(24)};
        font-family: ${fonts.regular};
        color: ${colors.mediumBlack};
        font-size: ${getRem(16)};
        max-width: ${getRem(528)};
        line-height: ${getRem(24)};
      }
      .hero-image {
        width: 100%;
        height: auto;

        video {
          width: 100%;
          height: 100%;
          max-width: ${getRem(602)};
          max-height: ${getRem(402)};
          border-radius: 6px;
          pointer-events: none;
        }
      }
    }

    @media screen and (max-width: 600px) {
      height: calc(100vh - 118px);
      .content-container {
        padding-inline: 20px;

        h1 {
          font-size: ${getRem(32)};
          line-height: ${getRem(48)};
        }
        h5 {
          margin-block: ${getRem(12)};
          font-size: ${getRem(14)};
        }
        .hero-image {
          margin-top: ${getRem(12)};
          width: 100%;
          height: 100%;

          video {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  section.about {
    background-color: ${colors.dimBlue};
    padding-block: 127px;
    .about-content {
      padding-inline: 8.61%;
      margin-inline: auto;
      max-width: 1536px;
      .about-image {
        width: 100%;
        height: auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
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
      p {
        font-family: ${fonts.regular};
        font-size: ${getRem(20)};
        line-height: ${getRem(28)};
        color: ${colors.foreBlack};
        max-width: 570px;
        span {
          color: ${colors.themeBlue};
        }
      }
      .btn-wrap {
        margin-top: ${getRem(48)};
      }
    }

    @media screen and (max-width: 600px) {
      padding-block: 48px;
      .about-content {
        padding-inline: 20px;
        .about-image {
          width: 294px;
          height: 217.5px;
        }
        h4 {
          font-size: 24px;
          line-height: ${getRem(32)};
          text-align: center;
        }
        h6 {
          font-size: ${getRem(12)};
          text-align: center;
        }
        p {
          font-size: 14px;
          line-height: ${getRem(20)};
          max-width: unset;
          text-align: center;
        }
        .btn-wrap {
          display: flex;
          justify-content: center;
          margin-top: ${getRem(24)};
        }
      }
    }
  }
  section.feature {
    padding-inline: 8.61%;
    padding-block: 124px 143px;
    margin-inline: auto;
    max-width: 1536px;

    .feature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 372px;
      img {
        width: 64px;
        height: auto;
      }
      h4 {
        font-family: ${fonts.semibold};
        font-size: ${getRem(30)};
        color: ${colors.black};
        margin-top: ${getRem(20)};
        margin-bottom: ${getRem(24)};
      }
      p {
        font-family: ${fonts.regular};
        font-size: ${getRem(16)};
        line-height: ${getRem(24)};
        color: ${colors.black};
      }
    }
    @media screen and (max-width: 600px) {
      padding-inline: 20px;
      padding-block: 48px 32px;

      .feature-card {
        h4 {
          font-size: 20px;
        }
        p {
          font-size: 14px;
          max-width: 250px;
        }
      }
    }
  }
  section.get-started {
    background-color: ${colors.dimBlue};
    padding-block: 93px;
    .get-started-content {
      padding-inline: 8.61%;
      max-width: 1536px;
      margin-inline: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      h3 {
        font-family: ${fonts.semibold};
        font-size: ${getRem(36)};
        color: ${colors.black};
      }
      p {
        margin-top: ${getRem(32)};
        margin-bottom: ${getRem(48)};
        font-family: ${fonts.regular};
        font-size: ${getRem(20)};
        line-height: ${getRem(28)};
        color: ${colors.foreBlack};
        text-align: center;
        max-width: ${getRem(512)};
      }
      div.btn-wrap {
        width: 209px;
      }
    }
    @media screen and (max-width: 600px) {
      padding-block: 48px;
      .get-started-content {
        padding-inline: 20px;
        h3 {
          font-size: 18px;
          max-width: 269px;
        }
        p {
          margin-top: ${getRem(16)};
          margin-bottom: ${getRem(24)};
          font-size: ${getRem(14)};
          line-height: ${getRem(20)};
        }
        div.btn-wrap {
          width: 172px;
          margin-top: 18px;
        }
      }
    }
  }
  section.testimonials {
    padding-block: 95px;

    .carousel-container {
      margin-top: 82px;
      padding-bottom: 82px;
      max-width: 1536px;
      margin-inline: auto;
      .testimonial-card {
        height: 364px;
        width: 336px;
        margin-inline: auto;
        .content {
          width: 100%;
          height: 100%;
          background-color: ${colors.white};
          box-shadow: 0px 4px 45px -8px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;

          .quote-wrap {
            position: absolute;
            left: 0;
            top: 0;
          }
          .indicator {
            position: absolute;
            width: 6px;
            height: 36px;
            background-color: ${colors.themeBlue};
          }
          .indicator.right {
            top: 64px;
            right: 0px;
          }
          .indicator.left {
            bottom: 72px;
            left: 0px;
          }
          .review-description {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 74px 18px 18px;
            text-align: center;
            p {
              font-family: ${fonts.regular};
              font-size: 13px;
              color: ${colors.black};
              margin: 12px 0px 23px;
              flex-grow: 1;
            }
            h4 {
              font-family: ${fonts.semibold};
              font-size: 16px;
              color: ${colors.themeBlue};
              margin-top: 12px;
            }
            h6 {
              font-family: ${fonts.semibold};
              color: ${colors.black};
              opacity: 0.7;
              margin-top: 3px;
            }
          }
        }
      }
      .react-multi-carousel-dot-list {
        .react-multi-carousel-dot {
          button {
            background: ${colors.gray};
            border-width: 0;
          }
        }
        .react-multi-carousel-dot--active {
          button {
            background: ${colors.themeBlue};
          }
        }
      }
      .react-multiple-carousel__arrow {
        background: ${colors.themeBlue};
        min-width: 37px;
        min-height: 37px;
        &:before {
          font-size: 14px;
        }
      }
      .react-multiple-carousel__arrow--right {
        right: calc(1% + 1px);
      }
      .react-multiple-carousel__arrow--left {
        left: calc(1% + 1px);
      }
    }

    @media screen and (max-width: 600px) {
      padding-block: 48px;
      .carousel-container {
        margin-top: 40px;
        padding-bottom: 48px;
        .testimonial-card {
          height: 327.6px;
          width: 302.4px;
          .content {
            .quote-wrap {
              img {
                width: 96px;
              }
            }
            .indicator.right {
              top: 48px;
            }
            .indicator.left {
              bottom: 64px;
            }
            .review-description {
              padding-top: 56px;
            }
          }
        }
        .react-multiple-carousel__arrow {
          display: none;
        }
      }
    }
  }

  .title-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 34px;
    h4 {
      font-family: ${fonts.medium};
      color: ${colors.themeBlue};
    }
    h3 {
      font-family: ${fonts.semibold};
      color: ${colors.black};
      margin-top: 4px;
      position: relative;
      text-align: center;
      &:after {
        position: absolute;
        content: "";
        width: 42px;
        height: 3px;
        background-color: ${colors.themeBlue};
        border-radius: 2px;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  @media screen and (max-width: 600px) {
    margin-top: 64px;
    .title-wrap {
      font-size: 20px;

      h3 {
        &:after {
          bottom: -8px;
        }
      }
    }
  }
`;
