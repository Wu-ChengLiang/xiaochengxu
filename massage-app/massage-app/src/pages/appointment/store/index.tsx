import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import { storeService } from '@/services/store'
import type { Store } from '@/types'
import './index.scss'

interface TimeSlot {
  date: string
  weekday: string
  slots: {
    time: string
    points: number
    duration: number
    available: boolean
  }[]
}

const StoreAppointmentPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [store, setStore] = useState<Store | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoreData()
    generateTimeSlots()
  }, [id])

  const loadStoreData = async () => {
    try {
      const storeData = await storeService.getStoreDetail(id!)
      setStore(storeData)
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSlots = () => {
    // 生成未来7天的时间段
    const slots: TimeSlot[] = []
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`
      const weekday = weekdays[date.getDay()]
      
      // 为每天生成时间段
      const daySlots = [
        { time: '10:00', points: 8, duration: 0, available: i > 0 },
        { time: '11:00', points: 9, duration: 10, available: true },
        { time: '12:00', points: 10, duration: 20, available: true },
        { time: '14:00', points: 10, duration: 0, available: true },
        { time: '15:00', points: 9, duration: 10, available: true },
        { time: '16:00', points: 8, duration: 20, available: i !== 2 },
        { time: '17:00', points: 8, duration: 30, available: true },
        { time: '18:00', points: 9, duration: 0, available: true },
        { time: '19:00', points: 10, duration: 0, available: true },
        { time: '20:00', points: 10, duration: 10, available: true }
      ]
      
      slots.push({
        date: dateStr,
        weekday: weekday,
        slots: daySlots
      })
    }
    
    setTimeSlots(slots)
    // 默认选择明天
    if (slots.length > 1) {
      setSelectedDate(slots[1].date)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
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
    if (!selectedTime) {
      Taro.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }

    // 跳转到预约确认页面
    Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=store&id=${id}&date=${selectedDate}&time=${selectedTime}`
    })
  }

  const getCurrentTimeSlot = () => {
    const current = timeSlots.find(slot => slot.date === selectedDate)
    return current?.slots || []
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
        <View className="store-actions">
          <Text className="action-text">一客一换</Text>
          <Text className="action-text">干净整洁</Text>
        </View>
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
            <Text className="address">{store.address}</Text>
          </View>
          <View className="action-buttons">
            <View className="action-btn" onClick={handleCallStore}>
              <AtIcon value="phone" size="24" color="#D9455F" />
            </View>
            <View className="action-btn" onClick={handleShowLocation}>
              <AtIcon value="map-pin" size="24" color="#D9455F" />
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
            <Text className="tip-desc">错峰预约<br />点击前往</Text>
          </View>
        </View>

        {/* 日期选择 */}
        <ScrollView scrollX className="date-selector">
          {timeSlots.map(slot => (
            <View
              key={slot.date}
              className={`date-item ${selectedDate === slot.date ? 'active' : ''}`}
              onClick={() => handleDateSelect(slot.date)}
            >
              <Text className="date">{slot.date}</Text>
              <Text className="weekday">{slot.weekday}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 时间段选择 */}
        <View className="time-slots">
          {getCurrentTimeSlot().map(slot => (
            <View
              key={slot.time}
              className={`time-slot ${!slot.available ? 'disabled' : ''} ${selectedTime === slot.time ? 'active' : ''}`}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
            >
              <View className="time-info">
                <Text className="time">{slot.time}</Text>
                <Text className="points">{slot.points}点</Text>
              </View>
              {slot.duration > 0 && (
                <Text className="duration">{slot.duration}分</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 底部预约栏 */}
      <View className="bottom-bar">
        <Text className="selected-time">
          预约时间：{selectedDate} {selectedTime || '请选择时间'}
        </Text>
        <AtButton 
          className="submit-btn"
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedTime}
        >
          选症状
        </AtButton>
      </View>
    </View>
  )
}

export default StoreAppointmentPage