import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const PrivacyPolicy: React.FC = () => {
  return (
    <View className="agreement-page">
      <View className="agreement-header">
        <Text className="agreement-title">隐私政策</Text>
      </View>
      <View className="agreement-content">
        <Text>我们重视您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。</Text>
      </View>
    </View>
  )
}

export default PrivacyPolicy
