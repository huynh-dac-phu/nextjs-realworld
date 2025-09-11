import { SortDirection } from '@/types/sort.type';

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: SortDirection;
  relations?: string[];
  where?: any;
}
