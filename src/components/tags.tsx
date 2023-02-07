import React from 'react';
import { Link } from 'gatsby';
import _ from 'lodash';
import * as styles from './tags.module.css';

function Tags(props) {
  const { tags } = props;

  return (
    <nav className={styles.tags}>
      Tags:
      <ul>
        {tags.map((tag) => {
          const label = tag;
          const slug = _.kebabCase(tag);

          return (
            <li key={slug}>
              <Link to={`/tag/${slug}`} itemProp="url">
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Tags;
