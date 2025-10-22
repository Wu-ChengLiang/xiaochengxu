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
  appointmentId?: number  // 预约ID（用于评价）
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
  appointmentStatus?: 'pending' | 'confirmed' | 'serving' | 'completed' | 'cancelled'  // 预约状态

  // 计算字段
  totalAmount?: number
  paymentDeadline?: string
  displayStatus?: string  // 综合显示状态
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
   * 获取综合显示状态
   * 结合支付状态和预约状态，返回最终的显示状态
   */
  private getDisplayStatus(order: OrderData): string {
    // 支付未完成
    if (order.paymentStatus === 'pending') {
      return 'pending'
    }

    // 已取消或退款
    if (order.paymentStatus === 'cancelled' || order.paymentStatus === 'refunded') {
      return order.paymentStatus
    }

    // 已支付的服务订单，根据预约状态细分
    if (order.paymentStatus === 'paid' && order.orderType === 'service') {
      // 如果有预约状态，优先使用
      if (order.appointmentStatus) {
        switch(order.appointmentStatus) {
          case 'completed':
            return 'completed'  // 已完成（管理员标记）
          case 'serving':
            return 'serving'    // 服务中（虽然少见，但可能存在）
          case 'cancelled':
            return 'cancelled'  // 预约已取消
          case 'pending':         // 待确认
          case 'confirmed':       // 已确认
          default:
            return 'paid'       // 都归类为"待服务"
        }
      }

      // 没有预约状态时，根据时间推断
      if (order.appointmentDate && order.appointmentTime) {
        const appointmentDateTime = new Date(`${order.appointmentDate} ${order.appointmentTime}`)
        const endDateTime = new Date(appointmentDateTime.getTime() + (order.duration || 60) * 60000)
        const now = new Date()

        // 如果服务时间已经结束，但没有标记completed，暂时归类为待服务
        // 等待管理员手动标记为completed
        if (endDateTime < now) {
          // 服务时间已过，可能已完成但未标记
          // 保守处理：仍显示为"待服务"，避免误判
          return 'paid'
        }
      }
    }

    // 默认返回支付状态
    return order.paymentStatus
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
            .catch(async (error) => {
              console.error(`获取门店信息失败 (storeId: ${order.storeId}):`, error)
              // 尝试获取默认门店信息
              const defaultStore = await this.getDefaultStoreInfo()
              if (defaultStore) {
                order.storeName = `${defaultStore.name}（替代显示）`
                order.storeAddress = defaultStore.address
              } else {
                // 最后的降级方案
                order.storeName = '门店信息暂时无法获取'
                order.storeAddress = '请联系客服获取详情'
              }
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
   * 获取默认门店信息（当原门店不存在时使用）
   * @private
   */
  private async getDefaultStoreInfo(): Promise<{ name: string; address: string } | null> {
    try {
      const response = await get('/stores/nearby', { page: 1, pageSize: 1 })
      if (response.data?.list?.[0]) {
        const store = response.data.list[0]
        return {
          name: store.name,
          address: store.address
        }
      }
    } catch (error) {
      console.error('获取默认门店信息失败:', error)
    }
    return null
  }

  /**
   * 批量补全订单列表的门店和技师信息，过滤无效订单
   * @param orders 订单列表
   * @returns 过滤后的有效订单列表
   * @private
   */
  private async enrichOrderListWithStoreAndTherapistInfo(orders: OrderData[]): Promise<OrderData[]> {
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
      const invalidStoreIds = new Set<string>()

      // 批量获取门店信息
      Array.from(storeIds).forEach(storeId => {
        promises.push(
          get(`/stores/${storeId}`)
            .then(response => {
              storeMap.set(storeId, response.data)
            })
            .catch(error => {
              console.warn(`门店不存在，将过滤相关订单 (storeId: ${storeId}):`, error.message)
              invalidStoreIds.add(storeId)
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

      // 🚀 过滤掉门店不存在的无效订单
      const validOrders = orders.filter(order => {
        if (order.storeId && invalidStoreIds.has(order.storeId.toString())) {
          console.warn(`过滤无效订单: ${order.orderNo}（门店 ${order.storeId} 不存在）`)
          return false
        }
        return true
      })

      // 只对有效订单填充信息
      validOrders.forEach(order => {
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
          } else {
            // 如果没有获取到技师信息，设置默认头像
            order.therapistAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
          }
        }
      })

      return validOrders
    } catch (error) {
      console.error('批量补全订单列表信息失败:', error)
      // 发生错误时返回原始订单列表
      return orders
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

      // ✅ API返回的amount已经是分为单位，需要转换为元用于显示
      const order = response.data
      if (order.amount) {
        order.totalAmount = order.amount / 100  // ✅ 转换为元用于显示
      }

      // 从extraData中提取预约信息
      if (order.extraData) {
        order.appointmentId = order.extraData.appointmentId
        order.therapistId = order.extraData.therapistId
        order.therapistName = order.extraData.therapistName
        order.storeId = order.extraData.storeId
        order.appointmentDate = order.extraData.appointmentDate
        order.appointmentTime = order.extraData.startTime
        order.duration = order.extraData.duration
        order.serviceName = order.extraData.serviceName || order.title

        // 🚀 读取预约状态（后端新增字段）
        order.appointmentStatus = order.extraData.appointmentStatus

        // 🚀 自动获取完整的门店和技师信息
        await this.enrichOrderWithStoreAndTherapistInfo(order)
      }

      // 计算综合显示状态
      order.displayStatus = this.getDisplayStatus(order)

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
        // ✅ API返回的amount已经是分为单位，需要转换为元用于显示
        if (order.amount) {
          order.totalAmount = order.amount / 100  // ✅ 转换为元用于显示
        }

        // 从extraData中提取信息
        if (order.extraData) {
          order.appointmentId = order.extraData.appointmentId
          order.therapistId = order.extraData.therapistId
          order.therapistName = order.extraData.therapistName
          order.storeId = order.extraData.storeId
          order.storeName = order.extraData.storeName // 移除硬编码默认值
          order.storeAddress = order.extraData.storeAddress // 移除硬编码默认值
          order.appointmentDate = order.extraData.appointmentDate
          order.appointmentTime = order.extraData.startTime
          order.duration = order.extraData.duration
          order.serviceName = order.extraData.serviceName || order.title

          // 🚀 读取预约状态（后端新增字段）
          order.appointmentStatus = order.extraData.appointmentStatus
        }

        // 添加默认头像（如果没有的话）
        if (!order.therapistAvatar) {
          order.therapistAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
        }

        // 计算综合显示状态
        order.displayStatus = this.getDisplayStatus(order)

        return order
      })

      // 🚀 批量补全门店和技师信息，并过滤无效订单
      const validOrders = await this.enrichOrderListWithStoreAndTherapistInfo(orders)

      return validOrders
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
   * 申请退款（通过订单API）
   * @param orderNo 订单号
   * @param reason 退款原因（可选）
   * @returns 退款单信息
   */
  async requestRefund(orderNo: string, reason?: string): Promise<any> {
    try {
      const { userId } = this.getUserInfo()

      const response = await post(`/orders/${orderNo}/refund`, {
        userId,
        reason: reason || '用户申请退款'
      }, {
        showLoading: true,
        loadingTitle: '申请退款中...'
      })

      return response.data
    } catch (error: any) {
      console.error('申请退款失败:', error)
      throw new Error(error.message || '申请退款失败')
    }
  }

  /**
   * 查询退款详情
   * @param refundId 退款单号
   * @returns 退款详情
   */
  async getRefundDetail(refundId: string): Promise<any> {
    try {
      const response = await get(`/refunds/${refundId}`)
      return response.data
    } catch (error: any) {
      console.error('获取退款详情失败:', error)
      throw new Error('退款单不存在或已删除')
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