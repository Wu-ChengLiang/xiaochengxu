import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { AtIcon, AtSteps } from 'taro-ui'
import { orderService, OrderData } from '@/services/order'
import { reviewService } from '@/services/review'
import { getOrderDetailShareConfig, getOrderDetailShareTimelineConfig } from '@/utils/share'
import { ReviewModal } from '@/components/Review'
import { formatAmount } from '@/utils/amount'  // ✅ 新增导入
import './index.scss'

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const { orderNo } = router.params as { orderNo: string }
  const [orderInfo, setOrderInfo] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [orderNo])

  // 配置分享功能
  useEffect(() => {
    if (orderInfo && orderNo) {
      const shareConfig = getOrderDetailShareConfig(orderNo)
      Taro.useShareAppMessage(() => {
        return {
          title: shareConfig.title,
          path: shareConfig.path
        }
      })

      // 配置分享到朋友圈功能
      const shareTimelineConfig = getOrderDetailShareTimelineConfig()
      Taro.useShareTimeline(() => {
        return {
          title: shareTimelineConfig.title,
          imageUrl: shareTimelineConfig.imageUrl
        }
      })
    }
  }, [orderInfo, orderNo])

  const fetchOrderDetail = async () => {
    if (!orderNo) {
      Taro.showToast({
        title: '订单号缺失',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    try {
      const order = await orderService.getOrderDetail(orderNo)

      // 🚀 改进：添加数据验证和调试日志
      console.log('📋 订单详情获取成功:', {
        orderNo: order.orderNo,
        amount: order.amount,
        amountType: typeof order.amount,
        therapistAvatar: order.therapistAvatar,
        therapistName: order.therapistName,
        displayStatus: order.displayStatus
      })

      // ✅ 数据完整性检查
      if (!order.amount && order.amount !== 0) {
        console.warn('⚠️ 警告：订单金额为空', { orderNo, amount: order.amount })
      }
      if (typeof order.amount !== 'number') {
        console.error('❌ 错误：订单金额类型不正确', { orderNo, amount: order.amount, type: typeof order.amount })
      }

      setOrderInfo(order)

      // 检查是否已评价（如果有appointmentId）
      if (order.extraData?.appointmentId) {
        const canReview = await reviewService.checkCanReview(order.extraData.appointmentId)
        setHasReviewed(!canReview)
      } else {
        // 没有appointmentId，默认为未评价
        setHasReviewed(false)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('❌ 获取订单详情失败:', error)
      Taro.showToast({
        title: '获取订单失败',
        icon: 'none'
      })
    }
  }

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '4008888888'
    })
  }

  const handleCancel = async () => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await orderService.cancelOrder(orderNo)

            // 🚀 改进：根据订单支付状态区分显示反馈
            // 未支付订单取消：只显示"取消订单"（无需提及退款）
            // 已支付订单取消：显示具体退款金额
            if (orderInfo?.paymentStatus === 'pending') {
              // 未支付订单：无资金流动，只是取消预约
              Taro.showToast({
                title: '取消订单',
                icon: 'success'
              })
            } else if (orderInfo?.paymentStatus === 'paid' && result.refundAmount && result.refundAmount > 0) {
              // 已支付订单：明确显示退款金额
              Taro.showToast({
                title: `取消订单`,
                icon: 'success'
              })
              // 显示退款详情（可选：在下一个toast中展示）
              setTimeout(() => {
                Taro.showToast({
                  title: `退款￥${(result.refundAmount / 100).toFixed(2)}`,
                  icon: 'success',
                  duration: 2500
                })
              }, 500)
            } else {
              Taro.showToast({
                title: '取消订单',
                icon: 'success'
              })
            }

            setTimeout(() => {
              fetchOrderDetail()
            }, 1500)
          } catch (error) {
            Taro.showToast({
              title: '取消失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  const handleRebook = () => {
    // 跳转到预约首页重新预约
    Taro.switchTab({
      url: '/pages/appointment/index'
    })
  }

  const handleCreateReview = () => {
    setShowReviewModal(true)
  }

  const handleViewReview = async () => {
    if (!orderInfo?.extraData?.appointmentId) {
      Taro.showToast({
        title: '暂无评价',
        icon: 'none'
      })
      return
    }

    try {
      // 使用appointmentId作为reviewId（因为后端使用appointmentId作为评价ID）
      const reviewDetail = await reviewService.getReviewDetail(orderInfo.extraData.appointmentId)
      // 可以跳转到评价详情页或显示评价内容
      Taro.showModal({
        title: '我的评价',
        content: `评分：${reviewDetail.rating}星\n${reviewDetail.content}`,
        showCancel: false
      })
    } catch (error) {
      Taro.showToast({
        title: '评价信息获取失败',
        icon: 'none'
      })
    }
  }

  const handleSubmitReview = async (reviewData: {
    appointmentId: number
    rating: number
    content: string
    tags: string[]
  }) => {
    try {
      // 添加therapistId到评价数据
      const fullReviewData = {
        ...reviewData,
        therapistId: orderInfo?.therapistId
      }

      await reviewService.createReview(fullReviewData)

      // 更新评价状态
      setHasReviewed(true)
      setShowReviewModal(false)

      // 刷新订单详情
      fetchOrderDetail()
    } catch (error: any) {
      throw error // 让ReviewModal处理错误
    }
  }

  const handleNavigate = () => {
    if (orderInfo) {
      Taro.openLocation({
        latitude: 31.189, // 示例坐标
        longitude: 121.43,
        name: orderInfo.storeName,
        address: orderInfo.storeAddress
      })
    }
  }

  const generateQRCodeUrl = (orderNo: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNo}`
  }

  const getStatusText = (order: OrderData) => {
    // 使用综合显示状态（优先）或支付状态（降级）
    const status = order.displayStatus || order.paymentStatus

    const statusTextMap = {
      'pending': '待支付',
      'paid': '待服务',
      'serving': '服务中',
      'completed': '已完成',  // 🚀 管理员标记的完成状态
      'cancelled': '已取消',
      'refunded': '已退款'
    }
    return statusTextMap[status] || status
  }

  const getOrderSteps = (order: OrderData) => {
    // 使用综合显示状态（优先）或支付状态（降级）
    const status = order.displayStatus || order.paymentStatus

    const allSteps = ['下单', '支付', '到店服务', '完成']
    let current = 0

    switch (status) {
      case 'pending':
        current = 0
        break
      case 'paid':
        current = 1
        break
      case 'serving':
        current = 2
        break
      case 'completed':
        current = 3
        break
      case 'cancelled':
      case 'refunded':
        return { steps: ['已取消'], current: 0 }
    }

    return { steps: allSteps, current }
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <View className="order-detail-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  if (!orderInfo) {
    return (
      <View className="order-detail-page">
        <View className="empty">订单不存在</View>
      </View>
    )
  }

  const { steps, current } = getOrderSteps(orderInfo)
  const currentStatus = orderInfo.displayStatus || orderInfo.paymentStatus

  return (
    <View className="order-detail-page">
      {/* 订单状态 */}
      <View className="status-section">
        <View className="status-header">
          <AtIcon
            value={currentStatus === 'paid' ? 'check-circle' : 'clock'}
            size="40"
            color="#fff"
          />
          <Text className="status-text">{getStatusText(orderInfo)}</Text>
        </View>

        {/* 订单流程 */}
        {currentStatus !== 'cancelled' && currentStatus !== 'refunded' && (
          <View className="steps-container">
            <AtSteps
              items={steps.map(step => ({ title: step }))}
              current={current}
              className="order-steps"
            />
          </View>
        )}
      </View>

      {/* 核销二维码（已支付状态显示） */}
      {currentStatus === 'paid' && (
        <View className="qrcode-section">
          <Text className="section-title">到店核销码</Text>
          <View className="qrcode-card">
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

      {/* 订单信息 */}
      <View className="info-section">
        <Text className="section-title">订单信息</Text>
        <View className="info-card">
          <View className="info-item">
            <Text className="label">订单编号</Text>
            <Text className="value">{orderInfo.orderNo}</Text>
          </View>
          <View className="info-item">
            <Text className="label">下单时间</Text>
            <Text className="value">{formatDateTime(orderInfo.createdAt)}</Text>
          </View>
          {orderInfo.paidAt && (
            <View className="info-item">
              <Text className="label">支付时间</Text>
              <Text className="value">{formatDateTime(orderInfo.paidAt)}</Text>
            </View>
          )}
          <View className="info-item">
            <Text className="label">预约时间</Text>
            <Text className="value highlight">
              {orderInfo.appointmentDate} {orderInfo.startTime}  {/* ✅ 改为 startTime */}
            </Text>
          </View>
        </View>
      </View>

      {/* 门店信息 */}
      <View className="store-section">
        <Text className="section-title">门店信息</Text>
        <View className="store-card" onClick={handleNavigate}>
          <View className="store-info">
            <Text className="store-name">{orderInfo.storeName}</Text>
            <Text className="store-address">{orderInfo.storeAddress}</Text>
          </View>
          <AtIcon value="map-pin" size="20" color="#a40035" />
        </View>
      </View>

      {/* 推拿师信息 */}
      <View className="therapist-section">
        <Text className="section-title">推拿师信息</Text>
        <View className="therapist-card">
          {orderInfo.therapistAvatar && (
            <Image
              className="therapist-avatar"
              src={orderInfo.therapistAvatar}
            />
          )}
          <View className="therapist-info">
            <Text className="therapist-name">{orderInfo.therapistName}</Text>
            <Text className="service-name">{orderInfo.serviceName}</Text>
            <Text className="service-duration">服务时长：{orderInfo.duration}分钟</Text>
          </View>
          <Text className="price">{formatAmount(orderInfo.amount)}</Text>  {/* ✅ 改为使用 formatAmount 转换 amount 字段 */}
        </View>
      </View>

      {/* 操作按钮 */}
      <View className="action-section">
        {currentStatus === 'paid' && (
          <>
            <View className="button secondary" onClick={handleCall}>
              <AtIcon value="phone" size="18" />
              <Text>联系门店</Text>
            </View>
            <View className="button danger" onClick={handleCancel}>
              取消订单
            </View>
          </>
        )}
        {/* 服务中：可以联系门店 */}
        {currentStatus === 'serving' && (
          <View className="button secondary" onClick={handleCall}>
            <AtIcon value="phone" size="18" />
            <Text>联系门店</Text>
          </View>
        )}
        {/* 已完成状态或已支付状态：显示评价和再次预约按钮 */}
        {(currentStatus === 'completed' || currentStatus === 'paid') && (
          <>
            {!hasReviewed ? (
              <View className="button primary" onClick={handleCreateReview}>
                <AtIcon value="star" size="16" />
                <Text> 评价服务</Text>
              </View>
            ) : (
              <View className="button secondary" onClick={handleViewReview}>
                查看评价
              </View>
            )}
            <View className="button primary" onClick={handleRebook}>
              再次预约
            </View>
          </>
        )}
        {/* 已取消/已退款：只显示再次预约 */}
        {(['cancelled', 'refunded'].includes(currentStatus)) && (
          <View className="button primary" onClick={handleRebook}>
            再次预约
          </View>
        )}
      </View>

      {/* 评价模态层 */}
      {orderInfo && (
        <ReviewModal
          visible={showReviewModal}
          orderInfo={orderInfo}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </View>
  )
}

export default OrderDetailPage