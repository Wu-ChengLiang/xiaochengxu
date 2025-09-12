import React, { useState, useEffect } from 'react'
import { View, Text, PickerView, PickerViewColumn } from '@tarojs/components'
import dayjs from 'dayjs'
import './index.scss'

interface TimePickerScrollerProps {
  onTimeChange: (date: string, hour: string, minute: string) => void
  defaultValue?: {
    date: number
    hour: number
    minute: number
  }
}

interface TimeSlot {
  date: string
  weekday: string
  fullDate: string
  dateObj: Date
}

const TimePickerScroller: React.FC<TimePickerScrollerProps> = ({ 
  onTimeChange, 
  defaultValue
}) => {
  const [dateList, setDateList] = useState<TimeSlot[]>([])
  const [hourList, setHourList] = useState<string[]>([])
  const [minuteList, setMinuteList] = useState<string[]>([])
  
  const [selectedIndices, setSelectedIndices] = useState(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const nextHour = currentHour + 1
    
    // 计算小时索引（9点是索引0）
    let hourIndex = 0
    if (nextHour >= 9 && nextHour <= 21) {
      hourIndex = nextHour - 9
    } else if (nextHour > 21) {
      hourIndex = 0 // 超过21点就显示明天9点
    }
    
    return [2, hourIndex, 0] // [今天, 计算出的小时, 00分]
  })

  useEffect(() => {
    initializeLists()
  }, [])

  useEffect(() => {
    // 当选择改变时，通知父组件
    if (dateList.length > 0 && hourList.length > 0 && minuteList.length > 0) {
      const selectedDate = dateList[selectedIndices[0]]
      const selectedHour = hourList[selectedIndices[1]]
      const selectedMinute = minuteList[selectedIndices[2]]
      
      onTimeChange(
        selectedDate.fullDate,
        selectedHour,
        selectedMinute
      )
    }
  }, [selectedIndices, dateList, hourList, minuteList])

  const initializeLists = () => {
    // 生成日期列表 (前2天 + 今天 + 后2天)
    const dates: TimeSlot[] = []
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    for (let i = -2; i <= 2; i++) {
      const date = dayjs().add(i, 'day')
      const isToday = i === 0
      
      dates.push({
        date: isToday ? '今天' : `${date.month() + 1}月${date.date()}日`,
        weekday: isToday ? '' : weekdays[date.day()],
        fullDate: date.format('YYYY-MM-DD'),
        dateObj: date.toDate()
      })
    }
    setDateList(dates)

    // 生成小时列表 (9点-21点)
    const hours: string[] = []
    for (let i = 9; i <= 21; i++) {
      hours.push(`${i}点`)
    }
    setHourList(hours)

    // 生成分钟列表 (00, 10, 20, 30, 40, 50)
    const minutes: string[] = []
    for (let i = 0; i < 60; i += 10) {
      minutes.push(`${i.toString().padStart(2, '0')}分`)
    }
    setMinuteList(minutes)

    // 计算默认选择的时间（当前时间的下一个整点）
    const now = dayjs()
    const currentHour = now.hour()
    const nextHour = currentHour + 1

    // 默认选择计算
    let defaultDateIndex = 2 // 今天的索引
    let defaultHourIndex = 1 // 默认10点的索引 (9点是索引0，10点是索引1)
    let defaultMinuteIndex = 0 // 默认00分

    // 如果下一个整点在营业时间内 (9-21点)
    if (nextHour >= 9 && nextHour <= 21) {
      // 在今天选择下一个整点
      defaultHourIndex = nextHour - 9 // 小时数组的索引 (9点对应索引0)
    } else if (nextHour > 21) {
      // 如果下一个整点超过21点，选择明天9点
      defaultDateIndex = 3 // 明天的索引
      defaultHourIndex = 0 // 9点的索引
    } else {
      // 如果当前时间早于9点，选择今天9点
      defaultHourIndex = 0 // 9点的索引
    }

    // 使用传入的defaultValue或计算出的默认值
    const finalIndices = defaultValue 
      ? [defaultValue.date, defaultValue.hour, defaultValue.minute]
      : [defaultDateIndex, defaultHourIndex, defaultMinuteIndex]

    setSelectedIndices(finalIndices)
  }

  const handleChange = (e: any) => {
    const { value } = e.detail
    setSelectedIndices(value)
  }

  return (
    <View className="time-picker-scroller">
      <PickerView
        indicatorStyle="height: 50px; background-color: rgba(0,0,0,0.05);"
        style={{ width: '100%', height: '200px' }}
        value={selectedIndices}
        onChange={handleChange}
      >
        {/* 日期列 */}
        <PickerViewColumn>
          {dateList.map((item, index) => (
            <View key={index} className="picker-item date-item">
              <Text className={`date-text ${item.date === '今天' ? 'today' : ''}`}>
                {item.date}
              </Text>
              {item.weekday && (
                <Text className="weekday-text">{item.weekday}</Text>
              )}
            </View>
          ))}
        </PickerViewColumn>

        {/* 小时列 */}
        <PickerViewColumn>
          {hourList.map((hour, index) => (
            <View key={index} className="picker-item hour-item">
              <Text className="hour-text">{hour}</Text>
            </View>
          ))}
        </PickerViewColumn>

        {/* 分钟列 */}
        <PickerViewColumn>
          {minuteList.map((minute, index) => (
            <View key={index} className="picker-item minute-item">
              <Text className="minute-text">{minute}</Text>
            </View>
          ))}
        </PickerViewColumn>
      </PickerView>
    </View>
  )
}

export default TimePickerScroller