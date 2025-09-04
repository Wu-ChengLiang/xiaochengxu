import { mockTherapists } from '@/mock/data/therapists'
import type { Therapist, PageData } from '@/types'

// 模拟网络延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class TherapistService {
  // 获取推荐推拿师
  async getRecommendedTherapists(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    await sleep(300)
    
    // 按评分和服务次数排序
    const sortedTherapists = [...mockTherapists].sort((a, b) => {
      // 优先按评分排序
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      // 评分相同按服务次数排序
      return b.serviceCount - a.serviceCount
    })
    
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
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    await sleep(200)
    
    const storeTherapists = mockTherapists.filter(t => t.storeId === storeId)
    
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
  async getTherapistDetail(therapistId: string): Promise<Therapist | null> {
    await sleep(200)
    
    const therapist = mockTherapists.find(t => t.id === therapistId)
    if (!therapist) {
      throw new Error('推拿师不存在')
    }
    
    return therapist
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