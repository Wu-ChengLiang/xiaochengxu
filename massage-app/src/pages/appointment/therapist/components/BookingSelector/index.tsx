import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.scss'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  discountPrice?: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingSelectorProps {
  services: Service[]
  onServiceSelect: (service: Service) => void
  onTimeSelect: (date: string, time: string) => void
}

export interface BookingSelectorHandle {
  clearSelectedTime: () => void
}

const BookingSelector = forwardRef<BookingSelectorHandle, BookingSelectorProps>(({ 
  services, 
  onServiceSelect, 
  onTimeSelect 
}, ref) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearSelectedTime: () => {
      setSelectedDate('')
      setSelectedTime('')
    }
  }))

  // 生成日期列表（今天+接下来4天）
  const generateDateList = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekDay = weekDays[date.getDay()]
      
      dates.push({
        key: date.toISOString().split('T')[0],
        display: i === 0 ? '今天' : `${month}月${day}日`,
        weekDay: i === 0 ? '' : weekDay
      })
    }
    
    return dates
  }

  // 生成时间段列表（9:00-21:00，每小时一个时段）
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    
    for (let hour = 9; hour <= 21; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      // 模拟可用性（实际应该从后端获取）
      const available = Math.random() > 0.3 // 70%的时段可用
      
      slots.push({
        time,
        available
      })
    }
    
    return slots
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedServiceId(service.id)
    onServiceSelect(service)
  }

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey)
    // 重置时间选择
    setSelectedTime('')
  }

  const handleTimeSelect = (time: string, available: boolean) => {
    if (!available || !selectedDate) return
    
    setSelectedTime(time)
    onTimeSelect(selectedDate, time)
  }

  const dateList = generateDateList()
  const timeSlots = generateTimeSlots()

  return (
    <View className="booking-selector">
      {/* 服务选择 */}
      <View className="service-section">
        <View className="section-title">选择服务</View>
        <ScrollView className="service-tabs" scrollX>
          {services.map(service => (
            <View
              key={service.id}
              className={`service-tab ${selectedServiceId === service.id ? 'active' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              <Text className="service-name">{service.name}</Text>
              <View className="service-price">
                {service.discountPrice ? (
                  <>
                    <Text className="discount-price">¥{service.discountPrice}</Text>
                    <Text className="original-price">¥{service.price}</Text>
                  </>
                ) : (
                  <Text className="price">¥{service.price}</Text>
                )}
              </View>
              <Text className="service-duration">{service.duration}分钟</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 日期时间选择 */}
      {selectedServiceId && (
        <View className="datetime-section">
          <View className="section-title">选择时间</View>
          
          {/* 日期选择 */}
          <ScrollView className="date-tabs" scrollX>
            {dateList.map(date => (
              <View
                key={date.key}
                className={`date-tab ${selectedDate === date.key ? 'active' : ''}`}
                onClick={() => handleDateSelect(date.key)}
              >
                <Text className="date-display">{date.display}</Text>
                {date.weekDay && <Text className="week-day">{date.weekDay}</Text>}
              </View>
            ))}
          </ScrollView>

          {/* 时间段选择 */}
          {selectedDate && (
            <View className="time-grid">
              {timeSlots.map((slot, index) => (
                <View
                  key={index}
                  className={`time-slot ${
                    slot.available 
                      ? selectedTime === slot.time 
                        ? 'selected' 
                        : 'available'
                      : 'disabled'
                  }`}
                  onClick={() => handleTimeSelect(slot.time, slot.available)}
                >
                  <Text className="time-text">{slot.time}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  )
})

BookingSelector.displayName = 'BookingSelector'

export default BookingSelector