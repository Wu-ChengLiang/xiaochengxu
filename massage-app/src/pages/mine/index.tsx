import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { walletService } from '@/services/wallet.service'
import LogoImg from '@/assets/icons/logo.png'
import './index.scss'

const Mine: React.FC = () => {
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    fetchBalance()
  }, [])

  // 页面显示时刷新余额
  useDidShow(() => {
    fetchBalance()
  })

  const fetchBalance = async () => {
    const currentBalance = await walletService.getBalance()
    setBalance(currentBalance)
  }

  const menuItems = [
    {
      icon: 'file-generic',
      title: '我的订单',
      path: '/pages/order/list/index',
      arrow: true
    },
    // {
    //   icon: 'money',
    //   title: '我的券包',
    //   path: '/pages/mine/coupons/index',
    //   badge: '3',
    //   arrow: true
    // },
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

  const handleLogin = () => {
    // TODO: 实现登录逻辑
    Taro.showToast({
      title: '登录功能开发中',
      icon: 'none'
    })
  }

  const handleBalanceClick = () => {
    Taro.navigateTo({
      url: '/pages/mine/balance/index'
    })
  }

  return (
    <View className="mine-page">
      <View className="header-section">
        <View className="user-card">
          <View className="user-info">
            <Image 
              className="avatar" 
              src={LogoImg}
              mode="aspectFill"
            />
            <Text className="phone">193****9506</Text>
          </View>
          <Button className="balance-info" onClick={() => handleBalanceClick()}>
            <Text className="balance-label">余额: </Text>
            <Text className="balance-amount">¥ {balance.toFixed(2)}</Text>
            <AtIcon value="chevron-right" size="16" color="#fff" />
          </Button>
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
    </View>
  )
}

export default Mine