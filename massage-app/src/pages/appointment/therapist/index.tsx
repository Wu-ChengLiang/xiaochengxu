import React, { useState, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { therapistService } from '@/services/therapist'
import { storeService } from '@/services/store'
import TherapistInfo from './components/TherapistInfo'
import StoreInfo from './components/StoreInfo'
import BookingSelector, { BookingSelectorHandle } from './components/BookingSelector'
import ShoppingCart from './components/ShoppingCart'
import type { Therapist, Store } from '@/types'
import './index.scss'

interface CartItem {
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistName: string
}

const TherapistBookingPage: React.FC = () => {
  const router = useRouter()
  const { therapistId, storeId } = router.params
  
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 预约选择状态
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  
  // 待处理操作状态（用于撤销功能）
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null)
  const [pendingAction, setPendingAction] = useState<'add' | 'update' | null>(null)
  const [pendingIndex, setPendingIndex] = useState<number>(-1)
  
  // BookingSelector 组件引用
  const bookingSelectorRef = useRef<BookingSelectorHandle>(null)

  // Mock 服务数据
  const mockServices = [
    { id: '1', name: '肩颈调理', duration: 60, price: 128, discountPrice: 98 },
    { id: '2', name: '全身推拿', duration: 90, price: 198, discountPrice: 158 },
    { id: '3', name: '足底按摩', duration: 45, price: 88 },
    { id: '4', name: '拔罐刮痧', duration: 30, price: 68, discountPrice: 58 },
    { id: '5', name: '中医理疗', duration: 120, price: 298, discountPrice: 238 }
  ]

  useEffect(() => {
    loadData()
  }, [therapistId, storeId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [therapistData, storeData] = await Promise.all([
        therapistService.getTherapistDetail(therapistId),
        storeService.getStoreDetail(storeId)
      ])

      setTherapist(therapistData)
      setStore(storeData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('加载数据失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
  }

  const handleTimeSelect = (date: string, time: string) => {
    if (!selectedService || !therapist) return

    const newItem: CartItem = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      discountPrice: selectedService.discountPrice,
      date,
      time,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    }

    // 检查是否已存在相同时间段的预约
    const existingIndex = cartItems.findIndex(
      item => item.date === date && item.time === time
    )

    if (existingIndex >= 0) {
      // 直接替换现有预约，不记录撤销操作
      const newItems = [...cartItems]
      newItems[existingIndex] = newItem
      setCartItems(newItems)
      
      Taro.showToast({
        title: '已更新该时段预约',
        icon: 'success'
      })
    } else {
      // 记录新增操作（只有新增才能撤销）
      setPendingItem(newItem)
      setPendingAction('add')
      setPendingIndex(cartItems.length)
      
      // 添加新预约
      setCartItems([...cartItems, newItem])
      
      Taro.showToast({
        title: '已添加到购物车',
        icon: 'success'
      })
    }
  }

  // 撤销操作（点击遮罩时）
  const handleCartMaskClick = () => {
    if (pendingAction === 'add' && pendingIndex >= 0) {
      // 撤销新增：移除最后添加的项
      const newItems = [...cartItems]
      newItems.splice(pendingIndex, 1)
      setCartItems(newItems)
      
      // 清除选中的时间
      bookingSelectorRef.current?.clearSelectedTime()
      
      Taro.showToast({
        title: '已取消预约',
        icon: 'none'
      })
    }
    
    // 清除待处理状态
    setPendingItem(null)
    setPendingAction(null)
    setPendingIndex(-1)
  }

  // 确认操作（点击"继续预约"时）
  const handleCartContinue = () => {
    // 确认操作，清除待处理状态
    setPendingItem(null)
    setPendingAction(null)
    setPendingIndex(-1)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    // 清除待处理状态
    setPendingItem(null)
    setPendingAction(null)
    setPendingIndex(-1)

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
        <TherapistInfo therapist={therapist} />
        <StoreInfo store={store} />
        <BookingSelector 
          ref={bookingSelectorRef}
          services={mockServices}
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
        hasPendingAction={pendingAction !== null}
      />
    </View>
  )
}

export default TherapistBookingPage