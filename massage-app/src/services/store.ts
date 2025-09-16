import { request } from '@/utils/request'
import type { Store, PageData } from '@/types'

class StoreService {
  // 获取附近门店
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    const data = await request('/stores/nearby', {
      data: { latitude, longitude, page, pageSize }
    })

    console.log('✅ 门店列表API调用成功:', data)
    return data.data
  }
  
  // 获取门店详情
  async getStoreDetail(storeId: string) {
    const data = await request(`/stores/${storeId}`)
    console.log('✅ 门店详情API调用成功:', data)
    return data
  }
  
  // 搜索门店
  async searchStores(keyword: string, page: number = 1, pageSize: number = 10): Promise<PageData<Store>> {
    const data = await request('/stores/search', {
      data: { keyword, page, pageSize }
    })

    console.log('✅ 门店搜索API调用成功:', data)
    return data.data
  }

  // 根据状态筛选门店
  async getStoresByStatus(
    status: Store['status'],
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    const data = await request('/stores/nearby', {
      data: { status, page, pageSize }
    })

    console.log('✅ 门店筛选API调用成功:', data)
    return data.data
  }
}

export const storeService = new StoreService()