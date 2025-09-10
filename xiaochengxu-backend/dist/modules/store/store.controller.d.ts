import { Request, Response, NextFunction } from 'express';
export declare class StoreController {
    private storeService;
    constructor();
    /**
     * 获取附近门店
     * GET /api/stores/nearby?lat=31.23&lng=121.47&page=1&pageSize=10
     */
    getNearbyStores(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 获取门店详情
     * GET /api/stores/:id
     */
    getStoreDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * 搜索门店
     * GET /api/stores/search?keyword=宜山路&page=1&pageSize=10
     */
    searchStores(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=store.controller.d.ts.map