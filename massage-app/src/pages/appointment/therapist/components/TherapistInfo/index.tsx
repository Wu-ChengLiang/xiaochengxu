import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import type { Therapist } from '@/types'
import type { ReviewStats, ReviewData } from '@/services/review'
import './index.scss'

interface TherapistInfoProps {
  therapist: Therapist
  stats?: ReviewStats | null
  reviews?: ReviewData[]
  reviewsLoading?: boolean
}

const TherapistInfo: React.FC<TherapistInfoProps> = ({ therapist, stats, reviews = [], reviewsLoading = false }) => {
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

  // 添加调试日志
  console.log('🔍 TherapistInfo Debug:', {
    therapistId: therapist.id,
    serviceCount: therapist.serviceCount,
    originalTherapist: therapist,
    therapistDetail
  })

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
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
          
        </View>
      </View>
      
      <View className="description-section">
        <Text className={`description ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {therapistDetail.description}
        </Text>

        {/* 展开状态下显示评价内容 */}
        {isExpanded && (
          <View className="reviews-section">
            {/* 评价统计 */}
            {stats && stats.totalCount > 0 && (
              <View className="review-stats-compact">
                <View className="stats-header">
                  <Text className="stats-title">用户评价</Text>
                  <View className="rating-info">
                    <Text className="score">{stats.averageRating.toFixed(1)}</Text>
                    <AtRate value={stats.averageRating} size={12} />
                    <Text className="count">({stats.totalCount}条)</Text>
                  </View>
                </View>
              </View>
            )}

            {/* 评价列表 */}
            <View className="review-list-compact">
              {reviewsLoading ? (
                <Text className="loading-text">加载评价中...</Text>
              ) : reviews.length === 0 ? (
                <Text className="empty-text">暂无评价</Text>
              ) : (
                reviews.slice(0, 3).map((review) => (
                  <View key={review.reviewId} className="review-item-compact">
                    <View className="review-header-compact">
                      <View className="user-info-compact">
                        <Text className="user-name">{review.userName || '匿名用户'}</Text>
                        <AtRate value={review.rating} size={10} />
                      </View>
                      <Text className="review-date">{formatDate(review.createdAt)}</Text>
                    </View>
                    <Text className="review-content-compact">{review.content}</Text>
                    {review.tags && review.tags.length > 0 && (
                      <View className="review-tags-compact">
                        {review.tags.map((tag, index) => (
                          <Text key={index} className="tag-compact">{tag}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              )}

              {reviews.length > 3 && (
                <Text className="more-reviews">仅显示最近3条评价</Text>
              )}
            </View>
          </View>
        )}

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