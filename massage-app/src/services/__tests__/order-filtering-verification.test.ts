/**
 * 订单过滤功能验证测试
 * 验证门店不存在时，相关订单是否被正确过滤
 */

import { orderService } from '../order'
import { get, post } from '@/utils/request'

// Mock services
jest.mock('@tarojs/taro')
jest.mock('@/utils/request')
jest.mock('@/utils/user', () => ({
  getCurrentUserId: jest.fn().mockReturnValue(1),
  getCurrentUserPhone: jest.fn().mockReturnValue('13800138000')
}))

const mockGet = get as jest.MockedFunction<typeof get>

describe('订单过滤功能验证', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('当门店不存在时，应该过滤掉相关订单', async () => {
    // Mock 订单列表API，包含无效门店的订单
    mockGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            list: [
              {
                orderNo: 'ORD001',
                amount: 12800,
                extraData: {
                  storeId: 1, // 不存在的门店
                  therapistId: 1,
                  therapistName: '张师傅'
                },
                paymentStatus: 'paid'
              },
              {
                orderNo: 'ORD002',
                amount: 15000,
                extraData: {
                  storeId: 6, // 存在的门店
                  therapistId: 2,
                  therapistName: '李师傅'
                },
                paymentStatus: 'paid'
              }
            ],
            total: 2
          }
        })
      }

      // 门店1返回404（不存在）
      if (url === '/stores/1') {
        return Promise.reject(new Error('门店不存在'))
      }

      // 门店6返回正常数据
      if (url === '/stores/6') {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            id: 6,
            name: '浦东新区店',
            address: '浦东新区陆家嘴环路123号'
          }
        })
      }

      // 技师信息正常返回
      if (url.startsWith('/therapists/')) {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            id: 1,
            name: '张师傅',
            avatar: 'https://example.com/avatar.jpg'
          }
        })
      }

      return Promise.reject(new Error('未匹配的API'))
    })

    // 获取订单列表
    const orders = await orderService.getOrderList()

    // 验证：应该只有一个有效订单（门店存在的订单）
    expect(orders).toHaveLength(1)
    expect(orders[0].orderNo).toBe('ORD002')
    expect(orders[0].storeId).toBe(6)
    expect(orders[0].storeName).toBe('浦东新区店')

    // 验证：无效订单已被过滤掉
    const filteredOrderNos = orders.map(o => o.orderNo)
    expect(filteredOrderNos).not.toContain('ORD001')
  })

  test('所有订单的门店都存在时，不应该过滤任何订单', async () => {
    // Mock 所有门店都存在的情况
    mockGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            list: [
              {
                orderNo: 'ORD001',
                amount: 12800,
                extraData: { storeId: 6, therapistId: 1 },
                paymentStatus: 'paid'
              },
              {
                orderNo: 'ORD002',
                amount: 15000,
                extraData: { storeId: 7, therapistId: 2 },
                paymentStatus: 'paid'
              }
            ],
            total: 2
          }
        })
      }

      // 所有门店都存在
      if (url === '/stores/6' || url === '/stores/7') {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            id: parseInt(url.split('/')[2]),
            name: '测试门店',
            address: '测试地址'
          }
        })
      }

      return Promise.reject(new Error('未匹配的API'))
    })

    const orders = await orderService.getOrderList()

    // 验证：应该返回所有订单
    expect(orders).toHaveLength(2)
    expect(orders.map(o => o.orderNo)).toEqual(['ORD001', 'ORD002'])
  })

  test('所有订单的门店都不存在时，应该返回空列表', async () => {
    // Mock 所有门店都不存在的情况
    mockGet.mockImplementation((url: string) => {
      if (url === '/orders') {
        return Promise.resolve({
          code: 0,
          message: 'success',
          data: {
            list: [
              {
                orderNo: 'ORD001',
                amount: 12800,
                extraData: { storeId: 1, therapistId: 1 },
                paymentStatus: 'paid'
              },
              {
                orderNo: 'ORD002',
                amount: 15000,
                extraData: { storeId: 2, therapistId: 2 },
                paymentStatus: 'paid'
              }
            ],
            total: 2
          }
        })
      }

      // 所有门店都不存在
      if (url.startsWith('/stores/')) {
        return Promise.reject(new Error('门店不存在'))
      }

      return Promise.reject(new Error('未匹配的API'))
    })

    const orders = await orderService.getOrderList()

    // 验证：应该返回空列表
    expect(orders).toHaveLength(0)
  })
})