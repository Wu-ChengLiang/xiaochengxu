import { reviewService } from '../review'
import { post, get } from '@/utils/request'

// Mock request utils
jest.mock('@/utils/request', () => ({
  post: jest.fn(),
  get: jest.fn()
}))

// Mock Taro
jest.mock('@tarojs/taro', () => ({
  default: {
    eventCenter: {
      trigger: jest.fn()
    },
    getStorageInfoSync: () => ({ keys: [] }),
    removeStorageSync: jest.fn()
  }
}))

describe('ReviewService', () => {
  const mockPost = post as jest.MockedFunction<typeof post>
  const mockGet = get as jest.MockedFunction<typeof get>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const reviewData = {
        appointmentId: 123,
        therapistId: '1',
        rating: 5,
        content: '服务非常专业，推拿手法到位，效果很好'
      }

      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          reviewId: 123,
          appointmentId: 123,
          rating: 5,
          content: '服务非常专业，推拿手法到位，效果很好',
          updatedTherapistRating: 4.8,
          updatedRatingCount: 129,
          createdAt: '2025-09-23T15:30:00.000Z'
        }
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await reviewService.createReview(reviewData)

      expect(mockPost).toHaveBeenCalledWith('/api/v2/reviews', reviewData, {
        showLoading: true,
        loadingTitle: '提交评价中...'
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle API error when creating review', async () => {
      const reviewData = {
        appointmentId: 123,
        therapistId: '1',
        rating: 5,
        content: '服务很好'
      }

      mockPost.mockRejectedValue(new Error('已评价过该订单'))

      await expect(reviewService.createReview(reviewData)).rejects.toThrow('已评价过该订单')
    })

    it('should validate content length', async () => {
      const reviewData = {
        appointmentId: 123,
        therapistId: '1',
        rating: 5,
        content: '太短了' // 少于10个字
      }

      await expect(reviewService.createReview(reviewData)).rejects.toThrow('评价内容至少需要10个字')
    })

    it('should validate rating range', async () => {
      const reviewData = {
        appointmentId: 123,
        therapistId: '1',
        rating: 6, // 超出范围
        content: '服务非常专业，推拿手法到位'
      }

      await expect(reviewService.createReview(reviewData)).rejects.toThrow('评分必须在1-5之间')
    })
  })

  describe('getTherapistReviews', () => {
    it('should fetch therapist reviews successfully', async () => {
      const therapistId = '181'
      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          list: [
            {
              reviewId: 123,
              appointmentId: 123,
              userId: 20,
              userName: '张**',
              rating: 5,
              content: '服务很专业，效果显著',
              appointmentDate: '2025-09-23',
              serviceType: '推拿按摩',
              createdAt: '2025-09-23T15:30:00.000Z'
            }
          ],
          total: 128,
          page: 1,
          pageSize: 10,
          hasMore: true
        }
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await reviewService.getTherapistReviews(therapistId)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/therapists/${therapistId}/reviews`, {
        page: 1,
        pageSize: 10
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should support pagination parameters', async () => {
      const therapistId = '181'
      const page = 2
      const pageSize = 20

      mockGet.mockResolvedValue({ code: 0, message: 'success', data: { list: [], total: 0, page, pageSize, hasMore: false } })

      await reviewService.getTherapistReviews(therapistId, page, pageSize)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/therapists/${therapistId}/reviews`, {
        page,
        pageSize
      })
    })

    it('should support rating filter', async () => {
      const therapistId = '181'
      const rating = 5

      mockGet.mockResolvedValue({ code: 0, message: 'success', data: { list: [], total: 0, page: 1, pageSize: 10, hasMore: false } })

      await reviewService.getTherapistReviews(therapistId, 1, 10, rating)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/therapists/${therapistId}/reviews`, {
        page: 1,
        pageSize: 10,
        rating
      })
    })
  })

  describe('getUserReviews', () => {
    it('should fetch user reviews successfully', async () => {
      const userId = 20
      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          list: [
            {
              reviewId: 123,
              appointmentId: 123,
              therapistId: 181,
              therapistName: '宋老师',
              storeId: 6,
              storeName: '测试门店',
              rating: 5,
              content: '服务很专业，效果显著',
              appointmentDate: '2025-09-23',
              serviceType: '推拿按摩',
              createdAt: '2025-09-23T15:30:00.000Z'
            }
          ],
          total: 15,
          page: 1,
          pageSize: 10,
          hasMore: true
        }
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await reviewService.getUserReviews(userId)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/users/${userId}/reviews`, {
        page: 1,
        pageSize: 10
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getReviewDetail', () => {
    it('should fetch review detail successfully', async () => {
      const reviewId = 'review-123'
      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          reviewId: 'review-123',
          appointmentId: 123,
          userId: 20,
          userName: '张**',
          therapistId: 181,
          therapistName: '宋老师',
          storeId: 6,
          storeName: '测试门店',
          appointmentDate: '2025-09-23',
          serviceType: '推拿按摩',
          rating: 5,
          content: '服务很专业，效果显著',
          createdAt: '2025-09-23T15:30:00.000Z'
        }
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await reviewService.getReviewDetail(reviewId)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/reviews/${reviewId}`)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle review not found', async () => {
      const reviewId = 'non-existent'

      mockGet.mockRejectedValue(new Error('评价不存在'))

      await expect(reviewService.getReviewDetail(reviewId)).rejects.toThrow('评价不存在')
    })
  })

  describe('getReviewStats', () => {
    it('should fetch review statistics successfully', async () => {
      const therapistId = '181'
      const mockResponse = {
        code: 0,
        message: 'success',
        data: {
          totalCount: 128,
          averageRating: 4.8,
          ratingBreakdown: {
            '5': 85,
            '4': 25,
            '3': 12,
            '2': 4,
            '1': 2
          }
        }
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await reviewService.getReviewStats(therapistId)

      expect(mockGet).toHaveBeenCalledWith(`/api/v2/therapists/${therapistId}/review-stats`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('checkCanReview', () => {
    it('should check if appointment can be reviewed', async () => {
      const appointmentId = 123

      // Mock获取预约详情的API
      mockGet.mockResolvedValue({
        code: 0,
        message: 'success',
        data: {
          id: 123,
          status: 'completed',
          rating: null,
          review: null
        }
      })

      const result = await reviewService.checkCanReview(appointmentId)

      expect(result).toBe(true)
    })

    it('should return false if already reviewed', async () => {
      const appointmentId = 123

      mockGet.mockResolvedValue({
        code: 0,
        message: 'success',
        data: {
          id: 123,
          status: 'completed',
          rating: 5,
          review: '已评价'
        }
      })

      const result = await reviewService.checkCanReview(appointmentId)

      expect(result).toBe(false)
    })

    it('should return false if appointment not completed', async () => {
      const appointmentId = 123

      mockGet.mockResolvedValue({
        code: 0,
        message: 'success',
        data: {
          id: 123,
          status: 'pending',
          rating: null,
          review: null
        }
      })

      const result = await reviewService.checkCanReview(appointmentId)

      expect(result).toBe(false)
    })
  })
})