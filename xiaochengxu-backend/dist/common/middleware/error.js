"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    // Zod 验证错误
    if (err instanceof zod_1.ZodError) {
        const errors = err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message
        }));
        return res.status(400).json(response_1.ResponseUtil.error(`参数验证失败: ${errors[0].message}`, 400));
    }
    // 业务错误
    if (err.message) {
        return res.status(400).json(response_1.ResponseUtil.error(err.message, 400));
    }
    // 未知错误
    return res.status(500).json(response_1.ResponseUtil.error('服务器内部错误', 500));
}
//# sourceMappingURL=error.js.map