import React from 'react';
import { graphql } from 'gatsby';

import { getSrc } from 'gatsby-plugin-image';
import Layout from '../components/layout';
import Seo from '../components/seo';

import * as styles from './content-page.module.css';

function ContentPageTemplate({ data, location }) {
  const page = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { siteUrl } = data.site.siteMetadata;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={page.frontmatter.title}
        description={page.frontmatter.description || page.excerpt}
        image={siteUrl + getSrc(page.frontmatter.thumbnail)}
        url={siteUrl + page.fields.slug}
      />
      <article
        className={styles.contentPage}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{page.frontmatter.title}</h1>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: page.html }}
          itemProp="articleBody"
        />
      </article>
    </Layout>
  );
}

export default ContentPageTemplate;

export const pageQuery = graphql`
  query pageBySlug($slug: String!) {
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
        thumbnail {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 200)
          }
        }
      }
    }
  }
`;
