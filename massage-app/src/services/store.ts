import { mockStores } from '@/mock/data/stores'
import { getLocationService } from './location'
import type { Store, PageData } from '@/types'

// 模拟网络延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class StoreService {
  // 获取附近门店
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    await sleep(300) // 模拟网络延迟
    
    // 计算每个门店的距离并排序
    const storesWithDistance = mockStores.map(store => ({
      ...store,
      distance: getLocationService.calculateDistance(
        latitude,
        longitude,
        store.location.latitude,
        store.location.longitude
      )
    })).sort((a, b) => a.distance - b.distance)
    
    // 分页处理
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = storesWithDistance.slice(start, end)
    
    return {
      list,
      total: storesWithDistance.length,
      page,
      pageSize,
      hasMore: end < storesWithDistance.length
    }
  }
  
  // 获取门店详情
  async getStoreDetail(storeId: string): Promise<Store | null> {
    await sleep(200)
    
    const store = mockStores.find(s => s.id === storeId)
    if (!store) {
      throw new Error('门店不存在')
    }
    
    return store
  }
  
  // 搜索门店
  async searchStores(keyword: string, page: number = 1, pageSize: number = 10): Promise<PageData<Store>> {
    await sleep(300)
    
    const filteredStores = mockStores.filter(store => 
      store.name.includes(keyword) || 
      store.address.includes(keyword)
    )
    
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
  
  // 根据状态筛选门店
  async getStoresByStatus(
    status: Store['status'],
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    await sleep(200)
    
    const filteredStores = mockStores.filter(store => store.status === status)
    
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

export const storeService = new StoreService()