import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import Pagination from '../components/pagination';
import shareImage from '../../content/assets/default-content-image.jpg';
import BlogList from '../components/blog-list';

function BlogIndex({ data, location, pageContext }) {
  const siteTitle = data.site.siteMetadata.title;
  const siteDescription = data.site.siteMetadata.description;
  const { siteUrl } = data.site.siteMetadata;
  const posts = data.allMarkdownRemark.edges;

  const { currentPage, numPages } = pageContext;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={siteTitle}
        description={siteDescription}
        image={siteUrl + shareImage}
        url={`${siteUrl}/blog/`}
      />
      <BlogList posts={posts} />
      <Pagination currentPage={currentPage} numPages={numPages} path="/blog/" />
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
