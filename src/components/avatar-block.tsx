/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import * as styles from './avatar-block.module.css';

function AvatarBlock({ text }) {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 45, height: 45)
        }
      }
      site {
        siteMetadata {
          author {
            name
          }
        }
      }
    }
  `);

  const { author } = data.site.siteMetadata;
  return (
    <div className={styles.avatarBlock}>
      <GatsbyImage
        image={data.avatar.childImageSharp.gatsbyImageData}
        alt={author.name}
        className={styles.image}
        imgStyle={{
          borderRadius: '50%',
        }}
      />
      <ul>
        <li className={styles.author}>{author.name}</li>
        <li className={styles.text}>{text}</li>
      </ul>
    </div>
  );
}

export default AvatarBlock;
