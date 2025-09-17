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

  const handleJoinCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '13701757685'
    })
  }

  return (
    <View className="about-page">
      <View className="brand-section">
        <View className="logo-container">
          <View className="logo">
            <Text className="logo-text">名医堂</Text>
          </View>
          <Text className="brand-name">上海名医堂</Text>
        </View>
        <Text className="version">版本号：5.1.20</Text>
      </View>

      <View className="culture-section">
        <Text className="section-title">关于我们</Text>
        
        <View className="culture-item">
          <Text className="culture-text">
            名医堂创立于2017年，汇聚非遗专家与中医师，融合正脊、推拿、艾灸等传统疗法，辨证施治，提供个性化医养结合服务，专注疼痛、亚健康及未病调理。
          </Text>
        </View>
      </View>

      <View className="contact-section" onClick={handleJoinCall}>
        <Text className="contact-label">加盟热线：</Text>
        <Text className="contact-number">13701757685</Text>
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