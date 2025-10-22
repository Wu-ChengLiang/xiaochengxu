import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import { GiftCard } from '@/types'
import './index.scss'

const CardDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [cardInfo, setCardInfo] = useState<GiftCard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const card = GiftService.getGiftCardById(id as string)
      if (card) {
        setCardInfo(card)
      }
      setLoading(false)
    }
  }, [id])

  const handlePurchase = () => {
    Taro.navigateTo({
      url: '/pages/gift/purchase/index'
    })
  }


  if (loading) {
    return (
      <View className="card-detail-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  if (!cardInfo) {
    return (
      <View className="card-detail-page">
        <View className="empty">礼卡不存在</View>
      </View>
    )
  }

  return (
    <View className="card-detail-page">
      {/* 礼卡展示区 */}
      <View className="card-display">
        <Image 
          className="card-image" 
          src={cardInfo.image}
          mode="aspectFill"
        />
      </View>

      {/* 礼卡信息 */}
      <View className="card-info">
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

      {/* 使用须知 */}
      <View className="terms-section">
        <Text className="section-title">使用须知</Text>
        <Text className="terms-text">{cardInfo.terms}</Text>
      </View>

      {/* 底部操作栏 */}
      <View className="action-bar">
        <Button className="action-btn purchase-btn" onClick={handlePurchase}>
          <AtIcon value="shopping-cart" size="20" />
          <Text>立即购买</Text>
        </Button>
      </View>
    </View>
  )
}

export default CardDetail