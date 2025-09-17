import { walletService } from '../wallet.service'

// Mock Taro storage
const mockStorage: { [key: string]: any } = {}

jest.mock('@tarojs/taro', () => ({
  getStorageSync: jest.fn((key: string) => mockStorage[key]),
  setStorageSync: jest.fn((key: string, value: any) => {
    mockStorage[key] = value
  }),
  removeStorageSync: jest.fn((key: string) => {
    delete mockStorage[key]
  })
}))

describe('WalletService', () => {
  beforeEach(() => {
    // 清空 mock storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key])
  })

  describe('getBalance', () => {
    it('应该返回初始余额0', async () => {
      const balance = await walletService.getBalance()
      expect(balance).toBe(0)
    })

    it('应该返回存储的余额', async () => {
      mockStorage['wallet_balance'] = 100
      const balance = await walletService.getBalance()
      expect(balance).toBe(100)
    })
  })

  describe('recharge', () => {
    it('应该增加余额', async () => {
      const result = await walletService.recharge(100, '充值')

      expect(result.success).toBe(true)
      expect(result.balance).toBe(100)
      expect(result.transaction).toMatchObject({
        type: 'recharge',
        amount: 100,
        balance: 100,
        description: '充值'
      })
    })

    it('应该拒绝无效金额', async () => {
      const result = await walletService.recharge(-10, '充值')

      expect(result.success).toBe(false)
      expect(result.message).toBe('充值金额必须大于0')
    })

    it('应该记录交易历史', async () => {
      await walletService.recharge(100, '充值')
      const transactions = await walletService.getTransactions()

      expect(transactions).toHaveLength(1)
      expect(transactions[0]).toMatchObject({
        type: 'recharge',
        amount: 100,
        balance: 100
      })
    })
  })

  describe('consume', () => {
    beforeEach(async () => {
      // 先充值100元
      await walletService.recharge(100, '测试充值')
    })

    it('应该扣减余额', async () => {
      const result = await walletService.consume(30, '推拿服务')

      expect(result.success).toBe(true)
      expect(result.balance).toBe(70)
      expect(result.transaction).toMatchObject({
        type: 'consume',
        amount: -30,
        balance: 70,
        description: '推拿服务'
      })
    })

    it('应该拒绝余额不足的消费', async () => {
      const result = await walletService.consume(200, '推拿服务')

      expect(result.success).toBe(false)
      expect(result.message).toBe('余额不足')
    })

    it('应该拒绝无效金额', async () => {
      const result = await walletService.consume(-10, '推拿服务')

      expect(result.success).toBe(false)
      expect(result.message).toBe('消费金额必须大于0')
    })
  })

  describe('refund', () => {
    beforeEach(async () => {
      await walletService.recharge(100, '测试充值')
      await walletService.consume(50, '推拿服务')
    })

    it('应该退款到余额', async () => {
      const result = await walletService.refund(30, '订单退款')

      expect(result.success).toBe(true)
      expect(result.balance).toBe(80) // 100 - 50 + 30
      expect(result.transaction).toMatchObject({
        type: 'refund',
        amount: 30,
        balance: 80,
        description: '订单退款'
      })
    })
  })

  describe('getTransactions', () => {
    it('应该返回空数组当没有交易时', async () => {
      const transactions = await walletService.getTransactions()
      expect(transactions).toEqual([])
    })

    it('应该按时间倒序返回交易记录', async () => {
      await walletService.recharge(100, '充值1')
      await walletService.consume(30, '消费1')
      await walletService.recharge(50, '充值2')

      const transactions = await walletService.getTransactions()

      expect(transactions).toHaveLength(3)
      expect(transactions[0].description).toBe('充值2')
      expect(transactions[1].description).toBe('消费1')
      expect(transactions[2].description).toBe('充值1')
    })

    it('应该支持分页', async () => {
      // 创建15条交易记录
      for (let i = 1; i <= 15; i++) {
        await walletService.recharge(10, `充值${i}`)
      }

      const page1 = await walletService.getTransactions(1, 10)
      const page2 = await walletService.getTransactions(2, 10)

      expect(page1).toHaveLength(10)
      expect(page2).toHaveLength(5)
    })
  })

  describe('getRechargeOptions', () => {
    it('应该返回充值选项配置', () => {
      const options = walletService.getRechargeOptions()

      expect(options).toContainEqual({
        amount: 100,
        bonus: 0,
        label: '100元'
      })

      expect(options).toContainEqual({
        amount: 500,
        bonus: 50,
        label: '500元（赠50元）'
      })
    })
  })
})