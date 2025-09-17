import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import './index.scss'

const OrderConfirm: React.FC = () => {
  const router = useRouter()
  const { orderNo, amount, quantity } = router.params
  const [paymentMethod, setPaymentMethod] = useState('wechat')

  const totalAmount = Number(amount) * Number(quantity)

  const handlePayment = async () => {
    if (!orderNo) {
      Taro.showToast({
        title: '订单信息错误',
        icon: 'none'
      })
      return
    }

    try {
      Taro.showLoading({ title: '支付中...' })

      const result = await GiftService.payOrder({
        orderNo: orderNo as string,
        paymentMethod: paymentMethod as 'wechat' | 'balance'
      })

      Taro.hideLoading()

      if (result.paymentMethod === 'wechat' && result.wxPayParams) {
        await GiftService.handleWechatPay(result.wxPayParams)
      }

      Taro.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000
      })

      setTimeout(() => {
        // 支付成功后跳转到礼卡列表或我的页面
        Taro.navigateBack({ delta: 2 })
      }, 2000)
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '支付失败',
        icon: 'none'
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
              src="/assets/images/gift/card/gift-card.png"
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
        
        <View 
          className={`payment-method ${paymentMethod === 'wechat' ? 'selected' : ''}`}
          onClick={() => setPaymentMethod('wechat')}
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