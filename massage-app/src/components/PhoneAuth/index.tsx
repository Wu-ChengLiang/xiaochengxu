import React from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { post } from '@/utils/request'
import { setUserInfo, fetchUserInfo, getCurrentUserInfo } from '@/utils/user'
import './index.scss'

interface PhoneAuthProps {
  type: 'bind' | 'change'  // 绑定或换绑
  openid?: string  // 绑定时需要传入openid
  onSuccess?: (phone: string) => void
  onCancel?: () => void
  buttonText?: string
  buttonSize?: 'default' | 'mini'
  buttonType?: 'default' | 'primary' | 'warn'
}

/**
 * 微信手机号授权组件
 * 使用微信原生能力获取手机号，无需短信验证码
 */
const PhoneAuth: React.FC<PhoneAuthProps> = ({
  type,
  openid,
  onSuccess,
  onCancel,
  buttonText,
  buttonSize = 'default',
  buttonType = 'primary'
}) => {

  const handleGetPhoneNumber = async (e: any) => {
    console.log('手机号授权回调:', e.detail)
    console.log('获取到code:', e.detail.code)
    console.log('当前时间:', new Date().toISOString())
    console.log('当前openid:', openid)

    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 用户同意授权
      const { code } = e.detail

      if (!code) {
        Taro.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
        return
      }

      console.log('准备发送请求，code:', code)
      console.log('请求时间:', new Date().toISOString())

      try {
        Taro.showLoading({ title: '处理中...' })

        let result
        if (type === 'bind') {
          // 首次绑定手机号
          if (!openid) {
            throw new Error('缺少openid参数')
          }

          console.log('发送绑定请求，参数:', { openid, code })
          const response = await post('/users/bind-phone-wx', {
            openid,
            code
          })
          console.log('绑定响应:', response)

          result = response.data

          // 获取完整用户信息并保存
          if (result.phone) {
            const userInfo = await fetchUserInfo(result.phone)
            if (userInfo) {
              setUserInfo(userInfo)
            }
          }

        } else {
          // 换绑手机号
          const currentUser = getCurrentUserInfo()
          if (!currentUser) {
            throw new Error('请先登录')
          }

          const response = await post('/users/change-phone-wx', {
            userId: currentUser.id,
            oldPhone: currentUser.phone,
            code
          })

          result = response.data

          // 更新本地用户信息
          if (result.phone) {
            const userInfo = await fetchUserInfo(result.phone)
            if (userInfo) {
              setUserInfo(userInfo)
            }
          }
        }

        Taro.hideLoading()

        if (result && result.phone) {
          Taro.showToast({
            title: type === 'bind' ? '绑定成功' : '换绑成功',
            icon: 'success'
          })

          // 回调成功函数
          onSuccess?.(result.phone)
        } else {
          throw new Error('操作失败')
        }

      } catch (error: any) {
        Taro.hideLoading()
        console.error('手机号操作失败:', error)
        console.error('错误详情:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        })

        // 显示具体错误信息
        const errorMsg = error.message || (type === 'bind' ? '绑定失败' : '换绑失败')
        Taro.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
      }

    } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      // 用户拒绝授权
      console.log('用户拒绝授权手机号')

      if (type === 'bind') {
        Taro.showModal({
          title: '温馨提示',
          content: '需要您的手机号才能为您提供预约服务',
          showCancel: true,
          confirmText: '知道了',
          success: (res) => {
            if (res.cancel) {
              onCancel?.()
            }
          }
        })
      } else {
        Taro.showToast({
          title: '已取消换绑',
          icon: 'none'
        })
        onCancel?.()
      }

    } else {
      // 其他错误
      console.error('获取手机号失败:', e.detail.errMsg)
      Taro.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
    }
  }

  // 根据type和buttonSize决定按钮文本
  const getButtonText = () => {
    if (buttonText) return buttonText

    if (type === 'bind') {
      return buttonSize === 'mini' ? '绑定' : '一键绑定手机号'
    } else {
      return buttonSize === 'mini' ? '更换' : '更换手机号'
    }
  }

  return (
    <View className="phone-auth-component">
      <Button
        className={`phone-auth-btn phone-auth-btn--${buttonSize}`}
        type={buttonType}
        size={buttonSize}
        openType="getPhoneNumber"
        onGetPhoneNumber={handleGetPhoneNumber}
      >
        {getButtonText()}
      </Button>
    </View>
  )
}

export default PhoneAuth