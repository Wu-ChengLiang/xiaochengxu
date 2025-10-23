import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { therapistService } from '@/services/therapist'
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
  status?: 'available' | 'busy' | 'break'
}

interface BookingSelectorProps {
  services: Service[]
  therapistId?: string
  onServiceSelect: (service: Service) => void
  onTimeSelect: (date: string, time: string) => void
}

export interface BookingSelectorHandle {
  clearSelectedTime: () => void
}

const BookingSelector = forwardRef<BookingSelectorHandle, BookingSelectorProps>(({
  services,
  therapistId,
  onServiceSelect,
  onTimeSelect
}, ref) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[][]>([])  // 存储从API获取的时间段
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string>('')  // 时段加载错误提示

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    clearSelectedTime: () => {
      setSelectedTime('')
    }
  }), [])

  // 当选择日期和服务时，获取可用时段
  useEffect(() => {
    if (selectedDate && therapistId && selectedService) {
      fetchAvailableSlots()
    }
  }, [selectedDate, selectedService, therapistId])

  // 页面重新可见时刷新时间段数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedDate && therapistId && selectedService) {
        console.log('页面重新可见，刷新时间段数据')
        fetchAvailableSlots()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [selectedDate, therapistId, selectedService])

  const fetchAvailableSlots = async () => {
    if (!therapistId || !selectedDate || !selectedService) return

    setLoadingSlots(true)
    setSlotsError('')  // 清除之前的错误
    try {
      const result = await therapistService.getAvailableSlots(
        therapistId,
        selectedDate,
        selectedService.duration
      )

      console.log('获取到的可用时段数据：', result)

      // 如果API返回了有效的slots数据
      if (result && result.slots && result.slots.length > 0) {
        // 使用API返回的数据
        const grid = []

        // 创建一个映射，方便查找整点的可用性
        const hourAvailability = new Map()
        result.slots.forEach(slot => {
          const hour = slot.time.split(':')[0]
          hourAvailability.set(hour, { available: slot.available, status: slot.status })
        })

        for (let hour = 9; hour <= 21; hour++) {
          const hourStr = hour.toString().padStart(2, '0')
          const hourSlots = []

          // 获取该小时的可用性（从整点数据推断）
          const hourData = hourAvailability.get(hourStr) || { available: true, status: 'available' }

          for (let minute = 0; minute < 60; minute += 10) {
            const time = `${hourStr}:${minute.toString().padStart(2, '0')}`

            // 如果是整点，直接使用API返回的数据
            // 如果不是整点，使用该小时整点的可用性
            const slot = result.slots.find(s => s.time === time)

            if (slot) {
              // 如果API返回了这个具体时间点的数据，使用它
              hourSlots.push({
                time,
                available: slot.available,
                status: slot.status
              })
            } else {
              // 否则使用该小时整点的可用性
              hourSlots.push({
                time,
                available: hourData.available,
                status: hourData.status
              })
            }
          }
          grid.push(hourSlots)
        }
        setTimeSlots(grid)
      } else {
        // 如果API返回了有效响应但没有时段数据，说明该时段已满
        console.log('该推拿师在选定时间无可用时段')
        setSlotsError('该推拿师在此时间段已满，请选择其他时间或推拿师')
        setTimeSlots([])
      }
    } catch (error: any) {
      console.error('❌ 获取可用时段失败:', error)

      // 处理不同的错误场景
      if (error.code === 1003) {  // NOT_FOUND
        setSlotsError('该推拿师不存在或不可用，请返回重新选择')
      } else if (error.code === 1010) {  // USER_NOT_FOUND
        setSlotsError('用户信息异常，请重新进入')
      } else if (error.response?.status >= 500) {  // 服务器错误
        setSlotsError('服务器异常，请稍后重试')
      } else {
        setSlotsError('加载可用时段失败，请检查网络后重试')
      }

      setTimeSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

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
    // 如果有从API获取的数据，使用API数据
    if (timeSlots.length > 0) {
      const grid = timeSlots.map((hourSlots, index) => {
        const hour = 9 + index
        return {
          hour: `${hour}:00`,
          slots: hourSlots
        }
      })
      return grid
    }

    // 否则返回默认的全部可用时段
    const grid = []
    for (let hour = 9; hour <= 21; hour++) {
      const hourSlots = []
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        hourSlots.push({
          time,
          available: true
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
    // 重置时间选择和时间段数据
    setSelectedTime('')
    setTimeSlots([])  // 清空之前的时间段数据，触发重新获取
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
            <>
              {/* 错误提示 */}
              {slotsError && (
                <View className="error-message">
                  <Text>{slotsError}</Text>
                </View>
              )}

              <ScrollView className="time-grid-container" scrollY>
                <View className="time-grid-wrapper">
                  {loadingSlots ? (
                    <View className="loading-slots">
                      <Text>加载可用时段...</Text>
                    </View>
                  ) : slotsError ? (
                    <View className="error-state">
                      <Text>暂无可用时段</Text>
                      <Text className="error-hint">请选择其他日期或推拿师</Text>
                    </View>
                  ) : (
                    timeGrid.map((row, rowIndex) => (
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
                  ))
                  )}
                </View>
              </ScrollView>
            </>
          )}
        </View>
      )}
    </View>
  )
})

BookingSelector.displayName = 'BookingSelector'

export default BookingSelector