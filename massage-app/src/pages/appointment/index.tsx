import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getLocationService } from '@/services/location'
import { storeService } from '@/services/store'
import { therapistService } from '@/services/therapist'
import StoreCard from '@/components/StoreCard'
import TherapistCard from '@/components/TherapistCard'
import type { Store, Therapist } from '@/types'
import './index.scss'

// 导入本地图片
import bannerGoodnight from '@/assets/images/banners/goodnight.jpg'

const Appointment: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState<Store[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })

  // 优惠活动数据（Mock）
  const banners = [
    {
      id: 1,
      image: bannerGoodnight,
      title: '晚安好眠',
      subtitle: '深度放松助眠服务',
      link: ''
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // 获取用户位置
      const location = await getLocationService.getCurrentLocation()
      setUserLocation(location)
      
      // 获取附近门店（只显示最近的2家）
      const nearbyStores = await storeService.getNearbyStores(
        location.latitude, 
        location.longitude, 
        1, 
        2
      )
      setStores(nearbyStores.list)
      
      // 获取推荐推拿师
      const recommendedTherapists = await therapistService.getRecommendedTherapists()
      setTherapists(recommendedTherapists.list)
      
    } catch (error) {
      console.error('加载数据失败:', error)
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
      url: `/pages/store/detail/index?id=${store.id}`
    })
  }

  const handleTherapistClick = (therapist: Therapist) => {
    Taro.navigateTo({
      url: `/pages/therapist/detail/index?id=${therapist.id}`
    })
  }

  const handleBookingClick = (e: any, item: Store | Therapist) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=${item.hasOwnProperty('storeId') ? 'therapist' : 'store'}&id=${item.id}`
    })
  }

  const handleMoreStores = () => {
    Taro.navigateTo({
      url: '/pages/store/list/index'
    })
  }

  const handleMoreSymptoms = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }

  const handleBannerClick = (banner: any) => {
    // 跳转到优惠专区页面
    Taro.navigateTo({
      url: '/pages/promotion/index'
    })
  }

  return (
    <View className="appointment-page">
      {/* 头部标题区域 */}
      <View className="header">
        <Text className="title">疲劳酸痛，到常乐对症推拿</Text>
        <View className="location">
          <Text className="icon">📍</Text>
          <Text className="text">正在获取位置...</Text>
        </View>
      </View>
      
      {/* 优惠活动轮播 */}
      <View className="banner-section">
        <Text className="section-title">优惠预约</Text>
        <Swiper
          className="banner-swiper"
          autoplay
          interval={3000}
          indicatorDots
          indicatorActiveColor="#D9455F"
        >
          {banners.map((banner) => (
            <SwiperItem key={banner.id}>
              <View className="banner-item" onClick={() => handleBannerClick(banner)}>
                <Image className="banner-image" src={banner.image} mode="aspectFill" />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      
      {/* 门店预约 */}
      <View className="stores-section">
        <View className="section-header">
          <Text className="section-title">门店预约</Text>
          <Text className="more-link" onClick={handleMoreStores}>
            更多门店 {'>>'}
          </Text>
        </View>
        <ScrollView scrollY className="store-list">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onClick={() => handleStoreClick(store)}
              onBooking={(e) => handleBookingClick(e, store)}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* 推拿师预约 */}
      <View className="therapists-section">
        <View className="section-header">
          <Text className="section-title">推拿师预约</Text>
          <Text className="more-link" onClick={handleMoreSymptoms}>
            更多症状 {'>>'}
          </Text>
        </View>
        <ScrollView scrollY className="therapist-list">
          {therapists.map((therapist) => (
            <TherapistCard 
              key={therapist.id} 
              therapist={therapist}
              onClick={() => handleTherapistClick(therapist)}
              onBooking={(e) => handleBookingClick(e, therapist)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default Appointment