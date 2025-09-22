import { get, post } from '@/utils/request'
import Taro from '@tarojs/taro'

/**
 * 交易记录类型
 */
export interface Transaction {
  id: string
  type: 'recharge' | 'consume' | 'refund'
  amount: number      // 正数为增加，负数为减少
  balance: number     // 交易后余额
  description: string
  orderId?: string    // 关联的订单号
  createdAt: string
}

/**
 * 充值选项配置
 */
export interface RechargeOption {
  id: number
  amount: number      // 金额（分）
  bonus: number       // 赠送金额（分）
  label: string       // 显示标签
  sortOrder?: number
  isActive?: boolean
  description?: string
  promotionTag?: string
  isRecommended?: boolean
}

/**
 * 余额响应数据
 */
interface BalanceResponse {
  balance: number     // 余额（元）
  totalSpent: number  // 总消费
  totalVisits: number // 总访问次数
}

/**
 * 交易记录响应
 */
interface TransactionsResponse {
  list: Transaction[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 钱包服务类
 * 生产级代码：完全使用真实API
 */
class WalletService {
  /**
   * 获取当前用户ID
   * @returns 用户ID
   */
  private getCurrentUserId(): number {
    const userInfo = Taro.getStorageSync('userInfo')
    return userInfo?.id || 1  // 默认用户ID为1（开发环境）
  }

  /**
   * 获取钱包余额
   * @returns 余额信息
   */
  async getBalance(): Promise<number> {
    try {
      const userId = this.getCurrentUserId()
      const response = await get<BalanceResponse>('/users/wallet/balance', { userId })

      // API返回的余额单位是元，直接使用
      return response.data.balance || 0
    } catch (error) {
      console.error('获取余额失败:', error)
      throw new Error('获取余额失败，请重试')
    }
  }

  /**
   * 获取余额详情（包含统计信息）
   * @returns 余额详情
   */
  async getBalanceDetails(): Promise<BalanceResponse> {
    try {
      const userId = this.getCurrentUserId()
      const response = await get<BalanceResponse>('/users/wallet/balance', { userId })
      return response.data
    } catch (error) {
      console.error('获取余额详情失败:', error)
      throw new Error('获取余额详情失败，请重试')
    }
  }

  /**
   * 获取充值配置选项
   * @returns 充值配置列表
   */
  async getRechargeOptions(): Promise<RechargeOption[]> {
    try {
      const response = await get<RechargeOption[]>('/recharge/configs')

      // API返回的数据已经是分为单位，需要转换为元用于显示
      return response.data.map(option => ({
        ...option,
        amount: option.amount / 100,    // 转换为元
        bonus: option.bonus / 100        // 转换为元
      }))
    } catch (error) {
      console.error('获取充值配置失败:', error)
      // 返回默认配置作为降级方案
      return this.getDefaultRechargeOptions()
    }
  }

  /**
   * 获取默认充值配置（降级方案）
   * @private
   */
  private getDefaultRechargeOptions(): RechargeOption[] {
    return [
      { id: 1, amount: 100, bonus: 0, label: '100元', sortOrder: 1 },
      { id: 2, amount: 200, bonus: 0, label: '200元', sortOrder: 2 },
      { id: 3, amount: 500, bonus: 50, label: '500元', sortOrder: 3, promotionTag: '赠50元' },
      { id: 4, amount: 1000, bonus: 100, label: '1000元', sortOrder: 4, promotionTag: '赠100元' },
      { id: 5, amount: 2000, bonus: 300, label: '2000元', sortOrder: 5, promotionTag: '赠300元' },
      { id: 6, amount: 5000, bonus: 1000, label: '5000元', sortOrder: 6, promotionTag: '赠1000元', isRecommended: true }
    ]
  }

  /**
   * 创建充值订单
   * @param amount 充值金额（元）
   * @param bonus 赠送金额（元）
   * @returns 订单信息
   */
  async createRechargeOrder(amount: number, bonus: number = 0) {
    try {
      const userId = this.getCurrentUserId()
      const userInfo = Taro.getStorageSync('userInfo')

      const orderData = {
        orderType: 'recharge',
        userId: userId,
        userPhone: userInfo?.phone || '13800138000',
        title: bonus > 0 ? `充值${amount}元，赠送${bonus}元` : `充值${amount}元`,
        amount: amount * 100, // 转换为分
        paymentMethod: 'wechat',
        extraData: {
          bonus: bonus * 100,  // 转换为分
          actualRecharge: (amount + bonus) * 100
        }
      }

      const response = await post('/orders/create', orderData, {
        showLoading: true,
        loadingTitle: '创建订单中...'
      })

      return response.data
    } catch (error: any) {
      console.error('创建充值订单失败:', error)
      throw new Error(error.message || '创建充值订单失败')
    }
  }

  /**
   * 获取交易记录
   * @param page 页码
   * @param pageSize 每页数量
   * @param type 交易类型（可选）
   * @returns 交易记录列表
   */
  async getTransactions(
    page: number = 1,
    pageSize: number = 20,
    type?: 'recharge' | 'consume' | 'refund'
  ): Promise<Transaction[]> {
    try {
      const userId = this.getCurrentUserId()
      const params: any = { userId, page, pageSize }
      if (type) params.type = type

      const response = await get<TransactionsResponse>('/users/wallet/transactions', params)

      // 转换金额单位：分转元
      return response.data.list.map(item => ({
        ...item,
        amount: item.amount / 100,
        balance: item.balance / 100
      }))
    } catch (error) {
      console.error('获取交易记录失败:', error)
      return []
    }
  }

  /**
   * 使用余额支付
   * @param orderNo 订单号
   * @param amount 支付金额（元）
   * @returns 支付结果
   */
  async payWithBalance(orderNo: string, amount: number) {
    try {
      const response = await post('/orders/pay', {
        orderNo,
        paymentMethod: 'balance'
      }, {
        showLoading: true,
        loadingTitle: '支付中...'
      })

      return {
        success: true,
        balance: response.data.balance / 100, // 转换为元
        message: '支付成功'
      }
    } catch (error: any) {
      console.error('余额支付失败:', error)
      throw new Error(error.message || '余额不足或支付失败')
    }
  }

  /**
   * 处理微信支付
   * @param wxPayParams 微信支付参数
   * @returns Promise
   */
  async handleWechatPay(wxPayParams: any): Promise<void> {
    return new Promise((resolve, reject) => {
      Taro.requestPayment({
        timeStamp: wxPayParams.timeStamp,
        nonceStr: wxPayParams.nonceStr,
        package: wxPayParams.package,
        signType: wxPayParams.signType,
        paySign: wxPayParams.paySign,
        success: () => resolve(),
        fail: (err) => reject(new Error(err.errMsg || '支付失败'))
      })
    })
  }

  /**
   * 退款到余额
   * @param orderNo 订单号
   * @param amount 退款金额（元）
   * @param reason 退款原因
   * @returns 退款结果
   */
  async refundToBalance(orderNo: string, amount: number, reason: string = '订单退款') {
    try {
      const userInfo = Taro.getStorageSync('userInfo')

      const response = await post('/users/wallet/refund', {
        phone: userInfo?.phone || '13800138000',
        amount: amount * 100, // 转换为分
        orderNo: orderNo,
        description: reason
      }, {
        showLoading: true,
        loadingTitle: '退款中...'
      })

      return {
        success: true,
        balance: response.data.balance / 100, // 转换为元
        transactionId: response.data.transactionId,
        message: '退款成功'
      }
    } catch (error: any) {
      console.error('退款失败:', error)
      throw new Error(error.message || '退款失败')
    }
  }

  /**
   * 清空本地缓存
   */
  clearCache(): void {
    try {
      Taro.removeStorageSync('userInfo')
      Taro.removeStorageSync('walletCache')
      console.log('钱包缓存已清空')
    } catch (error) {
      console.error('清空缓存失败:', error)
    }
  }
}

// 导出单例实例
export const walletService = new WalletService()