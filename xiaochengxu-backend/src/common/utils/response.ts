import { ApiResponse, PageData } from '../types';

export class ResponseUtil {
  static success<T>(data: T, message: string = 'success'): ApiResponse<T> {
    return {
      code: 200,
      message,
      data,
      timestamp: Date.now()
    };
  }

  static error(message: string, code: number = 400): ApiResponse<null> {
    return {
      code,
      message,
      data: null,
      timestamp: Date.now()
    };
  }

  static paginate<T>(
    list: T[],
    total: number,
    page: number,
    pageSize: number
  ): PageData<T> {
    const hasMore = page * pageSize < total;
    
    return {
      list,
      total,
      page,
      pageSize,
      hasMore
    };
  }
}