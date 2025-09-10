import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { storeService } from '@/services/store'
import type { Store } from '@/types'
import './index.scss'

const ApiTest: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // 测试获取附近门店 API
  const testNearbyStores = async () => {
    setLoading(true)
    setError('')
    
    try {
      // 使用上海市中心坐标
      const result = await storeService.getNearbyStores(31.23, 121.47, 1, 5)
      setStores(result.list)
      console.log('API 请求成功:', result)
    } catch (err: any) {
      console.error('API 请求失败:', err)
      setError(err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  // 测试门店详情 API
  const testStoreDetail = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await storeService.getStoreDetail('1')
      console.log('门店详情 API 请求成功:', result)
      alert(`门店详情获取成功: ${result.data.name}`)
    } catch (err: any) {
      console.error('门店详情 API 请求失败:', err)
      setError(err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="api-test">
      <View className="header">
        <Text className="title">API 集成测试</Text>
      </View>

      <View className="buttons">
        <Button 
          type="primary" 
          onClick={testNearbyStores}
          loading={loading}
          disabled={loading}
        >
          测试获取附近门店
        </Button>
        
        <Button 
          type="default" 
          onClick={testStoreDetail}
          loading={loading}
          disabled={loading}
        >
          测试门店详情
        </Button>
      </View>

      {error && (
        <View className="error">
          <Text className="error-text">❌ 错误: {error}</Text>
        </View>
      )}

      <View className="results">
        <Text className="results-title">API 响应结果 ({stores.length} 家门店):</Text>
        
        {stores.map((store) => (
          <View key={store.id} className="store-item">
            <Text className="store-name">🏪 {store.name}</Text>
            <Text className="store-address">📍 {store.address}</Text>
            <Text className="store-phone">📞 {store.phone}</Text>
            <Text className="store-distance">📏 距离: {store.distance}km</Text>
            <Text className="store-status">📊 状态: {store.status}</Text>
          </View>
        ))}
      </View>

      {stores.length === 0 && !loading && !error && (
        <View className="empty">
          <Text className="empty-text">点击按钮测试 API</Text>
        </View>
      )}
    </View>
  )
}

export default ApiTest