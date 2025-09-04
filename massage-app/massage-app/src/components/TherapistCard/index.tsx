import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import BookingButton from '@/components/BookingButton'
import type { Therapist } from '@/types'
import './index.scss'

interface TherapistCardProps {
  therapist: Therapist
  onClick?: () => void
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onClick }) => {
  return (
    <View className="therapist-card" onClick={onClick}>
      <View className="card-content">
        <Image 
          className="therapist-avatar" 
          src={therapist.avatar} 
          mode="aspectFill"
        />
        
        <View className="therapist-info">
          <View className="info-header">
            <Text className="therapist-name">{therapist.name}</Text>
            <View className="distance">
              <Text className="icon">📍</Text>
              <Text className="distance-text">{therapist.distance}km</Text>
            </View>
          </View>
          
          <View className="expertise-tags">
            {therapist.expertise.map((tag, index) => (
              <Text key={index} className="expertise-tag">
                {tag}
              </Text>
            ))}
          </View>
          
          <View className="therapist-footer">
            <View className="rating">
              <Text className="icon">⭐</Text>
              <Text className="rating-text">{therapist.rating}分</Text>
              <Text className="service-count">
                服务{therapist.serviceCount}次
              </Text>
            </View>
            <BookingButton 
              size="small"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default TherapistCard