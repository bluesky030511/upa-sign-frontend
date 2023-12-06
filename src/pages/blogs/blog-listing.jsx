import React from "react";
import styled from "styled-components";
import Grid from "@mui/material/Grid";

import Layout from "../../components/layout";
import Banner from "../../components/banners/overlay-banner";
import { getRem } from "../../utils/helper";
import BlogCard from "../../components/cards/blog-card";
import { BLOGSLISTING } from "../../data/blogs";

const BlogListing = () => {
  return (
    <Layout full>
      <BlogsWrapper>
        <Banner>Blogs</Banner>
        <div className="inner-wrapper">
          {/* Row 1 */}
          <Grid
            container
            columnSpacing={{ sm: "24px" }}
            rowSpacing={{ xs: "32px", sm: "108px" }}
          >
            {BLOGSLISTING.map((blog, index) => (
              <Grid key={index} item lg={4}>
                <BlogCard
                  id={blog.slug}
                  image={blog.image}
                  title={blog.title}
                  description={blog.description}
                />
              </Grid>
            ))}
            {/* <Grid item lg={4}>
              <Grid container rowSpacing={{ sm: "27px" }}>
                <Grid item lg={12}>
                  <BlogCard
                    title="Simplify Your Small Business Operations: A Guide to Harnessing the Power of E-Signatures"
                    description="In the fast-paced world of small businesses, finding efficient solutions that 
                    streamline operations and save time is crucial for success. One such solution that has gained 
                    significant traction is e-signatures. In this blog post, we'll explore how small businesses can 
                    leverage the power of e-signatures to enhance productivity, improve customer experiences, 
                    and propel growth."
                    expandable
                  />
                </Grid>
                <Grid item lg={12}>
                  <BlogCard
                    title="The human brain in the new Era"
                    description="We’re not always in the position that we want to be at. We’re
                    constantly growing. We’re constantly making mistakes. We’re
                    constantly trying to express ourselves"
                    expandable
                  />
                </Grid>
                <Grid item lg={12}>
                  <BlogCard
                    title="A healthy body is light and silent"
                    description="That’s what I do. That’s what I’m here for. Don’t be afraid to be
                    wrong because you can’t learn anything from a compliment."
                    expandable
                  />
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>

          {/* Row 2 */}
          {/* <Grid container sx={{ my: 11 }} columnSpacing={{ sm: "24px" }}>
            <Grid item lg={3}>
              <BlogCard
                image={BlogImage2}
                title="Rover raised $65 million for pet sitting"
                description="Finding temporary housing for your dog should be as easy as renting an Airbnb. That’s the idea behind Rover ..."
                expandable
                small
              />
            </Grid>
            <Grid item lg={3}>
              <BlogCard
                image={BlogImage3}
                title="MateLabs mixes machine
                learning with IFTTT"
                description="If you’ve ever wanted to train a machine
                learning model and integrate it with
                IFTTT, you now can with ..."
                expandable
                small
              />
            </Grid>
            <Grid item lg={3}>
              <BlogCard
                image={BlogImage4}
                title="US venture investment ticks up"
                description="Venture investment in U.S. startups
                rose sequentially in the second quarter
                of 2017, boosted by large, ate-stage
                financings"
                expandable
                small
              />
            </Grid>
            <Grid item lg={3}>
              <BlogCard
                image={BlogImage5}
                title="Startup Insticator raises $5.2M"
                description="Insticator is announcing that it has
                raised $5.2 million in Series A funding.
                The startup allows online publishers to
                add quizzes ..."
                expandable
                small
              />
            </Grid>
          </Grid> */}

          {/* Row 3 */}
          {/* <Grid container columnSpacing={{ sm: "60px" }}>
            <Grid item lg={5}>
              <Grid container rowSpacing={{ sm: "47px" }}>
                <Grid item lg={12}>
                  <BlogCard
                    title="Warner Music Group buys concert discovery service
                    Songkick"
                    description="Warner Music Group announced today it’s acquiring the selected assets
                    of the music platform Songkick, including its app for finding concerts and
                    the company’s trademark. Songkick has been involved in a lawsuit against
                    the major…"
                    expandable
                  />
                </Grid>
                <Grid item lg={12}>
                  <BlogCard
                    title="The human brain isn’t designed to process all of the
                    world’s emergencies in realtime"
                    description="Warner Music Group announced today it’s acquiring the selected assets
                    of the music platform Songkick, including its app for finding concerts and
                    the company’s trademark. Songkick has been involved in a lawsuit against
                    the major…"
                    expandable
                  />
                </Grid>
                <Grid item lg={12}>
                  <BlogCard
                    title="A healthy body is light and silent, just as a healthy
                    mind"
                    description="Warner Music Group announced today it’s acquiring the selected assets
                    of the music platform Songkick, including its app for finding concerts and
                    the company’s trademark. Songkick has been involved in a lawsuit against
                    the major…"
                    expandable
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={7}>
              <BlogCard
                image={BlogImage6}
                title="The best investors spend most of their time walking and reading"
                description="Warner Music Group announced today it’s acquiring the selected assets of the music platform Songkick,
                including its app for finding concerts and the company’s trademark. Songkick has been involved in a lawsuit
                against the major…"
                expandable
                large
              />
            </Grid>
          </Grid> */}
        </div>
      </BlogsWrapper>
    </Layout>
  );
};

export default BlogListing;

const BlogsWrapper = styled.section`
  padding-top: ${getRem(85)};

  .inner-wrapper {
    padding-inline: 8.61%;
    max-width: 1536px;
    margin-inline: auto;
    margin-block: ${getRem(82)};
  }

  @media screen and (max-width: 600px) {
    padding-top: ${getRem(79)};

    .inner-wrapper {
      padding-inline: ${getRem(20)};
      margin-block: ${getRem(42)};
    }
  }
`;
