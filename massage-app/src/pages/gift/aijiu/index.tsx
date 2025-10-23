import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
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

  useEffect(() => {
    const aijiuProducts = GiftService.getAijiuProducts()
    setProducts(aijiuProducts)
    if (aijiuProducts.length > 0) {
      setSelectedProduct(aijiuProducts[0])
    }
  }, [])

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
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
        amount: selectedProduct.price * quantity,
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

  const getTotalPrice = () => {
    return selectedProduct ? (selectedProduct.price / 100 * quantity).toFixed(0) : '0'
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
      {/* 产品信息 */}
      <View className="product-info-section">
        <View className="product-image">
          <Image
            className="product-pic"
            src={selectedProduct.image}
            mode="aspectFill"
          />
        </View>
        <Text className="product-name">{selectedProduct.name}</Text>
        <Text className="product-desc">{selectedProduct.description}</Text>
      </View>

      {/* 产品列表 */}
      <View className="product-section">
        <Text className="section-title">选择产品</Text>
        <View className="product-grid">
          {products.map((item) => (
            <View
              key={item.id}
              className={`product-card ${selectedProduct.id === item.id ? 'active' : ''}`}
              onClick={() => handleProductSelect(item)}
            >
              <View className="product-header">
                <View className="header-left">
                  <Text className="name">{item.name}</Text>
                  <Text className="price">¥{(item.price / 100).toFixed(0)}</Text>
                </View>
                {selectedProduct.id === item.id && (
                  <View className="header-right" onClick={(e) => e.stopPropagation()}>
                    <View
                      className="quantity-btn"
                      onClick={() => handleQuantityChange('decrease')}
                    >
                      <AtIcon value="subtract-circle" size="18" color={quantity === 1 ? '#ccc' : '#a40035'} />
                    </View>
                    <Text className="quantity-value">{quantity}</Text>
                    <View
                      className="quantity-btn"
                      onClick={() => handleQuantityChange('increase')}
                    >
                      <AtIcon value="add-circle" size="18" color="#a40035" />
                    </View>
                  </View>
                )}
              </View>
              <Text className="desc">{item.description}</Text>
              {selectedProduct.id === item.id && (
                <AtIcon value="check-circle" size="24" color="#a40035" className="check-icon" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 底部结算栏 */}
      <View className="purchase-bar">
        <View className="price-info">
          <AtIcon value="shopping-bag-2" size="24" color="#a40035" />
          <Text className="total-price">¥ {getTotalPrice()}</Text>
          <View className="quantity-badge">{quantity}</View>
        </View>
        <Button className="purchase-btn" onClick={handleBuyNow}>
          去结算
        </Button>
      </View>
    </View>
  )
}

export default AijiuDetail
