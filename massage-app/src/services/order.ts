import Taro from '@tarojs/taro'
import { sleep } from '@/utils/common'
import { getApiBaseUrl } from '@/config/api'
import { ApiResponse } from '@/types'

const API_BASE = getApiBaseUrl()

/**
 * 获取当前用户ID
 * TODO: 从全局状态或本地存储获取实际用户ID
 */
const getCurrentUserId = (): number => {
  // 临时使用固定用户ID，后续从用户状态管理获取
  return 1
}

// 订单数据接口 - 支持多种订单类型
export interface OrderData {
  orderNo: string
  orderType?: 'service' | 'product' | 'recharge'     // 订单类型
  userId?: number                                     // 用户ID
  title?: string                                      // 订单标题（统一字段）
  paymentMethod?: string                              // 支付方式
  status: 'pending_payment' | 'paid' | 'serving' | 'completed' | 'cancelled' | 'refunded'
  createdAt: string
  paidAt?: string
  paymentDeadline?: string
  totalAmount: number                                 // 金额（元）

  // 按摩预约特有字段（可选）
  therapistId?: string
  therapistName?: string
  therapistAvatar?: string
  storeId?: string
  storeName?: string
  storeAddress?: string
  serviceId?: string
  serviceName?: string
  duration?: number
  price?: number
  discountPrice?: number
  appointmentDate?: string
  appointmentTime?: string

  // 商品订单特有字段（可选）
  productId?: string
  productName?: string
  quantity?: number

  // 充值订单特有字段（可选）
  rechargeAmount?: number
  bonusAmount?: number

  // API返回的原始额外数据
  extraData?: any
}

// 创建订单请求参数
export interface CreateOrderParams {
  therapistId: string
  storeId: string
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  appointmentDate: string
  appointmentTime: string
  therapistName: string
  therapistAvatar?: string
  addons?: Array<{
    id: string
    name: string
    price: number
  }>
}

// 支付参数
export interface PaymentParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

// 微信支付请求参数（后端需要的参数）
export interface WxPayRequestParams {
  orderNo: string
  total_fee: number  // 订单金额，单位为分
  body: string       // 商品描述
  openid?: string    // 用户openid
  spbill_create_ip?: string  // 用户IP
}

class OrderService {
  // 创建订单
  async createOrder(params: CreateOrderParams): Promise<OrderData> {
    await sleep(500)
    
    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
    
    // Mock 订单数据
    const order: OrderData = {
      orderNo,
      therapistId: params.therapistId,
      therapistName: params.therapistName,
      therapistAvatar: params.therapistAvatar || '',
      storeId: params.storeId,
      storeName: '上海万象城店', // Mock 数据
      storeAddress: '闵行区吴中路1599号万象城L501b',
      serviceId: params.serviceId,
      serviceName: params.serviceName,
      duration: params.duration,
      price: params.price,
      discountPrice: params.discountPrice,
      appointmentDate: params.appointmentDate,
      appointmentTime: params.appointmentTime,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      paymentDeadline: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15分钟后
      totalAmount: params.discountPrice || params.price
    }
    
    // 模拟存储到本地（实际应该存储到服务器）
    const orders = Taro.getStorageSync('orders') || []
    orders.push(order)
    Taro.setStorageSync('orders', orders)
    
    return order
  }
  
  // 获取支付参数
  async getPaymentParams(orderNo: string): Promise<PaymentParams> {
    await sleep(300)
    
    // 获取订单信息
    const order = await this.getOrderDetail(orderNo)
    
    // 在实际场景中，这里应该调用后端接口，传递订单号和金额等信息
    // 后端会返回微信支付所需的参数
    // const response = await api.getWxPayParams({
    //   orderNo: orderNo,
    //   total_fee: order.totalAmount * 100, // 微信支付金额单位为分
    //   body: order.serviceName,
    //   ...
    // })
    
    // Mock 微信支付参数
    console.log('获取支付参数，订单金额:', order.totalAmount)
    return {
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: Math.random().toString(36).substr(2, 15),
      package: `prepay_id=${Math.random().toString(36).substr(2, 15)}`,
      signType: 'MD5',
      paySign: Math.random().toString(36).substr(2, 32)
    }
  }
  
  // 更新订单状态
  async updateOrderStatus(orderNo: string, status: OrderData['status']): Promise<OrderData> {
    await sleep(200)
    
    // 从本地存储获取订单
    const orders = Taro.getStorageSync('orders') || []
    const orderIndex = orders.findIndex((o: OrderData) => o.orderNo === orderNo)
    
    if (orderIndex === -1) {
      throw new Error('订单不存在')
    }
    
    // 更新状态
    orders[orderIndex].status = status
    if (status === 'paid') {
      orders[orderIndex].paidAt = new Date().toISOString()
    }
    
    // 保存回本地存储
    Taro.setStorageSync('orders', orders)
    
    return orders[orderIndex]
  }
  
  // 获取订单详情
  async getOrderDetail(orderNo: string): Promise<OrderData> {
    await sleep(200)
    
    // 从本地存储获取订单
    const orders = Taro.getStorageSync('orders') || []
    const order = orders.find((o: OrderData) => o.orderNo === orderNo)
    
    if (!order) {
      throw new Error('订单不存在')
    }
    
    return order
  }
  
