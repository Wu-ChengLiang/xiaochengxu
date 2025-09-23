import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import type { Therapist } from '@/types'
import type { ReviewStats } from '@/services/review'
import './index.scss'

interface TherapistInfoProps {
  therapist: Therapist
  stats?: ReviewStats | null
}

const TherapistInfo: React.FC<TherapistInfoProps> = ({ therapist, stats }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 从API获取推拿师信息，提供合理的默认值
  // 优先使用评价统计中的数据
  const therapistDetail = {
    level: 'LV4', // 暂时保持固定，后续可从API获取
    rating: stats?.averageRating || therapist.rating || 4.8,
    serviceCount: therapist.serviceCount || 0, // 使用API返回的真实服务次数
    reviewCount: stats?.totalCount || 0,
    description: therapist.bio || '专业推拿师，经验丰富，擅长各类疼痛调理和康复治疗',
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
              <Text className="sales-text">服务{therapistDetail.serviceCount}次</Text>
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