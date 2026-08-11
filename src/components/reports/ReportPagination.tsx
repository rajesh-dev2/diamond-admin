import React from 'react';

export interface ReportPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ReportPagination: React.FC<ReportPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPages = Math.max(1, totalPages);

  return (
    <div className="flex justify-end pt-2">
      <div className="report-pagination">
        {/* First Page */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className={`report-page-item ${currentPage <= 1 ? 'disabled' : ''}`}
          title="Go to first page"
        >
          «
        </button>

        {/* Previous Page */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`report-page-item ${currentPage <= 1 ? 'disabled' : ''}`}
          title="Go to previous page"
        >
          ‹
        </button>

        {/* Numbered Page Buttons */}
        {Array.from({ length: maxPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`report-page-item ${isActive ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          disabled={currentPage >= maxPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`report-page-item ${currentPage >= maxPages ? 'disabled' : ''}`}
          title="Go to next page"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          disabled={currentPage >= maxPages}
          onClick={() => onPageChange(maxPages)}
          className={`report-page-item ${currentPage >= maxPages ? 'disabled' : ''}`}
          title="Go to last page"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default ReportPagination;
