import React, { useState, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { therapistService } from '@/services/therapist'
import { storeService } from '@/services/store'
import { getLocationService } from '@/services/location'
import { reviewService, ReviewData, ReviewStats } from '@/services/review'
import { symptomServices } from '@/mock/data/symptoms'
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

  // 待处理操作状态（用于撤销功能）- 改进的会话追踪机制
  const [currentSessionItems, setCurrentSessionItems] = useState<Set<string>>(new Set()) // 记录本次会话添加的项ID
  const [isAutoExpanded, setIsAutoExpanded] = useState(false) // 是否是自动展开的购物车
  
  // BookingSelector 组件引用
  const bookingSelectorRef = useRef<BookingSelectorHandle>(null)

  // 使用真实的症状服务数据
  const mockServices = symptomServices.map(service => ({
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    discountPrice: service.discountPrice,
    description: service.description,
    tag: service.tag
  }))

  useEffect(() => {
    loadData()
  }, [therapistId, storeId])

  // 加载评价数据
  useEffect(() => {
    if (therapistId) {
      loadReviews()
    }
  }, [therapistId])

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

      const [therapistRes, storeData, userLocation] = await Promise.all([
        therapistService.getTherapistDetail(therapistId),
        storeService.getStoreDetail(storeId),
        getLocationService.getCurrentLocation()
      ])

      console.log('Store data response:', storeData)
      console.log('Therapist data response:', therapistRes)

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

    // 如果是新的会话，标记为自动展开
    if (currentSessionItems.size === 0) {
      setIsAutoExpanded(true)
    }

    const newItem: CartItem = {
      id: itemId,  // 添加唯一ID
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

    // 检查是否已存在相同时间段的预约（在整个购物车中）
    const existingIndex = cartItems.findIndex(
      item => item.date === date && item.time === time
    )

    if (existingIndex >= 0) {
      // 如果替换的是其他会话的项，需要从当前会话中移除旧项
      const oldItem = cartItems[existingIndex]
      const newSessionItems = new Set(currentSessionItems)

      // 移除旧项ID（如果存在）
      if (newSessionItems.has(oldItem.id)) {
        newSessionItems.delete(oldItem.id)
      }

      // 添加新项ID到当前会话
      newSessionItems.add(itemId)
      setCurrentSessionItems(newSessionItems)

      // 替换购物车中的项
      const newItems = [...cartItems]
      newItems[existingIndex] = newItem
      setCartItems(newItems)

      Taro.showToast({
        title: '已更新该时段预约',
        icon: 'success'
      })
    } else {
      // 添加新预约
      const newSessionItems = new Set(currentSessionItems)
      newSessionItems.add(itemId)
      setCurrentSessionItems(newSessionItems)

      setCartItems([...cartItems, newItem])

      Taro.showToast({
        title: '已添加到购物车',
        icon: 'success'
      })
    }
  }

  // 撤销操作（点击遮罩时）
  const handleCartMaskClick = () => {
    if (isAutoExpanded && currentSessionItems.size > 0) {
      // 精确删除本次会话中添加的所有项
      const newItems = cartItems.filter(item => !currentSessionItems.has(item.id))
      setCartItems(newItems)

      // 清除选中的时间
      bookingSelectorRef.current?.clearSelectedTime()

      console.log(`🔙 撤销操作: 移除了 ${currentSessionItems.size} 个项目`)
      console.log('🔙 当前会话项ID:', Array.from(currentSessionItems))
      console.log('🔙 撤销后购物车:', newItems)
    }

    // 重置会话状态
    setCurrentSessionItems(new Set())
    setIsAutoExpanded(false)
  }

  // 确认操作（点击"继续预约"时）
  const handleCartContinue = () => {
    // 确认操作，重置会话状态，允许继续添加
    setCurrentSessionItems(new Set())
    setIsAutoExpanded(false)

    console.log('✅ 确认继续预约，会话状态已重置')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    // 清除会话状态
    setCurrentSessionItems(new Set())
    setIsAutoExpanded(false)

    console.log('💳 去结算，购物车项目数:', cartItems.length)
    console.log('💳 购物车内容:', cartItems)

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
          services={mockServices}
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
        onContinue={handleCartContinue}
        hasPendingAction={isAutoExpanded && currentSessionItems.size > 0}
      />
    </View>
  )
}

export default TherapistBookingPage