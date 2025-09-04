import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface CartItem {
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistName: string
}

interface ShoppingCartProps {
  items: CartItem[]
  onCheckout: () => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ items, onCheckout }) => {
  if (items.length === 0) {
    return null
  }

  // 计算总价
  const totalOriginalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const totalDiscountPrice = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0)
  const totalSavings = totalOriginalPrice - totalDiscountPrice

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return '今天'
    }
    
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      Taro.showToast({
        title: '请先选择服务',
        icon: 'none'
      })
      return
    }
    
    onCheckout()
  }

  return (
    <View className="shopping-cart">
      <View className="cart-header">
        <View className="cart-info">
          <Text className="item-count">已选 {items.length} 项服务</Text>
          <View className="price-info">
            {totalSavings > 0 && (
              <Text className="savings">已省 ¥{totalSavings.toFixed(2)}</Text>
            )}
            <Text className="total-price">¥{totalDiscountPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <View className="checkout-btn" onClick={handleCheckout}>
          立即预约
        </View>
      </View>

      {/* 展开显示选中的服务详情 */}
      <View className="cart-items">
        {items.map((item, index) => (
          <View key={index} className="cart-item">
            <View className="item-info">
              <Text className="service-name">{item.serviceName}</Text>
              <Text className="service-details">
                {item.duration}分钟 · {item.therapistName} · {formatDate(item.date)} {item.time}
              </Text>
            </View>
            <View className="item-price">
              {item.discountPrice ? (
                <>
                  <Text className="discount-price">¥{item.discountPrice}</Text>
                  <Text className="original-price">¥{item.price}</Text>
                </>
              ) : (
                <Text className="price">¥{item.price}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default ShoppingCart