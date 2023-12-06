import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import BrandLogo from "../assets/images/logo black upa-03.svg";
import { colors, fonts } from "../utils/theme";
import { useUI } from "../context/ui.context";
import { PricingLink } from "../utils/helper";
import { PLAN_KEYS } from "../utils/variables";
import { useToast } from "../context/toast.context";
import { useSubscribeToNewsletter } from "../hooks/user-hook";

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter email")
    .email("Please enter valid email"),
});

const Footer = () => {
  const { user } = useUI();
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate: SubscribeToNewsletter } = useSubscribeToNewsletter();

  const onSubmit = (values) => {
    SubscribeToNewsletter(values, {
      onSuccess: () => {
        showSuccessToast("Subscribed to our newsletter");
        reset();
      },
      onError: () => {
        showErrorToast("Can't subscribe you right now.");
      },
    });
  };
  return (
    <FooterWrapper>
      <div className="footer-container">
        <div className="footer-content">
          <div className="about">
            <img src={BrandLogo} width="144" alt="UPA Sign" />
            <p>
              Simplify your document signing process with our cutting-edge
              e-signature solution, empowering businesses to streamline
              operations and embrace the era of paperless efficiency
            </p>
          </div>
          <div className="footer-links-container">
            {/* Important Links */}
            <ul>
              <h4>Important Link</h4>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/solutions">Solutions</Link>
              </li>
              <li>
                <Link to="/plans-pricing" state={{ section: "plans" }}>
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link to="/faqs" state={{ section: "faqs" }}>
                  FAQ
                </Link>
              </li>
              {user.loggedIn ? (
                <li>
                  <Link
                    to={user.role === "AGENT" ? "/documents" : "/templates"}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/auth">Sign in</Link>
                  </li>
                  <li>
                    <Link to="/auth/register">Register</Link>
                  </li>
                  <li>
                    <PricingLink pricingKey={PLAN_KEYS.free}>
                      Try for free
                    </PricingLink>
                  </li>
                </>
              )}
            </ul>
            {/* Contact Info */}
            <ul>
              <h4>Contact Info</h4>
              <p className="info">
                <span className="info-label">Address: </span>
                803 Park Ave, Newtown, Pa 18940.
              </p>
              <p className="info">
                <span className="info-label">Email: </span>
                support@upasign.com
              </p>
            </ul>
            {/* Subscribe Newsletter */}
            <ul>
              <h4>Subscribe to Newsletter</h4>
              <div className="news-letter-container">
                <p>
                  Stay up-to-date with the latest industry trends, product
                  updates, and exclusive offers by subscribing to our newsletter
                  today.
                </p>
                <form
                  className="input-wrapper"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <input
                    {...register("email")}
                    placeholder="Send email address"
                  />
                  <button type="submit">
                    <SendIcon
                      sx={{
                        color: colors.white,
                        fontSize: 16,
                        transform: "rotate(-45deg)",
                      }}
                    />
                  </button>
                </form>
                <span className="error-text">
                  {errors.email && errors.email.message}
                </span>
              </div>
            </ul>
          </div>
        </div>
        <Divider
          sx={{ borderColor: "rgba(50,96,241,0.13)", borderBottomWidth: "2px" }}
        />
        <div className="social-info-wrapper">
          <div className="disclaimer-container">
            <p>Copyright © 2023 All rights reserved</p>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{
                borderColor: colors.mediumBlack,
                borderRightWidth: "2px",
                height: "19px",
                marginInline: "8px",
              }}
            />
            <Link to="/">UPA Sign</Link>
          </div>
          <div className="social-links-container">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle"
            >
              <LinkedInIcon sx={{ fontSize: "18px", color: colors.white }} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlinedIcon
                sx={{ fontSize: "30px", color: colors.themeBlue }}
              />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle"
            >
              <InstagramIcon sx={{ fontSize: "18px", color: colors.white }} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-circle"
            >
              <TwitterIcon sx={{ fontSize: "18px", color: colors.white }} />
            </a>
          </div>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  background-color: ${colors.translucentBlue};
  padding-block: 55px 22px;
  .footer-container {
    padding-inline: 8.61%;
    max-width: 1536px;
    margin-inline: auto;
    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: -48px;
      margin-bottom: 60px;

      .about {
        margin-top: 48px;

        p {
          max-width: 257px;
          font-family: ${fonts.regular};
          color: ${colors.black};
          font-size: 13px;
          margin-top: 10px;
        }
      }
      .footer-links-container {
        display: flex;
        flex-wrap: wrap;
        margin-left: -84px;
        margin-top: 48px;

        ul {
          list-style: none;
          margin-left: 84px;
          h4 {
            font-family: ${fonts.medium};
            color: ${colors.black};
            font-size: 18px;
            margin-bottom: 20px;
            position: relative;
            max-width: max-content;

            &:after {
              position: absolute;
              content: "";
              width: 100%;
              height: 3px;
              background-color: ${colors.themeBlue};
              border-radius: 2px;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          li {
            font-family: ${fonts.regular};
            font-size: 15px;
            color: ${colors.black};
            margin-top: 8px;
          }
          .info {
            font-family: ${fonts.regular};
            color: ${colors.black};
            font-size: 15px;
            max-width: 205px;
            margin-top: 8px;

            .info-label {
              font-family: ${fonts.medium};
            }
          }
          .news-letter-container {
            max-width: 257px;
            p {
              font-family: ${fonts.regular};
              color: ${colors.black};
              font-size: 13px;
            }
            .input-wrapper {
              margin-top: 20px;
              width: 100%;
              background-color: ${colors.white};
              border-radius: 17px;
              display: flex;
              align-items: center;
              overflow: hidden;
              input {
                flex-grow: 1;
                border: none;
                padding: 11px 0px 11px 20px;
                font-size: 11px;
                font-family: ${fonts.regular};
                color: ${colors.foreBlack};
                &::placeholder {
                  color: ${colors.fadeBlack};
                }
              }
              button {
                padding-inline: 21px;
                background-color: ${colors.themeBlue};
                border-radius: 17px;
                height: 100%;
                border: none;
                padding-block: 9px;
              }
            }
          }
        }
      }
    }
    .social-info-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      .disclaimer-container {
        display: flex;
        align-items: center;
        p {
          font-family: ${fonts.medium};
          font-size: 16px;
          color: ${colors.foreBlack};
        }
        a {
          font-family: ${fonts.semibold};
          color: ${colors.themeBlue};
          font-size: 16px;
        }
      }
    }
    .social-links-container {
      display: flex;
      align-items: center;
      a {
        margin-right: 16px;
        width: 28px;
        height: 28px;
        &:last-child {
          margin-right: 0;
        }
        &.icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${colors.themeBlue};
          border-radius: 50%;
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    padding-block: 48px 22px;
    .footer-container {
      padding-inline: 20px;

      .footer-content {
        margin-bottom: 24px;
        .footer-links-container {
          margin-top: 0;
          ul {
            margin-top: 32px;
            width: 100%;
            .news-letter-container {
              max-width: unset;
            }
          }
        }
      }
      .social-info-wrapper {
        margin-top: 16px;
        flex-direction: column;
        .disclaimer-container {
          p {
            font-size: 12px;
          }
          a {
            font-size: 12px;
          }
        }
      }
      .social-links-container {
        margin-top: 16px;
      }
    }
  }
`;
