import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { GiftService } from '@/services/gift.service'
import { getGiftShareConfig, getGiftShareTimelineConfig } from '@/utils/share'
import './index.scss'

const Gift: React.FC = () => {
  const giftCards = GiftService.getAllGiftCards()

  // 配置分享功能
  React.useEffect(() => {
    const shareConfig = getGiftShareConfig()
    Taro.useShareAppMessage(() => {
      return {
        title: shareConfig.title,
        path: shareConfig.path,
        imageUrl: shareConfig.imageUrl
      }
    })

    // 配置分享到朋友圈功能
    const shareTimelineConfig = getGiftShareTimelineConfig()
    Taro.useShareTimeline(() => {
      return {
        title: shareTimelineConfig.title,
        imageUrl: shareTimelineConfig.imageUrl
      }
    })
  }, [])

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