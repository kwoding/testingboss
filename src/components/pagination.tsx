import React from 'react';
import { Link } from 'gatsby';
import * as styles from './pagination.module.css';

function Pagination({ currentPage, numPages, path }) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1
    ? path
    : path + (currentPage - 1);
  const nextPage = path + (currentPage + 1);

  return (
    <nav
      className={styles.pager}
      style={{ display: numPages === 1 ? 'none' : 'block' }}
    >
      <ul>
        {!isFirst && (
          <li key="pagination-prev" className={styles.item}>
            <Link to={prevPage} rel="prev">
              ←
            </Link>
          </li>
        )}
        {Array.from({ length: numPages }, (_, i) => (
          <li
            key={`pagination-number${i + 1}`}
            className={
              i + 1 === currentPage ? styles.selected : styles.item
            }
          >
            <Link to={`${path}${i === 0 ? '' : i + 1}`}>{i + 1}</Link>
          </li>
        ))}
        {!isLast && (
          <li key="pagination-next" className={styles.item}>
            <Link to={nextPage} rel="next">
              →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
