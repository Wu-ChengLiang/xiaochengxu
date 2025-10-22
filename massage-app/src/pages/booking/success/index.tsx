import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { orderService, OrderData } from '@/services/order'
import { formatAmount } from '@/utils/amount'  // ✅ 新增导入
import './index.scss'

const BookingSuccessPage: React.FC = () => {
  const router = useRouter()
  const { orderNo } = router.params as { orderNo: string }
  const [orderInfo, setOrderInfo] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetail()
  }, [orderNo])

  const fetchOrderDetail = async () => {
    if (!orderNo) {
      Taro.showToast({
        title: '订单号缺失',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.reLaunch({ url: '/pages/appointment/index' })
      }, 1500)
      return
    }

    try {
      const order = await orderService.getOrderDetail(orderNo)
      setOrderInfo(order)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Taro.showToast({
        title: '获取订单失败',
        icon: 'none'
      })
    }
  }

  const handleViewOrders = () => {
    Taro.redirectTo({
      url: '/pages/order/list/index'
    })
  }

  const handleBackHome = () => {
    Taro.switchTab({
      url: '/pages/appointment/index'
    })
  }

  const generateQRCodeUrl = (orderNo: string) => {
    // Mock 生成二维码 URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNo}`
  }

  if (loading) {
    return (
      <View className="success-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  return (
    <View className="success-page">
      {/* 成功提示 */}
      <View className="success-header">
        <View className="success-icon-wrapper">
          <AtIcon value="check-circle" size="60" color="#52c41a" />
        </View>
        <Text className="success-title">支付成功</Text>
        <Text className="success-subtitle">您已成功预约，请准时到店</Text>
      </View>

      {/* 订单信息 */}
      {orderInfo && (
        <View className="order-info">
          <View className="info-card">
            <View className="info-row">
              <Text className="label">门店</Text>
              <Text className="value">{orderInfo.storeName}</Text>
            </View>
            <View className="info-row">
              <Text className="label">推拿师</Text>
              <Text className="value">{orderInfo.therapistName}</Text>
            </View>
            <View className="info-row">
              <Text className="label">服务项目</Text>
              <Text className="value">{orderInfo.serviceName}</Text>
            </View>
            <View className="info-row">
              <Text className="label">预约时间</Text>
              <Text className="value">
                {orderInfo.appointmentDate} {orderInfo.startTime}  {/* ✅ 改为 startTime */}
              </Text>
            </View>
            <View className="info-row">
              <Text className="label">订单金额</Text>
              <Text className="value price">{formatAmount(orderInfo.amount)}</Text>  {/* ✅ 改为使用 formatAmount 转换 amount 字段 */}
            </View>
          </View>

          {/* 核销二维码 */}
          <View className="qrcode-section">
            <Text className="qrcode-title">到店核销码</Text>
            <Image 
              className="qrcode-image" 
              src={generateQRCodeUrl(orderInfo.orderNo)}
              mode="aspectFit"
            />
            <Text className="qrcode-no">{orderInfo.orderNo}</Text>
            <Text className="qrcode-tip">请向门店工作人员出示此二维码</Text>
          </View>
        </View>
      )}

      {/* 操作按钮 */}
      <View className="action-buttons">
        <View className="button-group">
          <View className="button secondary" onClick={handleBackHome}>
            返回首页
          </View>
          <View className="button primary" onClick={handleViewOrders}>
            查看订单
          </View>
        </View>
      </View>

      {/* 温馨提示 */}
      <View className="tips">
        <Text className="tips-title">温馨提示</Text>
        <View className="tips-list">
          <Text className="tips-item">• 请在预约时间前10分钟到店</Text>
          <Text className="tips-item">• 如需取消订单，请在服务开始前6小时操作</Text>
          <Text className="tips-item">• 到店后请向前台出示核销二维码</Text>
        </View>
      </View>
    </View>
  )
}

export default BookingSuccessPage