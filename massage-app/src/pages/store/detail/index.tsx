import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getDefaultShareConfig } from '@/utils/share'

const StoreDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.params

  // 配置分享功能
  useEffect(() => {
    const shareConfig = getDefaultShareConfig()
    Taro.useShareAppMessage(() => {
      return {
        title: shareConfig.title,
        path: shareConfig.path,
        imageUrl: shareConfig.imageUrl
      }
    })
  }, [])

  return (
    <View style={{ padding: '20px', textAlign: 'center' }}>
      <Text>门店详情页面 - 开发中</Text>
    </View>
  )
}

export default StoreDetail