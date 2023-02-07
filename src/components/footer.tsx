import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { useStaticQuery, graphql } from 'gatsby';
import * as styles from './footer.module.css';

function Footer() {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            social {
              twitter
              linkedin
              github
            }
          }
        }
      }
    `,
  );

  const siteInfo = site.siteMetadata;

  return (
    <footer className={styles.siteFooter}>
      &copy;
      {' '}
      {new Date().getFullYear()}
      {' '}
      {siteInfo.title}
      . All rights reserved.
      <div className={styles.socialIcons}>
        <a
          href={`https://twitter.com/${siteInfo.social.twitter}`}
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href={`https://linkedin.com/in/${siteInfo.social.linkedin}`}
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a
          href={`https://github.com/${siteInfo.social.github}`}
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
