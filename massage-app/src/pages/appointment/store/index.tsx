import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { storeService } from '@/services/store'
import { getLocationService } from '@/services/location'
import TimePickerScroller from './components/TimePickerScroller'
import type { Store } from '@/types'
import { ASSETS_CONFIG } from '@/config/assets'
import { normalizeImageUrl } from '@/utils/image'
import { getTodayString } from '@/utils/date'
import './index.scss'


const StoreAppointmentPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [store, setStore] = useState<Store | null>(null)
  const [selectedDate, setSelectedDate] = useState(getTodayString())  // ✅ 使用正确的北京时间生成方法
  const [selectedHour, setSelectedHour] = useState('10点')  // 默认10点
  const [selectedMinute, setSelectedMinute] = useState('00分')  // 默认00分
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoreData()
  }, [id])

  const loadStoreData = async () => {
    try {
      const [storeRes, userLocation] = await Promise.all([
        storeService.getStoreDetail(id!),
        getLocationService.getCurrentLocation()
      ])

      const storeDataRaw = storeRes.data

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

      setStore(storeDataFinal)
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
    if (store?.latitude && store?.longitude) {
      Taro.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
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

    // 直接跳转到症状调理页面
    const timeString = `${selectedHour.replace('点', '')}:${selectedMinute.replace('分', '')}`
    
    const params = {
      storeId: id,
      storeName: store?.name || '',
      selectedDate,
      selectedTime: timeString,
      from: 'store'
    }
    
    Taro.navigateTo({
      url: `/pages/appointment/symptom/index?${Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`
    })
  }

  const getFormattedDateTime = () => {
    if (!selectedDate || !selectedHour || !selectedMinute) {
      return '请选择时间'
    }

    const dateText = selectedDate === getTodayString() ? '今天' : selectedDate  // ✅ 使用正确的北京时间生成方法
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
          src={normalizeImageUrl(store.images?.[0] || store.image)}
          // src={store.images?.[0] || store.image || ASSETS_CONFIG.store.default}
          mode="aspectFill"
        />
      </View>

      {/* 门店基本信息 */}
      <View className="store-info">
        <View className="info-header">
          <View className="store-details">
            <View className="name-row">
              <Text className="store-name">{store.name}</Text>
              {store.distance !== undefined && store.distance !== null && (
                <Text className="distance">{store.distance}km</Text>
              )}
            </View>
            <View className="hours-row">
              <Text className="business-hours">
                {store.businessHours}
              </Text>
              <View className={`status ${store.status}`}>
                {store.status === 'normal' && '就近'}
                {store.status === 'busy' && '繁忙'}
                {store.status === 'full' && '爆满'}
              </View>
            </View>
            <Text className="address">{store.address}</Text>
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
          选项目
        </AtButton>
      </View>
    </View>
  )
}

export default StoreAppointmentPage