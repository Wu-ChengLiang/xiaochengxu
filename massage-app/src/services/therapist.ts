import { request } from '@/utils/request'
import type { Therapist, PageData } from '@/types'

class TherapistService {
  // 获取推荐推拿师
  async getRecommendedTherapists(
    page: number = 1,
    pageSize: number = 10,
    userLocation?: { latitude: number; longitude: number }
  ): Promise<PageData<Therapist>> {
    try {
      const data = await request('/therapists/recommended', {
        data: { page, pageSize, latitude: userLocation?.latitude, longitude: userLocation?.longitude }
      })

      console.log('✅ 推荐推拿师API调用成功:', data)
      return data.data || { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    } catch (error) {
      console.log('⚠️ 推荐推拿师API调用失败，使用mock数据:', error)
      return { list: [], total: 0, page: 1, pageSize: 10, hasMore: false }
    }
  }
  
  // 根据门店获取推拿师
  async getTherapistsByStore(
    storeId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    const data = await request(`/stores/${storeId}/therapists`, {
      data: { page, pageSize }
    })

    console.log('✅ 门店推拿师API调用成功:', data)

    // API返回的data是数组，需要转换为PageData格式
    const therapistArray = Array.isArray(data.data) ? data.data : []
    return {
      list: therapistArray,
      total: therapistArray.length,
      page: 1,
      pageSize: therapistArray.length
    }
  }
  
  // 获取推拿师详情
  async getTherapistDetail(therapistId: string) {
    const data = await request(`/therapists/${therapistId}`)
    console.log('✅ 推拿师详情API调用成功:', data)
    return data
  }
  
  // 按擅长项目筛选推拿师
  async getTherapistsByExpertise(
    expertise: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    const data = await request('/therapists/search', {
      data: { expertise, page, pageSize }
    })

    console.log('✅ 专长筛选推拿师API调用成功:', data)
    return data.data
  }
  
  // 搜索推拿师
  async searchTherapists(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist>> {
    const data = await request('/therapists/search', {
      data: { keyword, page, pageSize }
    })

    console.log('✅ 搜索推拿师API调用成功:', data)
    return data.data
  }
}

export const therapistService = new TherapistService()