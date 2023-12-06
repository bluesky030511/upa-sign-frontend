import React, { useEffect } from "react";
import styled from "styled-components";

import Layout from "../../components/layout";
import { getRem, PricingLink } from "../../utils/helper";
import Banner from "../../components/banners/overlay-banner";
import { colors, fonts } from "../../utils/theme";
import { useState } from "react";
import PrimaryButton from "../../components/buttons/primary-button";
import CheckMark from "../../assets/images/checkmark.svg";
import Footer from "../../components/footer";
import Signature from "../../assets/images/bordered3.jpg";
import Dots from "../../assets/images/dots.svg";
import { Link, useLocation } from "react-router-dom";
import { PLAN_KEYS } from "../../utils/variables";

const STROKE_COLOR = "#19182324";

const PLANS = [
  {
    id: 0,
    name: "Basic",
    description:
      "Our Basic plan is perfect for individuals and small businesses looking to streamline their document signing process. With this plan, you'll have access to essential e-signature features, such as document preparation, sending for signature, and basic tracking. Enjoy the convenience of electronic signatures at an affordable price point.",
    base_price: 15,
    discounted_price: 10,
    feature_title: "Core features include",
    features: [
      "Document preparation and sending for signature",
      "Basic tracking and notifications",
      "Limited document storage",
      "Essential security measures",
      "Email support",
    ],
    isPopular: false,
    key: PLAN_KEYS.personal,
  },
  {
    id: 1,
    name: "Standard",
    description:
      "Upgrade to our Standard plan for enhanced functionality and flexibility. Ideal for growing businesses and teams, this plan offers advanced features, including advanced tracking and reminders, integrations with popular business tools, and expanded document storage capacity. Unlock the full potential of efficient document signing with added convenience.",
    base_price: 45,
    discounted_price: 25,
    feature_title: "All Personal Plan features, plus",
    features: [
      "All features of the Basic plan",
      "Advanced tracking and document status notifications",
      "Integrations with CRM and document management systems",
      "Increased document storage capacity",
      "Customizable branding options",
      "Priority email and chat support",
    ],
    isPopular: true,
    key: PLAN_KEYS.standard,
  },
  {
    id: 2,
    name: "Business Pro",
    description:
      "For enterprise-level deployments and businesses with complex signing workflows, our Business Pro plan provides comprehensive features to meet your advanced requirements. Enjoy advanced security measures, unlimited document",
    base_price: 65,
    discounted_price: 40,
    feature_title: "All Standard Plan features, plus",
    features: [
      "All features of the Standard plan",
      "Advanced security measures, including audit trails and two-factor authentication",
      "Unlimited document storage",
      "API access for seamless integrations with existing systems",
      "Dedicated customer support and priority response times",
      "Advanced customization options for branding and user experience",
    ],
    isPopular: false,
    key: PLAN_KEYS.business,
  },
];

