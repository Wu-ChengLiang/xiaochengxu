import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { storeService } from '@/services/store'
import TimePickerScroller from './components/TimePickerScroller'
import type { Store } from '@/types'
import './index.scss'


const StoreAppointmentPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [store, setStore] = useState<Store | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoreData()
  }, [id])

  const loadStoreData = async () => {
    try {
      const storeRes = await storeService.getStoreDetail(id!)
      setStore(storeRes.data)
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTimeChange = (date: string, hour: string, minute: string) => {
    setSelectedDate(date)
    setSelectedHour(hour)
    setSelectedMinute(minute)
  }

  const handleCallStore = () => {
    if (store?.phone) {
      Taro.makePhoneCall({
        phoneNumber: store.phone
      })
    }
  }

  const handleShowLocation = () => {
    if (store?.location) {
      Taro.openLocation({
        latitude: store.location.latitude,
        longitude: store.location.longitude,
        name: store.name,
        address: store.address
      })
    }
  }

  const handleSubmit = () => {
    if (!selectedHour || !selectedMinute) {
      Taro.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }

    // 跳转到症状选择页面
    const timeString = `${selectedHour.replace('点', '')}:${selectedMinute.replace('分', '')}`
    
    // 需要先选择推拿师，然后进入症状调理页面
    // 这里暂时跳转到推拿师选择页面，由用户选择推拿师后再进入症状调理
    const params = {
      storeId: id,
      storeName: store?.name || '',
      selectedDate,
      selectedTime: timeString,
      from: 'store'
    }
    
    Taro.navigateTo({
      url: `/pages/appointment/therapist/index?${Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`
    })
  }

  const getFormattedDateTime = () => {
    if (!selectedDate || !selectedHour || !selectedMinute) {
      return '请选择时间'
    }
    
    const dateText = selectedDate === new Date().toISOString().split('T')[0] ? '今天' : selectedDate
    const hourText = selectedHour.replace('点', '')
    const minuteText = selectedMinute.replace('分', '')
    
    return `${dateText} ${hourText}:${minuteText}`
  }

  if (!store) return null

  return (
    <View className="store-appointment-page">
      {/* 门店信息头部 */}
      <View className="store-header">
        <Image 
          className="store-image" 
          src={store.images[0]} 
          mode="aspectFill"
        />
      </View>

      {/* 门店基本信息 */}
      <View className="store-info">
        <View className="info-header">
          <View className="store-details">
            <View className="name-row">
              <Text className="store-name">{store.name}</Text>
              <Text className="distance">{store.distance || 9.0}km</Text>
            </View>
            <View className="hours-row">
              <Text className="business-hours">
                {store.businessHours.start}-{store.businessHours.end}
              </Text>
              <View className={`status ${store.status}`}>
                {store.status === 'normal' && '就近'}
                {store.status === 'busy' && '繁忙'}
                {store.status === 'full' && '爆满'}
              </View>
            </View>
            <Text className="address">{store.address} (电影院门口)</Text>
          </View>
          <View className="action-buttons">
            <View className="action-btn" onClick={handleCallStore}>
              📞
            </View>
            <View className="action-btn" onClick={handleShowLocation}>
              📍
            </View>
          </View>
        </View>
      </View>

      {/* 预约时间选择 */}
      <View className="appointment-section">
        <Text className="section-title">预约时间</Text>
        
        {/* 特价时段提示 */}
        <View className="promotion-tips">
          <View className="tip-item main">
            <Text className="discount">9.5折</Text>
            <View className="tip-content">
              <Text className="tip-title">提前30分钟</Text>
              <Text className="tip-desc">10:00开始</Text>
            </View>
          </View>
          <View className="tip-item">
            <Text className="discount">9.0折</Text>
            <Text className="tip-desc">错峰预约</Text>
            <Text className="tip-desc">点击前往</Text>
          </View>
        </View>

        {/* 三列时间选择器 */}
        <TimePickerScroller onTimeChange={handleTimeChange} />
      </View>

      {/* 底部预约栏 */}
      <View className="bottom-bar">
        <Text className="selected-time">
          预约时间: {getFormattedDateTime()}
        </Text>
        <AtButton 
          className="submit-btn"
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedHour || !selectedMinute}
        >
          选症状
        </AtButton>
      </View>
    </View>
  )
}

export default StoreAppointmentPage