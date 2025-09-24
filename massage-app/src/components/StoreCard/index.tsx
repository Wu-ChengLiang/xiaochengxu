import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import BookingButton from '@/components/BookingButton'
import type { Store } from '@/types'
import storeImage from '@/assets/images/store/caodongli/store.jpg'
import './index.scss'

interface StoreCardProps {
  store: Store
  onClick?: () => void
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
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
        <View className="store-image-wrapper">
          <Image
            className="store-image"
            src={storeImage}
            mode="aspectFill"
          />
        </View>
        
        <View className="store-info">
          <Text className="store-name">{store.name}</Text>
          
          <View className="business-hours">
            <Text className="hours-text">
              {store.businessHours}
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
            {store.distance !== undefined && store.distance !== null && (
              <View className="distance">
                <AtIcon value="map-pin" size="12" color="#999" />
                <Text className="distance-text">{store.distance}km</Text>
              </View>
            )}
            <BookingButton 
              size="small"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default StoreCard