import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface BookingButtonProps {
  onClick?: (e: any) => void
  size?: 'small' | 'medium' | 'large'
  text?: string
  disabled?: boolean
}

const BookingButton: React.FC<BookingButtonProps> = ({
  onClick,
  size = 'medium',
  text = '预约',
  disabled = false
}) => {
  const handleClick = (e: any) => {
    e.stopPropagation()
    if (!disabled && onClick) {
      onClick(e)
    }
  }

  return (
    <View 
      className={`booking-button booking-button-${size} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <Text className="button-text">{text}</Text>
    </View>
  )
}

export default BookingButton