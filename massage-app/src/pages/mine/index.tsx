import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

const Mine: React.FC = () => {
  return (
    <View className="mine-page">
      <View className="content">
        <Text className="title">我的页面</Text>
        <Text className="desc">功能开发中...</Text>
      </View>
    </View>
  )
}

export default Mine