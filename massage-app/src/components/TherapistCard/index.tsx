import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import BookingButton from '@/components/BookingButton'
import { reviewService } from '@/services/review'
import type { Therapist } from '@/types'
import './index.scss'

interface TherapistCardProps {
  therapist: Therapist
  onClick?: () => void
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onClick }) => {
  const [reviewStats, setReviewStats] = useState<{totalCount: number, averageRating: number} | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviewStats = async () => {
      try {
        const stats = await reviewService.getReviewStats(therapist.id)
        setReviewStats(stats)
      } catch (error) {
        console.error('获取推拿师评价统计失败:', error)
        setReviewStats(null)
      } finally {
        setLoading(false)
      }
    }
    loadReviewStats()
  }, [therapist.id])

  // 决定显示什么评分信息
  const getRatingDisplay = () => {
    if (loading) return '...'
    if (!reviewStats || reviewStats.totalCount === 0) return '待评价'
    return `${reviewStats.averageRating}分`
  }

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
              <Text className="rating-text">{getRatingDisplay()}</Text>
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