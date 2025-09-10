import { ApiResponse, PageData } from '../types';
export declare class ResponseUtil {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error(message: string, code?: number): ApiResponse<null>;
    static paginate<T>(list: T[], total: number, page: number, pageSize: number): PageData<T>;
}
//# sourceMappingURL=response.d.ts.map