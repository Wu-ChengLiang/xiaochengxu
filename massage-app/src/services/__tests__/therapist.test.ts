import { therapistService } from '../therapist'
import { getLocationService } from '../location'
import { storeService } from '../store'
import type { Location } from '../location'

describe('TherapistService', () => {
  describe('getRecommendedTherapists with distance', () => {
    const mockUserLocation: Location = {
      latitude: 31.2304,
      longitude: 121.4737
    }

    it('should include distance field in therapist data', async () => {
      // Act
      const result = await therapistService.getRecommendedTherapists(
        1, 
        10, 
        mockUserLocation
      )

      // Assert
      expect(result.list).toBeDefined()
      expect(result.list.length).toBeGreaterThan(0)
      
      // 验证每个推拿师都有 distance 字段
      result.list.forEach(therapist => {
        expect(therapist.distance).toBeDefined()
        expect(typeof therapist.distance).toBe('number')
        expect(therapist.distance).toBeGreaterThanOrEqual(0)
      })
    })

    it('should calculate distance based on therapist store location', async () => {
      // Arrange
      const therapistId = 'therapist-101' // 世纪公园店的推拿师
      const expectedStoreId = 'store-011'
      
      // Act
      const result = await therapistService.getRecommendedTherapists(
        1, 
        50, // 增加pageSize确保能获取到目标推拿师
        mockUserLocation
      )
      
      const targetTherapist = result.list.find(t => t.id === therapistId)
      
      // Assert
      expect(targetTherapist).toBeDefined()
      expect(targetTherapist?.storeId).toBe(expectedStoreId)
      expect(targetTherapist?.distance).toBeDefined()
      
      // 验证距离是基于门店位置计算的
      const storeDetail = await storeService.getStoreDetail(expectedStoreId)
      if (storeDetail?.data?.location) {
        const expectedDistance = getLocationService.calculateDistance(
          mockUserLocation.latitude,
          mockUserLocation.longitude,
          storeDetail.data.location.latitude,
          storeDetail.data.location.longitude
        )
        expect(targetTherapist?.distance).toBe(expectedDistance)
      }
    })

    it('should sort therapists by rating and service count when no location provided', async () => {
      // Act
      const result = await therapistService.getRecommendedTherapists(1, 10)
      
      // Assert
      expect(result.list).toBeDefined()
      expect(result.list.length).toBeGreaterThan(0)
      
      // 验证排序（优先按评分，其次按服务次数）
      for (let i = 1; i < result.list.length; i++) {
        const current = result.list[i]
        const previous = result.list[i - 1]
        
        if (previous.rating === current.rating) {
          expect(previous.serviceCount || 0).toBeGreaterThanOrEqual(current.serviceCount || 0)
        } else {
          expect(previous.rating).toBeGreaterThanOrEqual(current.rating)
        }
      }
      
      // 没有位置时不应该有 distance 字段
      result.list.forEach(therapist => {
        expect(therapist.distance).toBeUndefined()
      })
    })

    it('should handle pagination correctly with distance calculation', async () => {
      // Act
      const page1 = await therapistService.getRecommendedTherapists(
        1, 
        5, 
        mockUserLocation
      )
      const page2 = await therapistService.getRecommendedTherapists(
        2, 
        5, 
        mockUserLocation
      )
      
      // Assert
      expect(page1.list.length).toBe(5)
      expect(page2.list.length).toBeGreaterThan(0)
      
      // 验证分页数据不重复
      const page1Ids = page1.list.map(t => t.id)
      const page2Ids = page2.list.map(t => t.id)
      const intersection = page1Ids.filter(id => page2Ids.includes(id))
      expect(intersection.length).toBe(0)
      
      // 验证第二页也有距离信息
      page2.list.forEach(therapist => {
        expect(therapist.distance).toBeDefined()
        expect(typeof therapist.distance).toBe('number')
      })
    })
  })

  describe('getTherapistsByStore with distance', () => {
    const mockUserLocation: Location = {
      latitude: 31.2304,
      longitude: 121.4737
    }

    it('should include distance for store therapists', async () => {
      // Arrange
      const storeId = 'store-011'
      
      // Act
      const result = await therapistService.getTherapistsByStore(
        storeId,
        1,
        10
      )
      
      // Assert
      expect(result.list).toBeDefined()
      expect(result.list.length).toBeGreaterThan(0)
      
      // 验证所有推拿师都属于指定门店且有距离信息
      result.list.forEach(therapist => {
        expect(therapist.storeId).toBe(storeId)
        expect(therapist.distance).toBeDefined()
        expect(typeof therapist.distance).toBe('number')
      })
    })
  })
})