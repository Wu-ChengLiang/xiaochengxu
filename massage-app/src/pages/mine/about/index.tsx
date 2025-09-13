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
            上海名医堂是黄浦区中西医结合医院的精品门诊品牌，专注于中西医结合治疗，尤其擅长中医特色理疗（针灸、推拿）、骨伤康复及老年常见病调理，为市中心患者提供专家级、一站式的中医诊疗服务。
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