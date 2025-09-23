/**
 * 支付服务
 * 支持模拟支付和余额支付（个人小程序可用）
 */
import Taro from '@tarojs/taro'
import { post } from '@/utils/request'

interface PaymentConfig {
  useMockPayment: boolean
  enableBalancePayment: boolean
  enableWechatPayment: boolean
}

interface PaymentOptions {
  orderNo: string
  amount: number
  paymentMethod: 'wechat' | 'balance' | 'mock'
  title?: string
}

class PaymentService {
  private config: PaymentConfig = {
    // 个人小程序默认配置
    useMockPayment: true,
    enableBalancePayment: true,
    enableWechatPayment: false
  }

  /**
   * 统一支付入口
   */
  async pay(options: PaymentOptions): Promise<boolean> {
    const { paymentMethod } = options

    // 开发环境或个人小程序使用模拟支付
    if (this.config.useMockPayment && paymentMethod === 'wechat') {
      return this.mockWechatPayment(options)
    }

    // 余额支付
    if (paymentMethod === 'balance') {
      return this.payWithBalance(options)
    }

    // 真实微信支付（需要企业认证）
    if (paymentMethod === 'wechat' && this.config.enableWechatPayment) {
      return this.payWithWechat(options)
    }

    throw new Error('不支持的支付方式')
  }

  /**
   * 模拟微信支付（个人小程序测试用）
   */
  private async mockWechatPayment(options: PaymentOptions): Promise<boolean> {
    try {
      // 显示模拟支付界面
      const { confirm } = await Taro.showModal({
        title: '模拟支付',
        content: `订单金额：¥${(options.amount / 100).toFixed(2)}\n${options.title || ''}`,
        confirmText: '确认支付',
        cancelText: '取消支付',
        confirmColor: '#07c160'
      })

      if (confirm) {
        // 显示加载动画
        Taro.showLoading({ title: '支付中...' })

        // 模拟网络延迟
        await this.delay(1500)

        // 调用后端更新订单状态
        await post('/orders/mock-pay', {
          orderNo: options.orderNo,
          paymentStatus: 'paid'
        })

        Taro.hideLoading()
        Taro.showToast({
          title: '支付成功',
          icon: 'success'
        })

        return true
      } else {
        console.log('用户取消模拟支付')
        return false
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '支付失败',
        icon: 'none'
      })
      throw error
    }
  }

  /**
   * 余额支付
   */
  private async payWithBalance(options: PaymentOptions): Promise<boolean> {
    try {
      Taro.showLoading({ title: '支付中...' })

      console.log('💰 余额支付请求参数:', {
        orderNo: options.orderNo,
        paymentMethod: 'balance'
      })

      // 调用余额支付接口
      const response = await post('/orders/pay', {
        orderNo: options.orderNo,
        paymentMethod: 'balance'
      })

      console.log('💰 余额支付响应:', response)

      Taro.hideLoading()

      if (response.code === 0) {
        // 显示新余额
        Taro.showToast({
          title: `支付成功\n余额：¥${(response.data.balance / 100).toFixed(2)}`,
          icon: 'success',
          duration: 2000
        })
        return true
      } else {
        throw new Error(response.message || '余额不足')
      }
    } catch (error: any) {
      console.error('💰 余额支付失败:', error)
      console.error('💰 错误详情:', error.response || error.message)
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '支付失败',
        icon: 'none'
      })
      return false
    }
  }

  /**
   * 真实微信支付（需要企业认证）
   */
  private async payWithWechat(options: PaymentOptions): Promise<boolean> {
    try {
      // 获取支付参数
      const { data } = await post('/orders/wechat-pay-params', {
        orderNo: options.orderNo
      })

      const { wxPayParams } = data

      // 调起微信支付
      await Taro.requestPayment({
        timeStamp: wxPayParams.timeStamp,
        nonceStr: wxPayParams.nonceStr,
        package: wxPayParams.package,
        signType: wxPayParams.signType as any,
        paySign: wxPayParams.paySign
      })

      Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      return true
    } catch (error: any) {
      if (error.errMsg === 'requestPayment:fail cancel') {
        console.log('用户取消支付')
        return false
      }

      Taro.showToast({
        title: '支付失败',
        icon: 'none'
      })
      throw error
    }
  }

  /**
   * 检查支付环境
   */
  async checkPaymentEnvironment(): Promise<{
    canUseWechatPay: boolean
    canUseBalance: boolean
    canUseMockPay: boolean
    message: string
  }> {
    // 获取小程序账号信息
    const accountInfo = Taro.getAccountInfoSync()
    const { miniProgram } = accountInfo

    // 个人小程序的AppID通常以wx开头的个人类型
    const isPersonalApp = !this.config.enableWechatPayment

    return {
      canUseWechatPay: !isPersonalApp && this.config.enableWechatPayment,
      canUseBalance: this.config.enableBalancePayment,
      canUseMockPay: this.config.useMockPayment,
      message: isPersonalApp
        ? '当前为个人小程序，使用模拟支付和余额支付'
        : '企业小程序，支持完整支付功能'
    }
  }

  /**
   * 生成充值码（线下充值）
   */
  async generateRechargeCode(amount: number): Promise<{
    code: string
    qrcode: string
    expireTime: string
  }> {
    const response = await post('/recharge/generate-code', { amount })
    return response.data
  }

  /**
   * 辅助方法：延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例
export const paymentService = new PaymentService()

// 导出支付方式枚举
export enum PaymentMethod {
  WECHAT = 'wechat',
  BALANCE = 'balance',
  MOCK = 'mock'
}