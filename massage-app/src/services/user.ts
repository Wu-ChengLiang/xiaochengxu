import { sleep } from '@/utils/common'
import type { User, ApiResponse } from '@/types'
import { mockUsers, currentUser } from '@/mock/data/users'

// 微信登录参数
export interface WechatLoginParams {
  code: string
  encryptedData?: string
  iv?: string
}

// 微信登录响应
export interface WechatLoginResponse {
  token: string
  user: User
  isNewUser: boolean
}

// 用户服务
class UserService {
  // 微信登录
  async wechatLogin(params: WechatLoginParams): Promise<ApiResponse<WechatLoginResponse>> {
    await sleep(500)
    
    // 模拟微信登录验证
    if (!params.code) {
      throw new Error('微信授权失败')
    }
    
    // 模拟返回登录结果
    const mockToken = `mock_token_${Date.now()}`
    const isNewUser = Math.random() < 0.3 // 30%概率是新用户
    
    return {
      code: 200,
      data: {
        token: mockToken,
        user: currentUser,
        isNewUser
      },
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await sleep(200)
    
    return {
      code: 200,
      data: currentUser,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 更新用户信息
  async updateUser(userId: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
    await sleep(300)
    
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('用户不存在')
    }
    
    // 更新用户信息
    Object.assign(user, updateData, {
      updatedAt: new Date().toISOString()
    })
    
    return {
      code: 200,
      data: user,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 绑定手机号
  async bindPhone(userId: string, phone: string, code: string): Promise<ApiResponse<User>> {
    await sleep(400)
    
    // 验证验证码
    if (code !== '123456') {
      throw new Error('验证码错误')
    }
    
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('用户不存在')
    }
    
    // 检查手机号是否已被绑定
    const existingUser = mockUsers.find(u => u.phone === phone && u.id !== userId)
    if (existingUser) {
      throw new Error('该手机号已被其他用户绑定')
    }
    
    // 绑定手机号
    user.phone = phone
    user.updatedAt = new Date().toISOString()
    
    return {
      code: 200,
      data: user,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 发送短信验证码
  async sendSmsCode(phone: string): Promise<ApiResponse<null>> {
    await sleep(1000)
    
    // 模拟发送短信
    console.log(`发送验证码到手机: ${phone}, 验证码: 123456`)
    
    return {
      code: 200,
      data: null,
      message: '验证码发送成功',
      timestamp: Date.now()
    }
  }
  
  // 获取用户积分记录
  async getUserPoints(userId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<any>> {
    await sleep(300)
    
    // 模拟积分记录
    const mockPointsHistory = [
      {
        id: 'point-001',
        type: 'earn',
        amount: 28,
        reason: '完成预约服务',
        createdAt: '2024-01-10T14:30:00.000Z'
      },
      {
        id: 'point-002', 
        type: 'spend',
        amount: -50,
        reason: '积分抵扣',
        createdAt: '2024-01-08T16:20:00.000Z'
      },
      {
        id: 'point-003',
        type: 'earn',
        amount: 100,
        reason: '首次注册奖励',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = mockPointsHistory.slice(start, end)
    
    return {
      code: 200,
      data: {
        list,
        total: mockPointsHistory.length,
        page,
        pageSize,
        hasMore: end < mockPointsHistory.length,
        currentPoints: currentUser.points
      },
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 检查用户登录状态
  async checkLoginStatus(): Promise<ApiResponse<boolean>> {
    await sleep(100)
    
    // 模拟检查token有效性
    const isLoggedIn = !!localStorage.getItem('user_token')
    
    return {
      code: 200,
      data: isLoggedIn,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 用户退出登录
  async logout(): Promise<ApiResponse<null>> {
    await sleep(200)
    
    // 清除本地存储的token
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    
    return {
      code: 200,
      data: null,
      message: '退出成功',
      timestamp: Date.now()
    }
  }
}

export const userService = new UserService()
export default userService