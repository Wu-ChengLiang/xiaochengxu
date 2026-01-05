import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { orderService, OrderData } from '@/services/order'
import { getDefaultShareConfig } from '@/utils/share'
import { formatAmount } from '@/utils/amount'  // ✅ 新增导入
import { parseDate } from '@/utils/date'  // ✅ iOS 兼容日期处理
import './index.scss'

const OrderListPage: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const tabList = [
    { title: '全部' },
    { title: '待支付' },
    { title: '待服务' },
    { title: '已完成' }
  ]

  const statusMap = {
    0: undefined, // 全部
    1: 'pending', // 待支付
    2: 'paid', // 待服务
    3: 'completed' // 已完成
  } as const

  useDidShow(() => {
    setPage(1)
    fetchOrders(1)
  })

  useEffect(() => {
    // 配置分享功能
    const shareConfig = getDefaultShareConfig()
    Taro.useShareAppMessage(() => {
      return {
        title: shareConfig.title,
        path: shareConfig.path,
        imageUrl: shareConfig.imageUrl
      }
    })

    // 配置分享到朋友圈功能
    Taro.useShareTimeline(() => {
      return {
        title: shareConfig.title,
        imageUrl: shareConfig.imageUrl
      }
    })
  }, [])

  useEffect(() => {
    setPage(1)
    fetchOrders(1)
  }, [current])

  usePullDownRefresh(async () => {
    await fetchOrders(1)
    Taro.stopPullDownRefresh()
  })

  const fetchOrders = async (pageNum: number = page) => {
    try {
      setLoading(true)
      const status = statusMap[current]

      // 获取所有订单（服务订单 + 产品订单），然后根据displayStatus筛选
      let orderList = await orderService.getOrderList(
        undefined, // 先不按paymentStatus筛选
        undefined, // 不过滤订单类型，同时获取服务订单和产品订单
        pageNum,
        100 // 获取更多以便筛选
      )

      // 根据标签页筛选订单
      if (status) {
        orderList = orderList.filter(order => {
          const displayStatus = order.displayStatus || order.paymentStatus

          // 特殊处理：已完成标签页显示completed状态
          if (status === 'completed') {
            return displayStatus === 'completed'
          }
          // 待服务标签页：显示paid状态（包括pending和confirmed的预约）
          if (status === 'paid') {
            return displayStatus === 'paid'
          }
          // 待支付标签页
          if (status === 'pending') {
            return displayStatus === 'pending'
          }

          return displayStatus === status
        })
      }

      // 只取前20条
      const paginatedList = orderList.slice(0, 20)

      if (pageNum === 1) {
        setOrders(paginatedList)
      } else {
        setOrders(prev => [...prev, ...paginatedList])
      }

      setPage(pageNum)
      setHasMore(paginatedList.length === 20)
    } catch (error) {
      console.error('获取订单失败:', error)
      if (pageNum === 1) {
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTabClick = (index: number) => {
    setCurrent(index)
  }

  const handleOrderClick = (orderNo: string) => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${orderNo}`
    })
  }

  const handlePayOrder = (e: any, order: OrderData) => {
    e.stopPropagation()

    // ✅ 改为跳转到确认页（已有订单模式）
    Taro.navigateTo({
      url: `/pages/booking/confirm/index?orderNo=${order.orderNo}`
    })
  }

  const handleCancelOrder = async (e: any, order: OrderData) => {
    e.stopPropagation()

    Taro.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await orderService.cancelOrder(order.orderNo)

            // 🚀 改进：根据订单支付状态区分显示反馈
            // 未支付订单取消：只显示"订单已取消"（无需提及退款）
            // 已支付订单取消：显示具体退款金额
            if (order.paymentStatus === 'pending') {
              // 未支付订单：无资金流动，只是取消预约
              Taro.showToast({
                title: '取消订单',
                icon: 'success'
              })
            } else if (order.paymentStatus === 'paid' && result.refundAmount && result.refundAmount > 0) {
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

            // 刷新列表
            fetchOrders(1)
          } catch (error: any) {
            Taro.showToast({
              title: error.message || '取消失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  const handleRebookOrder = (e: any, order: OrderData) => {
    e.stopPropagation()
    // 跳转到预约首页重新预约
    Taro.switchTab({
      url: '/pages/appointment/index'
    })
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

  const getStatusClass = (order: OrderData) => {
    // 使用综合显示状态（优先）或支付状态（降级）
    const status = order.displayStatus || order.paymentStatus

    const statusClassMap = {
      'pending': 'status-pending',
      'paid': 'status-paid',
      'serving': 'status-serving',
      'completed': 'status-completed',  // 🚀 已完成样式
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    }
    return statusClassMap[status] || ''
  }

  const formatDate = (dateStr: string) => {
    // ✅ 改进：使用 iOS 兼容的日期处理函数
    // 将 "2025-10-22 11:35:45" 转换为 "2025-10-22T11:35:45"（iOS 兼容格式）
    const date = parseDate(dateStr)
    if (!date) {
      return ''
    }
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const renderOrderItem = (order: OrderData) => (
    <View
      key={order.orderNo}
      className="order-item"
      onClick={() => handleOrderClick(order.orderNo)}
    >
      <View className="order-header">
        {/* 服务订单显示门店名 */}
        {order.orderType === 'service' && (
          <Text className="store-name">{order.storeName}</Text>
        )}
        {/* 产品订单显示产品名称 */}
        {order.orderType === 'product' && (
          <Text className="store-name">{order.title}</Text>
        )}
        <Text className={`order-status ${getStatusClass(order)}`}>
          {getStatusText(order)}
        </Text>
      </View>

      <View className="order-content">
        {/* 服务订单显示技师头像 */}
        {order.orderType === 'service' && order.therapistAvatar && (
          <Image
            className="therapist-avatar"
            src={order.therapistAvatar}
          />
        )}
        {/* 产品订单：不显示默认图片（避免 404 错误） */}
        {/* order.orderType === 'product' 时不显示任何图片 */}

        <View className={`order-info ${!order.therapistAvatar && order.orderType === 'service' ? 'no-image' : ''}`}>
          {/* 🚀 服务订单没有头像时显示占位符 */}
          {/* 服务订单信息 */}
          {order.orderType === 'service' && (
            <>
              <View className="info-row">
                <Text className="therapist-name">{order.therapistName}</Text>
                <Text className="service-name">{order.serviceName}</Text>
              </View>
              <View className="info-row">
                <Text className="appointment-time">
                  预约时间：{formatDate(`${order.appointmentDate} ${order.startTime}`)}  {/* ✅ 改为 startTime */}
                </Text>
              </View>
            </>
          )}

          {/* 产品订单信息 */}
          {order.orderType === 'product' && (
            <>
              <View className="info-row">
                <Text className="service-name">{order.title}</Text>
                {order.extraData?.quantity && (
                  <Text className="quantity">×{order.extraData.quantity}</Text>
                )}
              </View>
              <View className="info-row">
                <Text className="appointment-time">
                  购买时间：{formatDate(order.createdAt)}
                </Text>
              </View>
            </>
          )}

          <View className="info-row">
            <Text className="order-no">订单号：{order.orderNo}</Text>
          </View>
        </View>
      </View>

      <View className="order-footer">
        <View className="price-info">
          <Text className="label">实付：</Text>
          <Text className="price">{formatAmount(order.amount)}</Text>  {/* ✅ 改为使用 formatAmount() 和 amount 字段 */}
        </View>
        <View className="action-buttons">
          {/* 待支付订单：显示支付和取消 */}
          {(order.displayStatus || order.paymentStatus) === 'pending' && (
            <>
              <View className="button cancel" onClick={(e) => handleCancelOrder(e, order)}>
                取消订单
              </View>
              <View className="button pay" onClick={(e) => handlePayOrder(e, order)}>
                去支付
              </View>
            </>
          )}

          {/* 待服务订单：仅服务订单显示取消 */}
          {(order.displayStatus || order.paymentStatus) === 'paid' && order.orderType === 'service' && (
            <View className="button cancel" onClick={(e) => handleCancelOrder(e, order)}>
              取消订单
            </View>
          )}

          {/* 服务中订单：不显示操作按钮 */}
          {(order.displayStatus || order.paymentStatus) === 'serving' && null}

          {/* 已完成订单：仅服务订单显示再次预约 */}
          {(order.displayStatus === 'completed') && order.orderType === 'service' && (
            <View className="button rebook" onClick={(e) => handleRebookOrder(e, order)}>
              再次预约
            </View>
          )}

          {/* 已取消/已退款订单：仅服务订单显示再次预约 */}
          {(['cancelled', 'refunded'].includes(order.displayStatus || order.paymentStatus)) && order.orderType === 'service' && (
            <View className="button rebook" onClick={(e) => handleRebookOrder(e, order)}>
              再次预约
            </View>
          )}
        </View>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View className="empty-state">
      <AtIcon value="file-generic" size="60" color="#ccc" />
      <Text className="empty-text">暂无订单</Text>
    </View>
  )

  const renderLoading = () => (
    <View className="loading-state">
      <Text>加载中...</Text>
    </View>
  )

  return (
    <View className="order-list-page">
      <AtTabs
        current={current}
        tabList={tabList}
        onClick={handleTabClick}
        className="order-tabs"
      >
        {tabList.map((tab, index) => (
          <AtTabsPane key={index} current={current} index={index}>
            <ScrollView scrollY className="order-list">
              {loading ? renderLoading() : (
                orders.length > 0 ? orders.map(renderOrderItem) : renderEmpty()
              )}
            </ScrollView>
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

export default OrderListPage