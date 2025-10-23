import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import { paymentService } from '@/services/payment.service'
import { GiftCard } from '@/types'
import './index.scss'

const GiftCardPurchase: React.FC = () => {
  const router = useRouter()
  const { cardId } = router.params
  const [cardInfo, setCardInfo] = useState<GiftCard | null>(null)
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [quantity, setQuantity] = useState(1)  // 数量选择

  useEffect(() => {
    // 🎁 调试日志：检查礼卡加载
    console.log('🎁 电子礼卡页面加载')
    console.log('📍 router.params:', { cardId })

    if (cardId) {
      const card = GiftService.getGiftCardById(cardId as string)
      console.log('🔍 查询礼卡结果:', {
        cardId,
        found: !!card,
        card: card ? {
          id: card.id,
          name: card.name,
          image: card.image,
          type: card.type
        } : null
      })

      if (card) {
        setCardInfo(card)
        console.log('✅ 礼卡信息已设置')
      } else {
        console.warn('⚠️ 礼卡未找到:', cardId)
      }
    } else {
      console.warn('⚠️ cardId 未获取到:', cardId)
    }
  }, [cardId])

  const predefinedAmounts = [
    { value: 1000, label: '¥1000', bonus: '送100' },
    { value: 3000, label: '¥3000', bonus: '送500' },
  ]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(value)
  }

  const handlePurchase = async () => {
    const amount = selectedAmount
    if (!amount) {
      Taro.showToast({
        title: '请选择面额',
        icon: 'none'
      })
      return
    }

    try {
      // ✅ GiftService.createGiftCardOrder() 内部已处理 loading，不需要在这里重复
      const order = await GiftService.createGiftCardOrder({
        cardId: cardId as string,
        amount: amount * 100, // 转换为分
        quantity,
        paymentMethod: 'wechat',
        customMessage: '世界上最好的爸爸'
      })

      // ✅ 方案A：直接在购买页进行支付，不跳转到订单确认页
      console.log('🎁 订单创建成功，准备支付:', {
        orderNo: order.orderNo,
        amount: amount * quantity,
        quantity
      })

      // 进行微信支付
      const paymentSuccess = await paymentService.pay({
        orderNo: order.orderNo,
        amount: (amount * quantity) * 100, // 转换为分
        paymentMethod: 'wechat',
        title: `电子礼卡 ¥${amount} × ${quantity}`,
        wxPayParams: order.wxPayParams // ✅ 传递微信支付参数
      } as any)

      if (paymentSuccess) {
        // 支付成功后跳转回礼卡列表
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } catch (error: any) {
      console.error('❌ 礼卡购买失败:', error)
      Taro.hideLoading()  // ✅ 确保加载状态被隐藏
      Taro.showToast({
        title: error.message || '购买失败',
        icon: 'none'
      })
    }
  }

  const getTotalPrice = () => {
    return selectedAmount * quantity
  }

  if (!cardInfo) {
    return (
      <View className="gift-card-purchase">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  return (
    <View className="gift-card-purchase">
      {/* 卡片信息 */}
      <View className="card-info-section">
        <View className="card-image">
          <Image
            className="card-pic"
            src={cardInfo.image}
            mode="aspectFill"
          />
        </View>
        <Text className="card-name">{cardInfo.name}</Text>
        <Text className="card-desc">{cardInfo.description}</Text>
      </View>

      {/* 特色功能 */}
      <View className="features-section">
        <Text className="section-title">礼卡特色</Text>
        <View className="features-list">
          {cardInfo.features.map((feature: string, index: number) => (
            <View key={index} className="feature-item">
              <AtIcon value="check-circle" size="18" color="#a40035" />
              <Text className="feature-text">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 面额选择 */}
      <View className="amount-section">
        <Text className="section-title">请选择面额</Text>
        <View className="amount-grid">
          {predefinedAmounts.map((item) => (
            <View
              key={item.value}
              className={`amount-card ${selectedAmount === item.value ? 'active' : ''}`}
              onClick={() => handleAmountSelect(item.value)}
            >
              <View className="amount-header">
                <Text className="amount">{item.label}</Text>
              </View>
              <View className="amount-details">
                <Text className="bonus">{item.bonus}</Text>
              </View>
              {selectedAmount === item.value && (
                <View className="quantity-control">
                  <AtIcon
                    value="subtract-circle"
                    size="20"
                    color="#999"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (quantity > 1) handleQuantityChange(quantity - 1)
                    }}
                  />
                  <Text className="quantity">{quantity}</Text>
                  <AtIcon
                    value="add-circle"
                    size="20"
                    color="#a40035"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuantityChange(quantity + 1)
                    }}
                  />
                </View>
              )}
              {selectedAmount !== item.value && (
                <AtIcon value="add-circle" size="24" color="#a40035" />
              )}
            </View>
          ))}
          
        </View>
      </View>

      {/* 使用规则 */}
      <View className="rules-section">
        <Text className="section-title">使用说明</Text>
        <View className="rules-content">
          <Text className="rule-item">{cardInfo.terms}</Text>
          <Text className="rule-desc" style={{ marginTop: '16px' }}>返金额说明：</Text>
          <Text className="rule-item">(1) 电子卡返余额在礼卡分享成功后，自动充值至购买人的常乐推拿会员余额中。</Text>
        </View>
      </View>

      {/* 底部结算栏 */}
      <View className="purchase-bar">
        <View className="price-info">
          <AtIcon value="shopping-bag-2" size="24" color="#a40035" />
          <Text className="total-price">¥ {getTotalPrice()}</Text>
          <View className="quantity-badge">{quantity}</View>
        </View>
        <Button className="purchase-btn" onClick={handlePurchase}>
          去结算
        </Button>
      </View>
    </View>
  )
}

export default GiftCardPurchase