/**
 * 余额支付集成测试
 * 测试整个支付流程的集成
 */
import { walletService } from '../wallet.service'
import { paymentService } from '../payment.service'
import { orderService } from '../order'
import Taro from '@tarojs/taro'

// Mock dependencies
jest.mock('@tarojs/taro')
jest.mock('@/utils/request', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

describe('余额支付完整流程测试', () => {
  const mockedTaro = Taro as any

  beforeEach(() => {
    jest.clearAllMocks()
    mockedTaro.getStorageSync = jest.fn().mockReturnValue({
      id: 1,
      phone: '13800138000'
    })
    mockedTaro.showToast = jest.fn()
    mockedTaro.showLoading = jest.fn()
    mockedTaro.hideLoading = jest.fn()
    mockedTaro.getAccountInfoSync = jest.fn().mockReturnValue({
      miniProgram: { appId: 'wx123456' }
    })
  })

  describe('完整支付场景', () => {
    it('场景1: 余额充足，成功支付', async () => {
      const { get, post } = require('@/utils/request')

      // Step 1: 查询余额 - 充足
      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 500 }
      })

      // Step 2: 创建订单
      post.mockResolvedValueOnce({
        code: 0,
        data: {
          appointment: { id: 1 },
          order: {
            orderNo: 'ORDER123',
            amount: 29800, // 298元
            paymentStatus: 'pending'
          }
        }
      })

      // Step 3: 余额支付
      post.mockResolvedValueOnce({
        code: 0,
        data: {
          success: true,
          balance: 20200, // 202元（500-298）
          paidAt: '2025-09-23T10:00:00Z'
        }
      })

      // 执行流程
      const balance = await walletService.getBalance()
      expect(balance).toBe(500)

      const orderResult = await orderService.createAppointmentOrder({
        therapistId: '1',
        storeId: '1',
        serviceId: '1',
        serviceName: '经络推拿',
        duration: 60,
        price: 298,
        appointmentDate: '2025-09-23',
        appointmentTime: '10:00',
        therapistName: '张技师'
      })

      expect(orderResult.order.orderNo).toBe('ORDER123')

      const payResult = await paymentService.pay({
        orderNo: 'ORDER123',
        amount: 29800,
        paymentMethod: 'balance',
        title: '经络推拿'
      })

      expect(payResult).toBe(true)
      expect(Taro.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('支付成功')
        })
      )
    })

    it('场景2: 余额不足，切换到模拟支付', async () => {
      const { get, post } = require('@/utils/request')

      // Step 1: 查询余额 - 不足
      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 100 }
      })

      const balance = await walletService.getBalance()
      expect(balance).toBe(100)

      // 订单金额298元，余额只有100元
      const orderAmount = 298
      const canPayWithBalance = balance >= orderAmount

      expect(canPayWithBalance).toBe(false)

      // 应该切换到模拟支付
      mockedTaro.showModal = jest.fn().mockResolvedValue({ confirm: true })

      const payResult = await paymentService.pay({
        orderNo: 'ORDER456',
        amount: 29800,
        paymentMethod: 'wechat', // 切换到微信支付（模拟）
        title: '经络推拿'
      })

      expect(mockedTaro.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '模拟支付',
          content: expect.stringContaining('¥298.00')
        })
      )
    })

    it('场景3: 支付后余额更新', async () => {
      const { get, post } = require('@/utils/request')

      // 初始余额
      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 1000 }
      })

      const initialBalance = await walletService.getBalance()
      expect(initialBalance).toBe(1000)

      // 支付298元
      post.mockResolvedValueOnce({
        code: 0,
        data: {
          success: true,
          balance: 70200 // 702元（1000-298）
        }
      })

      const payResult = await walletService.payWithBalance('ORDER789', 298)
      expect(payResult.success).toBe(true)
      expect(payResult.balance).toBe(702)

      // 重新查询余额
      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 702 }
      })

      const newBalance = await walletService.getBalance()
      expect(newBalance).toBe(702)
    })

    it('场景4: 支付失败后的处理', async () => {
      const { post } = require('@/utils/request')

      // 模拟支付失败
      post.mockRejectedValueOnce({
        message: '系统繁忙，请稍后重试'
      })

      await expect(
        walletService.payWithBalance('ORDER999', 100)
      ).rejects.toThrow('系统繁忙')
    })
  })

  describe('边界条件测试', () => {
    it('余额刚好等于订单金额', async () => {
      const { get, post } = require('@/utils/request')

      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 298 }
      })

      const balance = await walletService.getBalance()
      const orderAmount = 298

      expect(balance).toBe(orderAmount)
      expect(balance >= orderAmount).toBe(true)
    })

    it('余额为0的处理', async () => {
      const { get } = require('@/utils/request')

      get.mockResolvedValueOnce({
        code: 0,
        data: { balance: 0 }
      })

      const balance = await walletService.getBalance()
      expect(balance).toBe(0)

      const canPayWithBalance = balance >= 100
      expect(canPayWithBalance).toBe(false)
    })
  })
})