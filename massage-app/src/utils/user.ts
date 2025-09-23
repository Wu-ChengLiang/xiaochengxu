/**
 * 用户信息统一管理工具
 * 解决用户鉴权不一致问题
 */
import Taro from '@tarojs/taro'
import { get, post } from './request'

export interface UserInfo {
  id: number
  phone: string
  nickname?: string
  avatar?: string
  openid?: string
  username?: string
  membershipNumber?: string
  memberLevel?: string
  balance?: number
  totalSpent?: number
  totalVisits?: number
}

/**
 * 获取当前用户信息
 * 统一的用户信息获取入口
 */
export const getCurrentUserInfo = (): UserInfo | null => {
  try {
    const userInfo = Taro.getStorageSync('userInfo')
    return userInfo || null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 获取当前用户ID
 * 所有服务统一使用此方法获取用户ID
 */
export const getCurrentUserId = (): number => {
  const userInfo = getCurrentUserInfo()
  return userInfo?.id || 1 // 默认用户ID为1（开发环境）
}

/**
 * 获取当前用户手机号
 * 所有服务统一使用此方法获取手机号
 */
export const getCurrentUserPhone = (): string => {
  const userInfo = getCurrentUserInfo()
  return userInfo?.phone || '13800138000' // 默认手机号（开发环境）
}

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: UserInfo): void => {
  try {
    Taro.setStorageSync('userInfo', userInfo)
  } catch (error) {
    console.error('设置用户信息失败:', error)
  }
}

/**
 * 清除用户信息
 */
export const clearUserInfo = (): void => {
  try {
    Taro.removeStorageSync('userInfo')
  } catch (error) {
    console.error('清除用户信息失败:', error)
  }
}

/**
 * 手机号脱敏处理
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return '未设置'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 微信登录
 */
export interface WechatLoginResult {
  needBindPhone: boolean
  openid: string
  sessionKey: string
  userInfo?: UserInfo
  userStatus?: 'complete' | 'need_bind_phone' | 'need_register'
}

export const wechatLogin = async (): Promise<WechatLoginResult> => {
  try {
    // 1. 获取微信code
    const { code } = await Taro.login()

    // 2. 调用后端微信登录API
    const response = await post('/users/wechat-login', { code })

    if (response.data) {
      // 如果有完整用户信息，保存到本地
      if (response.data.userInfo && !response.data.needBindPhone) {
        setUserInfo(response.data.userInfo)
      }

      return response.data
    }

    throw new Error('微信登录失败：返回数据异常')
  } catch (error) {
    console.error('微信登录失败:', error)
    throw error
  }
}

/**
 * 绑定手机号
 */
export const bindPhone = async (openid: string, phone: string) => {
  try {
    const response = await post('/users/bind-phone', {
      openid,
      phone
    })

    if (response.data) {
      // 绑定成功后，获取完整用户信息并保存
      const userInfo = await fetchUserInfo(phone)
      if (userInfo) {
        setUserInfo(userInfo)
      }
      return response.data
    }

    throw new Error('手机号绑定失败')
  } catch (error: any) {
    console.error('手机号绑定失败:', error)

    // 尝试提取更详细的错误信息
    if (error?.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message)
    } else if (error?.response?.status === 500) {
      throw new Error('该手机号已被占用')
    } else if (error?.message) {
      throw error
    } else {
      throw new Error('手机号绑定失败，请重试')
    }
  }
}

/**
 * 从API获取用户信息
 */
export const fetchUserInfo = async (phone?: string): Promise<UserInfo | null> => {
  try {
    // 如果没有传手机号，尝试从本地获取
    if (!phone) {
      const localUserInfo = getCurrentUserInfo()
      phone = localUserInfo?.phone
    }

    if (!phone) {
      console.warn('无法获取用户信息：缺少手机号')
      return null
    }

    const response = await get(`/users/info?phone=${phone}`)

    if (response.data) {
      const userInfo: UserInfo = {
        id: response.data.id,
        phone: response.data.phone,
        username: response.data.username,
        nickname: response.data.nickname,
        avatar: response.data.avatar,
        openid: response.data.openid,
        membershipNumber: response.data.membershipNumber,
        memberLevel: response.data.memberLevel,
        balance: response.data.balance,
        totalSpent: response.data.totalSpent,
        totalVisits: response.data.totalVisits
      }

      // 保存到本地缓存
      setUserInfo(userInfo)
      return userInfo
    }

    return null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 检查登录状态并自动登录
 */
export const checkAndAutoLogin = async (): Promise<UserInfo | null> => {
  try {
    // 1. 先检查本地缓存
    const localUserInfo = getCurrentUserInfo()
    if (localUserInfo && localUserInfo.phone) {
      // 尝试刷新用户信息
      const freshUserInfo = await fetchUserInfo(localUserInfo.phone)
      return freshUserInfo || localUserInfo
    }

    // 2. 本地没有信息，尝试微信登录
    const loginResult = await wechatLogin()

    if (!loginResult.needBindPhone && loginResult.userInfo) {
      // 已有完整用户信息
      return loginResult.userInfo
    }

    // 3. 需要绑定手机号，返回null让页面处理
    return null

  } catch (error) {
    console.error('自动登录失败:', error)
    return null
  }
}

/**
 * 初始化默认用户信息（开发环境）
 * @deprecated 建议使用 checkAndAutoLogin 替代
 */
export const initDefaultUserInfo = (): void => {
  const existingUserInfo = getCurrentUserInfo()
  if (!existingUserInfo) {
    console.warn('⚠️  使用开发环境默认用户信息，生产环境请调用 checkAndAutoLogin')
    const defaultUserInfo: UserInfo = {
      id: 1,
      phone: '13800138000',
      nickname: '测试用户',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
    setUserInfo(defaultUserInfo)
    console.log('🔧 已初始化默认用户信息:', defaultUserInfo)
  }
}