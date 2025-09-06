import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { getProductById } from '@/mock/data/gifts'
import './index.scss'

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [productInfo, setProductInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      const product = getProductById(id as string)
      if (product) {
        setProductInfo(product)
      }
      setLoading(false)
    }
  }, [id])

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }

  const handleBuyNow = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }

  if (loading) {
    return (
      <View className="product-detail-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  if (!productInfo) {
    return (
      <View className="product-detail-page">
        <View className="empty">商品不存在</View>
      </View>
    )
  }

  return (
    <View className="product-detail-page">
      {/* 商品图片轮播 */}
      <Swiper className="product-swiper" circular autoplay>
        <SwiperItem>
          <Image 
            className="product-image" 
            src={productInfo.image}
            mode="aspectFill"
          />
        </SwiperItem>
      </Swiper>

      {/* 商品信息 */}
      <View className="product-info">
        <View className="price-section">
          <View className="price-row">
            <Text className="price">¥{productInfo.price.toFixed(2)}</Text>
            <Text className="original-price">¥{productInfo.originalPrice.toFixed(2)}</Text>
          </View>
          <Text className="unit">/{productInfo.unit}</Text>
        </View>
        <Text className="product-name">{productInfo.name}</Text>
        <Text className="product-desc">{productInfo.description}</Text>
      </View>

      {/* 商品特色 */}
      <View className="features-section">
        <Text className="section-title">产品特色</Text>
        <View className="features-list">
          {productInfo.features.map((feature: string, index: number) => (
            <View key={index} className="feature-item">
              <View className="feature-dot" />
              <Text className="feature-text">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 规格参数 */}
      <View className="specs-section">
        <Text className="section-title">规格参数</Text>
        <View className="specs-list">
          {Object.entries(productInfo.specifications).map(([key, value]) => (
            <View key={key} className="spec-item">
              <Text className="spec-label">{key}</Text>
              <Text className="spec-value">{value as string}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 数量选择 */}
      <View className="quantity-section">
        <Text className="section-title">购买数量</Text>
        <View className="quantity-selector">
          <View 
            className="quantity-btn"
            onClick={() => handleQuantityChange('decrease')}
          >
            <AtIcon value="subtract" size="20" color={quantity === 1 ? '#ccc' : '#333'} />
          </View>
          <Text className="quantity-value">{quantity}</Text>
          <View 
            className="quantity-btn"
            onClick={() => handleQuantityChange('increase')}
          >
            <AtIcon value="add" size="20" color="#333" />
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className="action-bar">
        <Button className="action-btn cart-btn" onClick={handleAddToCart}>
          <AtIcon value="shopping-cart" size="20" />
          <Text>加入购物车</Text>
        </Button>
        <Button className="action-btn buy-btn" onClick={handleBuyNow}>
          立即购买
        </Button>
      </View>
    </View>
  )
}

export default ProductDetail