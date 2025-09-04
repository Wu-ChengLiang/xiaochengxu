import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
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

interface OrderConfirmPageParams {
  therapistId: string
  storeId: string
  items: string // JSON string of CartItem[]
}

const OrderConfirmPage: React.FC = () => {
  const router = useRouter()
  const params = router.params as unknown as OrderConfirmPageParams
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [therapistInfo, setTherapistInfo] = useState<any>(null)
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(180) // 3分钟倒计时
  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const timerRef = useRef<any>(null)

  useEffect(() => {
    // 解析传递的数据
    try {
      const items = JSON.parse(decodeURIComponent(params.items || '[]'))
      setCartItems(items)
      
      // 获取推拿师和门店信息
      fetchTherapistAndStoreInfo()
    } catch (error) {
      Taro.showToast({
        title: '数据解析失败',
        icon: 'none'
      })
      setTimeout(() => Taro.navigateBack(), 1500)
    }
  }, [params])

  // 倒计时逻辑
  useEffect(() => {
    if (!loading && cartItems.length > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            Taro.showModal({
              title: '订单已超时',
              content: '请重新选择预约时间',
              showCancel: false,
              success: () => {
                Taro.navigateBack()
              }
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [loading, cartItems])

  const fetchTherapistAndStoreInfo = async () => {
    try {
      setLoading(true)
      
      // Mock 获取推拿师信息
      const therapistData = {
        id: params.therapistId,
        name: '王志香',
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        rating: 4.8,
        serviceCount: 10109
      }
      
      // Mock 获取门店信息
      const storeData = {
        id: params.storeId,
        name: '上海万象城店',
        address: '闵行区吴中路1599号万象城L501b（电影院门口）',
        distance: 8.8
      }
      
      setTherapistInfo(therapistData)
      setStoreInfo(storeData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Taro.showToast({
        title: '获取信息失败',
        icon: 'none'
      })
    }
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`
  }

  const calculateEndTime = (time: string, duration: number) => {
    const [hour, minute] = time.split(':').map(Number)
    const endMinute = minute + duration
    const endHour = hour + Math.floor(endMinute / 60)
    const finalMinute = endMinute % 60
    return `${endHour}:${finalMinute.toString().padStart(2, '0')}`
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0)
  }

  const handlePayment = async () => {
    // 创建订单
    const orderNo = `ORD${Date.now()}`
    
    Taro.showLoading({
      title: '正在支付...'
    })
    
    // Mock 支付流程
    setTimeout(() => {
      Taro.hideLoading()
      
      // Mock 支付成功
      Taro.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 1500
      })
      
      setTimeout(() => {
        // 跳转到支付成功页面
        Taro.redirectTo({
          url: `/pages/booking/success/index?orderNo=${orderNo}`
        })
      }, 1500)
    }, 2000)
  }

  if (loading) {
    return (
      <View className="order-confirm-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  return (
    <ScrollView className="order-confirm-page" scrollY>
      {/* 门店信息 */}
      <View className="store-section">
        <Text className="store-name">{storeInfo?.name}</Text>
        <Text className="store-distance">📍 {storeInfo?.distance}km</Text>
      </View>

      {/* 预约信息 */}
      <View className="booking-info">
        {cartItems.map((item, index) => (
          <View key={index} className="booking-item">
            <Image 
              className="therapist-avatar" 
              src={item.therapistAvatar || therapistInfo?.avatar} 
            />
            <View className="booking-details">
              <View className="therapist-name">{item.therapistName}</View>
              <View className="service-time">
                {formatDate(item.date)} {item.time} 至 {calculateEndTime(item.time, item.duration)}
              </View>
              <View className="service-name">{item.serviceName}</View>
            </View>
            <View className="service-price">¥{item.discountPrice || item.price}</View>
          </View>
        ))}
      </View>

      {/* 退单说明 */}
      <View className="refund-policy">
        <Text className="policy-title">退单说明</Text>
        <View className="policy-list">
          <View className="policy-item">
            • 下单15分钟内或距订单开始时间>6小时退单，退100%
          </View>
          <View className="policy-item">
            • 距订单开始前<6小时退单，退实付金额90%
          </View>
          <View className="policy-item">
            • 订单时间开始后退单，退实付金额80%
          </View>
        </View>
      </View>

      {/* 客户备注 */}
      <View className="customer-note">
        <Text className="note-title">客户备注</Text>
        <Text className="note-hint">您对茶水、房间、按摩服等是否有特殊需求，我们将提前为您做好准备</Text>
      </View>

      {/* 支付方式 */}
      <View className="payment-section">
        <Text className="section-title">支付方式</Text>
        <View className="payment-methods">
          <View 
            className={`payment-method ${paymentMethod === 'wechat' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('wechat')}
          >
            <View className="method-info">
              <Text className="method-icon">✅</Text>
              <Text className="method-name">微信支付</Text>
            </View>
            <View className={`check-icon ${paymentMethod === 'wechat' ? 'checked' : ''}`} />
          </View>
        </View>
      </View>

      {/* 底部支付栏 */}
      <View className="payment-bar">
        <View className="price-info">
          <Text className="total-price">¥ {getTotalPrice()}</Text>
          <Text className="countdown">支付倒计时: {formatCountdown(countdown)}</Text>
        </View>
        <View className="pay-button" onClick={handlePayment}>
          去支付
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderConfirmPage