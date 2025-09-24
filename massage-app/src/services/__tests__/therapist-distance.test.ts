import { therapistService } from '../therapist'
import { storeService } from '../store'
import { getLocationService } from '../location'
import { request } from '@/utils/request'

// Mock dependencies
jest.mock('@/utils/request')
jest.mock('../store')
jest.mock('../location')

const mockRequest = request as jest.MockedFunction<typeof request>
const mockStoreService = storeService as jest.Mocked<typeof storeService>
const mockLocationService = getLocationService as jest.Mocked<typeof getLocationService>

describe('Therapist Distance Calculation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getRecommendedTherapistsWithDistance', () => {
    it('should calculate distance for each therapist based on their store location', async () => {
      // Arrange
      const mockUserLocation = {
        latitude: 31.2304,
        longitude: 121.4737
      }

      const mockTherapists = [
        {
          id: '1',
          name: '张师傅',
          storeId: 'store1',
          avatar: '/avatar1.jpg',
          title: '高级推拿师',
          rating: 4.8,
          ratingCount: 100,
          expertise: ['推拿', '按摩'],
          yearsOfExperience: 5,
          status: 'available' as const
        },
        {
          id: '2',
          name: '李师傅',
          storeId: 'store2',
          avatar: '/avatar2.jpg',
          title: '资深推拿师',
          rating: 4.9,
          ratingCount: 200,
          expertise: ['推拿', '刮痧'],
          yearsOfExperience: 8,
          status: 'available' as const
        }
      ]

      const mockStores = {
        'store1': {
          id: 'store1',
          name: '静安店',
          address: '上海市静安区',
          latitude: 31.2404,
          longitude: 121.4837
        },
        'store2': {
          id: 'store2',
          name: '浦东店',
          address: '上海市浦东新区',
          latitude: 31.2504,
          longitude: 121.5037
        }
      }

      // Mock implementations
      mockLocationService.getCurrentLocation.mockResolvedValue(mockUserLocation)

      mockRequest.mockResolvedValue({
        code: 200,
        message: 'success',
        data: {
          list: mockTherapists,
          total: 2,
          page: 1,
          pageSize: 10,
          hasMore: false
        }
      })

      mockStoreService.getStoreDetail.mockImplementation((storeId: string) => {
        return Promise.resolve({
          data: mockStores[storeId as keyof typeof mockStores]
        } as any)
      })

      mockLocationService.calculateDistance.mockImplementation((lat1, lng1, lat2, lng2) => {
        // Simple distance calculation for testing
        if (lat2 === 31.2404 && lng2 === 121.4837) return 1.5 // store1
        if (lat2 === 31.2504 && lng2 === 121.5037) return 3.8 // store2
        return 0
      })

      // Act
      const result = await therapistService.getRecommendedTherapistsWithDistance()

      // Assert
      expect(mockLocationService.getCurrentLocation).toHaveBeenCalledTimes(1)
      expect(mockStoreService.getStoreDetail).toHaveBeenCalledTimes(2)
      expect(mockStoreService.getStoreDetail).toHaveBeenCalledWith('store1')
      expect(mockStoreService.getStoreDetail).toHaveBeenCalledWith('store2')

      expect(result.list).toHaveLength(2)
      expect(result.list[0].distance).toBe(1.5)
      expect(result.list[0].name).toBe('张师傅')
      expect(result.list[1].distance).toBe(3.8)
      expect(result.list[1].name).toBe('李师傅')
    })

    it('should sort therapists by distance (nearest first)', async () => {
      // Arrange
      const mockUserLocation = { latitude: 31.2304, longitude: 121.4737 }

      const mockTherapists = [
        { id: '1', name: '远处技师', storeId: 'far-store', status: 'available' as const },
        { id: '2', name: '近处技师', storeId: 'near-store', status: 'available' as const },
        { id: '3', name: '中等技师', storeId: 'mid-store', status: 'available' as const }
      ] as any[]

      mockLocationService.getCurrentLocation.mockResolvedValue(mockUserLocation)
      mockRequest.mockResolvedValue({
        code: 200,
        message: 'success',
        data: { list: mockTherapists }
      })

      mockStoreService.getStoreDetail.mockImplementation((storeId: string) => {
        const locations: Record<string, any> = {
          'far-store': { latitude: 31.3004, longitude: 121.5237 },
          'near-store': { latitude: 31.2354, longitude: 121.4787 },
          'mid-store': { latitude: 31.2504, longitude: 121.4937 }
        }
        return Promise.resolve({
          data: locations[storeId]
        } as any)
      })

      mockLocationService.calculateDistance.mockImplementation((lat1, lng1, lat2, lng2) => {
        if (lat2 === 31.3004) return 10.5 // far
        if (lat2 === 31.2354) return 0.8  // near
        if (lat2 === 31.2504) return 3.2  // mid
        return 0
      })

      // Act
      const result = await therapistService.getRecommendedTherapistsWithDistance()

      // Assert
      expect(result.list[0].name).toBe('近处技师')
      expect(result.list[0].distance).toBe(0.8)
      expect(result.list[1].name).toBe('中等技师')
      expect(result.list[1].distance).toBe(3.2)
      expect(result.list[2].name).toBe('远处技师')
      expect(result.list[2].distance).toBe(10.5)
    })

    it('should handle therapists without store location gracefully', async () => {
      // Arrange
      const mockUserLocation = { latitude: 31.2304, longitude: 121.4737 }

      const mockTherapists = [
        { id: '1', name: '有位置技师', storeId: 'store-with-location' },
        { id: '2', name: '无位置技师', storeId: 'store-without-location' }
      ] as any[]

      mockLocationService.getCurrentLocation.mockResolvedValue(mockUserLocation)
      mockRequest.mockResolvedValue({
        code: 200,
        message: 'success',
        data: { list: mockTherapists }
      })

      mockStoreService.getStoreDetail.mockImplementation((storeId) => {
        if (storeId === 'store-with-location') {
          return Promise.resolve({
            data: { latitude: 31.2404, longitude: 121.4837 }
          } as any)
        }
        return Promise.resolve({ data: {} } as any)
      })

      mockLocationService.calculateDistance.mockReturnValue(2.5)

      // Act
      const result = await therapistService.getRecommendedTherapistsWithDistance()

      // Assert
      expect(result.list[0].name).toBe('有位置技师')
      expect(result.list[0].distance).toBe(2.5)
      expect(result.list[1].name).toBe('无位置技师')
      expect(result.list[1].distance).toBeNull()
    })

    it('should handle user location permission denied', async () => {
      // Arrange
      const mockTherapists = [
        { id: '1', name: '技师1', storeId: 'store1' }
      ] as any[]

      // Simulate location permission denied
      mockLocationService.getCurrentLocation.mockResolvedValue({
        latitude: 31.2304,  // Default Shanghai location
        longitude: 121.4737
      })

      mockRequest.mockResolvedValue({
        code: 200,
        message: 'success',
        data: { list: mockTherapists }
      })

      mockStoreService.getStoreDetail.mockResolvedValue({
        data: { latitude: 31.2404, longitude: 121.4837 }
      } as any)

      mockLocationService.calculateDistance.mockReturnValue(1.5)

      // Act
      const result = await therapistService.getRecommendedTherapistsWithDistance()

      // Assert
      expect(result.list[0].distance).toBe(1.5)
      // Should still calculate distance using default location
    })

    it('should pass user location to API when available', async () => {
      // Arrange
      const mockUserLocation = { latitude: 31.2304, longitude: 121.4737 }

      mockLocationService.getCurrentLocation.mockResolvedValue(mockUserLocation)
      mockRequest.mockResolvedValue({
        code: 200,
        message: 'success',
        data: { list: [] }
      })

      // Act
      await therapistService.getRecommendedTherapistsWithDistance(1, 10)

      // Assert
      expect(mockRequest).toHaveBeenCalledWith(
        '/therapists/recommended',
        {
          data: {
            page: 1,
            pageSize: 10,
            latitude: 31.2304,
            longitude: 121.4737
          }
        }
      )
    })
  })
})