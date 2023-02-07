import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';

import * as styles from './404.module.css';

import shareImage from '../../content/assets/default-content-image.jpg';

function NotFoundPage({ data, location }) {
  const { siteUrl, title } = data.site.siteMetadata;

  return (
    <Layout location={location} title={title}>
      <Seo
        title="404: Not Found"
        image={siteUrl + shareImage}
        url={`${siteUrl}/404/`}
      />
      <article
        className={styles.contentPage}
        itemScope
        itemType="http://schema.org/Article"
      >
        <section>
          Nope, sorry, it appears that page does not exist
        </section>
      </article>
    </Layout>
  );
}

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;