const PlansPricing = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const { state } = useLocation();

  const handleTabChange = (value) => () => {
    setTabIndex(value);
  };

  useEffect(() => {
    if (state) {
      const target = window.document.getElementById(state.section);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <Layout full>
      <PlansWrapper>
        <Banner>Plans and Pricing</Banner>
        <div className="inner-wrapper" id="plans">
          <div className="title-panel">
            <h1>Compare e-signature plans & pricing</h1>
            <div className="switch">
              <button
                onClick={handleTabChange(0)}
                className={`tab saving ${tabIndex === 0 ? "active" : ""}`}
              >
                Annual
              </button>
              <button
                onClick={handleTabChange(1)}
                className={`tab ${tabIndex === 1 ? "active" : ""}`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="pricing-container">
            {PLANS.map((plan, index) => (
              <div
                key={index}
                className={`payment-card ${plan.isPopular ? "highlight" : ""}`}
              >
                <div className="meta-box">
                  {plan.isPopular ? (
                    <p className="meta-text">Most Popular</p>
                  ) : null}
                </div>
                <h4>{plan.name}</h4>
                <p className="desc">{plan.description}</p>
                <div className="price-wrap">
                  <data className=" money" value="10">
                    ${tabIndex === 0 ? plan.discounted_price : plan.base_price}
                  </data>
                  <p className="duration">/month</p>
                </div>
                {tabIndex === 0 && (
                  <p className="payment-desc">
                    ${plan.discounted_price * 12} billed anually
                  </p>
                )}
                <div className="btn-wrap">
                  <PricingLink pricingKey={plan.key}>
                    <PrimaryButton
                      sx={{ borderRadius: "4px", textTransform: "none" }}
                    >
                      Buy Now
                    </PrimaryButton>
                  </PricingLink>
                </div>

                <div className="features-wrap">
                  <p className="feature-title">{plan.feature_title}:</p>
                  <ul>
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="payment-card">
              <div className="meta-box">
                <img src={Dots} alt="dots" />
                <p className="meta-text off">Enhanced Plans</p>
              </div>
              <h3>Need more features for your team?</h3>
              <p className="contact">Call 1-855-944-3473</p>
              <p className="desc customized">
                Customize a pricing plan that scales to your business needs
              </p>

              <div className="btn-wrap">
                <Link to="/faqs" state={{ section: "contact" }}>
                  <PrimaryButton
                    sx={{
                      borderRadius: "4px",
                      textTransform: "none",
                      bgcolor: colors.darkBlack,
                    }}
                  >
                    Contact Sales
                  </PrimaryButton>
                </Link>
              </div>

              <div className="features-wrap">
                <p className="feature-title">Additional benefits include:</p>
                <ul>
                  {[
                    "Manage data across accounts",
                    "24/7 live support",
                    "Identification and authentication",
                    "Address compliance obligations",
                    "Enhanced signer verification",
                    "Single sign-on (SS0)",
                    "Customize with integrations",
                  ].map((feature, i) => (
                    <li key={i} className="customized">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </PlansWrapper>
      <CTAWrapper>
        <div className="inner-container">
          <div>
            <h6>Affordable & Reliable</h6>
            <h4>Find the Perfect Plan</h4>
            <p>
              Choose the e-signature plan that aligns with your business needs
              and budget, and unlock the power of streamlined document signing,
              enhanced productivity, and improved collaboration. Whether you're
              an individual, small business, or enterprise, our range of plans
              ensures that you can find the perfect fit to revolutionize your
              document signing process.
            </p>
          </div>
          <figure>
            <img src={Signature} alt="checking" />
          </figure>
        </div>
      </CTAWrapper>
      <Footer />
    </Layout>
  );
};

export default PlansPricing;

const PlansWrapper = styled.section`
  padding-top: ${getRem(85)};

  .inner-wrapper {
    padding-inline: 8.61%;
    max-width: 1536px;
    margin-inline: auto;
    margin-block: ${getRem(88)};
    .title-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${getRem(8)};
      h1 {
        font-family: ${fonts.semibold};
        font-size: ${getRem(40)};
        color: ${colors.black};
      }

      .switch {
        width: ${getRem(220)};
        height: ${getRem(40)};
        border-radius: 20px;
        border: 2px solid #706d88;
        display: flex;
        background-color: #f4f4f6;

        .tab {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          outline: none;
          background-color: transparent;
          font-family: ${fonts.regular};
          font-size: ${getRem(15)};
          color: ${colors.foreBlack};
          transition: color 0.2s ease-in-out;
          position: relative;

          &.active {
            font-family: ${fonts.semibold};
            color: ${colors.black};
          }
          &.saving::after {
            content: "Save up to 44%";
            position: absolute;
            width: ${getRem(80)};
            height: 18px;
            border-radius: 2px;
            background-color: #068146;
            bottom: -12px;
            font-size: ${getRem(8)};
            font-family: ${fonts.semibold};
            color: ${colors.white};
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .pricing-container {
      display: flex;
      border-top: 1px solid;
      border-color: ${STROKE_COLOR};
      margin-top: ${getRem(36)};

      .payment-card {
        width: 100%;
        border-right: 1px solid;
        border-color: ${STROKE_COLOR};
        padding: ${getRem(24)} ${getRem(20)};

        &.highlight {
          background-color: #f0f4ff;
        }

        &:first-of-type {
          padding-left: 0;
        }

        &:last-of-type {
          border-right-width: 0;
        }

        .meta-box {
          height: ${getRem(55)};
          display: flex;
          align-items: center;
          img {
            margin-right: ${getRem(8)};
          }

          p.meta-text {
            font-family: ${fonts.semibold};
            font-size: ${getRem(11)};
            color: ${colors.themeBlue};
            text-transform: uppercase;
            line-height: ${getRem(16)};

            &.off {
              color: #63607c;
            }
          }
        }

        h4 {
          font-family: ${fonts.semibold};
          font-size: ${getRem(25)};
          color: ${colors.black};
          line-height: ${getRem(35)};
        }
        h3 {
          font-family: ${fonts.semibold};
          font-size: ${getRem(18)};
          color: ${colors.black};
          line-height: ${getRem(25)};
        }
        p.contact {
          margin-block: ${getRem(18)} ${getRem(12)};
          font-family: ${fonts.medium};
          font-size: ${getRem(14)};
          color: ${colors.themeBlue};
        }
        p.desc {
          height: ${getRem(232)};
          margin-top: ${getRem(8)};
          font-family: ${fonts.regular};
          font-size: ${getRem(12)};
          color: ${colors.darkBlack};
          line-height: ${getRem(20)};
          overflow: hidden;
          text-overflow: ellipsis;
          &.customized {
            height: auto;
            margin-bottom: ${getRem(38)};
          }
        }
        .price-wrap {
          display: flex;
          align-items: center;

          data.money {
            font-family: ${fonts.semibold};
            font-size: ${getRem(22)};
            line-height: ${getRem(32)};
            color: ${colors.black};
          }

          p.duration {
            margin-left: ${getRem(4)};
            font-size: ${getRem(14)};
            font-family: ${fonts.regular};
            color: ${colors.foreBlack};
          }
        }
        p.payment-desc {
          font-family: ${fonts.regular};
          font-size: ${getRem(13)};
          color: ${colors.mediumBlack};
          margin-top: ${getRem(6)};
        }
        .btn-wrap {
          margin-top: ${getRem(14)};
          width: 80%;
        }
        .features-wrap {
          margin-top: ${getRem(24)};
          p.feature-title {
            font-family: ${fonts.medium};
            font-size: ${getRem(13)};
            color: ${colors.darkBlack};
            margin-bottom: ${getRem(10)};
          }
          ul {
            padding-left: ${getRem(24)};
            li {
              list-style-image: url(${CheckMark});
              padding-block: ${getRem(8)};
              font-family: ${fonts.medium};
              font-size: ${getRem(12)};
              color: ${colors.darkBlack};
              text-decoration: underline;
              text-underline-offset: 2px;

              &.customized {
                text-decoration: none;
              }
            }
          }
        }
      }
    }

    .cta-container {
      padding-inline: 8.61%;
      background-color: #f2f2f2;
      width: 100%;

      .inner-container {
        max-width: 1536px;
        margin-inline: auto;
        padding-block: ${getRem(62)};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  @media screen and (max-width: 600px) {
    padding-top: ${getRem(79)};

    .inner-wrapper {
      padding-inline: ${getRem(20)};
      margin-top: ${getRem(42)};

      .title-panel {
        flex-direction: column;
        align-items: flex-end;
        h1 {
          font-size: ${getRem(24)};
          margin-bottom: ${getRem(12)};
        }
        .switch {
          width: ${getRem(220 * 0.8)};
          height: ${getRem(40 * 0.8)};
          .tab {
            font-size: ${getRem(12)};
            &.saving {
              &::after {
                width: ${getRem(64)};
                font-size: ${getRem(6)};
                bottom: -14px;
              }
            }
          }
        }
      }
      .pricing-container {
        flex-direction: column;

        .payment-card {
          padding-inline: ${getRem(12)};
          border: none;

          .meta-box {
            height: auto;
          }

          p.desc {
            height: auto;
            margin-bottom: ${getRem(8)};
          }
        }
      }
    }
  }
`;

const CTAWrapper = styled.div`
  background-color: #f2f2f2;
  width: 100%;

  .inner-container {
    padding-inline: 8.61%;
    max-width: 1536px;
    margin-inline: auto;
    padding-block: ${getRem(62)};
    display: flex;
    align-items: center;
    justify-content: space-between;
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
      max-width: ${getRem(622)};
      font-family: ${fonts.regular};
      font-size: ${getRem(16)};
      color: ${colors.black};
      line-height: ${getRem(24)};
    }
    figure {
      margin-left: ${getRem(80)};
      img {
        width: ${getRem(508)};
        height: auto;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .inner-container {
      padding-inline: ${getRem(20)};
      padding-block: ${getRem(32)};
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
      p {
        font-size: ${getRem(14)};
        line-height: ${getRem(20)};
      }
      figure {
        margin-left: 0;
        display: flex;
        justify-content: center;
        margin-bottom: ${getRem(12)};
        img {
          width: 80%;
        }
      }
    }
  }
`;
