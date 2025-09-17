import { request } from '@/utils/request'
import Taro from '@tarojs/taro'

// 交易记录类型
export interface Transaction {
  id: string
  type: 'recharge' | 'consume' | 'refund'
  amount: number      // 正数为增加，负数为减少
  balance: number     // 交易后余额
  description: string
  orderId?: string    // 关联的订单号
  createdAt: string
}

// 充值选项
export interface RechargeOption {
  amount: number
  bonus: number       // 赠送金额
  label: string
}

// 操作结果
export interface WalletOperationResult {
  success: boolean
  message?: string
  balance?: number
  transaction?: Transaction
}

class WalletService {
  // 获取当前用户ID（从本地存储或登录状态获取）
  private getCurrentUserId(): number {
    // 这里应该从登录状态获取用户ID，暂时使用固定值
    const userInfo = Taro.getStorageSync('userInfo')
    return userInfo?.id || 1  // 默认用户ID为1
  }

  // 获取余额
  async getBalance(): Promise<number> {
    try {
      const userId = this.getCurrentUserId()
      const response = await request(`/api/v2/users/wallet/balance?userId=${userId}`)
      console.log('✅ 获取余额API调用成功:', response)

      // 检查响应格式
      if (response && response.data && typeof response.data.balance === 'number') {
        return response.data.balance / 100  // API返回的是分，转换为元
      } else {
        console.log('⚠️ 余额API返回格式不正确，使用默认值0')
        return 0
      }
    } catch (error) {
      console.log('⚠️ 获取余额API调用失败，使用默认值0:', error)
      return 0
    }
  }

  // 充值（创建充值订单）
  async recharge(amount: number, description: string = '余额充值'): Promise<WalletOperationResult> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          message: '充值金额必须大于0'
        }
      }

      const userId = this.getCurrentUserId()

      // 创建充值订单
      const orderResponse = await request('/api/v2/orders/create', {
        method: 'POST',
        data: {
          orderType: 'recharge',
          userId: userId,
          title: description,
          amount: amount * 100, // 转换为分
          paymentMethod: 'wechat',
          extraData: {
            bonus: this.calculateBonus(amount * 100) // 计算赠送金额
          }
        }
      })

      console.log('✅ 创建充值订单成功:', orderResponse)

      // 返回订单信息（实际支付需要调用微信支付）
      return {
        success: true,
        message: '充值订单创建成功，请完成微信支付',
        transaction: {
          id: orderResponse.data.orderNo,
          type: 'recharge',
          amount: amount,
          balance: 0, // 支付完成后才能获取最新余额
          description,
          orderId: orderResponse.data.orderNo,
          createdAt: orderResponse.data.createdAt
        }
      }
    } catch (error) {
      console.error('❌ 充值失败:', error)
      return {
        success: false,
        message: '充值失败，请稍后重试'
      }
    }
  }

  // 计算赠送金额
  private calculateBonus(amount: number): number {
    // amount是分为单位
    if (amount >= 500000) return 100000      // 5000元赠1000元
    if (amount >= 200000) return 30000       // 2000元赠300元
    if (amount >= 100000) return 10000       // 1000元赠100元
    if (amount >= 50000) return 5000         // 500元赠50元
    return 0
  }

  // 消费（创建订单并支付）
  async consume(amount: number, description: string, orderId?: string): Promise<WalletOperationResult> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          message: '消费金额必须大于0'
        }
      }

      // 如果没有提供订单号，创建新订单
      if (!orderId) {
        const userId = this.getCurrentUserId()

        // 创建服务订单
        const orderResponse = await request('/api/v2/orders/create', {
          method: 'POST',
          data: {
            orderType: 'service',
            userId: userId,
            title: description,
            amount: amount * 100, // 转换为分
            paymentMethod: 'balance'
          }
        })

        orderId = orderResponse.data.orderNo
        console.log('✅ 创建服务订单成功:', orderResponse)
      }

      // 使用余额支付订单
      const payResponse = await request('/api/v2/orders/pay', {
        method: 'POST',
        data: {
          orderNo: orderId,
          paymentMethod: 'balance'
        }
      })

      console.log('✅ 余额支付成功:', payResponse)

      return {
        success: true,
        balance: (payResponse.data.balance || 0) / 100, // 转换为元
        message: '支付成功',
        transaction: {
          id: `PAY_${orderId}`,
          type: 'consume',
          amount: -amount,
          balance: (payResponse.data.balance || 0) / 100, // 转换为元
          description,
          orderId,
          createdAt: payResponse.data.paidAt
        }
      }
    } catch (error) {
      console.error('❌ 消费失败:', error)
      return {
        success: false,
        message: '支付失败，请检查余额是否充足'
      }
    }
  }

  // 退款
  async refund(amount: number, description: string = '订单退款', orderId?: string): Promise<WalletOperationResult> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          message: '退款金额必须大于0'
        }
      }

      if (!orderId) {
        return {
          success: false,
          message: '退款必须提供订单号'
        }
      }

      const userId = this.getCurrentUserId()

      // 调用退款API
      const response = await request('/api/v2/users/wallet/refund', {
        method: 'POST',
        data: {
          phone: await this.getUserPhone(),
          amount: amount * 100, // 转换为分
          orderNo: orderId,
          description
        }
      })

      console.log('✅ 退款成功:', response)

      return {
        success: true,
        balance: (response.data.balance || 0) / 100, // 转换为元
        transaction: {
          id: response.data.transactionId,
          type: 'refund',
          amount: amount,
          balance: (response.data.balance || 0) / 100, // 转换为元
          description,
          orderId,
          createdAt: response.data.createdAt
        }
      }
    } catch (error) {
      console.error('❌ 退款失败:', error)
      return {
        success: false,
        message: '退款失败，请稍后重试'
      }
    }
  }

  // 获取用户手机号
  private async getUserPhone(): Promise<string> {
    const userInfo = Taro.getStorageSync('userInfo')
    return userInfo?.phone || '13800138000' // 默认手机号
  }

  // 获取交易记录
  async getTransactions(page: number = 1, pageSize: number = 20): Promise<Transaction[]> {
    try {
      const userId = this.getCurrentUserId()
      const response = await request(`/api/v2/users/wallet/transactions?userId=${userId}&page=${page}&pageSize=${pageSize}`)

      console.log('✅ 获取交易记录成功:', response)

      // 转换API响应格式为前端格式
      const transactions = response.data.list.map((item: any) => ({
        id: item.id,
        type: item.type,
        amount: item.amount / 100, // 转换为元
        balance: item.balance / 100, // 转换为元
        description: item.description,
        orderId: item.orderNo,
        createdAt: item.createdAt
      }))

      return transactions
    } catch (error) {
      console.error('❌ 获取交易记录失败:', error)
      return []
    }
  }

  // 获取充值选项
  getRechargeOptions(): RechargeOption[] {
    // 暂时使用硬编码，后续可以从API获取充值配置
    return [
      { amount: 100, bonus: 0, label: '100元' },
      { amount: 200, bonus: 0, label: '200元' },
      { amount: 500, bonus: 50, label: '500元（赠50元）' },
      { amount: 1000, bonus: 100, label: '1000元（赠100元）' },
      { amount: 2000, bonus: 300, label: '2000元（赠300元）' },
      { amount: 5000, bonus: 1000, label: '5000元（赠1000元）' }
    ]
  }

  // 清空本地缓存（仅用于测试）
  async clearLocalCache(): Promise<void> {
    Taro.removeStorageSync('userInfo')
    console.log('✅ 本地用户缓存已清空')
  }
}

export const walletService = new WalletService()