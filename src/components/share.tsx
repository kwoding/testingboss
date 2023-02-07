import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import * as styles from './share.module.css';

function Share({ url }) {
  const encodedUrl = encodeURIComponent(url);
  return (
    <div className={styles.shareLinks}>
      Share on:
      <ul>
        <li>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Share with Twitter"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </li>
        <li>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Share on LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Share;
