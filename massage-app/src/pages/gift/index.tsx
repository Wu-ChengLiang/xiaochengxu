import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getAllGiftCards, getAllProducts } from '@/mock/data/gifts'
import './index.scss'

const Gift: React.FC = () => {
  const giftCards = getAllGiftCards()
  const products = getAllProducts()

  const handleCardClick = (cardId: string) => {
    Taro.navigateTo({
      url: `/pages/gift/card-detail/index?id=${cardId}`
    })
  }

  const handleProductClick = (productId: string) => {
    Taro.navigateTo({
      url: `/pages/gift/product-detail/index?id=${productId}`
    })
  }

  return (
    <View className="gift-page">
      {/* 礼卡部分 */}
      <View className="section">
        <Text className="section-title">常乐礼卡</Text>
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
        <Text className="section-title">常乐周边</Text>
        <View className="products">
          {products.map((product) => (
            <View 
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <Image 
                className="product-image" 
                src={product.image}
                mode="aspectFill"
              />
              <View className="product-info">
                <Text className="product-name">{product.name}</Text>
                <View className="price-row">
                  <Text className="price">¥{product.price.toFixed(2)}</Text>
                  <Text className="unit">起</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default Gift