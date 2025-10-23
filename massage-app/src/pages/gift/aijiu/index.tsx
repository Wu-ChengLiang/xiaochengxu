import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { GiftService } from '@/services/gift.service'
import { paymentService } from '@/services/payment.service'
import { Product } from '@/types'
import './index.scss'

const AijiuDetail: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const aijiuProducts = GiftService.getAijiuProducts()
    setProducts(aijiuProducts)
    if (aijiuProducts.length > 0) {
      setSelectedProduct(aijiuProducts[0])
      // 自动弹出模态框
      setShowModal(true)
    }
  }, [])

  const handleProductSelect = (index: number) => {
    const product = products[index]
    setCurrentIndex(index)
    setSelectedProduct(product)
    setQuantity(1)

    // 跳转到商品详情页
    Taro.navigateTo({
      url: `/pages/gift/product-detail/index?id=${product.id}`
    })
  }

  const handleSwiperChange = (e: any) => {
    setCurrentIndex(e.detail.current)
  }

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedProduct) return

    try {
      Taro.showLoading({ title: '创建订单...' })

      // 创建商品订单
      const order = await GiftService.createProductOrder({
        productId: selectedProduct.id,
        quantity,
        paymentMethod: 'wechat'
      })

      Taro.hideLoading()

      // 使用统一的支付服务处理支付
      const paymentSuccess = await paymentService.pay({
        orderNo: order.orderNo,
        amount: selectedProduct.price * 100 * quantity,
        paymentMethod: 'wechat',
        title: selectedProduct.name,
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

  const handleCloseModal = () => {
    setShowModal(false)
    Taro.navigateBack()
  }

  if (!selectedProduct) {
    return (
      <View className="aijiu-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  return (
    <View className="aijiu-page">
      {showModal && (
        <View className="modal-overlay" onClick={handleCloseModal}>
          <View className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 上半部分：图片轮播卡片 */}
            <View className="modal-top">
              <View className="carousel-container">
                <Swiper
                  className="product-swiper"
                  circular
                  current={currentIndex}
                  onChange={handleSwiperChange}
                >
                  {products.map((product, index) => (
                    <SwiperItem key={product.id}>
                      <Image
                        className="product-image"
                        src={product.image}
                        mode="aspectFill"
                      />
                    </SwiperItem>
                  ))}
                </Swiper>

                {/* 分页指示器 */}
                <View className="pagination-dots">
                  {products.map((_, index) => (
                    <View
                      key={index}
                      className={`dot ${currentIndex === index ? 'active' : ''}`}
                    />
                  ))}
                </View>
              </View>

              <View className="close-btn" onClick={handleCloseModal}>
                <AtIcon value="close" size="24" color="#fff" />
              </View>
            </View>

            {/* 下半部分：产品选择和购买 */}
            <View className="modal-bottom">
              {/* 产品列表 */}
              <View className="product-list">
                {products.map((product, index) => (
                  <View
                    key={product.id}
                    className={`product-item ${selectedProduct.id === product.id ? 'active' : ''}`}
                    onClick={() => handleProductSelect(index)}
                  >
                    <View className="product-header">
                      <Text className="product-name">{product.name}</Text>
                      <Text className="product-price">¥{(product.price / 100).toFixed(0)}</Text>
                    </View>
                    <Text className="product-desc">{product.description}</Text>
                  </View>
                ))}
              </View>

              {/* 数量选择 */}
              <View className="quantity-section">
                <Text className="label">购买数量</Text>
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

              {/* 购买按钮 */}
              <View className="action-bar">
                <Button className="buy-btn" onClick={handleBuyNow}>
                  立即购买 ¥{(selectedProduct.price / 100 * quantity).toFixed(0)}
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default AijiuDetail
