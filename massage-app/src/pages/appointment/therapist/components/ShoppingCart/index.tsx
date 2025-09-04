import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image } from '@tarojs/components'
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
  therapistAvatar?: string
}

interface ShoppingCartProps {
  items: CartItem[]
  therapist?: any
  onCheckout: () => void
  onMaskClick?: () => void
  onContinue?: () => void
  hasPendingAction?: boolean
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ 
  items, 
  therapist, 
  onCheckout,
  onMaskClick,
  onContinue,
  hasPendingAction = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [countdown, setCountdown] = useState(180) // 3分钟 = 180秒
  const timerRef = useRef<any>(null)

  // 计算总价
  const totalOriginalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const totalDiscountPrice = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0)
  const totalSavings = totalOriginalPrice - totalDiscountPrice
  const hasItems = items.length > 0

  // 倒计时逻辑
  useEffect(() => {
    if (hasItems && isExpanded) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            // 时间到，可以触发重置逻辑
            Taro.showToast({
              title: '支付超时了呦，快快重新下单吧~',
              icon: 'none'
            })
            setIsExpanded(false)
            return 180
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [hasItems, isExpanded])

  // 格式化倒计时显示
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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

  const handleCheckoutClick = () => {
    if (!hasItems) {
      Taro.showToast({
        title: '请先选择服务',
        icon: 'none'
      })
      return
    }
    
    setIsExpanded(true)
  }

  const handleMaskClick = () => {
    // 如果有待处理操作且提供了撤销函数，执行撤销
    if (onMaskClick && hasPendingAction) {
      onMaskClick()
    }
    setIsExpanded(false)
  }

  const handleContinue = () => {
    // 执行继续预约操作
    if (onContinue) {
      onContinue()
    }
    setIsExpanded(false)
  }

  const handleConfirmCheckout = () => {
    onCheckout()
  }

  return (
    <>
      {/* 半透明遮罩 */}
      {isExpanded && (
        <View className="cart-mask" onClick={handleMaskClick} />
      )}

      {/* 底部固定栏 */}
      <View className="shopping-cart">
        <View className="cart-bar">
          <View className="cart-info">
            {hasItems ? (
              <>
                <Text className="total-price">¥{totalDiscountPrice}</Text>
                {totalSavings > 0 && (
                  <Text className="savings">已优惠¥{totalSavings}</Text>
                )}
              </>
            ) : (
              <Text className="empty-text">请选择服务项目</Text>
            )}
          </View>
          
          <View 
            className={`checkout-btn ${!hasItems ? 'disabled' : ''}`} 
            onClick={handleCheckoutClick}
          >
            去结算
          </View>
        </View>
      </View>

      {/* 展开的购物车详情 */}
      {isExpanded && (
        <View className="cart-expanded">
          <View className="expanded-header">
            <Text className="title">已选推拿师({items.length})位</Text>
            <Text className="action" onClick={handleContinue}>继续预约</Text>
          </View>

          {/* 服务详情 */}
          <View className="service-list">
            {items.map((item, index) => (
              <View key={index} className="service-item">
                <Image 
                  className="therapist-avatar" 
                  src={item.therapistAvatar || therapist?.avatar || ''} 
                />
                <View className="service-info">
                  <View className="info-header">
                    <Text className="therapist-name">{item.therapistName}</Text>
                    <Text className="duration">{item.duration}分钟</Text>
                  </View>
                  <View className="info-detail">
                    <Text className="service-name">{item.serviceName}</Text>
                  </View>
                  <View className="info-time">
                    <Text className="time-text">
                      {formatDate(item.date)} {item.time} 至 {
                        // 计算结束时间
                        (() => {
                          const [hour, minute] = item.time.split(':').map(Number)
                          const endMinute = minute + item.duration
                          const endHour = hour + Math.floor(endMinute / 60)
                          const finalMinute = endMinute % 60
                          return `${endHour}:${finalMinute.toString().padStart(2, '0')}`
                        })()
                      }
                    </Text>
                  </View>
                </View>
                <View className="price-info">
                  <Text className="price">¥{item.discountPrice || item.price}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 可选增值项目 */}
          <View className="addon-section">
            <Text className="section-title">可选增值项目</Text>
            <View className="addon-list">
              <View className="addon-item">
                <View className="addon-info">
                  <Text className="addon-name">刮痧20分钟</Text>
                  <Text className="addon-price">¥ 99</Text>
                </View>
                <View className="addon-action">+</View>
              </View>
              <View className="addon-item">
                <View className="addon-info">
                  <Text className="addon-name">加钟20分钟</Text>
                  <Text className="addon-price">¥ 99</Text>
                </View>
                <View className="addon-action">+</View>
              </View>
            </View>
          </View>

          {/* 底部结算信息 */}
          <View className="checkout-section">
            <View className="price-summary">
              <View className="cart-icon">
                <Text className="icon">🛒</Text>
                <View className="badge">1</View>
              </View>
              <View className="price-detail">
                <Text className="final-price">¥ {totalDiscountPrice}</Text>
                {totalOriginalPrice > totalDiscountPrice && (
                  <Text className="original-price">¥ {totalOriginalPrice}</Text>
                )}
              </View>
              <Text className="discount-tip">已享受最大优惠减20元</Text>
            </View>
            
            <View className="checkout-footer">
              <Text className="countdown">支付倒计时: {formatCountdown(countdown)}</Text>
              <View className="confirm-btn" onClick={handleConfirmCheckout}>
                去结算
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  )
}

export default ShoppingCart