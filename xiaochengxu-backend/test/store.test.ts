import { Store, PageData } from '../src/common/types';

// Mock 的 StoreService（将在实际实现时替换）
class StoreService {
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    throw new Error('Not implemented');
  }

  async getStoreDetail(storeId: string): Promise<Store> {
    throw new Error('Not implemented');
  }

  async searchStores(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    throw new Error('Not implemented');
  }
}

describe('StoreService', () => {
  let storeService: StoreService;

  beforeEach(() => {
    storeService = new StoreService();
  });

  describe('getNearbyStores', () => {
    it('should return stores sorted by distance', async () => {
      const result = await storeService.getNearbyStores(31.23, 121.47, 1, 10);
      
      expect(result).toBeDefined();
      expect(result.list).toBeInstanceOf(Array);
      expect(result.list.length).toBeGreaterThan(0);
      
      // 验证距离排序
      for (let i = 1; i < result.list.length; i++) {
        expect(result.list[i - 1].distance).toBeLessThanOrEqual(result.list[i].distance!);
      }
    });

    it('should handle pagination correctly', async () => {
      const page1 = await storeService.getNearbyStores(31.23, 121.47, 1, 5);
      const page2 = await storeService.getNearbyStores(31.23, 121.47, 2, 5);
      
      expect(page1.list.length).toBeLessThanOrEqual(5);
      expect(page1.page).toBe(1);
      expect(page1.pageSize).toBe(5);
      expect(page1.hasMore).toBe(true);
      
      // 确保第二页的数据不同于第一页
      expect(page2.list[0].id).not.toBe(page1.list[0].id);
    });

    it('should include all required fields in response', async () => {
      const result = await storeService.getNearbyStores(31.23, 121.47, 1, 10);
      const store = result.list[0];
      
      // 验证必需字段
      expect(store).toHaveProperty('id');
      expect(store).toHaveProperty('name');
      expect(store).toHaveProperty('address');
      expect(store).toHaveProperty('phone');
      expect(store).toHaveProperty('businessHours');
      expect(store).toHaveProperty('location');
      expect(store).toHaveProperty('distance');
      expect(store).toHaveProperty('status');
      expect(store).toHaveProperty('images');
      expect(store).toHaveProperty('services');
      
      // 验证 businessHours 格式
      expect(store.businessHours).toHaveProperty('start');
      expect(store.businessHours).toHaveProperty('end');
      
      // 验证 location 格式
      expect(store.location).toHaveProperty('latitude');
      expect(store.location).toHaveProperty('longitude');
    });
  });

  describe('getStoreDetail', () => {
    it('should return store detail by id', async () => {
      const store = await storeService.getStoreDetail('1');
      
      expect(store).toBeDefined();
      expect(store.id).toBe('1');
      expect(store.name).toBeTruthy();
    });

    it('should convert snake_case to camelCase', async () => {
      const store = await storeService.getStoreDetail('1');
      
      // 验证 businessHours 被正确转换
      expect(store.businessHours).toBeDefined();
      expect(store.businessHours.start).toBe('09:00');
      expect(store.businessHours.end).toBe('21:00');
    });

    it('should throw error for non-existent store', async () => {
      await expect(storeService.getStoreDetail('99999')).rejects.toThrow();
    });
  });

  describe('searchStores', () => {
    it('should search stores by keyword', async () => {
      const result = await storeService.searchStores('宜山路', 1, 10);
      
      expect(result.list).toBeInstanceOf(Array);
      expect(result.list.length).toBeGreaterThan(0);
      
      // 验证搜索结果包含关键词
      result.list.forEach(store => {
        const matchesName = store.name.includes('宜山路');
        const matchesAddress = store.address.includes('宜山路');
        expect(matchesName || matchesAddress).toBe(true);
      });
    });

    it('should return empty list for no matches', async () => {
      const result = await storeService.searchStores('不存在的地址', 1, 10);
      
      expect(result.list).toBeInstanceOf(Array);
      expect(result.list.length).toBe(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should handle pagination in search results', async () => {
      const result = await storeService.searchStores('路', 1, 5);
      
      expect(result.list.length).toBeLessThanOrEqual(5);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(5);
    });
  });
});

describe('Store API Endpoints', () => {
  // API 端点测试（集成测试）
  describe('GET /api/stores/nearby', () => {
    it('should return 200 with nearby stores', async () => {
      // TODO: 实现 API 测试
      expect(true).toBe(true);
    });
  });

  describe('GET /api/stores/:id', () => {
    it('should return 200 with store detail', async () => {
      // TODO: 实现 API 测试
      expect(true).toBe(true);
    });
  });

  describe('GET /api/stores/search', () => {
    it('should return 200 with search results', async () => {
      // TODO: 实现 API 测试
      expect(true).toBe(true);
    });
  });
});