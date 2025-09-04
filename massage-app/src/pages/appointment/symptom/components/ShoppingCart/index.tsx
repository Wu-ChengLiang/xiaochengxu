import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
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
  therapistAvatar?: string
}

interface ShoppingCartProps {
  items: CartItem[]
  onCheckout: () => void
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ items, onCheckout }) => {
  const [expanded, setExpanded] = useState(false)

  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.discountPrice || item.price)
  }, 0)

  const totalOriginalPrice = items.reduce((sum, item) => {
    return sum + item.price
  }, 0)

  const savedAmount = totalOriginalPrice - totalPrice

  return (
    <View className="shopping-cart">
      <View className="cart-summary" onClick={() => setExpanded(!expanded)}>
        <View className="cart-icon">
          <Text className="cart-badge">{items.length}</Text>
        </View>
        <View className="price-info">
          <Text className="total-price">¥{totalPrice}</Text>
          {savedAmount > 0 && (
            <Text className="saved-amount">已省¥{savedAmount}</Text>
          )}
        </View>
        <AtButton 
          className="checkout-btn" 
          type="primary" 
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onCheckout()
          }}
        >
          去结算
        </AtButton>
      </View>

      {expanded && (
        <View className="cart-details">
          {items.map((item, index) => (
            <View key={index} className="cart-item">
              <View className="item-info">
                <Text className="service-name">{item.serviceName}</Text>
                <Text className="therapist-name">{item.therapistName} | {item.duration}分钟</Text>
              </View>
              <View className="item-price">
                {item.discountPrice ? (
                  <>
                    <Text className="discount-price">¥{item.discountPrice}</Text>
                    <Text className="original-price">¥{item.price}</Text>
                  </>
                ) : (
                  <Text className="discount-price">¥{item.price}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default ShoppingCart