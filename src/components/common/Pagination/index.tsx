import React from 'react';
import './style.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const maxPages = Math.max(1, totalPages);

  return (
    <div className={`common-pagination-wrapper ${className}`}>
      <div className="common-pagination-container">
        {/* First Page */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className={`common-pagination-btn ${
            currentPage <= 1 ? 'common-pagination-btn-disabled' : ''
          }`}
          title="Go to first page"
        >
          «
        </button>

        {/* Previous Page */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`common-pagination-btn ${
            currentPage <= 1 ? 'common-pagination-btn-disabled' : ''
          }`}
          title="Go to previous page"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {Array.from({ length: maxPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`common-pagination-btn ${
                isActive ? 'common-pagination-btn-active' : ''
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          disabled={currentPage >= maxPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`common-pagination-btn ${
            currentPage >= maxPages ? 'common-pagination-btn-disabled' : ''
          }`}
          title="Go to next page"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          disabled={currentPage >= maxPages}
          onClick={() => onPageChange(maxPages)}
          className={`common-pagination-btn ${
            currentPage >= maxPages ? 'common-pagination-btn-disabled' : ''
          }`}
          title="Go to last page"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
