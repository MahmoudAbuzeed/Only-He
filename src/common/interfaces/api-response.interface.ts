/**
 * Standard API Response Structure for all mobile endpoints
 */
export interface ApiResponse<T = any> {
  /**
   * Success status
   */
  success: boolean;

  /**
   * Response message
   */
  message: string;

  /**
   * Response data (optional)
   */
  data?: T;

  /**
   * Error details (only present when success is false)
   */
  error?: {
    code?: string;
    details?: any;
  };

  /**
   * Metadata (pagination, counts, etc.)
   */
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
