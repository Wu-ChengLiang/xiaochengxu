import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import type { Store } from '@/types'
import './index.scss'

interface StoreCardProps {
  store: Store
  onClick?: () => void
  onBooking?: (e: any) => void
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick, onBooking }) => {
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

  return (
    <View className="store-card" onClick={onClick}>
      <View className="card-content">
        <Image 
          className="store-image" 
          src={store.images[0]} 
          mode="aspectFill"
        />
        
        <View className="store-info">
          <Text className="store-name">{store.name}</Text>
          
          <View className="business-hours">
            <Text className="hours-text">
              {store.businessHours.start}-{store.businessHours.end}
            </Text>
            <Text className={`status ${getStatusClass(store.status)}`}>
              {getStatusText(store.status)}
            </Text>
          </View>
          
          <View className="store-address">
            <Text className="address-text" numberOfLines={1}>
              {store.address}
            </Text>
          </View>
          
          <View className="store-footer">
            <View className="distance">
              <Text className="icon">📍</Text>
              <Text className="distance-text">{store.distance}km</Text>
            </View>
            <AtButton 
              className="booking-btn"
              type="primary"
              size="small"
              onClick={onBooking}
            >
              预约
            </AtButton>
          </View>
        </View>
      </View>
    </View>
  )
}

export default StoreCard