  // 获取订单列表
  async getOrderList(status?: OrderData['status']): Promise<OrderData[]> {
    try {
      // 调用真实API
      const response = await Taro.request({
        url: `${API_BASE}/api/v2/orders`,
        method: 'GET',
        data: {
          userId: getCurrentUserId(),
          page: 1,
          pageSize: 100,
          status: status ? this.unmapStatus(status) : undefined
        },
        header: {
          'Content-Type': 'application/json'
        }
      })

      const result = response.data as ApiResponse<{list: any[]}>
      if (result.code !== 0) {
        throw new Error(result.message)
      }

      // 转换数据格式
      return result.data.list.map((order: any) => this.transformApiOrder(order))
    } catch (error) {
      console.error('获取订单列表失败:', error)
      // 降级到本地存储
      return this.getLocalOrders(status)
    }
  }

  // 转换API订单数据为前端格式
  private transformApiOrder(apiOrder: any): OrderData {
    const extraData = apiOrder.extraData || {}

    // 基础字段
    const baseOrder: OrderData = {
      orderNo: apiOrder.orderNo,
      orderType: apiOrder.orderType,
      userId: apiOrder.userId,
      title: apiOrder.title,
      status: this.mapPaymentStatus(apiOrder.paymentStatus),
      totalAmount: apiOrder.amount / 100, // 分转元
      createdAt: apiOrder.createdAt,
      paidAt: apiOrder.paidAt,
      paymentMethod: apiOrder.paymentMethod,
      extraData: extraData
    }

    // 根据订单类型补充字段
    if (apiOrder.orderType === 'service') {
      return {
        ...baseOrder,
        // 从extraData提取按摩预约字段
        therapistId: extraData.therapistId || '',
        therapistName: extraData.therapistName || '待分配',
        therapistAvatar: extraData.therapistAvatar || '',
        storeId: extraData.storeId || '',
        storeName: extraData.storeName || '默认门店',
        storeAddress: extraData.storeAddress || '',
        serviceId: extraData.serviceId || '',
        serviceName: extraData.serviceName || apiOrder.title || '按摩服务',
        appointmentDate: extraData.appointmentDate || '',
        appointmentTime: extraData.startTime || '',
        duration: extraData.duration || 60,
        price: extraData.price ? extraData.price / 100 : apiOrder.amount / 100,
        discountPrice: extraData.discountPrice ? extraData.discountPrice / 100 : undefined
      }
    } else if (apiOrder.orderType === 'product') {
      return {
        ...baseOrder,
        // 从extraData提取商品字段
        productId: extraData.productId || '',
        productName: extraData.productName || apiOrder.title,
        quantity: extraData.quantity || 1,
        // 为了兼容列表显示，设置一些默认值
        storeName: '线上商城',
        therapistName: '商品订单',
        serviceName: apiOrder.title
      }
    } else if (apiOrder.orderType === 'recharge') {
      return {
        ...baseOrder,
        // 从extraData提取充值字段
        rechargeAmount: extraData.rechargeAmount ? extraData.rechargeAmount / 100 : apiOrder.amount / 100,
        bonusAmount: extraData.bonus ? extraData.bonus / 100 : 0,
        // 为了兼容列表显示
        storeName: '充值中心',
        therapistName: '充值订单',
        serviceName: apiOrder.title
      }
    }

    // 默认返回基础订单
    return baseOrder
  }

  // 状态映射：前端状态 -> API状态
  private unmapStatus(status: OrderData['status']): string {
    const statusMap = {
      'pending_payment': 'pending',
      'paid': 'paid',
      'serving': 'paid',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'refunded': 'refunded'
    }
    return statusMap[status] || status
  }

  // 状态映射：API状态 -> 前端状态
  private mapPaymentStatus(apiStatus: string): OrderData['status'] {
    const statusMap = {
      'pending': 'pending_payment',
      'paid': 'paid',
      'failed': 'cancelled',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'completed': 'completed'
    }
    return statusMap[apiStatus] || 'pending_payment'
  }

  // 获取本地存储的订单（降级方案）
  private async getLocalOrders(status?: OrderData['status']): Promise<OrderData[]> {
    await sleep(300)
    let orders = Taro.getStorageSync('orders') || []

    if (status) {
      orders = orders.filter((o: OrderData) => o.status === status)
    }

    orders.sort((a: OrderData, b: OrderData) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return orders
  }
  
  // 取消订单
  async cancelOrder(orderNo: string): Promise<OrderData> {
    await sleep(300)
    
    const order = await this.getOrderDetail(orderNo)
    
    // 检查是否可以取消
    if (order.status !== 'pending_payment' && order.status !== 'paid') {
      throw new Error('该订单状态不能取消')
    }
    
    // 计算退款金额
    const now = new Date()
    const appointmentTime = new Date(`${order.appointmentDate} ${order.appointmentTime}`)
    const timeDiff = appointmentTime.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    let refundRate = 0
    if (order.status === 'pending_payment' || hoursDiff > 6) {
      refundRate = 1 // 100%
    } else if (hoursDiff > 0) {
      refundRate = 0.9 // 90%
    } else {
      refundRate = 0.8 // 80%
    }
    
    // 更新订单状态
    const updatedOrder = await this.updateOrderStatus(orderNo, 'cancelled')
    
    return {
      ...updatedOrder,
      refundAmount: updatedOrder.totalAmount * refundRate
    }
  }
}

export const orderService = new OrderService()