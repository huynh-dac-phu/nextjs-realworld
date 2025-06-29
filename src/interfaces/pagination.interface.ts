export interface PaginationMeta {
  total: number;
  page: number;
  total_page: number;
  limit: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
