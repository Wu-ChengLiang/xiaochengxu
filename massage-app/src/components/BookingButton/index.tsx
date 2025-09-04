import React from 'react'
import Taro from '@tarojs/taro'
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
  return (
    <View 
      className={`booking-button booking-button-${size}`}
    >
      <Text className="button-text">{text}</Text>
    </View>
  )
}

export default BookingButton