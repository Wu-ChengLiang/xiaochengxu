import Taro from '@tarojs/taro'
import { sleep } from '@/utils/common'

// 订单数据接口
export interface OrderData {
  orderNo: string
  therapistId: string
  therapistName: string
  therapistAvatar: string
  storeId: string
  storeName: string
  storeAddress: string
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  appointmentDate: string
  appointmentTime: string
  status: 'pending_payment' | 'paid' | 'serving' | 'completed' | 'cancelled' | 'refunded'
  createdAt: string
  paidAt?: string
  paymentDeadline: string
  totalAmount: number
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
    await sleep(300)
    
    // 从本地存储获取订单
    let orders = Taro.getStorageSync('orders') || []
    
    // 按状态筛选
    if (status) {
      orders = orders.filter((o: OrderData) => o.status === status)
    }
    
    // 按创建时间倒序
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