import { request } from '@/utils/request'
import type { Store, PageData } from '@/types'
import { normalizeImageUrl } from '@/utils/image'

class StoreService {
  // 获取附近门店
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    try {
      const data = await request('/stores/nearby', {
        data: { latitude, longitude, page, pageSize }
      })

      console.log('✅ 门店列表API调用成功:', data)

      // 检查响应结构
      if (data && data.data && data.data.list) {
        // 规范化图片URL（HTTP→HTTPS）
        const normalizedStores = data.data.list.map((store: Store) => ({
          ...store,
          image: normalizeImageUrl(store.image),
          images: store.images?.map(img => normalizeImageUrl(img))
        }))
        return {
          ...data.data,
          list: normalizedStores
        }
      } else {
        // 如果API不存在，返回mock数据
        console.log('⚠️ API不存在，使用mock数据')
        return {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        }
      }
    } catch (error) {
      console.log('⚠️ 门店API调用失败，使用mock数据:', error)
      // 返回空的mock数据结构
      return {
        list: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    }
  }
  
  // 获取门店详情
  async getStoreDetail(storeId: string) {
    try {
      const data = await request(`/stores/${storeId}`)
      console.log('✅ 门店详情API调用成功:', data)

      // 规范化图片URL（HTTP→HTTPS）
      if (data?.data) {
        return {
          ...data,
          data: {
            ...data.data,
            image: normalizeImageUrl(data.data.image),
            images: data.data.images?.map((img: string) => normalizeImageUrl(img))
          }
        }
      }
      return data
    } catch (error) {
      console.log('⚠️ 门店详情API调用失败:', error)
      return null
    }
  }
  
  // 搜索门店
  async searchStores(keyword: string, page: number = 1, pageSize: number = 10): Promise<PageData<Store>> {
    try {
      const data = await request('/stores/search', {
        data: { keyword, page, pageSize }
      })

      console.log('✅ 门店搜索API调用成功:', data)
      return data.data || { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    } catch (error) {
      console.log('⚠️ 门店搜索API调用失败:', error)
      return { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    }
  }

  // 根据状态筛选门店
  async getStoresByStatus(
    status: Store['status'],
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    try {
      const data = await request('/stores/filter', {
        data: { status, page, pageSize }
      })

      console.log('✅ 门店筛选API调用成功:', data)
      return data.data || { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    } catch (error) {
      console.log('⚠️ 门店筛选API调用失败:', error)
      return { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    }
  }
}

export const storeService = new StoreService()