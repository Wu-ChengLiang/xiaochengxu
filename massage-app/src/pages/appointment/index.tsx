import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getLocationService } from '@/services/location'
import { storeService } from '@/services/store'
import { therapistService } from '@/services/therapist'
import StoreCard from '@/components/StoreCard'
import TherapistCard from '@/components/TherapistCard'
import BottomSheet from '@/components/BottomSheet'
import type { Store, Therapist } from '@/types'
import './index.scss'


const Appointment: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState<Store[]>([])
  const [allStores, setAllStores] = useState<Store[]>([])  // 所有门店数据
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [locationText, setLocationText] = useState('正在获取位置...')
  const [showStoreSheet, setShowStoreSheet] = useState(false)  // 控制门店弹出层
  const [searchValue, setSearchValue] = useState('')  // 搜索框值


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setLocationStatus('loading')
      setLocationText('正在获取位置...')
      
      // 获取用户位置
      const location = await getLocationService.getCurrentLocation()
      setUserLocation(location)
      
      // 判断是否是默认位置（上海市中心）
      if (location.latitude === 31.2304 && location.longitude === 121.4737) {
        setLocationStatus('error')
        setLocationText('定位失败，使用默认位置')
      } else {
        setLocationStatus('success')
        setLocationText('定位成功')
        // 2秒后显示为具体位置（这里可以后续接入逆地理编码）
        setTimeout(() => {
          setLocationText('上海市')
        }, 2000)
      }
      
      // 获取附近门店（只显示最近的2家）
      const nearbyStores = await storeService.getNearbyStores(
        location.latitude, 
        location.longitude, 
        1, 
        2
      )
      setStores(nearbyStores.list)
      
      // 获取所有门店数据（用于更多门店）
      const allStoresData = await storeService.getNearbyStores(
        location.latitude, 
        location.longitude, 
        1, 
        20  // 获取更多数据
      )
      setAllStores(allStoresData.list)
      
      // 获取推荐推拿师（使用新的带距离计算的方法）
      const recommendedTherapists = await therapistService.getRecommendedTherapistsWithDistance(
        1,
        10
      )
      setTherapists(recommendedTherapists.list)
      
    } catch (error) {
      console.error('加载数据失败:', error)
      setLocationStatus('error')
      setLocationText('定位失败')
      
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStoreClick = (store: Store) => {
    Taro.navigateTo({
      url: `/pages/appointment/store/index?id=${store.id}`
    })
  }

  const handleTherapistClick = (therapist: Therapist) => {
    // 跳转到推拿师预约页面
    Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${therapist.id}&storeId=${therapist.storeId}`
    })
  }



  const handleMoreStores = () => {
    setShowStoreSheet(true)
  }

  const handleMoreSymptoms = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }


  return (
    <View className="appointment-page">
      {/* 头部位置区域 */}
      <View className="header">
        <View className="location">
          <View className="icon">
            {locationStatus === 'loading' && <View className="icon-location loading" />}
            {locationStatus === 'success' && <View className="icon-location success" />}
            {locationStatus === 'error' && <View className="icon-warning" />}
          </View>
          <Text className={`text ${locationStatus}`}>{locationText}</Text>
          {locationStatus === 'error' && (
            <Text className="retry-btn" onClick={loadData}>重试</Text>
          )}
        </View>
      </View>
      
      
      {/* 门店预约 */}
      <View className="stores-section">
        <View className="section-header">
          <Text className="section-title">门店预约</Text>
          <Text className="more-link" onClick={handleMoreStores}>
            更多门店
            <View className="arrow-icon" />
          </Text>
        </View>
        <View className="store-list">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onClick={() => handleStoreClick(store)}
            />
          ))}
        </View>
      </View>
      
      {/* 推拿师预约 */}
      <View className="therapists-section">
        <View className="section-header">
          <Text className="section-title">推拿师预约</Text>
          <Text className="more-link" onClick={handleMoreSymptoms}>
            更多症状
            <View className="arrow-icon" />
          </Text>
        </View>
        <View className="therapist-list">
          {therapists.map((therapist) => (
            <TherapistCard 
              key={therapist.id} 
              therapist={therapist}
              onClick={() => handleTherapistClick(therapist)}
            />
          ))}
        </View>
      </View>
      
      {/* 更多门店弹出层 */}
      <BottomSheet
        visible={showStoreSheet}
        title="更多门店"
        onClose={() => setShowStoreSheet(false)}
        height="80%"
      >
        {/* 城市选择和搜索框 */}
        <View className="store-sheet-header">
          <View className="city-selector">
            <Text className="city-name">上海市</Text>
            <Text className="city-arrow">▼</Text>
          </View>
          <View className="search-box">
            <View className="search-icon" />
            <Input 
              className="search-input"
              placeholder="搜索门店"
              value={searchValue}
              onInput={(e) => setSearchValue(e.detail.value)}
            />
          </View>
        </View>
        
        {/* 门店列表 */}
        <View className="store-sheet-list">
          {allStores
            .filter(store => 
              searchValue === '' || 
              store.name.includes(searchValue) || 
              store.address.includes(searchValue)
            )
            .map((store) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                onClick={() => {
                  handleStoreClick(store)
                  setShowStoreSheet(false)
                }}
              />
            ))
          }
        </View>
      </BottomSheet>
    </View>
  )
}

export default Appointment