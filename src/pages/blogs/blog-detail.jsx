import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";

import { BLOGS, BLOGSLISTING } from "../../data/blogs";
import Layout from "../../components/layout";
import { getRem } from "../../utils/helper";
import { colors, fonts } from "../../utils/theme";
import BlogCard from "../../components/cards/blog-card";
import { getRandomNumbersWithExclusion } from "../../utils/helper";

const BlogDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const blog = BLOGS[id];
  const currentIndex = blog["id"];
  const prevBlog =
    currentIndex - 1 >= 0 ? BLOGSLISTING[currentIndex - 1] : null;
  const nextBlog =
    currentIndex + 1 < BLOGSLISTING.length
      ? BLOGSLISTING[currentIndex + 1]
      : null;
  const randomNumber = getRandomNumbersWithExclusion(0, 8, currentIndex);

  useEffect(() => {
    if (state) {
      const target = window.document.getElementById(state.section);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentIndex]);
  if (Boolean(blog)) {
    return (
      <Layout>
        <BlogDetailWrapper>
          <div className="blog-content-container" id="blog">
            <figure className="title-fig">
              <img src={blog.image} alt={blog.title} />
            </figure>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="navigators">
              <div>
                {prevBlog && (
                  <Link
                    to={`/blogs/${prevBlog.slug}`}
                    state={{ section: "blog" }}
                  >
                    <button className="expandable prev">
                      <ArrowBackIcon
                        sx={{
                          color: colors.darkBlack,
                          mr: "6px",
                          fontSize: 16,
                        }}
                      />
                      Previous Post
                    </button>
                  </Link>
                )}
              </div>
              <div>
                {nextBlog && (
                  <Link
                    to={`/blogs/${nextBlog.slug}`}
                    state={{ section: "blog" }}
                  >
                    <button className="expandable next">
                      Next Post
                      <ArrowForwardIcon
                        sx={{
                          color: colors.darkBlack,
                          ml: "6px",
                          fontSize: 16,
                        }}
                      />
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <div className="recommendation">
              <h4 className="cta">Must Read</h4>
              <Grid
                container
                rowSpacing={{ xs: "32px" }}
                columnSpacing={{ sm: "24px" }}
              >
                <Grid item lg={6}>
                  <BlogCard
                    id={BLOGSLISTING[randomNumber[0]].slug}
                    image={BLOGSLISTING[randomNumber[0]].image}
                    title={BLOGSLISTING[randomNumber[0]].title}
                    description={BLOGSLISTING[randomNumber[0]].description}
                    small
                  />
                </Grid>
                <Grid item lg={6}>
                  <BlogCard
                    id={BLOGSLISTING[randomNumber[1]].slug}
                    image={BLOGSLISTING[randomNumber[1]].image}
                    title={BLOGSLISTING[randomNumber[1]].title}
                    description={BLOGSLISTING[randomNumber[1]].description}
                    small
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </BlogDetailWrapper>
      </Layout>
    );
  }
  return <Navigate to="/not-found" />;
};

export default BlogDetail;

const BlogDetailWrapper = styled.section`
  padding-top: ${getRem(85)};
  .blog-content-container {
    max-width: 960px;
    margin-inline: auto;
    background-color: ${colors.white};
    padding: ${getRem(85)} ${getRem(106)};
    display: flex;
    flex-direction: column;
    align-items: center;

    figure.title-fig {
      max-width: ${getRem(748)};
      margin-inline: auto;
      height: auto;
      text-align: center;
      margin-bottom: ${getRem(12)};

      img {
        width: 100%;
        max-height: ${getRem(485)};
        height: 100%;
        object-fit: contain;
      }
    }

    .blog-content {
      h1 {
        font-family: ${fonts.regular};
        font-size: ${getRem(40)};
        line-height: ${getRem(48)};
        color: ${colors.darkBlack};
        margin-bottom: ${getRem(10)};
      }
      h3 {
        font-family: ${fonts.semibold};
        font-size: ${getRem(30)};
        line-height: ${getRem(36)};
        color: ${colors.darkBlack};
        margin-bottom: ${getRem(20)};
      }
      h4 {
        font-family: ${fonts.bold};
        font-size: ${getRem(18)};
        line-height: ${getRem(24)};
        color: ${colors.darkBlack};
        margin-bottom: ${getRem(12)};
      }
      h6.meta {
        font-family: ${fonts.light};
        font-size: ${getRem(14)};
        color: ${colors.darkBlack};
        margin-bottom: ${getRem(30)};
      }
      p {
        font-family: ${fonts.regular};
        color: #4c455f;
        font-size: ${getRem(16)};
        line-height: ${getRem(25)};
        margin-bottom: ${getRem(20)};
      }
    }

    .navigators {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: ${getRem(32)};
      margin-bottom: ${getRem(48)};
      width: 100%;

      button.expandable {
        background-color: transparent;
        border: none;
        outline: none;
        display: flex;
        align-items: center;
        font-family: ${fonts.regular};
        font-size: ${getRem(14)};
        color: ${colors.darkBlack};
        transition: transform 0.3s ease-in-out;
        &.prev {
          align-self: flex-start;
        }
        &.next {
          align-self: flex-end;
        }
      }
    }
    .recommendation {
      h4.cta {
        font-family: ${fonts.bold};
        font-size: ${getRem(30)};
        color: ${colors.darkBlack};
        margin-bottom: ${getRem(24)};
      }
    }
  }
  @media screen and (max-width: 600px) {
    padding-top: ${getRem(79)};
    .blog-content-container {
      padding: ${getRem(42)} 0;

      figure.title-fig {
        img {
          width: 80%;
        }
      }

      .blog-content {
        h1 {
          font-size: ${getRem(24)};
          line-height: ${getRem(32)};
        }
        h3 {
          font-size: ${getRem(20)};
          line-height: ${getRem(26)};
          margin-bottom: ${getRem(14)};
        }
        h4 {
          font-size: ${getRem(16)};
          line-height: ${getRem(20)};
          margin-bottom: ${getRem(8)};
        }
        h6.meta {
          font-size: ${getRem(12)};
          margin-bottom: ${getRem(24)};
        }
        p {
          font-size: ${getRem(14)};
          line-height: ${getRem(22)};
          margin-bottom: ${getRem(16)};
        }
      }
    }
  }
`;
