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
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearSelectedTime: () => {
      setSelectedTime('')
    }
  }), [])

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

  // 生成时间网格数据（按小时分组）
  const generateTimeGrid = () => {
    const grid = []
    
    for (let hour = 9; hour <= 21; hour++) {
      const hourSlots = []
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // 模拟可用性（实际应该从后端获取）
        const available = Math.random() > 0.3 // 70%的时段可用
        
        hourSlots.push({
          time,
          available
        })
      }
      grid.push({
        hour: `${hour}:00`,
        slots: hourSlots
      })
    }
    
    return grid
  }

  // 判断某个时间槽是否被选中
  const isTimeSlotSelected = (time: string) => {
    if (!selectedTime || !selectedService) return false
    
    const startTime = selectedTime
    const duration = selectedService.duration
    
    // 将时间转换为分钟数进行计算
    const timeToMinutes = (timeStr: string) => {
      const [hour, minute] = timeStr.split(':').map(Number)
      return hour * 60 + minute
    }
    
    const startMinutes = timeToMinutes(startTime)
    const currentMinutes = timeToMinutes(time)
    const endMinutes = startMinutes + duration
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedServiceId(service.id)
    setSelectedService(service)
    onServiceSelect(service)
    // 重置时间选择
    setSelectedTime('')
  }

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey)
    // 重置时间选择
    setSelectedTime('')
  }

  const handleTimeSelect = (time: string, available: boolean) => {
    if (!available || !selectedDate || !selectedService) return
    
    // 检查选择的时间段是否足够
    const timeToMinutes = (timeStr: string) => {
      const [hour, minute] = timeStr.split(':').map(Number)
      return hour * 60 + minute
    }
    
    const startMinutes = timeToMinutes(time)
    const endMinutes = startMinutes + selectedService.duration
    
    // 检查是否超过营业时间
    if (endMinutes > 22 * 60) { // 22:00
      return
    }
    
    setSelectedTime(time)
    onTimeSelect(selectedDate, time)
    
    // 自动弹出购物车
    setTimeout(() => {
      const cartBtn = document.querySelector('.checkout-btn:not(.disabled)')
      if (cartBtn) {
        (cartBtn as HTMLElement).click()
      }
    }, 300)
  }

  const dateList = generateDateList()
  const timeGrid = generateTimeGrid()

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
              <View className="service-info">
                <Text className="service-duration">{service.duration}分钟</Text>
                <Text className="price">¥{service.discountPrice || service.price}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 日期时间选择 */}
      {selectedServiceId && (
        <View className="datetime-section">
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
            <ScrollView className="time-grid-container" scrollY>
              <View className="time-grid-wrapper">
                {timeGrid.map((row, rowIndex) => (
                  <View key={rowIndex} className="time-row">
                    <Text className="hour-label">{row.hour}</Text>
                    <View className="time-slots">
                      {row.slots.map((slot, slotIndex) => (
                        <View
                          key={slotIndex}
                          className={`time-slot ${
                            slot.available 
                              ? isTimeSlotSelected(slot.time)
                                ? 'selected' 
                                : 'available'
                              : 'disabled'
                          }`}
                          onClick={() => handleTimeSelect(slot.time, slot.available)}
                        >
                          <Text className="time-text">:{slot.time.split(':')[1]}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  )
})

BookingSelector.displayName = 'BookingSelector'

export default BookingSelector