import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface BookingButtonProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const BookingButton: React.FC<BookingButtonProps> = ({
  size = 'medium',
  text = '预约'
}) => {
  // 纯装饰性按钮，不处理任何点击事件
  // 点击事件由父组件（整个卡片）处理
  
  return (
    <View className={`booking-button booking-button-${size}`}>
      <Text className="button-text">{text}</Text>
    </View>
  )
}

export default BookingButton