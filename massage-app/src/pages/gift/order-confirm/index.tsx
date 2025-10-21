import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import { paymentService } from '@/services/payment.service'
import { walletService } from '@/services/wallet.service'
import './index.scss'

const OrderConfirm: React.FC = () => {
  const router = useRouter()
  const { orderNo, amount, quantity } = router.params
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat')
  const [userBalance, setUserBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const totalAmount = Number(amount) * Number(quantity)

  // 获取用户余额
  useEffect(() => {
    fetchUserBalance()
  }, [])

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true)
      const balance = await walletService.getBalance()
      setUserBalance(balance)

      // 如果余额充足，默认选择余额支付
      if (balance >= totalAmount) {
        setPaymentMethod('balance')
      }
    } catch (error) {
      console.error('获取余额失败:', error)
      setUserBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }

  // 检查余额是否充足
  const isBalanceSufficient = () => {
    return userBalance >= totalAmount
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
    if (!orderNo) {
      Taro.showToast({
        title: '订单信息错误',
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
      console.log('🎁 开始礼卡订单支付:', {
        orderNo,
        paymentMethod,
        totalAmount
      })

      // 先调用后端创建/获取订单，获取wxPayParams（如果是微信支付）
      Taro.showLoading({ title: '准备支付...' })

      const orderResult = await GiftService.payOrder({
        orderNo: orderNo as string,
        paymentMethod: paymentMethod
      })

      console.log('🎁 订单支付接口返回:', orderResult)
      Taro.hideLoading()

      // 使用统一的支付服务处理支付
      const paymentSuccess = await paymentService.pay({
        orderNo: orderNo as string,
        amount: totalAmount * 100, // 转换为分
        paymentMethod: paymentMethod,
        title: `电子礼卡 ¥${amount} × ${quantity}`,
        wxPayParams: orderResult.wxPayParams  // 传递后端返回的微信支付参数
      } as any)

      if (paymentSuccess) {
        // 支付成功后更新余额显示
        if (paymentMethod === 'balance') {
          await fetchUserBalance()
        }

        setTimeout(() => {
          // 支付成功后跳转到礼卡列表或我的页面
          Taro.navigateBack({ delta: 2 })
        }, 1500)
      }
      // 注意: 如果支付失败或用户取消, paymentService.pay() 内部已经显示错误提示
    } catch (error: any) {
      console.error('❌ 礼卡支付流程错误:', error)
      Taro.hideLoading()

      // 显示详细错误信息
      const errorMessage = error.message || error.errMsg || '支付失败'
      Taro.showModal({
        title: '支付失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }

  return (
    <View className="order-confirm">
      {/* 订单信息 */}
      <View className="order-info">
        <Text className="section-title">电子礼卡</Text>
        
        <View className="card-item">
          <View className="card-preview">
            <Image 
              className="card-thumb"
              src="https://mingyitang1024.com/static/card/gift-card.png"
              mode="aspectFill"
            />
            <View className="card-badge">
              <AtIcon value="tag" size="12" color="#fff" />
              <Text>世界上最好的爸爸</Text>
            </View>
          </View>
          
          <View className="card-details">
            <Text className="card-name">电子礼卡</Text>
            <View className="price-quantity">
              <Text className="price">¥ {amount}</Text>
              <Text className="quantity">×{quantity}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 支付方式 */}
      <View className="payment-section">
        <Text className="section-title">支付方式</Text>

        {/* 余额支付 */}
        <View
          className={`payment-method ${paymentMethod === 'balance' ? 'selected' : ''} ${!isBalanceSufficient() ? 'disabled' : ''}`}
          onClick={() => handlePaymentMethodChange('balance')}
        >
          <View className="method-info">
            <AtIcon value="money" size="20" color="#FF6B00" />
            <Text className="method-name">余额支付</Text>
            <Text className="balance-amount">
              {balanceLoading ? '加载中...' : `¥${userBalance.toFixed(2)}`}
              {!isBalanceSufficient() && !balanceLoading && (
                <Text className="insufficient"> (余额不足)</Text>
              )}
            </Text>
          </View>
          <AtIcon
            value={paymentMethod === 'balance' ? 'check-circle' : 'circle'}
            size="20"
            color={paymentMethod === 'balance' ? '#a40035' : '#999'}
          />
        </View>

        {/* 微信支付 */}
        <View
          className={`payment-method ${paymentMethod === 'wechat' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('wechat')}
        >
          <View className="method-info">
            <AtIcon value="sketch" size="20" color="#1AAD19" />
            <Text className="method-name">微信支付</Text>
          </View>
          <AtIcon
            value={paymentMethod === 'wechat' ? 'check-circle' : 'circle'}
            size="20"
            color={paymentMethod === 'wechat' ? '#a40035' : '#999'}
          />
        </View>
      </View>

      {/* 底部支付栏 */}
      <View className="payment-bar">
        <View className="total-amount">
          <Text className="amount-symbol">¥</Text>
          <Text className="amount-value">{totalAmount}</Text>
        </View>
        <Button className="pay-btn" onClick={handlePayment}>
          去支付
        </Button>
      </View>
    </View>
  )
}

export default OrderConfirm