import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { orderService, CreateOrderParams } from '@/services/order'
import { storeService } from '@/services/store'
import { therapistService } from '@/services/therapist'
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
      console.log('页面参数:', params)
      console.log('原始items参数:', params.items)
      
      const decodedItems = decodeURIComponent(params.items || '[]')
      console.log('解码后的items:', decodedItems)
      
      const items = JSON.parse(decodedItems)
      console.log('解析后的购物车项目:', items)
      
      setCartItems(items)
      
      // 获取推拿师和门店信息
      fetchTherapistAndStoreInfo()
    } catch (error) {
      console.error('数据解析失败:', error)
      Taro.showToast({
        title: `数据解析失败: ${error.message}`,
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
              title: '支付超时了呦',
              content: '快快重新下单吧~',
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
      
      console.log('获取信息参数:', { therapistId: params.therapistId, storeId: params.storeId })
      
      // 获取推拿师信息
      const therapistRes = await therapistService.getTherapistDetail(params.therapistId)
      const therapistData = therapistRes.data
      console.log('推拿师信息:', therapistData)
      
      // 获取门店信息
      const storeRes = await storeService.getStoreDetail(params.storeId)
      const storeData = storeRes.data
      console.log('门店信息:', storeData)
      
      setTherapistInfo(therapistData)
      setStoreInfo(storeData)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('获取信息失败:', error)
      Taro.showToast({
        title: `获取信息失败: ${error.message || '未知错误'}`,
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
    // 添加调试信息
    console.log('支付检查:', {
      cartItemsLength: cartItems.length,
      hasTherapistInfo: !!therapistInfo,
      hasStoreInfo: !!storeInfo,
      cartItems,
      therapistInfo,
      storeInfo
    })
    
    if (cartItems.length === 0 || !therapistInfo || !storeInfo) {
      const missingInfo = []
      if (cartItems.length === 0) missingInfo.push('购物车为空')
      if (!therapistInfo) missingInfo.push('推拿师信息缺失')
      if (!storeInfo) missingInfo.push('门店信息缺失')
      
      Taro.showToast({
        title: `订单信息不完整: ${missingInfo.join(', ')}`,
        icon: 'none',
        duration: 3000
      })
      return
    }

    try {
      Taro.showLoading({
        title: '创建订单...'
      })

      // 使用第一个购物项的信息（如果有多个服务，可以后续优化）
      const firstItem = cartItems[0]
      const orderParams: CreateOrderParams = {
        therapistId: params.therapistId,
        storeId: params.storeId,
        serviceId: firstItem.serviceId,
        serviceName: firstItem.serviceName,
        duration: firstItem.duration,
        price: firstItem.price,
        discountPrice: firstItem.discountPrice,
        appointmentDate: firstItem.date,
        appointmentTime: firstItem.time,
        therapistName: firstItem.therapistName,
        therapistAvatar: firstItem.therapistAvatar || therapistInfo.avatar
      }

      // 创建订单
      const order = await orderService.createOrder(orderParams)
      
      Taro.hideLoading()
      Taro.showLoading({
        title: '正在支付...'
      })

      // 获取支付参数
      const paymentParams = await orderService.getPaymentParams(order.orderNo)
      
      Taro.hideLoading()
      
      // 调用微信支付（Mock环境直接模拟成功）
      if (process.env.NODE_ENV === 'development') {
        // 开发环境Mock支付成功
        await orderService.updateOrderStatus(order.orderNo, 'paid')
        
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500
        })
        
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/booking/success/index?orderNo=${order.orderNo}`
          })
        }, 1500)
      } else {
        // 生产环境调用真实支付
        Taro.requestPayment({
          ...paymentParams,
          success: async () => {
            // 更新订单状态为已支付
            await orderService.updateOrderStatus(order.orderNo, 'paid')
            
            Taro.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500
            })
            
            setTimeout(() => {
              Taro.redirectTo({
                url: `/pages/booking/success/index?orderNo=${order.orderNo}`
              })
            }, 1500)
          },
          fail: (err) => {
            console.error('支付失败:', err)
            if (err.errMsg !== 'requestPayment:fail cancel') {
              // 如果是缺少total_fee的错误，给出更明确的提示
              if (err.errMsg && err.errMsg.includes('total_fee')) {
                Taro.showToast({
                  title: '支付参数错误：缺少金额信息',
                  icon: 'none',
                  duration: 2500
                })
              } else {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              }
            }
          }
        })
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '订单创建失败',
        icon: 'none'
      })
    }
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
            • 下单15分钟内或距订单开始时间&gt;6小时退单，退100%
          </View>
          <View className="policy-item">
            • 距订单开始前&lt;6小时退单，退实付金额90%
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