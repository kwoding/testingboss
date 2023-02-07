import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import * as styles from './blog-list.module.css';

function BlogList({ posts }) {
  return (
    <nav className={styles.blogList}>
      <ul className={styles.cards}>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          return (
            <li key={node.fields.slug} className={styles.card}>
              <Link to={`/blog${node.fields.slug}`} title={title}>
                <div className={styles.image}>
                  <GatsbyImage
                    image={
                      node.frontmatter.thumbnail.childImageSharp.gatsbyImageData
                    }
                    alt={title}
                  />
                </div>
                <div className={styles.text}>
                  <header>
                    <h3>{title}</h3>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt,
                      }}
                    />
                    <p className={styles.cta}>Read More →</p>
                  </section>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BlogList;
