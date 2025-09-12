import { mockTherapists } from '@/mock/data/therapists'
import { mockStores } from '@/mock/data/stores'
import { getLocationService } from './location'
import type { Therapist, PageData } from '@/types'
import type { Location } from './location'

// 模拟网络延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class TherapistService {
  // 获取推荐推拿师
  async getRecommendedTherapists(
    page: number = 1,
    pageSize: number = 10,
    userLocation?: Location
  ): Promise<PageData<Therapist>> {
    await sleep(300)
    
    // 按评分和服务次数排序
    let sortedTherapists = [...mockTherapists].sort((a, b) => {
      // 优先按评分排序
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      // 评分相同按服务次数排序
      return b.serviceCount - a.serviceCount
    })
    
    // 如果提供了用户位置，计算距离
    if (userLocation) {
      sortedTherapists = sortedTherapists.map(therapist => {
        // 找到推拿师所属门店
        const store = mockStores.find(s => s.id === therapist.storeId)
        if (!store || !store.location) {
          return therapist
        }
        
        // 计算距离
        const distance = getLocationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.location.latitude,
          store.location.longitude
        )
        
        return {
          ...therapist,
          distance
        }
      })
    }
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = sortedTherapists.slice(start, end)
    
    return {
      list,
      total: sortedTherapists.length,
      page,
      pageSize,
      hasMore: end < sortedTherapists.length
    }
  }
  
  // 根据门店获取推拿师
  async getTherapistsByStore(
    storeId: string,
    page: number = 1,
    pageSize: number = 10,
    userLocation?: Location
  ): Promise<PageData<Therapist>> {
    await sleep(200)
    
    let storeTherapists = mockTherapists.filter(t => t.storeId === storeId)
    
    // 如果提供了用户位置，计算距离
    if (userLocation) {
      const store = mockStores.find(s => s.id === storeId)
      if (store && store.location) {
        const distance = getLocationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.location.latitude,
          store.location.longitude
        )
        
        storeTherapists = storeTherapists.map(therapist => ({
          ...therapist,
          distance
        }))
      }
    }
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = storeTherapists.slice(start, end)
    
    return {
      list,
      total: storeTherapists.length,
      page,
      pageSize,
      hasMore: end < storeTherapists.length
    }
  }
  
  // 获取推拿师详情
  async getTherapistDetail(therapistId: string) {
    await sleep(200)
    
    const therapist = mockTherapists.find(t => t.id === therapistId)
    if (!therapist) {
      throw new Error('推拿师不存在')
    }
    
    return {
      code: 200,
      data: therapist,
      message: 'success'
    }
  }
  
  // 按擅长项目筛选推拿师
  async getTherapistsByExpertise(
    expertise: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    await sleep(300)
    
    const filteredTherapists = mockTherapists.filter(therapist =>
      therapist.expertise.includes(expertise)
    )
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredTherapists.slice(start, end)
    
    return {
      list,
      total: filteredTherapists.length,
      page,
      pageSize,
      hasMore: end < filteredTherapists.length
    }
  }
  
  // 搜索推拿师
  async searchTherapists(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    await sleep(300)
    
    const filteredTherapists = mockTherapists.filter(therapist =>
      therapist.name.includes(keyword) ||
      therapist.expertise.some(e => e.includes(keyword)) ||
      therapist.storeName?.includes(keyword)
    )
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredTherapists.slice(start, end)
    
    return {
      list,
      total: filteredTherapists.length,
      page,
      pageSize,
      hasMore: end < filteredTherapists.length
    }
  }
}

export const therapistService = new TherapistService()