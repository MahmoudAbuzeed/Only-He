import {
  ApiResponse,
  PaginatedResponse,
} from "../interfaces/api-response.interface";

/**
 * Utility class for creating standardized API responses
 */
export class ResponseUtil {
  /**
   * Create a success response
   */
  static success<T>(message: string, data?: T, meta?: any): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  /**
   * Create an error response
   */
  static error(message: string, code?: string, details?: any): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code,
        details,
      },
    };
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    message: string,
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a success response with no data (for delete, update operations)
   */
  static successNoData(message: string): ApiResponse {
    return {
      success: true,
      message,
    };
  }

  /**
   * Create a success response with metadata only
   */
  static successWithMeta<T>(
    message: string,
    data: T,
    meta: any
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }
}
