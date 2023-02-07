import React from 'react';
import { graphql } from 'gatsby';
import shareImage from '../../content/assets/default-content-image.jpg';
import Layout from '../components/layout';
import Seo from '../components/seo';
import * as styles from './tag-list.module.css';
import BlogList from '../components/blog-list';

function TagList({ data, location, pageContext }) {
  const siteTitle = data.site.siteMetadata.title;
  const siteDescription = data.site.siteMetadata.description;
  const { siteUrl } = data.site.siteMetadata;

  const { tag } = pageContext;
  const { totalCount } = data.allMarkdownRemark;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={siteTitle}
        description={siteDescription}
        image={siteUrl + shareImage}
        url={`${siteUrl}/tag/${tag}`}
      />
      <div className={styles.tagList}>
        <h2>{tag}</h2>
        <div className={styles.postCount}>
          There
          {' '}
          {totalCount === 1 ? 'is 1 post' : `are ${totalCount} posts`}
          {' '}
          under &quot;
          {tag}
          &quot;
        </div>
        <BlogList posts={posts} />
      </div>
    </Layout>
  );
}

export default TagList;

export const pageQuery = graphql`
  query tagPageQuery($tag: String) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { tags: { in: [$tag] }, pageType: { eq: "blog" } }
      }
    ) {
      totalCount
      edges {
        node {
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
