import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import type { Store } from '@/types'
import './index.scss'

interface StoreInfoProps {
  store: Store
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
  const handleCallStore = () => {
    if (store.phone) {
      Taro.makePhoneCall({
        phoneNumber: store.phone
      })
    }
  }

  const handleShowLocation = () => {
    if (store.latitude && store.longitude) {
      Taro.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
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
            {store.distance !== undefined && store.distance !== null && (
              <Text className="distance">{store.distance}km</Text>
            )}
          </View>
          
          <View className="hours-row">
            <Text className="business-hours">
              {store.businessHours}
            </Text>
          </View>
          
          <Text className="address">{store.address}</Text>
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