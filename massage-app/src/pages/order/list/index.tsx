import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { orderService, OrderData } from '@/services/order'
import './index.scss'

const OrderListPage: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)

  const tabList = [
    { title: '全部' },
    { title: '待支付' },
    { title: '待服务' },
    { title: '已完成' }
  ]

  const statusMap = {
    0: undefined, // 全部
    1: 'pending_payment', // 待支付
    2: 'paid', // 待服务
    3: 'completed' // 已完成
  } as const

  useDidShow(() => {
    fetchOrders()
  })

  useEffect(() => {
    fetchOrders()
  }, [current])

  usePullDownRefresh(async () => {
    await fetchOrders()
    Taro.stopPullDownRefresh()
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const status = statusMap[current]
      const orderList = await orderService.getOrderList(status)
      setOrders(orderList)
    } catch (error) {
      Taro.showToast({
        title: '获取订单失败',
        icon: 'none'
      })
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

  const handlePayOrder = async (e: any, order: OrderData) => {
    e.stopPropagation()
    
    try {
      // 获取支付参数
      const paymentParams = await orderService.getPaymentParams(order.orderNo)
      
      // 调用微信支付
      Taro.requestPayment({
        ...paymentParams,
        success: async () => {
          // 更新订单状态
          await orderService.updateOrderStatus(order.orderNo, 'paid')
          Taro.showToast({
            title: '支付成功',
            icon: 'success'
          })
          // 刷新订单列表
          fetchOrders()
        },
        fail: (err) => {
          if (err.errMsg !== 'requestPayment:fail cancel') {
            Taro.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        }
      })
    } catch (error) {
      Taro.showToast({
        title: '获取支付参数失败',
        icon: 'none'
      })
    }
  }

  const handleCancelOrder = async (e: any, order: OrderData) => {
    e.stopPropagation()
    
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderService.cancelOrder(order.orderNo)
            Taro.showToast({
              title: '订单已取消',
              icon: 'success'
            })
            fetchOrders()
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

  const handleRebookOrder = (e: any, order: OrderData) => {
    e.stopPropagation()
    // 跳转到推拿师详情页重新预约
    Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${order.therapistId}&storeId=${order.storeId}`
    })
  }

  const getStatusText = (status: string) => {
    const statusTextMap = {
      'pending_payment': '待支付',
      'paid': '待服务',
      'serving': '服务中',
      'completed': '已完成',
      'cancelled': '已取消',
      'refunded': '已退款'
    }
    return statusTextMap[status] || status
  }

  const getStatusClass = (status: string) => {
    const statusClassMap = {
      'pending_payment': 'status-pending',
      'paid': 'status-paid',
      'serving': 'status-serving',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    }
    return statusClassMap[status] || ''
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const renderOrderItem = (order: OrderData) => {
    // 根据订单类型显示不同内容
    const getOrderIcon = () => {
      if (order.orderType === 'service') {
        return order.therapistAvatar || 'https://img.yzcdn.cn/vant/cat.jpeg'
      } else if (order.orderType === 'product') {
        return order.extraData?.productType === 'gift_card'
          ? '/assets/images/gift/card/gift-card.png'
          : '/assets/images/gift/product/neck-pillow.png'
      } else if (order.orderType === 'recharge') {
        return '/assets/images/icons/wallet-icon.png'
      }
      return 'https://img.yzcdn.cn/vant/cat.jpeg'
    }

    const getOrderTitle = () => {
      if (order.orderType === 'service') {
        return order.therapistName || '按摩服务'
      }
      return order.title || '订单'
    }

    const getOrderSubtitle = () => {
      if (order.orderType === 'service') {
        return order.serviceName || '按摩服务'
      } else if (order.orderType === 'product') {
        const quantity = order.extraData?.quantity || 1
        return quantity > 1 ? `数量: ${quantity}` : ''
      } else if (order.orderType === 'recharge') {
        const bonus = order.extraData?.bonus
        return bonus ? `赠送金额: ¥${(bonus/100).toFixed(2)}` : ''
      }
      return ''
    }

    const getOrderTime = () => {
      if (order.orderType === 'service' && order.appointmentDate) {
        return `预约时间：${formatDate(`${order.appointmentDate} ${order.appointmentTime || ''}`)}`
      }
      return `下单时间：${formatDate(order.createdAt)}`
    }

    return (
      <View
        key={order.orderNo}
        className="order-item"
        onClick={() => handleOrderClick(order.orderNo)}
      >
        <View className="order-header">
          <View className="order-type-badge">
            {order.orderType === 'service' && <Text className="badge-service">按摩</Text>}
            {order.orderType === 'product' && <Text className="badge-product">商品</Text>}
            {order.orderType === 'recharge' && <Text className="badge-recharge">充值</Text>}
          </View>
          <Text className="store-name">{order.storeName || (
            order.orderType === 'service' ? '默认门店' :
            order.orderType === 'product' ? '线上商城' :
            '充值中心'
          )}</Text>
          <Text className={`order-status ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </Text>
        </View>

        <View className="order-content">
          <Image
            className="therapist-avatar"
            src={getOrderIcon()}
            mode="aspectFill"
          />
          <View className="order-info">
            <View className="info-row">
              <Text className="therapist-name">{getOrderTitle()}</Text>
              <Text className="service-name">{getOrderSubtitle()}</Text>
            </View>
            <View className="info-row">
              <Text className="appointment-time">{getOrderTime()}</Text>
            </View>
            <View className="info-row">
              <Text className="order-no">订单号：{order.orderNo}</Text>
            </View>
          </View>
        </View>

        <View className="order-footer">
          <View className="price-info">
            <Text className="label">实付：</Text>
            <Text className="price">¥{order.totalAmount.toFixed(2)}</Text>
          </View>
          <View className="action-buttons">
            {order.status === 'pending_payment' && (
              <>
                <View className="button cancel" onClick={(e) => handleCancelOrder(e, order)}>
                  取消订单
                </View>
                <View className="button pay" onClick={(e) => handlePayOrder(e, order)}>
                  去支付
                </View>
              </>
            )}
            {order.status === 'paid' && (
              <View className="button cancel" onClick={(e) => handleCancelOrder(e, order)}>
                取消订单
              </View>
            )}
            {(order.status === 'completed' || order.status === 'cancelled') && order.orderType === 'service' && (
              <View className="button rebook" onClick={(e) => handleRebookOrder(e, order)}>
                再次预约
              </View>
            )}
            {(order.status === 'completed' || order.status === 'cancelled') && order.orderType !== 'service' && (
              <View className="button rebook" onClick={() => Taro.navigateBack()}>
                返回
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

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