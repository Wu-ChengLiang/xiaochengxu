import React, { useEffect, useState } from 'react'
import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import { paymentService } from '@/services/payment.service'
import { Product } from '@/types'
import './index.scss'

const ProductDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.params
  const [productInfo, setProductInfo] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      const product = GiftService.getProductById(id as string)
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


  const handleBuyNow = async () => {
    if (!productInfo) return

    try {
      Taro.showLoading({ title: '创建订单...' })

      // 创建商品订单
      const order = await GiftService.createProductOrder({
        productId: productInfo.id,
        quantity,
        paymentMethod: 'wechat'
      })

      Taro.hideLoading()

      // 使用统一的支付服务处理支付
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
      // 如果支付失败或用户取消，paymentService 内部已处理提示
    } catch (error: any) {
      Taro.hideLoading()

      // 显示详细错误信息
      const errorMessage = error.message || error.errMsg || '购买失败'
      Taro.showModal({
        title: '购买失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
    }
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
      {/* 商品图片轮播卡片 */}
      <View className="product-carousel-card">
        {/* 轮播图区域 */}
        <Swiper className="product-swiper" circular>
          <SwiperItem>
            <Image
              className="product-image"
              src={productInfo.image}
              mode="aspectFill"
            />
          </SwiperItem>
        </Swiper>

        {/* 底部信息区域 */}
        <View className="carousel-info">
          <View className="info-content">
            <Text className="product-name">{productInfo.name}</Text>
            <View className="price-row">
              <Text className="price">¥{productInfo.price.toFixed(2)}</Text>
              <Text className="original-price">¥{productInfo.originalPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* 分页指示器 */}
          <View className="pagination-dots">
            <View className="dot active" />
          </View>
        </View>
      </View>

      {/* 商品描述信息 */}
      <View className="product-info">
        <Text className="unit">单位: {productInfo.unit}</Text>
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
        <Button className="action-btn buy-btn" onClick={handleBuyNow}>
          立即购买
        </Button>
      </View>
    </View>
  )
}

export default ProductDetail