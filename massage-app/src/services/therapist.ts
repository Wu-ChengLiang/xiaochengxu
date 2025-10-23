import { request } from '@/utils/request'
import type { Therapist, PageData } from '@/types'
import { storeService } from './store'
import { getLocationService } from './location'
import { normalizeImageUrl } from '@/utils/image'

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

  // 获取推荐推拿师并计算距离
  async getRecommendedTherapistsWithDistance(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Therapist & { distance: number | null }>> {
    try {
      // 1. 获取用户位置
      const userLocation = await getLocationService.getCurrentLocation()

      // 2. 获取推拿师列表（传入用户位置）
      const data = await request('/therapists/recommended', {
        data: {
          page,
          pageSize,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        }
      })

      console.log('✅ 推荐推拿师API调用成功:', data)

      const therapists = data.data?.list || []

      // 3. 规范化推拿师头像URL（HTTP→HTTPS）
      const normalizedTherapists = therapists.map((therapist: Therapist) => ({
        ...therapist,
        avatar: normalizeImageUrl(therapist.avatar)
      }))

      // 4. 为每个推拿师计算距离
      const therapistsWithDistance = await Promise.all(
        normalizedTherapists.map(async (therapist: Therapist) => {
          try {
            // 获取推拿师对应门店信息
            const storeData = await storeService.getStoreDetail(therapist.storeId)
            const store = storeData?.data || storeData

            let distance: number | null = null

            // 如果门店有位置信息，计算距离
            // API返回的位置数据直接在store对象上，不是嵌套的location对象
            if (store?.latitude && store?.longitude) {
              distance = getLocationService.calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                store.latitude,
                store.longitude
              )
            }

            return {
              ...therapist,
              distance
            }
          } catch (error) {
            console.warn(`获取技师 ${therapist.id} 门店信息失败:`, error)
            return {
              ...therapist,
              distance: null
            }
          }
        })
      )

      // 4. 按距离排序（距离近的排在前面，null值排在后面）
      therapistsWithDistance.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })

      return {
        list: therapistsWithDistance,
        total: data.data?.total || therapistsWithDistance.length,
        page: data.data?.page || page,
        pageSize: data.data?.pageSize || pageSize,
        hasMore: data.data?.hasMore || false
      }
    } catch (error) {
      console.log('⚠️ 推荐推拿师距离计算API调用失败:', error)
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
      pageSize: therapistArray.length,
      hasMore: false
    }
  }
  
  // 获取推拿师详情
  async getTherapistDetail(therapistId: string) {
    try {
      const data = await request(`/therapists/${therapistId}`)
      console.log('✅ 推拿师详情API调用成功:', data)
      return data
    } catch (error) {
      console.log('⚠️ 推拿师详情API调用失败:', error)
      throw error // 让上层处理错误
    }
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

  // 获取技师可预约时段
  async getAvailableSlots(
    therapistId: string,
    date: string,
    duration: number = 60
  ): Promise<{
    date: string
    slots: Array<{
      time: string
      available: boolean
      status: 'available' | 'busy' | 'break'
    }>
    workTime: {
      start: string
      end: string
    }
  }> {
    try {
      const data = await request('/appointments/available-slots', {
        data: { therapistId, date, duration }
      })

      console.log('✅ 获取可预约时段API调用成功:', data)
      return data.data
    } catch (error) {
      // ⚠️ 错误直接抛出，让调用方处理
      // 这样可以区分不同的错误场景（推拿师不存在、网络错误等）
      console.error('❌ 获取可预约时段API调用失败:', error)
      throw error
    }
  }

  // 获取门店所有推拿师的排班信息
  // 用于症状页面显示技师可用性
  async getTherapistsAvailability(
    storeId: string,
    date: string,
    days: number = 3
  ): Promise<any[]> {
    try {
      const data = await request(`/stores/${storeId}/therapists/availability`, {
        data: { date, days }
      })

      console.log('✅ 门店推拿师排班API调用成功:', data)

      // API返回的data是数组，直接返回
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('❌ 门店推拿师排班API调用失败:', error)
      // 返回空数组，保证兼容性
      return []
    }
  }
}

export const therapistService = new TherapistService()