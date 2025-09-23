/**
 * 用户信息统一管理工具
 * 解决用户鉴权不一致问题
 */
import Taro from '@tarojs/taro'

export interface UserInfo {
  id: number
  phone: string
  nickname?: string
  avatar?: string
  openid?: string
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
  return userInfo?.id || 20 // 默认用户ID为20（开发环境）
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
 * 初始化默认用户信息（开发环境）
 */
export const initDefaultUserInfo = (): void => {
  const existingUserInfo = getCurrentUserInfo()
  if (!existingUserInfo) {
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