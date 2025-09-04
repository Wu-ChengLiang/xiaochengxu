import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import type { Therapist } from '@/types'
import './index.scss'

interface TherapistInfoProps {
  therapist: Therapist
}

const TherapistInfo: React.FC<TherapistInfoProps> = ({ therapist }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 模拟扩展的推拿师信息（实际应该从 therapist 对象获取）
  const therapistDetail = {
    level: 'LV4',
    rating: therapist.rating || 5,
    salesCount: therapist.serviceCount || 10109,
    description: '毕业于成都中医药大学针灸推拿专业。高级康复师 从业18年，专研身体疼痛、运动康复、产后康复、体态调理、经络疏通、美容养生等',
    ...therapist
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <View className="therapist-info">
      <View className="therapist-header">
        <View className="avatar-wrapper">
          <Image
            className="avatar"
            src={therapist.avatar}
            mode="aspectFill"
          />
        </View>
        
        <View className="basic-info">
          <View className="name-row">
            <Text className="name">{therapist.name}</Text>
            <View className="level">{therapistDetail.level}</View>
          </View>
          
          <View className="stats-row">
            <View className="rating">
              <Text className="rating-score">{therapistDetail.rating}分</Text>
            </View>
            <View className="divider">|</View>
            <View className="sales">
              <Text className="sales-text">销量{therapistDetail.salesCount}单</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="description-section">
        <Text className={`description ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {therapistDetail.description}
        </Text>
        
        <View className="expand-toggle" onClick={toggleExpanded}>
          <Text className="expand-text">{isExpanded ? '收起' : '展开'}</Text>
          <Text className={`expand-icon ${isExpanded ? 'up' : 'down'}`}>
            {isExpanded ? '▲' : '▼'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default TherapistInfo