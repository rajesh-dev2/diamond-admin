'use client';
import './PageHeader.css';

export interface PageHeaderProps {
  title: string;
  onRefresh?: () => void;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export function PageHeader({
  title,
  onRefresh,
  onSearch,
  searchPlaceholder = 'Search Event',
  showSearch = true,
}: PageHeaderProps) {
  return (
    <div className="page-title-box">
      {/* Title + Refresh Icon */}
      <div className="flex items-center">
        <h4 className="page-title-heading">
          <span>{title}</span>
          <button
            type="button"
            onClick={onRefresh || (() => window.location.reload())}
            className="text-dark pl-1 text-[#333333] hover:text-[#000000] transition-colors cursor-pointer inline-flex items-center"
            title="Refresh Data"
          >
            <i className="fa fa-sync text-[14px] mt-1"></i>
          </button>
        </h4>
      </div>

      {/* Right Search Input */}
      {showSearch && (
        <div className="page-title-right">
          <input
            type="text"
            name="searchMarktetText"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="page-header-search-input"
            style={{ fontFamily: 'Arial, sans-serif' }}
          />
        </div>
      )}
    </div>
  );
}
