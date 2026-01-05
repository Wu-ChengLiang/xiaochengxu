import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { GiftService } from '@/services/gift.service'
import './index.scss'

const Gift: React.FC = () => {
  const giftCards = GiftService.getAllGiftCards()

  // 分享功能
  useShareAppMessage(() => {
    return {
      title: '名医堂礼品卡-享受推拿好礼',
      path: '/pages/gift/index',
      imageUrl: require('@/assets/icons/logo.png')
    }
  })

  useShareTimeline(() => {
    return {
      title: '名医堂礼品卡-享受推拿好礼',
      imageUrl: require('@/assets/icons/logo.png')
    }
  })

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/gift/purchase/index?cardId=${cardId}`
    })
  }

  const handleNuantieClick = () => {
    Taro.navigateTo({
      url: '/pages/gift/nuantie/index'
    })
  }

  const handleAijiuClick = () => {
    Taro.navigateTo({
      url: '/pages/gift/aijiu/index'
    })
  }

  return (
    <View className="gift-page">
      {/* 礼卡部分 */}
      <View className="section">
        <Text className="section-title">名医堂礼卡</Text>
        <View className="gift-cards">
          {giftCards.map((card) => (
            <View
              key={card.id}
              className="gift-card"
              onClick={() => handleCardClick(card.id)}
            >
              <Image
                className="card-image"
                src={card.image}
                mode="aspectFill"
              />
            </View>
          ))}
        </View>
      </View>

      {/* 周边商品部分 */}
      <View className="section">
        <Text className="section-title">名医堂产品</Text>
        <View className="products">
          {/* 暖贴 */}
          <View
            className="product-card"
            onClick={handleNuantieClick}
          >
            <Image
              className="product-image"
              src="https://mingyitang1024.com/static/gift/product/nuantie/yaofu.jpg"
              mode="aspectFill"
            />
            <View className="product-info">
              <Text className="product-name">暖贴</Text>
              <View className="price-row">
                <Text className="price">¥99</Text>
                <Text className="unit">起</Text>
              </View>
            </View>
          </View>

          {/* 艾条 */}
          <View
            className="product-card"
            onClick={handleAijiuClick}
          >
            <Image
              className="product-image"
              src="https://mingyitang1024.com/static/gift/product/aijiu/xinaitiao.jpg"
              mode="aspectFill"
            />
            <View className="product-info">
              <Text className="product-name">艾条</Text>
              <View className="price-row">
                <Text className="price">¥99</Text>
                <Text className="unit">起</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Gift