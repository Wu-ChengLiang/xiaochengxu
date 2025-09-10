"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreIdDto = exports.SearchStoresDto = exports.GetNearbyStoresDto = void 0;
const zod_1 = require("zod");
// 获取附近门店的请求参数
exports.GetNearbyStoresDto = zod_1.z.object({
    lat: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(-90).max(90)),
    lng: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(-180).max(180)),
    page: zod_1.z.string().optional().default('1'),
    pageSize: zod_1.z.string().optional().default('10'),
});
// 搜索门店的请求参数
exports.SearchStoresDto = zod_1.z.object({
    keyword: zod_1.z.string().min(1, '关键词不能为空'),
    page: zod_1.z.string().optional().default('1'),
    pageSize: zod_1.z.string().optional().default('10'),
});
// 门店ID参数
exports.StoreIdDto = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, '无效的门店ID'),
});
//# sourceMappingURL=store.dto.js.map