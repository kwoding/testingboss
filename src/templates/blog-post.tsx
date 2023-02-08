import React from 'react';
import { graphql } from 'gatsby';

import { getSrc } from 'gatsby-plugin-image';
import Bio from '../components/bio';
import Layout from '../components/layout';
import Share from '../components/share';
import Tags from '../components/tags';
import Seo from '../components/seo';

import * as styles from './blog-post.module.css';

function BlogPostTemplate({ data, location }) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { siteUrl } = data.site.siteMetadata;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        image={siteUrl + getSrc(post.frontmatter.thumbnail)}
        url={`${siteUrl}/blog${post.fields.slug}`}
      />
      <article
        className={styles.blogPost}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <div className={styles.date}>
            Published on:
            {' '}
            {post.frontmatter.date}
          </div>
        </header>

        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />

        <Tags tags={post.frontmatter.tags} />
        <Share url={`${siteUrl}/blog${post.fields.slug}`} />
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query blogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      fields {
        slug
      }
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "D MMMM YYYY")
        description
        tags
        thumbnail {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 200)
          }
        }
      }
    }
  }
`;
