import { paymentService } from '../payment.service'
import { walletService } from '../wallet.service'
import { orderService } from '../order'
import Taro from '@tarojs/taro'

// Mock Taro
jest.mock('@tarojs/taro')

// Mock request utilities
jest.mock('@/utils/request', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

describe('Balance Payment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Taro methods
    const mockedTaro = Taro as any;
    mockedTaro.getStorageSync = jest.fn().mockReturnValue({
      id: 1,
      phone: '13800138000'
    });
    mockedTaro.showToast = jest.fn();
    mockedTaro.showLoading = jest.fn();
    mockedTaro.hideLoading = jest.fn();
    mockedTaro.getAccountInfoSync = jest.fn().mockReturnValue({
      miniProgram: { appId: 'wx123456' }
    });
  })

  describe('Wallet Service', () => {
    it('should fetch user balance', async () => {
      const { get } = require('@/utils/request')
      get.mockResolvedValue({
        code: 0,
        data: { balance: 1000 } // 1000元
      })

      const balance = await walletService.getBalance()

      expect(get).toHaveBeenCalledWith('/users/wallet/balance', { userId: 1 })
      expect(balance).toBe(1000)
    })

    it('should handle balance payment', async () => {
      const { post } = require('@/utils/request')
      post.mockResolvedValue({
        code: 0,
        data: {
          success: true,
          balance: 70000 // 700元（分）
        }
      })

      const result = await walletService.payWithBalance('ORDER123', 300)

      expect(post).toHaveBeenCalledWith(
        '/orders/pay',
        { orderNo: 'ORDER123', paymentMethod: 'balance' },
        expect.any(Object)
      )
      expect(result.success).toBe(true)
      expect(result.balance).toBe(700) // 转换为元
    })

    it('should throw error when balance insufficient', async () => {
      const { post } = require('@/utils/request')
      post.mockRejectedValue({
        message: '余额不足'
      })

      await expect(
        walletService.payWithBalance('ORDER123', 1000)
      ).rejects.toThrow('余额不足')
    })
  })

  describe('Payment Service', () => {
    it('should support balance payment method', async () => {
      const { post } = require('@/utils/request')
      post.mockResolvedValue({
        code: 0,
        data: { balance: 50000 } // 500元（分）
      })

      const result = await paymentService.pay({
        orderNo: 'ORDER123',
        amount: 20000, // 200元（分）
        paymentMethod: 'balance',
        title: '推拿服务'
      })

      expect(result).toBe(true)
      expect(Taro.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('支付成功')
        })
      )
    })

    it('should check payment environment correctly', async () => {
      const env = await paymentService.checkPaymentEnvironment()

      expect(env.canUseBalance).toBe(true)
      expect(env.canUseMockPay).toBe(true)
      expect(env.message).toContain('模拟支付和余额支付')
    })
  })

  describe('Order Service Integration', () => {
    it('should create order and pay with balance', async () => {
      const { post } = require('@/utils/request')

      // Mock order creation
      post.mockResolvedValueOnce({
        code: 0,
        data: {
          appointment: { id: 1 },
          order: {
            orderNo: 'ORDER123',
            amount: 29800,
            paymentStatus: 'pending'
          }
        }
      })

      // Mock balance payment
      post.mockResolvedValueOnce({
        code: 0,
        data: {
          paidAt: '2025-09-23T10:00:00Z'
        }
      })

      // Create order
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

      // Pay with balance
      const payResult = await orderService.updateOrderStatus('ORDER123', 'paid')

      expect(payResult.paymentStatus).toBe('paid')
      expect(post).toHaveBeenCalledTimes(2)
    })
  })

  describe('UI Integration Requirements', () => {
    it('should have required data for payment selection UI', async () => {
      const { get } = require('@/utils/request')

      // Mock balance fetch
      get.mockResolvedValue({
        code: 0,
        data: { balance: 500 }
      })

      // Get data needed for UI
      const balance = await walletService.getBalance()
      const orderAmount = 298

      // Check if balance is sufficient
      const canPayWithBalance = balance >= orderAmount

      expect(balance).toBe(500)
      expect(canPayWithBalance).toBe(true)
    })

    it('should handle insufficient balance scenario', async () => {
      const { get } = require('@/utils/request')

      // Mock low balance
      get.mockResolvedValue({
        code: 0,
        data: { balance: 100 }
      })

      const balance = await walletService.getBalance()
      const orderAmount = 298

      const canPayWithBalance = balance >= orderAmount

      expect(canPayWithBalance).toBe(false)
    })
  })
})