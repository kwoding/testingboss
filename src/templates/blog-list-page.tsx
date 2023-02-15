import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import Pagination from '../components/pagination';
import shareImage from '../../content/assets/default-content-image.jpg';
import BlogList from '../components/blog-list';

function BlogIndex({ data, location, pageContext }) {
  const { title, description, keywords, siteUrl } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;

  const { currentPage, numPages } = pageContext;

  return (
    <Layout location={location} title={title}>
      <Seo
        title={title}
        description={description}
        keywords={keywords}
        image={siteUrl + shareImage}
        url={`${siteUrl}/`}
      />
      <BlogList posts={posts} />
      <Pagination currentPage={currentPage} numPages={numPages} path="/" />
    </Layout>
  );
}

export default BlogIndex;

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
        keywords
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { pageType: { eq: "blog" } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "D MMMM YYYY")
            title
            description
            thumbnail {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 308, height: 200)
              }
            }
          }
        }
      }
    }
  }
`;
