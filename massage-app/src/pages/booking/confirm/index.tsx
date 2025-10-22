import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { orderService, CreateOrderParams } from '@/services/order'
import { storeService } from '@/services/store'
import { therapistService } from '@/services/therapist'
import { walletService } from '@/services/wallet.service'
import { paymentService } from '@/services/payment.service'
import { voucherService } from '@/services/voucher.service'
import { calculateDiscountPrice } from '@/types/voucher'
import { getCurrentUserInfo } from '@/utils/user'
import './index.scss'

interface CartItem {
  id?: string  // 唯一标识符（可选，向后兼容）
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistId?: string
  therapistName: string
  therapistAvatar?: string
}

interface OrderConfirmPageParams {
  therapistId?: string
  storeId: string
  items: string // JSON string of CartItem[]
  from?: string  // 来源标识，如 'symptom'
}

const OrderConfirmPage: React.FC = () => {
  const router = useRouter()
  const params = router.params as unknown as OrderConfirmPageParams
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [therapistInfo, setTherapistInfo] = useState<any>(null)
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(180) // 3分钟倒计时
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat')
  const [userBalance, setUserBalance] = useState(0) // 用户余额
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [userDiscountRate, setUserDiscountRate] = useState<number | null>(null) // 用户折扣率
  const [hasVoucher, setHasVoucher] = useState(false) // 是否有优惠券
  const timerRef = useRef<any>(null)

  useEffect(() => {
    // 解析传递的数据
    try {
      const items = JSON.parse(decodeURIComponent(params.items || '[]'))
      setCartItems(items)

      // 获取推拿师和门店信息
      fetchTherapistAndStoreInfo()
      // 获取用户余额
      fetchUserBalance()
      // 获取用户折扣信息
      fetchUserDiscount()
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

  // 获取用户折扣信息
  const fetchUserDiscount = async () => {
    try {
      const userInfo = getCurrentUserInfo()
      if (userInfo && userInfo.discountRate) {
        setUserDiscountRate(userInfo.discountRate)
        // 检查是否有优惠券
        const vouchers = await voucherService.getMyVouchers()
        setHasVoucher(vouchers.length > 0)
      }
    } catch (error) {
      console.error('获取用户折扣信息失败:', error)
    }
  }

  // 获取用户余额
  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true)
      const balance = await walletService.getBalance()  // 返回值是元
      setUserBalance(balance)

      // 如果余额充足，默认选择余额支付
      // ✅ getTotalPrice()返回元，balance也是元，直接比较
      const totalPrice = getTotalPrice()  // 元
      if (balance >= totalPrice) { // balance(元) >= totalPrice(元)
        setPaymentMethod('balance')
      }
    } catch (error) {
      console.error('获取余额失败:', error)
      setUserBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }

  const fetchTherapistAndStoreInfo = async () => {
    try {
      setLoading(true)

      // 获取推拿师信息（仅在有therapistId时获取）
      if (params.therapistId) {
        const therapistRes = await therapistService.getTherapistDetail(params.therapistId)
        setTherapistInfo(therapistRes.data)
      }

      // 获取门店信息
      const storeRes = await storeService.getStoreDetail(params.storeId)
      const storeData = storeRes.data

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
    const originalTotal = cartItems.reduce((sum, item) => sum + item.price, 0)
    // 如果有折扣率，计算折后价
    if (userDiscountRate && userDiscountRate < 1) {
      const discountInfo = calculateDiscountPrice(originalTotal, userDiscountRate)
      return discountInfo.finalPrice
    }
    // 否则使用原价或已有的折扣价
    return cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0)
  }

  // 获取原价（用于展示划线价）
  const getOriginalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0)
  }

  // 获取节省金额
  const getSavedAmount = () => {
    const originalTotal = getOriginalPrice()
    const finalTotal = getTotalPrice()
    return originalTotal - finalTotal
  }

  // 获取折扣描述
  const getDiscountDisplay = () => {
    if (userDiscountRate && userDiscountRate < 1) {
      const percentage = Math.round(userDiscountRate * 100)
      return `${percentage}折`
    }
    return ''
  }

  // 检查余额是否充足
  const isBalanceSufficient = () => {
    const totalPrice = getTotalPrice()  // 元
    return userBalance >= totalPrice   // 两个都是元，直接比较
  }

  // 处理支付方式切换
  const handlePaymentMethodChange = (method: 'wechat' | 'balance') => {
    if (method === 'balance' && !isBalanceSufficient()) {
      Taro.showToast({
        title: '余额不足，请充值或使用其他支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    setPaymentMethod(method)
  }

  const handlePayment = async () => {
    // 症状调理模式下推拿师信息在cartItems中，不需要therapistInfo
    const isSymptomMode = params.from === 'symptom'
    const needTherapistInfo = !isSymptomMode && !therapistInfo

    if (cartItems.length === 0 || needTherapistInfo || !storeInfo) {
      Taro.showToast({
        title: '订单信息不完整',
        icon: 'none'
      })
      return
    }

    // 余额支付前再次检查余额
    if (paymentMethod === 'balance' && !isBalanceSufficient()) {
      Taro.showToast({
        title: '余额不足，请充值或使用其他支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }

    try {
      Taro.showLoading({
        title: '创建订单...'
      })

      // 使用第一个购物项的信息（如果有多个服务，可以后续优化）
      const firstItem = cartItems[0]

      // 调试日志 - 查看购物车项目数据
      console.log('🛒 购物车第一个项目:', firstItem)
      console.log('🛒 firstItem.therapistId:', firstItem.therapistId)
      console.log('🛒 params.therapistId:', params.therapistId)
      console.log('🛒 params.from:', params.from)

      const orderParams: CreateOrderParams = {
        therapistId: firstItem.therapistId || params.therapistId || 'symptom-mode', // 优先使用购物车中的技师ID
        storeId: params.storeId,
        serviceId: firstItem.serviceId,
        serviceName: firstItem.serviceName,
        duration: firstItem.duration,
        price: firstItem.price,
        discountPrice: firstItem.discountPrice,
        appointmentDate: firstItem.date,
        appointmentTime: firstItem.time,
        therapistName: firstItem.therapistName,
        therapistAvatar: firstItem.therapistAvatar || (therapistInfo?.avatar)
      }

      // 调试日志 - 查看最终的订单参数
      console.log('📦 最终的订单参数:', orderParams)
      console.log('📦 therapistId将要传递的值:', orderParams.therapistId)

      // 创建订单
      const result = await orderService.createAppointmentOrder(orderParams)
      const order = result.order

      console.log('✅ 订单创建成功:', result)
      console.log('✅ 订单号:', order.orderNo)
      console.log('✅ 支付参数:', order.wxPayParams)

      Taro.hideLoading()

      // ✅ 检查订单创建结果
      if (!order || !order.orderNo) {
        throw new Error('订单创建失败，未返回订单号')
      }

      // ✅ 微信支付需要检查wxPayParams
      if (paymentMethod === 'wechat') {
        if (!order.wxPayParams) {
          throw new Error('微信支付参数缺失，请检查用户登录状态或尝试余额支付')
        }
        console.log('✅ 微信支付参数完整性检查:', {
          timeStamp: !!order.wxPayParams.timeStamp,
          nonceStr: !!order.wxPayParams.nonceStr,
          package: !!order.wxPayParams.package,
          signType: !!order.wxPayParams.signType,
          paySign: !!order.wxPayParams.paySign
        })
      }

      // 调用统一支付接口
      const paymentSuccess = await paymentService.pay({
        orderNo: order.orderNo,
        amount: (order.totalAmount || getTotalPrice()) * 100, // ✅ getTotalPrice()返回元，需要乘以100转为分
        paymentMethod: paymentMethod,
        title: `${firstItem.serviceName} - ${firstItem.therapistName}`,
        wxPayParams: order.wxPayParams  // 传递后端返回的微信支付参数
      } as any)

      if (paymentSuccess) {
        // 支付成功后更新余额显示
        if (paymentMethod === 'balance') {
          await fetchUserBalance()
        }

        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/booking/success/index?orderNo=${order.orderNo}`
          })
        }, 1500)
      }
      // 注意: 如果支付失败或用户取消, paymentService.pay() 内部已经显示错误提示
      // 不需要额外处理
    } catch (error) {
      console.error('❌ 支付流程错误:', error)
      Taro.hideLoading()

      // ✅ 显示更详细的错误信息
      const errorMessage = error.message || error.errMsg || '订单创建失败'
      Taro.showModal({
        title: '支付失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
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
          {/* 余额支付 */}
          <View
            className={`payment-method ${paymentMethod === 'balance' ? 'active' : ''} ${!isBalanceSufficient() ? 'disabled' : ''}`}
            onClick={() => handlePaymentMethodChange('balance')}
          >
            <View className="method-info">
              <Text className="method-icon">💰</Text>
              <Text className="method-name">余额支付</Text>
              <Text className="balance-amount">
                {balanceLoading ? '加载中...' : `¥${userBalance.toFixed(2)}`}
                {!isBalanceSufficient() && !balanceLoading && (
                  <Text className="insufficient"> (余额不足)</Text>
                )}
              </Text>
            </View>
            <View className={`check-icon ${paymentMethod === 'balance' ? 'checked' : ''}`} />
          </View>

          {/* 微信支付 */}
          <View
            className={`payment-method ${paymentMethod === 'wechat' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('wechat')}
          >
            <View className="method-info">
              <Text className="method-icon">💚</Text>
              <Text className="method-name">微信支付</Text>
            </View>
            <View className={`check-icon ${paymentMethod === 'wechat' ? 'checked' : ''}`} />
          </View>
        </View>
      </View>

      {/* 底部支付栏 */}
      <View className="payment-bar">
        <View className="price-info">
          {userDiscountRate && userDiscountRate < 1 && getSavedAmount() > 0 ? (
            <View className="price-with-discount">
              <View className="discount-info">
                <Text className="discount-tag">{getDiscountDisplay()}</Text>
                <Text className="saved-amount">已优惠 ¥{getSavedAmount()}</Text>
              </View>
              <View className="price-display">
                <Text className="original-price">¥{getOriginalPrice()}</Text>
                <Text className="total-price">¥{getTotalPrice()}</Text>
              </View>
            </View>
          ) : (
            <Text className="total-price">¥{getTotalPrice()}</Text>
          )}
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