import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { GiftService } from '@/services/gift.service'
import './index.scss'

const Gift: React.FC = () => {
  const giftCards = GiftService.getAllGiftCards()

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/gift/purchase/index?cardId=${cardId}`
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
    </View>
  )
}

export default Gift