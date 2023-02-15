import React from 'react';
import { graphql } from 'gatsby';

import { getSrc } from 'gatsby-plugin-image';
import AvatarBlock from '../components/avatar-block';
import Layout from '../components/layout';
import Share from '../components/share';
import Tags from '../components/tags';
import Seo from '../components/seo';

import * as styles from './blog-post.module.css';

function BlogPostTemplate({ data, location }) {
  const post = data.markdownRemark;
  const { title, keywords, siteUrl } = data.site.siteMetadata;

  return (
    <Layout location={location} title={title}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={`${keywords},${post.frontmatter.tags.toString()}`}
        image={siteUrl + getSrc(post.frontmatter.thumbnail)}
        url={`${siteUrl} /blog${post.fields.slug}`}
      />
      <article
        className={styles.blogPost}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <AvatarBlock text={post.frontmatter.date} />
        </header>

        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />

        <Tags tags={post.frontmatter.tags} />
        <Share url={`${siteUrl}/blog${post.fields.slug}`} />
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
        keywords
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
        date(formatString: "D MMM YYYY")
        description
        tags
        thumbnail {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 500)
          }
        }
      }
    }
  }
`;
