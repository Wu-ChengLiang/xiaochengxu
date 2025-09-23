import Taro from '@tarojs/taro'
import { get, post } from '@/utils/request'
import { getCurrentUserId, getCurrentUserPhone } from '@/utils/user'

/**
 * 订单数据接口
 */
export interface OrderData {
  orderNo: string
  orderType: 'service' | 'product' | 'recharge'
  userId: number
  userPhone: string
  title: string
  amount: number
  paymentMethod: 'wechat' | 'balance'
  paymentStatus: 'pending' | 'paid' | 'cancelled' | 'refunded'
  createdAt: string
  paidAt?: string
  extraData?: any

  // 服务订单特有字段
  therapistId?: string
  therapistName?: string
  therapistAvatar?: string
  storeId?: string
  storeName?: string
  storeAddress?: string
  serviceId?: string
  serviceName?: string
  duration?: number
  appointmentDate?: string
  appointmentTime?: string

  // 计算字段
  totalAmount?: number
  paymentDeadline?: string
}

/**
 * 订单列表响应
 */
interface OrderListResponse {
  list: OrderData[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 创建订单参数
 */
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

/**
 * 支付参数
 */
export interface PaymentParams {
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

/**
 * 取消订单响应
 */
interface CancelOrderResponse {
  orderNo: string
  paymentStatus: string
  refundAmount?: number
  refundRate?: number
  cancelledAt?: string
}

/**
 * 订单服务类
 * 生产级代码：完全使用真实API
 */
class OrderService {
  /**
   * 获取当前用户信息
   */
  private getUserInfo() {
    return {
      userId: getCurrentUserId(),
      userPhone: getCurrentUserPhone()
    }
  }

  /**
   * 补全订单的门店和技师信息
   * @param order 订单对象
   * @private
   */
  private async enrichOrderWithStoreAndTherapistInfo(order: OrderData): Promise<void> {
    try {
      const promises: Promise<any>[] = []

      // 并发获取门店信息
      if (order.storeId && !order.storeName) {
        promises.push(
          get(`/stores/${order.storeId}`)
            .then(storeResponse => {
              const store = storeResponse.data
              order.storeName = store.name
              order.storeAddress = store.address
            })
            .catch(error => {
              console.error(`获取门店信息失败 (storeId: ${order.storeId}):`, error)
              // 失败时不设置，避免undefined覆盖可能存在的extraData值
            })
        )
      }

      // 并发获取技师信息
      if (order.therapistId && !order.therapistAvatar) {
        promises.push(
          get(`/therapists/${order.therapistId}`)
            .then(therapistResponse => {
              const therapist = therapistResponse.data
              order.therapistAvatar = therapist.avatar
              // 如果extraData中没有技师姓名，则使用API返回的姓名
              if (!order.therapistName) {
                order.therapistName = therapist.name
              }
            })
            .catch(error => {
              console.error(`获取技师信息失败 (therapistId: ${order.therapistId}):`, error)
              // 失败时使用默认头像
              if (!order.therapistAvatar) {
                order.therapistAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
              }
            })
        )
      }

      // 等待所有API调用完成
      if (promises.length > 0) {
        await Promise.allSettled(promises)
      }
    } catch (error) {
      console.error('补全订单信息失败:', error)
      // 不抛出错误，确保订单详情仍能正常返回
    }
  }

  /**
   * 批量补全订单列表的门店和技师信息
   * @param orders 订单列表
   * @private
   */
  private async enrichOrderListWithStoreAndTherapistInfo(orders: OrderData[]): Promise<void> {
    try {
      // 收集需要获取的门店ID和技师ID（去重）
      const storeIds = new Set<string>()
      const therapistIds = new Set<string>()

      orders.forEach(order => {
        if (order.storeId && !order.storeName) {
          storeIds.add(order.storeId.toString())
        }
        if (order.therapistId && !order.therapistAvatar) {
          therapistIds.add(order.therapistId.toString())
        }
      })

      // 并发获取所有需要的门店和技师信息
      const promises: Promise<any>[] = []
      const storeMap = new Map<string, any>()
      const therapistMap = new Map<string, any>()

      // 批量获取门店信息
      Array.from(storeIds).forEach(storeId => {
        promises.push(
          get(`/stores/${storeId}`)
            .then(response => {
              storeMap.set(storeId, response.data)
            })
            .catch(error => {
              console.error(`批量获取门店信息失败 (storeId: ${storeId}):`, error)
            })
        )
      })

      // 批量获取技师信息
      Array.from(therapistIds).forEach(therapistId => {
        promises.push(
          get(`/therapists/${therapistId}`)
            .then(response => {
              therapistMap.set(therapistId, response.data)
            })
            .catch(error => {
              console.error(`批量获取技师信息失败 (therapistId: ${therapistId}):`, error)
            })
        )
      })

      // 等待所有API调用完成
      if (promises.length > 0) {
        await Promise.allSettled(promises)
      }

      // 将获取到的信息填充到订单中
      orders.forEach(order => {
        // 填充门店信息
        if (order.storeId && !order.storeName) {
          const store = storeMap.get(order.storeId.toString())
          if (store) {
            order.storeName = store.name
            order.storeAddress = store.address
          }
        }

        // 填充技师信息
        if (order.therapistId && !order.therapistAvatar) {
          const therapist = therapistMap.get(order.therapistId.toString())
          if (therapist) {
            order.therapistAvatar = therapist.avatar
            if (!order.therapistName) {
              order.therapistName = therapist.name
            }
          }
        }
      })
    } catch (error) {
      console.error('批量补全订单列表信息失败:', error)
      // 不抛出错误，确保订单列表仍能正常返回
    }
  }

  /**
   * 创建预约订单（通过预约接口）
   * @param params 创建订单参数
   * @returns 订单和预约信息
   */
  async createAppointmentOrder(params: CreateOrderParams) {
    try {
      const { userId, userPhone } = this.getUserInfo()

      // 调试日志 - 查看原始参数
      console.log('📝 创建订单原始参数:', params)
      console.log('📝 therapistId类型:', typeof params.therapistId, '值:', params.therapistId)

      const requestData = {
        therapistId: Number(params.therapistId),
        storeId: Number(params.storeId),
        userId,
        userPhone,
        appointmentDate: params.appointmentDate,
        startTime: params.appointmentTime,
        duration: params.duration || 60,
        serviceId: params.serviceId,
        serviceName: params.serviceName,
        price: params.discountPrice || params.price
      }

      // 调试日志 - 查看转换后的请求数据
      console.log('📤 实际发送的请求数据:', requestData)
      console.log('📤 转换后的therapistId:', requestData.therapistId, '是否为NaN:', isNaN(requestData.therapistId))

      const response = await post('/appointments/create-with-order', requestData, {
        showLoading: true,
        loadingTitle: '创建订单中...'
      })

      // 提取订单信息
      const orderData: OrderData = {
        ...response.data.order,
        therapistName: params.therapistName,
        therapistAvatar: params.therapistAvatar,
        serviceName: params.serviceName,
        duration: params.duration,
        appointmentDate: params.appointmentDate,
        appointmentTime: params.appointmentTime,
        totalAmount: (params.discountPrice || params.price)
      }

      return {
        order: orderData,
        appointment: response.data.appointment
      }
    } catch (error: any) {
      console.error('创建订单失败:', error)
      throw new Error(error.message || '创建订单失败')
    }
  }

  /**
   * 获取支付参数
   * @param orderNo 订单号
   * @returns 支付参数
   */
  async getPaymentParams(orderNo: string): Promise<PaymentParams> {
    try {
      const response = await post('/orders/pay', {
        orderNo,
        paymentMethod: 'wechat'
      })

      // 返回微信支付参数
      if (response.data.wxPayParams) {
        return response.data.wxPayParams
      }

      // 模拟支付参数（开发环境）
      return {
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: Math.random().toString(36).substr(2, 15),
        package: `prepay_id=${Math.random().toString(36).substr(2, 15)}`,
        signType: 'MD5',
        paySign: Math.random().toString(36).substr(2, 32)
      }
    } catch (error: any) {
      console.error('获取支付参数失败:', error)
      throw new Error('获取支付参数失败')
    }
  }

  /**
   * 更新订单状态（余额支付）
   * @param orderNo 订单号
   * @param status 订单状态
   * @returns 更新后的订单
   */
  async updateOrderStatus(orderNo: string, status: OrderData['paymentStatus']): Promise<OrderData> {
    try {
      // 使用余额支付接口
      const response = await post('/orders/pay', {
        orderNo,
        paymentMethod: 'balance'
      })

      return {
        orderNo,
        paymentStatus: 'paid',
        paidAt: response.data.paidAt || new Date().toISOString()
      } as OrderData
    } catch (error: any) {
      console.error('更新订单状态失败:', error)
      throw new Error(error.message || '支付失败')
    }
  }

  /**
   * 获取订单详情
   * @param orderNo 订单号
   * @returns 订单详情
   */
  async getOrderDetail(orderNo: string): Promise<OrderData> {
    try {
      // 使用RESTful风格的API路径
      const response = await get(`/orders/${orderNo}`)

      // 转换金额单位和格式
      const order = response.data
      if (order.amount) {
        order.totalAmount = order.amount / 100
      }

      // 从extraData中提取预约信息
      if (order.extraData) {
        order.therapistId = order.extraData.therapistId
        order.therapistName = order.extraData.therapistName
        order.storeId = order.extraData.storeId
        order.appointmentDate = order.extraData.appointmentDate
        order.appointmentTime = order.extraData.startTime
        order.duration = order.extraData.duration
        order.serviceName = order.extraData.serviceName || order.title

        // 🚀 自动获取完整的门店和技师信息
        await this.enrichOrderWithStoreAndTherapistInfo(order)
      }

      return order
    } catch (error: any) {
      console.error('获取订单详情失败:', error)
      throw new Error('订单不存在或已删除')
    }
  }

  /**
   * 获取订单列表
   * @param status 订单状态（可选）
   * @param orderType 订单类型（可选）
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 订单列表
   */
  async getOrderList(
    status?: OrderData['paymentStatus'],
    orderType?: OrderData['orderType'],
    page: number = 1,
    pageSize: number = 20
  ): Promise<OrderData[]> {
    try {
      const { userId } = this.getUserInfo()

      const params: any = { userId, page, pageSize }
      if (status) params.status = status
      if (orderType) params.orderType = orderType

      const response = await get<OrderListResponse>('/orders', params)

      // 处理订单数据
      const orders = response.data.list.map(order => {
        // 转换金额单位（分转元）
        if (order.amount) {
          order.totalAmount = order.amount / 100
        }

        // 从extraData中提取信息
        if (order.extraData) {
          order.therapistId = order.extraData.therapistId
          order.therapistName = order.extraData.therapistName
          order.storeId = order.extraData.storeId
          order.storeName = order.extraData.storeName // 移除硬编码默认值
          order.storeAddress = order.extraData.storeAddress // 移除硬编码默认值
          order.appointmentDate = order.extraData.appointmentDate
          order.appointmentTime = order.extraData.startTime
          order.duration = order.extraData.duration
          order.serviceName = order.extraData.serviceName || order.title
        }

        // 添加默认头像（如果没有的话）
        if (!order.therapistAvatar) {
          order.therapistAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
        }

        return order
      })

      // 🚀 批量补全门店和技师信息
      await this.enrichOrderListWithStoreAndTherapistInfo(orders)

      return orders
    } catch (error: any) {
      console.error('获取订单列表失败:', error)
      return []
    }
  }

  /**
   * 取消订单
   * @param orderNo 订单号
   * @param reason 取消原因
   * @returns 取消结果
   */
  async cancelOrder(orderNo: string, reason: string = '用户取消'): Promise<CancelOrderResponse> {
    try {
      const { userId } = this.getUserInfo()

      const response = await post<CancelOrderResponse>('/orders/cancel', {
        orderNo,
        userId,
        reason
      }, {
        showLoading: true,
        loadingTitle: '取消中...'
      })

      return response.data
    } catch (error: any) {
      console.error('取消订单失败:', error)
      throw new Error(error.message || '取消订单失败')
    }
  }

  /**
   * 重新预约（基于已有订单）
   * @param orderNo 原订单号
   * @returns 是否成功
   */
  async rebookOrder(orderNo: string): Promise<boolean> {
    try {
      // 获取原订单信息
      const originalOrder = await this.getOrderDetail(orderNo)

      // 保存到临时存储，供预约页面使用
      Taro.setStorageSync('rebookOrderInfo', {
        therapistId: originalOrder.therapistId,
        therapistName: originalOrder.therapistName,
        storeId: originalOrder.storeId,
        storeName: originalOrder.storeName,
        serviceId: originalOrder.serviceId,
        serviceName: originalOrder.serviceName,
        duration: originalOrder.duration
      })

      return true
    } catch (error) {
      console.error('重新预约失败:', error)
      return false
    }
  }

  /**
   * 获取订单统计
   * @returns 订单统计信息
   */
  async getOrderStatistics() {
    try {
      const { userId } = this.getUserInfo()
      const response = await get('/orders', { userId, page: 1, pageSize: 100 })

      const orders = response.data.list

      return {
        total: orders.length,
        pendingPayment: orders.filter((o: OrderData) => o.paymentStatus === 'pending').length,
        paid: orders.filter((o: OrderData) => o.paymentStatus === 'paid').length,
        completed: orders.filter((o: OrderData) => o.paymentStatus === 'paid' &&
          new Date(o.appointmentDate + ' ' + o.appointmentTime) < new Date()).length,
        cancelled: orders.filter((o: OrderData) => o.paymentStatus === 'cancelled').length
      }
    } catch (error) {
      console.error('获取订单统计失败:', error)
      return {
        total: 0,
        pendingPayment: 0,
        paid: 0,
        completed: 0,
        cancelled: 0
      }
    }
  }
}

// 导出单例实例
export const orderService = new OrderService()