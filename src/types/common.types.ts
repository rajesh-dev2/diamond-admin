export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
