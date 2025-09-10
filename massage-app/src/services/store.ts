import { http } from '@/utils/request'
import { config } from '@/config'
import type { Store, PageData } from '@/types'

// 如果配置为使用 Mock，则导入 Mock 服务
const mockStoreService = config.useMock ? require('./store-mock').storeService : null

class StoreApiService {
  /**
   * 获取附近门店
   */
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    // 如果配置使用 Mock，则调用 Mock 服务
    if (config.useMock && mockStoreService) {
      return mockStoreService.getNearbyStores(latitude, longitude, page, pageSize)
    }

    const response = await http.get<{code: number; data: PageData<Store>; message: string}>('/api/stores/nearby', {
      lat: latitude,
      lng: longitude,
      page,
      pageSize
    })

    return response.data.data
  }

  /**
   * 获取门店详情
   */
  async getStoreDetail(storeId: string): Promise<{ code: number; data: Store; message: string }> {
    // 如果配置使用 Mock，则调用 Mock 服务
    if (config.useMock && mockStoreService) {
      return mockStoreService.getStoreDetail(storeId)
    }

    const response = await http.get<Store>(`/api/stores/${storeId}`)
    
    return {
      code: response.code,
      data: response.data,
      message: response.message
    }
  }

  /**
   * 搜索门店
   */
  async searchStores(
    keyword: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    // 如果配置使用 Mock，则调用 Mock 服务
    if (config.useMock && mockStoreService) {
      return mockStoreService.searchStores(keyword, page, pageSize)
    }

    const response = await http.get<{code: number; data: PageData<Store>; message: string}>('/api/stores/search', {
      keyword,
      page,
      pageSize
    })

    return response.data.data
  }

  /**
   * 根据状态筛选门店
   */
  async getStoresByStatus(
    status: Store['status'],
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    // 如果配置使用 Mock，则调用 Mock 服务
    if (config.useMock && mockStoreService) {
      return mockStoreService.getStoresByStatus(status, page, pageSize)
    }

    // 真实 API 暂未实现此接口，先返回所有门店然后过滤
    const response = await http.get<{code: number; data: PageData<Store>; message: string}>('/api/stores/nearby', {
      lat: 31.23, // 使用默认位置
      lng: 121.47,
      page: 1,
      pageSize: 100 // 获取足够多的数据进行过滤
    })

    // 在前端过滤状态
    const filteredStores = response.data.data.list.filter(store => store.status === status)
    
    // 手动分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredStores.slice(start, end)

    return {
      list,
      total: filteredStores.length,
      page,
      pageSize,
      hasMore: end < filteredStores.length
    }
  }
}

export const storeService = new StoreApiService()