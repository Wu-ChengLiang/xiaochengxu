import React, { useState, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { therapistService } from '@/services/therapist'
import { storeService } from '@/services/store'
import { getLocationService } from '@/services/location'
import { reviewService, ReviewData, ReviewStats } from '@/services/review'
import { symptomService } from '@/services/symptom'
import { getTherapistShareConfig } from '@/utils/share'
import TherapistInfo from './components/TherapistInfo'
import StoreInfo from './components/StoreInfo'
import BookingSelector, { BookingSelectorHandle } from './components/BookingSelector'
import ShoppingCart from './components/ShoppingCart'
import type { Therapist, Store } from '@/types'
import './index.scss'

interface CartItem {
  id: string  // 唯一标识符：用于精确追踪
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistId?: string
  therapistName: string
  therapistAvatar?: string
}

const TherapistBookingPage: React.FC = () => {
  const router = useRouter()
  const { therapistId, storeId } = router.params
  
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 评价相关状态
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // 预约选择状态
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)

  // BookingSelector 组件引用
  const bookingSelectorRef = useRef<BookingSelectorHandle>(null)

  // ✅ 从 API 获取的服务数据
  const [services, setServices] = useState<any[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [therapistId, storeId])

  // 加载评价数据
  useEffect(() => {
    if (therapistId) {
      loadReviews()
    }
  }, [therapistId])

  // 配置分享功能
  useEffect(() => {
    if (therapist && therapistId) {
      const shareConfig = getTherapistShareConfig(therapistId, therapist.name || '技师')
      Taro.useShareAppMessage(() => {
        return {
          title: shareConfig.title,
          path: shareConfig.path
        }
      })
    }
  }, [therapist, therapistId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // 添加调试日志
      console.log('TherapistBookingPage params:', { therapistId, storeId })

      if (!therapistId || !storeId) {
        console.error('Missing required params:', { therapistId, storeId })
        setError('参数错误，请重新进入')
        return
      }

      // ✅ 并行加载：推拿师、门店、位置和服务数据
      const [therapistRes, storeData, userLocation, servicesResponse] = await Promise.all([
        therapistService.getTherapistDetail(therapistId),
        storeService.getStoreDetail(storeId),
        getLocationService.getCurrentLocation(),
        symptomService.getTherapistSymptomServices(therapistId) // ✅ 新增：从 API 获取服务
      ])

      console.log('Store data response:', storeData)
      console.log('Therapist data response:', therapistRes)
      console.log('✅ Services data response:', servicesResponse) // ✅ 调试日志

      // 根据API返回的实际结构处理数据
      const therapistData = therapistRes.data || therapistRes
      const storeDataRaw = storeData?.data || storeData

      // 计算门店距离
      let storeDataFinal = { ...storeDataRaw }
      if (storeDataRaw?.latitude && storeDataRaw?.longitude) {
        const distance = getLocationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          storeDataRaw.latitude,
          storeDataRaw.longitude
        )
        storeDataFinal = {
          ...storeDataRaw,
          distance
        }
      }

      // ✅ 设置服务列表
      const servicesList = servicesResponse.data || []
      setServices(servicesList)
      console.log(`✅ 加载了 ${servicesList.length} 个服务`)

      setTherapist(therapistData)
      setStore(storeDataFinal)

      // 验证数据是否正确设置
      console.log('Store state after setting:', storeDataFinal)
      console.log('Therapist state after setting:', therapistData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('加载数据失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    if (!therapistId) return

    try {
      setReviewsLoading(true)

      // 并行获取评价列表和统计数据
      const [reviewsResponse, statsResponse] = await Promise.all([
        reviewService.getTherapistReviews(therapistId, 1, 10),
        reviewService.getReviewStats(therapistId)
      ])

      setReviews(reviewsResponse.list || [])
      setReviewStats(statsResponse)

      // 如果有评价统计，更新技师的评分
      if (statsResponse && therapist) {
        setTherapist({
          ...therapist,
          rating: statsResponse.averageRating,
          ratingCount: statsResponse.totalCount
        })
      }
    } catch (error) {
      console.error('加载评价数据失败:', error)
      // 静默处理错误，不影响主要功能
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
  }

  const handleTimeSelect = (date: string, time: string) => {
    if (!selectedService || !therapist) return

    // 生成唯一ID：基于日期+时间+时间戳
    const itemId = `${date}_${time}_${Date.now()}`

    const newItem: CartItem = {
      id: itemId,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      discountPrice: selectedService.discountPrice,
      date,
      time,
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    }

    // 单选模式：直接替换购物车内容，只保留最新选择
    setCartItems([newItem])

    Taro.showToast({
      title: '已选择预约时间',
      icon: 'success'
    })
  }

  // 撤销操作（点击遮罩时）
  const handleCartMaskClick = () => {
    // 清空购物车
    setCartItems([])

    // 清除选中的时间
    bookingSelectorRef.current?.clearSelectedTime()
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    // 导航到预约确认页面
    const params = {
      therapistId: therapistId!,
      storeId: storeId!,
      items: JSON.stringify(cartItems)
    }

    Taro.navigateTo({
      url: `/pages/booking/confirm/index?${Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`
    })
  }

  if (loading) {
    return (
      <View className="therapist-booking-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  if (error || !therapist || !store) {
    return (
      <View className="therapist-booking-page">
        <View className="error">{error || '数据加载失败'}</View>
      </View>
    )
  }

  return (
    <View className="therapist-booking-page">
      <ScrollView className="main-content" scrollY>
        <TherapistInfo
          therapist={therapist}
          stats={reviewStats}
          reviews={reviews}
          reviewsLoading={reviewsLoading}
        />
        {store && <StoreInfo store={store} />}
        <BookingSelector
          ref={bookingSelectorRef}
          services={services}
          therapistId={therapistId}
          onServiceSelect={handleServiceSelect}
          onTimeSelect={handleTimeSelect}
        />
      </ScrollView>
      <ShoppingCart
        items={cartItems}
        therapist={therapist}
        onCheckout={handleCheckout}
        onMaskClick={handleCartMaskClick}
      />
    </View>
  )
}

export default TherapistBookingPage