import React, { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon, AtInputNumber } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import './index.scss'

const GiftCardPurchase: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(200)
  const [customAmount, setCustomAmount] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const predefinedAmounts = [
    { value: 200, discount: null },
    { value: 500, discount: 50 },
    { value: 1000, discount: 100 },
    { value: 2000, discount: 200 },
  ]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount(0)
  }

  const handleCustomAmount = () => {
    setSelectedAmount(0)
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(value)
  }

  const handlePurchase = async () => {
    const amount = selectedAmount || customAmount
    if (!amount) {
      Taro.showToast({
        title: '请选择或输入金额',
        icon: 'none'
      })
      return
    }

    try {
      Taro.showLoading({ title: '创建订单...' })

      const order = await GiftService.createGiftCardOrder({
        amount: amount * 100, // 转换为分
        quantity,
        paymentMethod: 'wechat',
        customMessage: '世界上最好的爸爸'
      })

      Taro.hideLoading()

      // 跳转到确认页面，传递订单信息
      Taro.navigateTo({
        url: `/pages/gift/order-confirm/index?orderNo=${order.orderNo}&amount=${amount}&quantity=${quantity}`
      })
    } catch (error: any) {
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '创建订单失败',
        icon: 'none'
      })
    }
  }

  const getTotalPrice = () => {
    const amount = selectedAmount || customAmount || 0
    return amount * quantity
  }

  return (
    <View className="gift-card-purchase">
      {/* 礼卡展示 */}
      <View className="card-preview">
        <Image 
          className="card-image"
          src="https://mingyitang1024.com/static/card/gift-card.png"
          mode="aspectFit"
        />
        <View className="card-content">
          <Text className="card-title">世界上</Text>
          <Text className="card-subtitle">最好的爸爸</Text>
          <Text className="card-label">HEALTH CARD</Text>
          <View className="panda-illustration">
            {/* 熊猫插画占位 */}
          </View>
          <View className="brand-tag">
            <Text>常乐</Text>
          </View>
        </View>
        <Button className="diy-button">DIY自定义</Button>
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
              <Text className="amount">¥{item.value}</Text>
              {item.discount && (
                <Text className="discount">返余额{item.discount}.00元</Text>
              )}
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
              {!item.discount && selectedAmount !== item.value && (
                <AtIcon value="add-circle" size="24" color="#a40035" />
              )}
            </View>
          ))}
          
          {/* 自定义金额 */}
          <View 
            className={`amount-card custom ${selectedAmount === 0 && customAmount > 0 ? 'active' : ''}`}
            onClick={handleCustomAmount}
          >
            <Text className="custom-label">自定义金额</Text>
            {selectedAmount === 0 && (
              <AtInputNumber
                min={1}
                max={10000}
                step={1}
                value={customAmount}
                onChange={(value) => setCustomAmount(value as number)}
              />
            )}
            {selectedAmount !== 0 && (
              <AtIcon value="add-circle" size="24" color="#999" />
            )}
          </View>

          {/* 礼卡集采 */}
          <View className="amount-card bulk">
            <Text className="bulk-label">礼卡集采</Text>
            <AtIcon value="chevron-right" size="20" color="#999" />
          </View>
        </View>
      </View>

      {/* 使用规则 */}
      <View className="rules-section">
        <Text className="section-title">使用规则</Text>
        <View className="rules-content">
          <Text className="rule-desc">返金额说明：</Text>
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