import React from "react";
import styled from "styled-components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

import { getRem } from "../../utils/helper";
import { colors, fonts } from "../../utils/theme";
import PrimaryButton from "../../components/buttons/primary-button";

const BlogCard = ({
  id,
  image,
  title,
  description,
  expandable,
  small,
  large,
}) => {
  console.log("ID => ", id);
  return (
    <BlogWrapper>
      {Boolean(image) && (
        <figure className={small ? "small" : large ? "large" : ""}>
          <img src={image} alt="blog" />
        </figure>
      )}
      <h6 className="blog-title">{title}</h6>
      <p className="blog-desc">{description}</p>
      {expandable ? (
        <Link to={`/blogs/${id}`} state={{ section: "blog" }}>
          <button className="expandable">
            Read More
            <ArrowForwardIcon
              sx={{ color: colors.themeBlue, ml: "6px", fontSize: 16 }}
            />
          </button>
        </Link>
      ) : (
        <Link to={`/blogs/${id}`} state={{ section: "blog" }}>
          <PrimaryButton
            sx={{
              width: 144,
              borderRadius: 1,
              fontSize: `${getRem(12)}`,
              bgcolor: "transparent",
              boxShadow: "none",
              border: "1px solid",
              borderColor: colors.themeBlue,
              color: colors.themeBlue,
              py: "6px",
              fontFamily: fonts.bold,
              "&:hover": {
                bgcolor: colors.themeBlue,
                color: colors.white,
              },
            }}
          >
            Read Article
          </PrimaryButton>
        </Link>
      )}
    </BlogWrapper>
  );
};

export default BlogCard;

const BlogWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  figure {
    width: 100%;
    margin-bottom: ${getRem(16)};

    &.small {
      img {
        max-height: ${getRem(197)};
      }
    }

    &.large {
      img {
        max-height: ${getRem(418)};
      }
    }

    img {
      width: 100%;
      height: auto;
      max-height: ${getRem(257)};
      border-radius: 12px;
    }
  }

  h6.blog-title {
    font-family: ${fonts.semibold};
    font-size: ${getRem(20)};
    color: #344767;
    line-height: ${getRem(28)};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: ${getRem(56)};
  }

  p.blog-desc {
    margin-block: ${getRem(8)} ${getRem(16)};
    font-family: ${fonts.regular};
    font-size: ${getRem(14)};
    line-height: ${getRem(21)};
    color: #67748e;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: ${getRem(63)};
  }

  button.expandable {
    background-color: transparent;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    font-family: ${fonts.regular};
    font-size: ${getRem(14)};
    color: ${colors.themeBlue};
    transition: transform 0.3s ease-in-out;

    &:hover {
      svg {
        transform: translateX(4px);
      }
    }
  }

  @media screen and (max-width: 600px) {
    figure {
      margin-bottom: ${getRem(8)};
      img {
        max-height: ${getRem(257 * 0.8)};
      }
    }
    p.blog-desc {
      margin-block: ${getRem(6)} ${getRem(12)};
    }
  }
`;
