import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const TermsOfService: React.FC = () => {
  return (
    <View className="agreement-page">
      <View className="agreement-header">
        <Text className="agreement-title">用户服务协议</Text>
      </View>
      <View className="agreement-content">
        <Text>欢迎使用我们的服务。本协议规定了您使用我们服务的条款和条件。</Text>
      </View>
    </View>
  )
}

export default TermsOfService
