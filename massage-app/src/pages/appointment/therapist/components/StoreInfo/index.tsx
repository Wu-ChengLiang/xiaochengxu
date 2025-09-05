import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import type { Store } from '@/types'
import './index.scss'

interface StoreInfoProps {
  store: Store
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
  const getStatusText = (status: Store['status']) => {
    switch (status) {
      case 'normal':
        return '就近'
      case 'busy':
        return '繁忙'
      case 'full':
        return '爆满'
      default:
        return ''
    }
  }

  const getStatusClass = (status: Store['status']) => {
    switch (status) {
      case 'normal':
        return 'status-normal'
      case 'busy':
        return 'status-busy'
      case 'full':
        return 'status-full'
      default:
        return ''
    }
  }

  const handleCallStore = () => {
    if (store.phone) {
      Taro.makePhoneCall({
        phoneNumber: store.phone
      })
    }
  }

  const handleShowLocation = () => {
    if (store.location) {
      Taro.openLocation({
        latitude: store.location.latitude,
        longitude: store.location.longitude,
        name: store.name,
        address: store.address
      })
    }
  }

  return (
    <View className="store-info">
      <View className="store-header">
        <View className="store-details">
          <View className="name-row">
            <Text className="store-name">{store.name}</Text>
            <Text className="distance">{store.distance || 9.0}km</Text>
          </View>
          
          <View className="hours-row">
            <Text className="business-hours">
              {store.businessHours ? `${store.businessHours.start}-${store.businessHours.end}` : '营业时间未知'}
            </Text>
            <View className={`status ${getStatusClass(store.status)}`}>
              {getStatusText(store.status)}
            </View>
          </View>
          
          <Text className="address">{store.address || '地址未知'} (电影院门口)</Text>
        </View>
        
        <View className="action-buttons">
          <View className="action-btn" onClick={handleCallStore}>
            📞
          </View>
          <View className="action-btn" onClick={handleShowLocation}>
            📍
          </View>
        </View>
      </View>
    </View>
  )
}

export default StoreInfo