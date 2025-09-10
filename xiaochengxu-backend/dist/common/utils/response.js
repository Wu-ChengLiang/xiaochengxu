"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(data, message = 'success') {
        return {
            code: 200,
            message,
            data,
            timestamp: Date.now()
        };
    }
    static error(message, code = 400) {
        return {
            code,
            message,
            data: null,
            timestamp: Date.now()
        };
    }
    static paginate(list, total, page, pageSize) {
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
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map