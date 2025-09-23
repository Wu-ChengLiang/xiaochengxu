import { post, get } from '@/utils/request'
import Taro from '@tarojs/taro'

/**
 * 评价数据接口
 */
export interface ReviewData {
  reviewId: number | string
  appointmentId: number
  userId?: number
  userName?: string
  userAvatar?: string
  therapistId?: string | number
  therapistName?: string
  therapistAvatar?: string
  storeId?: string | number
  storeName?: string
  rating: number
  content: string
  tags?: string[]
  appointmentDate?: string
  serviceType?: string
  createdAt: string
  updatedAt?: string
}

/**
 * 创建评价参数
 */
export interface CreateReviewParams {
  appointmentId: number
  therapistId?: string
  rating: number
  content: string
  tags?: string[]
}

/**
 * 评价列表响应
 */
export interface ReviewListResponse {
  list: ReviewData[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 评价统计数据
 */
export interface ReviewStats {
  totalCount: number
  averageRating: number
  ratingBreakdown: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

/**
 * 评价服务类
 */
class ReviewService {
  /**
   * 创建评价
   * @param params 评价参数
   * @returns 评价结果
   */
  async createReview(params: CreateReviewParams): Promise<ReviewData> {
    // 参数验证
    if (params.content.length < 10) {
      throw new Error('评价内容至少需要10个字')
    }

    if (params.content.length > 500) {
      throw new Error('评价内容不能超过500字')
    }

    if (params.rating < 1 || params.rating > 5) {
      throw new Error('评分必须在1-5之间')
    }

    try {
      const response = await post('/api/v2/reviews', params, {
        showLoading: true,
        loadingTitle: '提交评价中...'
      })

      // 触发评价成功事件（可用于更新缓存）
      Taro.eventCenter.trigger('review:created', response.data)

      return response.data
    } catch (error: any) {
      console.error('创建评价失败:', error)
      throw new Error(error.message || '创建评价失败')
    }
  }

  /**
   * 获取推拿师评价列表
   * @param therapistId 推拿师ID
   * @param page 页码
   * @param pageSize 每页数量
   * @param rating 评分筛选
   * @returns 评价列表
   */
  async getTherapistReviews(
    therapistId: string | number,
    page: number = 1,
    pageSize: number = 10,
    rating?: number
  ): Promise<ReviewListResponse> {
    try {
      const params: any = { page, pageSize }
      if (rating) {
        params.rating = rating
      }

      const response = await get(`/api/v2/therapists/${therapistId}/reviews`, params)
      return response.data
    } catch (error: any) {
      console.error('获取推拿师评价失败:', error)
      return {
        list: [],
        total: 0,
        page,
        pageSize,
        hasMore: false
      }
    }
  }

  /**
   * 获取用户评价历史
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 评价列表
   */
  async getUserReviews(
    userId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ReviewListResponse> {
    try {
      const response = await get(`/api/v2/users/${userId}/reviews`, {
        page,
        pageSize
      })
      return response.data
    } catch (error: any) {
      console.error('获取用户评价失败:', error)
      return {
        list: [],
        total: 0,
        page,
        pageSize,
        hasMore: false
      }
    }
  }

  /**
   * 获取评价详情
   * @param reviewId 评价ID
   * @returns 评价详情
   */
  async getReviewDetail(reviewId: string | number): Promise<ReviewData> {
    try {
      const response = await get(`/api/v2/reviews/${reviewId}`)
      return response.data
    } catch (error: any) {
      console.error('获取评价详情失败:', error)
      throw new Error(error.message || '评价不存在')
    }
  }

  /**
   * 获取推拿师评价统计
   * @param therapistId 推拿师ID
   * @returns 评价统计
   */
  async getReviewStats(therapistId: string | number): Promise<ReviewStats> {
    try {
      const response = await get(`/api/v2/therapists/${therapistId}/review-stats`)
      return response.data
    } catch (error: any) {
      console.error('获取评价统计失败:', error)
      // 返回默认统计数据
      return {
        totalCount: 0,
        averageRating: 0,
        ratingBreakdown: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0
        }
      }
    }
  }

  /**
   * 检查是否可以评价
   * @param appointmentId 预约ID
   * @returns 是否可以评价
   */
  async checkCanReview(appointmentId: number): Promise<boolean> {
    try {
      // 获取预约详情
      const response = await get(`/api/v2/appointments/${appointmentId}`)
      const appointment = response.data

      // 检查条件：
      // 1. 预约状态必须是completed
      // 2. 还没有评价（rating和review为空）
      return (
        appointment.status === 'completed' &&
        !appointment.rating &&
        !appointment.review
      )
    } catch (error) {
      console.error('检查评价状态失败:', error)
      return false
    }
  }

  /**
   * 批量获取评价状态
   * @param appointmentIds 预约ID列表
   * @returns 评价状态映射
   */
  async batchCheckReviewStatus(
    appointmentIds: number[]
  ): Promise<Record<number, boolean>> {
    const result: Record<number, boolean> = {}

    // 并发检查所有预约的评价状态
    const promises = appointmentIds.map(async (id) => {
      const canReview = await this.checkCanReview(id)
      result[id] = canReview
    })

    await Promise.allSettled(promises)
    return result
  }

  /**
   * 清除缓存
   */
  clearCache() {
    try {
      // 清除本地存储的评价相关缓存
      const keys = Taro.getStorageInfoSync().keys
      keys.forEach(key => {
        if (key.startsWith('review_cache_')) {
          Taro.removeStorageSync(key)
        }
      })
    } catch (error) {
      console.error('清除评价缓存失败:', error)
    }
  }
}

// 导出单例实例
export const reviewService = new ReviewService()