import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import * as styles from './header.module.css';
import logo from '../../content/assets/logo.png';

function Header() {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `,
  );

  const siteTitle = site.siteMetadata.title;

  return (
    <header className={styles.siteHeader}>
      <nav>
        <ul className={styles.menu}>
          <li className={styles.logo}>
            <a href="/">
              <img src={logo} alt={siteTitle} title={siteTitle} />
            </a>
          </li>
          <li className={styles.item}>
            <a href="/about">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
