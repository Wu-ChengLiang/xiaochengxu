import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { GiftService } from '@/services/gift.service'
import { paymentService } from '@/services/payment.service'
import { getProductDetailShareConfig } from '@/utils/share'
import { Product } from '@/types'
import './index.scss'

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [productInfo, setProductInfo] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    if (id) {
      const product = GiftService.getProductById(id as string)
      if (product) {
        setProductInfo(product)
      }
      setLoading(false)
    }
  }, [id])

  // 配置分享功能
  useEffect(() => {
    if (productInfo && id) {
      const shareConfig = getProductDetailShareConfig(
        id as string,
        productInfo.name || '商品',
        productInfo.image
      )
      Taro.useShareAppMessage(() => {
        return {
          title: shareConfig.title,
          path: shareConfig.path,
          imageUrl: shareConfig.imageUrl
        }
      })
    }
  }, [productInfo, id])

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleBuyNow = async () => {
    if (!productInfo) return

    try {
      Taro.showLoading({ title: '创建订单...' })

      const order = await GiftService.createProductOrder({
        productId: productInfo.id,
        quantity,
        paymentMethod: 'wechat'
      })

      Taro.hideLoading()

      const paymentSuccess = await paymentService.pay({
        orderNo: order.orderNo,
        amount: productInfo.price * 100 * quantity,
        paymentMethod: 'wechat',
        title: productInfo.name,
        wxPayParams: order.wxPayParams
      })

      if (paymentSuccess) {
        Taro.showToast({
          title: '购买成功',
          icon: 'success',
          duration: 1500
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } catch (error: any) {
      Taro.hideLoading()
      const errorMessage = error.message || error.errMsg || '购买失败'
      Taro.showModal({
        title: '购买失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }

  const handleScroll = (e: any) => {
    setScrollTop(e.detail.scrollTop)
  }

  const totalPrice = (productInfo?.price || 0) * quantity

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
      {/* 顶部导航栏 */}
      <View className={`navbar ${scrollTop > 20 ? 'shadow' : ''}`}>
        <View className="navbar-content">
          <View className="navbar-back" onClick={() => Taro.navigateBack()}>
            <View className="back-icon">‹</View>
          </View>
          <Text className="navbar-title">商品详情</Text>
        </View>
      </View>

      {/* 页面内容 */}
      <View className="page-content" onScroll={handleScroll} scrollY>
        {/* 产品图片展示 */}
        <View className="product-image-container">
          <Image
            className="product-image"
            src={productInfo.image}
            mode="aspectFill"
          />
          <View className="image-badge">{productInfo.unit}</View>
        </View>

        {/* 产品基础信息 */}
        <View className="product-info-card">
          <View className="price-section">
            <View className="current-price">
              <Text className="currency">¥</Text>
              <Text className="price-value">
                {(productInfo.price / 100).toFixed(0)}
              </Text>
            </View>
            {productInfo.originalPrice && productInfo.originalPrice > productInfo.price && (
              <Text className="original-price">
                ¥{(productInfo.originalPrice / 100).toFixed(0)}
              </Text>
            )}
          </View>

          <View className="product-title-section">
            <Text className="product-name">{productInfo.name}</Text>
            <Text className="product-description">{productInfo.description}</Text>
          </View>
        </View>

        {/* 产品特色 */}
        {productInfo.features && productInfo.features.length > 0 && (
          <View className="features-card">
            <Text className="card-title">产品特色</Text>
            <View className="features-list">
              {productInfo.features.map((feature, index) => (
                <View key={index} className="feature-item">
                  <View className="feature-icon">✓</View>
                  <Text className="feature-text">{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 规格参数 */}
        {productInfo.specifications && Object.keys(productInfo.specifications).length > 0 && (
          <View className="specs-card">
            <Text className="card-title">规格参数</Text>
            <View className="specs-list">
              {Object.entries(productInfo.specifications).map(([key, value], index) => (
                <View
                  key={index}
                  className={`spec-item ${index !== Object.entries(productInfo.specifications).length - 1 ? 'has-border' : ''}`}
                >
                  <Text className="spec-label">{key}</Text>
                  <Text className="spec-value">{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 空白区域，用于防止内容被底部栏遮挡 */}
        <View className="bottom-spacer" />
      </View>

      {/* 底部购买栏 */}
      <View className="bottom-bar">
        <View className="quantity-container">
          <Text className="quantity-label">数量</Text>
          <View className="quantity-selector">
            <View
              className="quantity-btn"
              onClick={() => handleQuantityChange('decrease')}
            >
              −
            </View>
            <Text className="quantity-value">{quantity}</Text>
            <View
              className="quantity-btn"
              onClick={() => handleQuantityChange('increase')}
            >
              +
            </View>
          </View>
        </View>

        <View className="action-buttons">
          <Button
            className="buy-btn"
            onClick={handleBuyNow}
          >
            <View className="btn-content">
              <Text className="btn-label">立即购买</Text>
              <Text className="btn-price">¥{(totalPrice / 100).toFixed(0)}</Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default ProductDetail
