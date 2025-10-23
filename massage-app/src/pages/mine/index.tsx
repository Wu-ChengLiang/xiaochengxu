import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import { AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { walletService } from '@/services/wallet.service'
import { getLocationService } from '@/services/location'
import {
  getCurrentUserInfo,
  maskPhone,
  checkAndAutoLogin,
  wechatLogin,
  bindPhone,
  WechatLoginResult,
  UserInfo
} from '@/utils/user'
import PhoneAuth from '@/components/PhoneAuth'
import NewUserVoucherModal from '@/components/NewUserVoucherModal'
import LogoImg from '@/assets/icons/logo.png'
import { voucherService } from '@/services/voucher.service'
import './index.scss'

const Mine: React.FC = () => {
  const [balance, setBalance] = useState(0)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)

  // 新人礼券弹窗
  const [showNewUserVoucher, setShowNewUserVoucher] = useState(false)
  const [voucherInfo, setVoucherInfo] = useState<{ discountPercentage: number }>({
    discountPercentage: 0
  })

  // 手机号绑定弹窗状态
  const [showBindPhoneModal, setShowBindPhoneModal] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [bindingPhone, setBingingPhone] = useState(false)
  const [currentOpenid, setCurrentOpenid] = useState('')

  // 用于标记是否需要刷新余额（避免多重渲染）
  const isInitialLoad = React.useRef(true)

  useEffect(() => {
    initUser()
    checkLocation()
  }, [])

  // 页面显示时刷新数据 - 只在非初始加载时刷新
  useDidShow(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    // 只刷新定位，不再重复刷新余额（已在initUser中获取）
    checkLocation()
  })

  // 检查定位状态
  const checkLocation = async () => {
    try {
      await getLocationService.getCurrentLocation()
      setLocationEnabled(true)
    } catch (error) {
      setLocationEnabled(false)
    }
  }

  // 初始化用户信息
  const initUser = async () => {
    setLoading(true)
    try {
      // 先尝试从本地获取用户信息
      const localUser = getCurrentUserInfo()
      if (localUser && localUser.phone) {
        setUserInfo(localUser)
        fetchBalance()
        // 后台静默尝试刷新用户信息
        checkAndAutoLogin().then(freshUser => {
          if (freshUser) {
            setUserInfo(freshUser)
          }
        })
      } else {
        // 没有本地用户，尝试自动登录
        const userInfo = await checkAndAutoLogin()
        if (userInfo) {
          setUserInfo(userInfo)
          fetchBalance()
        } else {
          // 需要手动触发登录
          console.log('需要用户手动登录')
          // 确保userInfo为null，显示登录按钮
          setUserInfo(null)
        }
      }
    } catch (error) {
      console.error('初始化用户失败:', error)
      // 失败时也要确保显示登录按钮
      setUserInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchBalance = async () => {
    try {
      const currentBalance = await walletService.getBalance()
      setBalance(currentBalance)
    } catch (error) {
      console.error('获取余额失败:', error)
    }
  }

  const menuItems = [
    {
      icon: 'file-generic',
      title: '我的订单',
      path: '/pages/order/list/index',
      arrow: true
    },
    {
      icon: 'money',
      title: '我的券包',
      path: '/pages/mine/vouchers/index',
      arrow: true
    },
    // {
    //   icon: 'gift',
    //   title: '邀请有奖',
    //   path: '/pages/mine/invite/index',
    //   arrow: true
    // },
    // {
    //   icon: 'phone',
    //   title: '联系客服',
    //   path: '/pages/mine/contact/index',
    //   arrow: true
    // },
    {
      icon: 'help',
      title: '关于我们',
      path: '/pages/mine/about/index',
      arrow: true
    }
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    Taro.navigateTo({ url: item.path })
  }

  // 处理微信登录
  const handleLogin = async () => {
    if (loading) return

    setLoading(true)
    try {
      const loginResult = await wechatLogin()

      if (loginResult.needBindPhone) {
        // 需要绑定手机号 - 设置openid供PhoneAuth组件使用
        setCurrentOpenid(loginResult.openid)
        setShowBindPhoneModal(true)
      } else if (loginResult.userInfo) {
        // 登录成功
        setUserInfo(loginResult.userInfo)
        fetchBalance()

        // 检查是否为新用户并显示礼券弹窗
        checkAndShowNewUserVoucher()

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // 处理手机号绑定
  const handleBindPhone = async () => {
    if (!phoneInput.trim()) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'error'
      })
      return
    }

    // 简单的手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phoneInput.trim())) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'error'
      })
      return
    }

    setBingingPhone(true)
    try {
      await bindPhone(currentOpenid, phoneInput.trim())

      // 绑定成功，获取最新用户信息
      const latestUserInfo = getCurrentUserInfo()
      if (latestUserInfo) {
        setUserInfo(latestUserInfo)
        fetchBalance()
      }

      setShowBindPhoneModal(false)
      setPhoneInput('')

      Taro.showToast({
        title: '绑定成功',
        icon: 'success'
      })
    } catch (error: any) {
      console.error('手机号绑定失败:', error)

      // 根据错误类型显示不同的提示
      let errorMessage = '绑定失败，请重试'

      // 检查是否是手机号已被占用的错误
      if (error?.message?.includes('已') || error?.response?.data?.error?.message?.includes('已')) {
        errorMessage = '该手机号已被使用'
      } else if (error?.response?.status === 500 || error?.message?.includes('500')) {
        errorMessage = '该手机号已被占用'
      } else if (error?.message?.includes('网络')) {
        errorMessage = '网络错误，请稍后重试'
      }

      Taro.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })
    } finally {
      setBingingPhone(false)
    }
  }

  // 取消手机号绑定
  const handleCancelBindPhone = () => {
    setShowBindPhoneModal(false)
    setPhoneInput('')
    setCurrentOpenid('')
  }

  const handleBalanceClick = () => {
    Taro.navigateTo({
      url: '/pages/mine/balance/index'
    })
  }

  // 检查并显示新用户礼券弹窗
  const checkAndShowNewUserVoucher = () => {
    const voucherInfo = voucherService.getNewUserVoucherInfo()
    if (voucherInfo.hasVoucher && voucherInfo.discountPercentage) {
      // 检查是否已经显示过（避免重复显示）
      const hasShown = Taro.getStorageSync('newUserVoucherShown')
      if (!hasShown) {
        setVoucherInfo({ discountPercentage: voucherInfo.discountPercentage })
        setTimeout(() => {
          setShowNewUserVoucher(true)
        }, 1500) // 延迟显示，让用户先看到登录成功
      }
    }
  }

  // 处理关闭新人礼券弹窗
  const handleCloseNewUserVoucher = () => {
    setShowNewUserVoucher(false)
    // 标记已显示
    Taro.setStorageSync('newUserVoucherShown', true)
  }

  // 处理使用新人礼券
  const handleUseNewUserVoucher = () => {
    setShowNewUserVoucher(false)
    Taro.setStorageSync('newUserVoucherShown', true)
  }

  return (
    <View className="mine-page">
      <View className="header-section">
        <View className="user-card">
          <View className="user-info">
            <Image
              className="avatar"
              src={userInfo?.avatar || LogoImg}
              mode="aspectFill"
            />
            {userInfo ? (
              <Text className="phone">
                {userInfo.nickname || userInfo.username || maskPhone(userInfo.phone)}
              </Text>
            ) : (
              <Button
                className="login-btn"
                onClick={handleLogin}
                loading={loading}
                disabled={loading}
                size="mini"
                type="primary"
              >
                {loading ? '登录中...' : '微信登录'}
              </Button>
            )}
          </View>
          {userInfo && (
            <>
              {/* 手机号信息和换绑功能 */}
              <View className="phone-info">
                <Text className="phone-label">手机号: </Text>
                <Text className="phone-number">{maskPhone(userInfo.phone)}</Text>
                <PhoneAuth
                  type="change"
                  buttonText="换绑"
                  buttonSize="mini"
                  buttonType="default"
                  onSuccess={(phone) => {
                    console.log('换绑成功，新手机号:', phone)
                    Taro.showToast({
                      title: '换绑成功',
                      icon: 'success'
                    })
                    // 刷新用户信息
                    initUser()
                  }}
                />
              </View>
              {/* 余额和定位信息 */}
              <View className="balance-location-row">
                <View className="balance-info" onClick={handleBalanceClick}>
                  <Text className="balance-label">余额: </Text>
                  <Text className="balance-amount">¥ {balance.toFixed(2)}</Text>
                  <AtIcon value="chevron-right" size="16" color="#fff" />
                </View>
                <View className="location-info">
                  <Text className="location-text">
                    {locationEnabled ? '定位已启用' : '定位未启用'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      <View className="menu-section">
        {menuItems.map((item, index) => (
          <View 
            key={index}
            className="menu-item" 
            onClick={() => handleMenuClick(item)}
          >
            <View className="menu-left">
              <AtIcon 
                prefixClass="icon" 
                value={item.icon} 
                size="20" 
                color="#666"
              />
              <Text className="menu-title">{item.title}</Text>
            </View>
            <View className="menu-right">
              {item.badge && (
                <View className="badge">{item.badge}</View>
              )}
              {item.arrow && (
                <AtIcon value="chevron-right" size="16" color="#999" />
              )}
            </View>
          </View>
        ))}
      </View>

      {/* 手机号绑定弹窗 - 使用微信手机号组件 */}
      <AtModal
        isOpened={showBindPhoneModal}
        onCancel={handleCancelBindPhone}
      >
        <AtModalHeader>绑定手机号</AtModalHeader>
        <AtModalContent>
          <View className="bind-phone-content">
            <Text className="bind-phone-tips">
              使用微信绑定的手机号快速登录
            </Text>
            <View className="phone-auth-wrapper">
              <PhoneAuth
                type="bind"
                openid={currentOpenid}
                onSuccess={(phone) => {
                  console.log('绑定成功，手机号:', phone)
                  setShowBindPhoneModal(false)
                  setPhoneInput('')
                  // 刷新用户信息
                  const latestUserInfo = getCurrentUserInfo()
                  if (latestUserInfo) {
                    setUserInfo(latestUserInfo)
                    fetchBalance()
                  }
                }}
                onCancel={() => {
                  console.log('用户取消绑定')
                }}
              />
            </View>
            <Text className="bind-phone-privacy">
              授权后将获取您的微信手机号用于账号登录
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleCancelBindPhone}>稍后绑定</Button>
        </AtModalAction>
      </AtModal>

      {/* 新人礼券弹窗 */}
      <NewUserVoucherModal
        isOpened={showNewUserVoucher}
        discountPercentage={voucherInfo.discountPercentage}
        onClose={handleCloseNewUserVoucher}
        onUse={handleUseNewUserVoucher}
      />
    </View>
  )
}

export default Mine