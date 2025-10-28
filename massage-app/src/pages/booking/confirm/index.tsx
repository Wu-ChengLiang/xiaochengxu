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
import { getCurrentUserInfo, requireLogin } from '@/utils/user'
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
  // 模式1：新预约
  therapistId?: string
  storeId?: string
  items?: string // JSON string of CartItem[]
  from?: string  // 来源标识，如 'symptom'

  // 模式2：已有订单
  orderNo?: string  // 订单号
}

interface ExistingOrder {
  orderNo: string
  amount: number  // 分为单位
  title: string
  paymentMethod: 'wechat' | 'balance'
  paymentStatus: string
  extraData?: {
    therapistName?: string
    therapistAvatar?: string
    serviceName?: string
    appointmentDate?: string
    startTime?: string
    duration?: number
    storeId?: string
    storeName?: string
    storeAddress?: string
  }
}

const OrderConfirmPage: React.FC = () => {
  const router = useRouter()
  const params = router.params as unknown as OrderConfirmPageParams

  // ✅ 判断模式：新预约 vs 已有订单
  const isExistingOrderMode = !!params.orderNo
  const isNewAppointmentMode = !isExistingOrderMode

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [therapistInfo, setTherapistInfo] = useState<any>(null)
  const [storeInfo, setStoreInfo] = useState<any>(null)
  const [existingOrder, setExistingOrder] = useState<ExistingOrder | null>(null)  // ✅ 新增：已有订单
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(180) // 3分钟倒计时
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat')
  const [userBalance, setUserBalance] = useState(0) // 用户余额
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [userDiscountRate, setUserDiscountRate] = useState<number | null>(null) // 用户折扣率
  const [hasVoucher, setHasVoucher] = useState(false) // 是否有优惠券
  const timerRef = useRef<any>(null)

  useEffect(() => {
    // ✅ 在支付前检查登录状态
    const initializePage = async () => {
      try {
        // 先检查用户登录状态
        const isLoggedIn = await requireLogin()
        if (!isLoggedIn) {
          return
        }

        // ✅ 区分模式初始化
        if (isExistingOrderMode) {
          // 模式2：已有订单 - 加载订单详情
          fetchExistingOrder()
        } else {
          // 模式1：新预约 - 解析购物车数据
          const items = JSON.parse(decodeURIComponent(params.items || '[]'))
          setCartItems(items)
          fetchTherapistAndStoreInfo()
        }

        // 两个模式都需要获取用户余额和折扣
        fetchUserBalance()
        fetchUserDiscount()
      } catch (error) {
        Taro.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
        setTimeout(() => Taro.navigateBack(), 1500)
      }
    }

    initializePage()
  }, [params])

  // 倒计时逻辑（仅新预约模式需要）
  useEffect(() => {
    // ✅ 已有订单模式不需要倒计时
    if (!loading && isNewAppointmentMode && cartItems.length > 0) {
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
  }, [loading, cartItems, isNewAppointmentMode])

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
      const balance = await walletService.getBalance()  // 返回分为单位
      setUserBalance(balance / 100)  // ✅ 转换为元存储

      // 如果余额充足，默认选择余额支付
      // ✅ 两个都是元，直接比较
      const totalPrice = getTotalPrice()  // 元
      if (balance / 100 >= totalPrice) { // balance(元) >= totalPrice(元)
        setPaymentMethod('balance')
      }
    } catch (error) {
      console.error('获取余额失败:', error)
      setUserBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }

  // ✅ 新增：获取已有订单详情
  const fetchExistingOrder = async () => {
    try {
      setLoading(true)
      const order = await orderService.getOrderDetail(params.orderNo!)
      setExistingOrder(order)

      // 获取门店信息（如果订单中有storeId）
      if (order.extraData?.storeId) {
        try {
          const storeRes = await storeService.getStoreDetail(order.extraData.storeId)
          setStoreInfo(storeRes.data)
        } catch (error) {
          console.error('获取门店信息失败:', error)
        }
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      Taro.showToast({
        title: '获取订单信息失败',
        icon: 'none'
      })
      setTimeout(() => Taro.navigateBack(), 1500)
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
      const storeRes = await storeService.getStoreDetail(params.storeId!)
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
    // ✅ 已有订单模式：直接使用订单金额（转为元）
    if (isExistingOrderMode && existingOrder) {
      return existingOrder.amount / 100  // 订单金额是分，转为元
    }

    // 新预约模式：计算购物车总价
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
    // ✅ 已有订单模式：与总价相同（不显示划线价）
    if (isExistingOrderMode && existingOrder) {
      return existingOrder.amount / 100
    }

    // 新预约模式：计算原价
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
      // ✅ 区分两个模式
      if (isExistingOrderMode) {
        // 模式2：已有订单 - 直接支付
        await handleExistingOrderPayment()
      } else {
        // 模式1：新预约 - 创建订单后支付
        await handleNewAppointmentPayment()
      }
    } catch (error: any) {
      console.error('❌ 支付流程错误:', error)
      Taro.hideLoading()

      // 错误提示：将"请求的资源不存在"转换为"该技师已被预约"
      let errorMessage = error.message || error.errMsg || '支付失败'

      // 检查是否是"请求的资源不存在"或"已经预约"相关的错误，统一显示为"该技师已被预约"
      if (error.response?.data?.errorCode === 1003 ||
          error.response?.data?.errorCode === 1004 ||
          error.message?.includes('资源不存在') ||
          error.message?.includes('已经预约') ||
          error.message?.includes('重复')) {
        errorMessage = '该技师已被预约'
      }

      Taro.showModal({
        title: '提示',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }

  // ✅ 新增：处理已有订单的支付
  const handleExistingOrderPayment = async () => {
    if (!existingOrder) {
      throw new Error('订单信息丢失')
    }

    Taro.showLoading({
      title: '准备支付...'
    })

    try {
      const orderNo = existingOrder.orderNo
      const amount = existingOrder.amount  // 分为单位

      // 根据支付方式处理
      if (paymentMethod === 'wechat') {
        // 获取微信支付参数
        console.log('💳 获取微信支付参数，订单号:', orderNo)
        const paymentParams = await orderService.getPaymentParams(orderNo)

        console.log('💳 支付参数获取成功:', paymentParams)

        if (!paymentParams) {
          throw new Error('获取支付参数失败')
        }

        Taro.hideLoading()

        // 调用统一支付接口
        const paymentSuccess = await paymentService.pay({
          orderNo: orderNo,
          amount: amount,
          paymentMethod: 'wechat',
          title: existingOrder.title,
          wxPayParams: paymentParams
        } as any)

        if (paymentSuccess) {
          // 支付成功，跳转确认页
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/booking/success/index?orderNo=${orderNo}`
            })
          }, 1500)
        }
      } else {
        // 余额支付 - 直接调用支付接口
        console.log('💰 余额支付，订单号:', orderNo)

        const paymentSuccess = await paymentService.pay({
          orderNo: orderNo,
          amount: amount,
          paymentMethod: 'balance',
          title: existingOrder.title
        } as any)

        Taro.hideLoading()

        if (paymentSuccess) {
          // 支付成功，更新余额并跳转确认页
          await fetchUserBalance()

          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/booking/success/index?orderNo=${orderNo}`
            })
          }, 1500)
        }
      }
    } catch (error) {
      Taro.hideLoading()
      throw error
    }
  }

  // ✅ 改造：处理新预约的支付（现有逻辑）
  const handleNewAppointmentPayment = async () => {
    // 症状调理模式下推拿师信息在cartItems中，不需要therapistInfo
    const isSymptomMode = params.from === 'symptom'
    const needTherapistInfo = !isSymptomMode && !therapistInfo

    if (cartItems.length === 0 || needTherapistInfo || !storeInfo) {
      throw new Error('订单信息不完整')
    }

    Taro.showLoading({
      title: '创建订单...'
    })

    // 使用第一个购物项的信息（如果有多个服务，可以后续优化）
    const firstItem = cartItems[0]

    const orderParams: CreateOrderParams = {
      therapistId: firstItem.therapistId || params.therapistId || 'symptom-mode',
      storeId: params.storeId!,
      serviceId: firstItem.serviceId,
      serviceName: firstItem.serviceName,
      duration: firstItem.duration,
      price: firstItem.price,
      discountPrice: firstItem.discountPrice,
      appointmentDate: firstItem.date,
      appointmentTime: firstItem.time,
      therapistName: firstItem.therapistName,
      therapistAvatar: firstItem.therapistAvatar || (therapistInfo?.avatar),
      paymentMethod: paymentMethod  // ✅ 新增：传递用户选择的支付方式
    }

    // 创建订单
    console.log('📝 创建订单，支付方式:', paymentMethod)
    const result = await orderService.createAppointmentOrder(orderParams)
    const order = result.order

    Taro.hideLoading()

    if (!order || !order.orderNo) {
      throw new Error('订单创建失败，未返回订单号')
    }

    // 微信支付需要检查wxPayParams
    if (paymentMethod === 'wechat') {
      if (!order.wxPayParams) {
        throw new Error('微信支付参数缺失，请检查用户登录状态或尝试余额支付')
      }
    }

    // 调用统一支付接口
    const paymentSuccess = await paymentService.pay({
      orderNo: order.orderNo,
      amount: (order.totalAmount || getTotalPrice()) * 100,
      paymentMethod: paymentMethod,
      title: `${firstItem.serviceName} - ${firstItem.therapistName}`,
      wxPayParams: order.wxPayParams
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
        {isExistingOrderMode && existingOrder ? (
          // ✅ 已有订单显示方式
          <View className="booking-item">
            {existingOrder.extraData?.therapistAvatar && (
              <Image
                className="therapist-avatar"
                src={existingOrder.extraData.therapistAvatar}
              />
            )}
            <View className="booking-details">
              <View className="therapist-name">{existingOrder.extraData?.therapistName || '推拿师'}</View>
              <View className="service-time">
                {existingOrder.extraData?.appointmentDate && existingOrder.extraData?.startTime && (
                  <>
                    {formatDate(existingOrder.extraData.appointmentDate)} {existingOrder.extraData.startTime}
                    {existingOrder.extraData.duration && (
                      <> 至 {calculateEndTime(existingOrder.extraData.startTime, existingOrder.extraData.duration)}</>
                    )}
                  </>
                )}
              </View>
              <View className="service-name">{existingOrder.extraData?.serviceName || existingOrder.title}</View>
            </View>
            <View className="service-price">¥{(existingOrder.amount / 100).toFixed(2)}</View>
          </View>
        ) : (
          // 新预约显示方式
          cartItems.map((item, index) => (
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
          ))
        )}
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
          {/* ✅ 仅新预约模式显示倒计时 */}
          {isNewAppointmentMode && (
            <Text className="countdown">支付倒计时: {formatCountdown(countdown)}</Text>
          )}
        </View>
        <View className="pay-button" onClick={handlePayment}>
          去支付
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderConfirmPage