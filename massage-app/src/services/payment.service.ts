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
    // 企业小程序真实支付配置
    useMockPayment: false,  // 关闭模拟支付
    enableBalancePayment: true,
    enableWechatPayment: true  // 启用真实微信支付
  }

  /**
   * 统一支付入口
   */
  async pay(options: PaymentOptions): Promise<boolean> {
    const { paymentMethod } = options

    // 余额支付
    if (paymentMethod === 'balance') {
      return this.payWithBalance(options)
    }

    // 真实微信支付
    if (paymentMethod === 'wechat') {
      return this.payWithWechat(options)
    }

    throw new Error('不支持的支付方式')
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
        // ✅ API返回的balance已经是分为单位，需要转为元显示
        const balanceInYuan = (response.data.balance || 0) / 100
        Taro.showToast({
          title: `支付成功\n余额：¥${balanceInYuan.toFixed(2)}`,
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
   * 注意：wxPayParams 已经在创建订单时由后端返回
   */
  private async payWithWechat(options: PaymentOptions): Promise<boolean> {
    try {
      console.log('💳 开始真实微信支付，订单号:', options.orderNo)

      // ⚠️ 重要：wxPayParams 应该由创建订单接口返回，而不是单独获取
      // 如果没有传入支付参数，需要从订单服务获取
      // 这里假设调用方已经在options中附带了wxPayParams
      const wxPayParams = (options as any).wxPayParams

      if (!wxPayParams) {
        throw new Error('缺少微信支付参数，请先创建订单')
      }

      // ✅ 验证支付参数完整性
      const requiredFields = ['timeStamp', 'nonceStr', 'package', 'signType', 'paySign']
      const missingFields = requiredFields.filter(field => !wxPayParams[field])

      if (missingFields.length > 0) {
        console.error('❌ 微信支付参数不完整，缺少字段:', missingFields)
        throw new Error(`微信支付参数缺失: ${missingFields.join(', ')}`)
      }

      console.log('💳 微信支付参数:', {
        timeStamp: wxPayParams.timeStamp,
        nonceStr: wxPayParams.nonceStr?.substring(0, 8) + '...',
        package: wxPayParams.package,
        signType: wxPayParams.signType,
        paySign: wxPayParams.paySign?.substring(0, 16) + '...'
      })

      // 调起微信支付SDK
      await Taro.requestPayment({
        timeStamp: wxPayParams.timeStamp,
        nonceStr: wxPayParams.nonceStr,
        package: wxPayParams.package,
        signType: wxPayParams.signType as any,
        paySign: wxPayParams.paySign
      })

      console.log('💳 用户完成支付，等待微信回调后端更新订单状态')

      Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })

      return true
    } catch (error: any) {
      if (error.errMsg === 'requestPayment:fail cancel') {
        console.log('💳 用户取消支付')
        return false
      }

      console.error('💳 微信支付失败:', error)
      console.error('💳 错误详情:', {
        errMsg: error.errMsg,
        errCode: error.errCode,
        message: error.message
      })

      Taro.showToast({
        title: error.errMsg || error.message || '支付失败',
        icon: 'none',
        duration: 3000
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
    message: string
  }> {
    return {
      canUseWechatPay: this.config.enableWechatPayment,
      canUseBalance: this.config.enableBalancePayment,
      message: '支持微信支付和余额支付'
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