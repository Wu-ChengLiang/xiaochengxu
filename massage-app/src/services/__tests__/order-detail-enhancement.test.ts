/**
 * 订单详情数据补全测试
 * 测试订单详情和列表是否能获取完整的门店、技师信息
 */

import { orderService } from '../order'
import { storeService } from '../store'
import { therapistService } from '../therapist'
import { get, post } from '@/utils/request'

// Mock services
jest.mock('@tarojs/taro')
jest.mock('@/utils/request')
jest.mock('@/utils/user', () => ({
  getCurrentUserId: jest.fn().mockReturnValue(1),
  getCurrentUserPhone: jest.fn().mockReturnValue('13800138000')
}))

const mockGet = get as jest.MockedFunction<typeof get>
const mockPost = post as jest.MockedFunction<typeof post>

describe('订单详情数据补全测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('🔴 失败测试：检测当前数据缺失问题', () => {
    test('订单详情应该包含完整的门店信息而不是硬编码默认值', async () => {
      // Mock 订单详情API返回数据（缺少门店名称）
      mockGet.mockResolvedValueOnce({
        code: 0,
        message: 'success',
        data: {
          orderNo: 'ORD123456',
          extraData: {
            storeId: 1,
            therapistId: 1,
            // 缺少 storeName, storeAddress
            therapistName: '张师傅'
          },
          amount: 15000,
          paymentStatus: 'paid'
        }
      })

      const orderDetail = await orderService.getOrderDetail('ORD123456')

      // 这个测试应该失败，因为当前会使用硬编码默认值
      expect(orderDetail.storeName).not.toBe('上海万象城店') // 不应该是硬编码
      expect(orderDetail.storeAddress).not.toBe('闵行区吴中路1599号') // 不应该是硬编码
    })

    test('订单列表应该显示真实门店信息而不是硬编码', async () => {
      // Mock 订单列表API返回数据
      mockGet.mockResolvedValueOnce({
        code: 0,
        message: 'success',
        data: {
          list: [{
            orderNo: 'ORD123456',
            extraData: {
              storeId: 1,
              therapistId: 1
              // 缺少完整门店信息
            },
            amount: 15000,
            paymentStatus: 'paid'
          }],
          total: 1
        }
      })

      const orders = await orderService.getOrderList()

      // 这个测试应该失败，因为当前会使用硬编码
      expect(orders[0].storeName).not.toBe('上海万象城店')
    })
  })

  describe('🟢 期望的行为：修复后应该通过的测试', () => {
    test('订单详情应该自动获取完整的门店和技师信息', async () => {
      // Mock 订单详情API
      mockGet.mockImplementation((url: string) => {
        if (url === '/orders/ORD123456') {
          return Promise.resolve({
            code: 0,
            message: 'success',
            data: {
              orderNo: 'ORD123456',
              extraData: {
                storeId: 1,
                therapistId: 1,
                therapistName: '张师傅'
              },
              amount: 15000,
              paymentStatus: 'paid'
            }
          })
        }
        if (url === '/stores/1') {
          return Promise.resolve({
            code: 0,
            message: 'success',
            data: {
              id: 1,
              name: '浦东新区店',
              address: '浦东新区陆家嘴环路123号',
              phone: '021-12345678'
            }
          })
        }
        if (url === '/therapists/1') {
          return Promise.resolve({
            code: 0,
            message: 'success',
            data: {
              id: 1,
              name: '张师傅',
              avatar: 'https://example.com/avatar1.jpg',
              experience: 5
            }
          })
        }
        return Promise.reject(new Error('未匹配的API'))
      })

      // 这是我们期望的行为：获取完整信息
      const orderDetail = await orderService.getOrderDetail('ORD123456')

      // 修复后应该获取到真实的门店信息
      expect(orderDetail.storeName).toBe('浦东新区店')
      expect(orderDetail.storeAddress).toBe('浦东新区陆家嘴环路123号')
      expect(orderDetail.therapistAvatar).toBe('https://example.com/avatar1.jpg')
    })

    test('订单列表应该批量获取门店信息', async () => {
      // Mock APIs
      mockGet.mockImplementation((url: string) => {
        if (url === '/orders') {
          return Promise.resolve({
            code: 0,
            message: 'success',
            data: {
              list: [{
                orderNo: 'ORD123456',
                extraData: {
                  storeId: 1,
                  therapistId: 1,
                  therapistName: '张师傅'
                },
                amount: 15000,
                paymentStatus: 'paid'
              }],
              total: 1
            }
          })
        }
        if (url === '/stores/1') {
          return Promise.resolve({
            code: 0,
            message: 'success',
            data: {
              id: 1,
              name: '浦东新区店',
              address: '浦东新区陆家嘴环路123号'
            }
          })
        }
        return Promise.reject(new Error('未匹配的API'))
      })

      const orders = await orderService.getOrderList()

      // 修复后应该显示真实门店名称
      expect(orders[0].storeName).toBe('浦东新区店')
      expect(orders[0].storeAddress).toBe('浦东新区陆家嘴环路123号')
    })
  })
})