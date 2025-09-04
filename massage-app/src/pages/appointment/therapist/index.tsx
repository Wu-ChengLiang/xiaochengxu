import React, { useState, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
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

const TherapistSelectionPage: React.FC = () => {
  const router = useRouter()
  const { storeId, selectedDate, selectedTime, from } = router.params
  
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    loadData()
  }, [storeId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [therapistsRes, storeRes] = await Promise.all([
        therapistService.getTherapistsByStore(storeId as string),
        storeService.getStoreDetail(storeId as string)
      ])

      setTherapists(therapistsRes.list)
      setStore(storeRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('加载数据失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleTherapistSelect = (therapist: Therapist) => {
    // 跳转到症状调理页面
    const params = {
      therapistId: therapist.id,
      therapistName: therapist.name,
      storeId: storeId as string,
      storeName: store?.name || '',
      selectedDate: selectedDate || '',
      selectedTime: selectedTime || ''
    }
    
    Taro.navigateTo({
      url: `/pages/appointment/symptom/index?${Object.entries(params)
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

  if (error || !store) {
    return (
      <View className="therapist-selection-page">
        <View className="error">{error || '数据加载失败'}</View>
      </View>
    )
  }

  return (
    <View className="therapist-selection-page">
      <ScrollView className="main-content" scrollY>
        <View className="store-header">
          <Text className="store-name">{store.name}</Text>
          <Text className="selected-time">
            {selectedDate && selectedTime ? `${selectedDate} ${selectedTime}` : '请选择推拿师'}
          </Text>
        </View>
        
        <View className="therapists-list">
          {therapists.map((therapist) => (
            <View 
              key={therapist.id} 
              className="therapist-card"
              onClick={() => handleTherapistSelect(therapist)}
            >
              <View className="therapist-avatar">
                <Image src={therapist.avatar} mode="aspectFill" />
              </View>
              <View className="therapist-info">
                <View className="name-rating">
                  <Text className="name">{therapist.name}</Text>
                  <View className="rating">
                    <Text className="rating-score">⭐ {therapist.rating}</Text>
                    <Text className="rating-count">({therapist.ratingCount})</Text>
                  </View>
                </View>
                <View className="expertise">
                  {therapist.expertise.map((skill, index) => (
                    <Text key={index} className="skill-tag">{skill}</Text>
                  ))}
                </View>
                <View className="experience">
                  <Text className="years">{therapist.yearsOfExperience}年经验</Text>
                  <Text className="service-count">已服务{therapist.serviceCount}人</Text>
                  <View className={`status ${therapist.status}`}>
                    {therapist.status === 'available' && '可预约'}
                    {therapist.status === 'busy' && '繁忙'}
                    {therapist.status === 'rest' && '休息'}
                  </View>
                </View>
              </View>
              <View className="arrow">→</View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default TherapistSelectionPage