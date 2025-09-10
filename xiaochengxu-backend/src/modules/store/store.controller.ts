import { Request, Response, NextFunction } from 'express';
import { StoreService } from './store.service';
import { GetNearbyStoresDto, SearchStoresDto, StoreIdDto } from './store.dto';
import { ResponseUtil } from '../../common/utils/response';

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  /**
   * 获取附近门店
   * GET /api/stores/nearby?lat=31.23&lng=121.47&page=1&pageSize=10
   */
  async getNearbyStores(req: Request, res: Response, next: NextFunction) {
    try {
      // 验证请求参数
      const params = GetNearbyStoresDto.parse(req.query);
      
      // 调用服务
      const result = await this.storeService.getNearbyStores(
        params.lat,
        params.lng,
        Number(params.page),
        Number(params.pageSize)
      );
      
      // 返回成功响应
      res.json(ResponseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取门店详情
   * GET /api/stores/:id
   */
  async getStoreDetail(req: Request, res: Response, next: NextFunction) {
    try {
      // 验证请求参数
      const params = StoreIdDto.parse(req.params);
      
      // 调用服务
      const result = await this.storeService.getStoreDetail(params.id);
      
      // 返回成功响应
      res.json(ResponseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 搜索门店
   * GET /api/stores/search?keyword=宜山路&page=1&pageSize=10
   */
  async searchStores(req: Request, res: Response, next: NextFunction) {
    try {
      // 验证请求参数
      const params = SearchStoresDto.parse(req.query);
      
      // 调用服务
      const result = await this.storeService.searchStores(
        params.keyword,
        Number(params.page),
        Number(params.pageSize)
      );
      
      // 返回成功响应
      res.json(ResponseUtil.success(result));
    } catch (error) {
      next(error);
    }
  }
}