import React from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const About: React.FC = () => {
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 实现退出登录逻辑
          Taro.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                Taro.switchTab({ url: '/pages/appointment/index' })
              }, 2000)
            }
          })
        }
      }
    })
  }

  const handlePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-633-0933'
    })
  }

  return (
    <View className="about-page">
      <View className="brand-section">
        <View className="logo-container">
          <View className="logo">
            <Text className="logo-text">常乐</Text>
          </View>
          <Text className="brand-name">对症推拿</Text>
        </View>
        <Text className="version">版本号：5.1.20</Text>
      </View>

      <View className="culture-section">
        <Text className="section-title">常乐文化</Text>
        
        <View className="culture-item">
          <View className="bullet" />
          <Text className="culture-text">
            <Text className="culture-label">身份：</Text>
            中国对症推拿数字化平台开创者
          </Text>
        </View>
        
        <View className="culture-item">
          <View className="bullet" />
          <Text className="culture-text">
            <Text className="culture-label">主张：</Text>
            疲劳酸痛，到常乐对症推拿
          </Text>
        </View>
        
        <View className="culture-item">
          <View className="bullet" />
          <Text className="culture-text">
            <Text className="culture-label">承诺：</Text>
            对症无效，一键退款
          </Text>
        </View>
      </View>

      <View className="contact-section" onClick={handlePhoneCall}>
        <Text className="contact-label">客服电话：</Text>
        <Text className="contact-number">400-633-0933</Text>
      </View>

      <View className="button-section">
        <Button className="logout-btn" onClick={handleLogout}>
          退出账户
        </Button>
      </View>
    </View>
  )
}

export default About