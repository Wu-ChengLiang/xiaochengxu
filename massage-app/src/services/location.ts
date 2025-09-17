import Taro from '@tarojs/taro'

export interface Location {
  latitude: number
  longitude: number
}

class LocationService {
  // 获取用户当前位置
  async getCurrentLocation(): Promise<Location> {
    try {
      // 检查授权状态
      const settingRes = await Taro.getSetting()
      const authSetting = settingRes?.authSetting || {}

      if (!authSetting['scope.userLocation']) {
        // 请求授权
        await Taro.authorize({
          scope: 'scope.userLocation'
        })
      }
      
      // 获取位置，先尝试gcj02，失败则降级到wgs84
      let res
      try {
        res = await Taro.getLocation({
          type: 'gcj02', // 国内火星坐标系
          isHighAccuracy: true
        })
      } catch (gcj02Error) {
        console.warn('gcj02坐标系不支持，尝试wgs84:', gcj02Error)
        // 降级到wgs84坐标系
        res = await Taro.getLocation({
          type: 'wgs84' // GPS原始坐标系
        })
      }

      return {
        latitude: res.latitude,
        longitude: res.longitude
      }
    } catch (error) {
      console.error('获取位置失败:', error)

      // 如果用户拒绝授权或其他错误，使用默认位置（上海市中心）
      const errorMsg = (error as any)?.errMsg || ''

      // 只在用户明确拒绝授权时才显示弹窗
      if (errorMsg.includes('auth deny') || errorMsg.includes('authorize:fail')) {
        Taro.showModal({
          title: '提示',
          content: '需要获取您的位置信息来推荐附近门店',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting()
            }
          }
        })
      }

      // 无论什么错误，都返回默认位置（上海市中心）
      console.log('使用默认位置：上海市中心')
      return {
        latitude: 31.2304,
        longitude: 121.4737
      }
    }
  }
  
  // 计算两点之间的距离（单位：公里）
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const rad = Math.PI / 180
    const R = 6371 // 地球半径（公里）
    
    const dLat = (lat2 - lat1) * rad
    const dLng = (lng2 - lng1) * rad
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return Number((R * c).toFixed(1))
  }
  
  // 格式化距离显示
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance}km`
  }
}

export const getLocationService = new LocationService()