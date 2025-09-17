import Taro from '@tarojs/taro'
import { sleep } from '@/utils/common'

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
  private readonly BALANCE_KEY = 'wallet_balance'
  private readonly TRANSACTIONS_KEY = 'wallet_transactions'

  // 获取余额
  async getBalance(): Promise<number> {
    await sleep(100)
    const balance = Taro.getStorageSync(this.BALANCE_KEY)
    return balance || 0
  }

  // 充值
  async recharge(amount: number, description: string = '余额充值'): Promise<WalletOperationResult> {
    await sleep(200)

    if (amount <= 0) {
      return {
        success: false,
        message: '充值金额必须大于0'
      }
    }

    const currentBalance = await this.getBalance()
    const newBalance = currentBalance + amount

    // 创建交易记录
    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'recharge',
      amount: amount,
      balance: newBalance,
      description,
      createdAt: new Date().toISOString()
    }

    // 保存余额
    Taro.setStorageSync(this.BALANCE_KEY, newBalance)

    // 保存交易记录
    this.saveTransaction(transaction)

    return {
      success: true,
      balance: newBalance,
      transaction
    }
  }

  // 消费
  async consume(amount: number, description: string, orderId?: string): Promise<WalletOperationResult> {
    await sleep(200)

    if (amount <= 0) {
      return {
        success: false,
        message: '消费金额必须大于0'
      }
    }

    const currentBalance = await this.getBalance()

    if (currentBalance < amount) {
      return {
        success: false,
        message: '余额不足'
      }
    }

    const newBalance = currentBalance - amount

    // 创建交易记录
    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'consume',
      amount: -amount,  // 消费为负数
      balance: newBalance,
      description,
      orderId,
      createdAt: new Date().toISOString()
    }

    // 保存余额
    Taro.setStorageSync(this.BALANCE_KEY, newBalance)

    // 保存交易记录
    this.saveTransaction(transaction)

    return {
      success: true,
      balance: newBalance,
      transaction
    }
  }

  // 退款
  async refund(amount: number, description: string = '订单退款', orderId?: string): Promise<WalletOperationResult> {
    await sleep(200)

    if (amount <= 0) {
      return {
        success: false,
        message: '退款金额必须大于0'
      }
    }

    const currentBalance = await this.getBalance()
    const newBalance = currentBalance + amount

    // 创建交易记录
    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'refund',
      amount: amount,
      balance: newBalance,
      description,
      orderId,
      createdAt: new Date().toISOString()
    }

    // 保存余额
    Taro.setStorageSync(this.BALANCE_KEY, newBalance)

    // 保存交易记录
    this.saveTransaction(transaction)

    return {
      success: true,
      balance: newBalance,
      transaction
    }
  }

  // 获取交易记录
  async getTransactions(page: number = 1, pageSize: number = 20): Promise<Transaction[]> {
    await sleep(200)

    const allTransactions = Taro.getStorageSync(this.TRANSACTIONS_KEY) || []

    // 按时间倒序排序
    allTransactions.sort((a: Transaction, b: Transaction) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return allTransactions.slice(start, end)
  }

  // 获取充值选项
  getRechargeOptions(): RechargeOption[] {
    return [
      { amount: 100, bonus: 0, label: '100元' },
      { amount: 200, bonus: 0, label: '200元' },
      { amount: 500, bonus: 50, label: '500元（赠50元）' },
      { amount: 1000, bonus: 100, label: '1000元（赠100元）' },
      { amount: 2000, bonus: 300, label: '2000元（赠300元）' },
      { amount: 5000, bonus: 1000, label: '5000元（赠1000元）' }
    ]
  }

  // 保存交易记录
  private saveTransaction(transaction: Transaction): void {
    const transactions = Taro.getStorageSync(this.TRANSACTIONS_KEY) || []
    transactions.push(transaction)
    Taro.setStorageSync(this.TRANSACTIONS_KEY, transactions)
  }

  // 清空数据（仅用于测试）
  async clearAll(): Promise<void> {
    Taro.removeStorageSync(this.BALANCE_KEY)
    Taro.removeStorageSync(this.TRANSACTIONS_KEY)
  }
}

export const walletService = new WalletService()