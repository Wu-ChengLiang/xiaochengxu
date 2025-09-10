"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const store_service_1 = require("./store.service");
const store_dto_1 = require("./store.dto");
const response_1 = require("../../common/utils/response");
class StoreController {
    storeService;
    constructor() {
        this.storeService = new store_service_1.StoreService();
    }
    /**
     * 获取附近门店
     * GET /api/stores/nearby?lat=31.23&lng=121.47&page=1&pageSize=10
     */
    async getNearbyStores(req, res, next) {
        try {
            // 验证请求参数
            const params = store_dto_1.GetNearbyStoresDto.parse(req.query);
            // 调用服务
            const result = await this.storeService.getNearbyStores(params.lat, params.lng, Number(params.page), Number(params.pageSize));
            // 返回成功响应
            res.json(response_1.ResponseUtil.success(result));
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 获取门店详情
     * GET /api/stores/:id
     */
    async getStoreDetail(req, res, next) {
        try {
            // 验证请求参数
            const params = store_dto_1.StoreIdDto.parse(req.params);
            // 调用服务
            const result = await this.storeService.getStoreDetail(params.id);
            // 返回成功响应
            res.json(response_1.ResponseUtil.success(result));
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 搜索门店
     * GET /api/stores/search?keyword=宜山路&page=1&pageSize=10
     */
    async searchStores(req, res, next) {
        try {
            // 验证请求参数
            const params = store_dto_1.SearchStoresDto.parse(req.query);
            // 调用服务
            const result = await this.storeService.searchStores(params.keyword, Number(params.page), Number(params.pageSize));
            // 返回成功响应
            res.json(response_1.ResponseUtil.success(result));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StoreController = StoreController;
//# sourceMappingURL=store.controller.js.map