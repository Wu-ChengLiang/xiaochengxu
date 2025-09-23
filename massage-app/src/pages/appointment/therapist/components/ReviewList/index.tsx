import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtRate } from 'taro-ui'
import { ReviewData, ReviewStats } from '@/services/review'
import './index.scss'

interface ReviewListProps {
  reviews: ReviewData[]
  stats: ReviewStats | null
  loading?: boolean
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, stats, loading }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    }
  }

  if (loading) {
    return (
      <View className="review-list loading">
        <Text>加载评价中...</Text>
      </View>
    )
  }

  return (
    <View className="review-list">
      {/* 评价统计 */}
      {stats && stats.totalCount > 0 && (
        <View className="review-stats">
          <View className="stats-header">
            <Text className="title">用户评价</Text>
            <View className="rating-info">
              <Text className="score">{stats.averageRating.toFixed(1)}</Text>
              <AtRate value={stats.averageRating} size={14} />
              <Text className="count">({stats.totalCount}条)</Text>
            </View>
          </View>

          {/* 评分分布 */}
          <View className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.ratingBreakdown[rating] || 0
              const percentage = stats.totalCount > 0
                ? (count / stats.totalCount * 100).toFixed(0)
                : '0'

              return (
                <View key={rating} className="rating-row">
                  <Text className="rating-label">{rating}星</Text>
                  <View className="rating-bar">
                    <View
                      className="rating-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="rating-count">{count}</Text>
                </View>
              )
            })}
          </View>
        </View>
      )}

      {/* 评价列表 */}
      <View className="review-items">
        {reviews.length === 0 ? (
          <View className="empty">
            <Text>暂无评价</Text>
          </View>
        ) : (
          reviews.map((review) => (
            <View key={review.reviewId} className="review-item">
              <View className="review-header">
                <View className="user-info">
                  <Image
                    className="user-avatar"
                    src={review.userAvatar || 'https://img.yzcdn.cn/vant/cat.jpeg'}
                    mode="aspectFill"
                  />
                  <View className="user-detail">
                    <Text className="user-name">{review.userName || '匿名用户'}</Text>
                    <Text className="review-date">{formatDate(review.createdAt)}</Text>
                  </View>
                </View>
                <AtRate value={review.rating} size={12} />
              </View>

              <View className="review-content">
                <Text>{review.content}</Text>
              </View>

              {review.tags && review.tags.length > 0 && (
                <View className="review-tags">
                  {review.tags.map((tag, index) => (
                    <Text key={index} className="tag">{tag}</Text>
                  ))}
                </View>
              )}

              {review.serviceType && (
                <View className="review-service">
                  <AtIcon value="tag" size={12} color="#999" />
                  <Text className="service-name">{review.serviceType}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* 查看更多 */}
      {stats && stats.totalCount > 10 && reviews.length >= 10 && (
        <View className="load-more">
          <Text>仅显示最近10条评价</Text>
        </View>
      )}
    </View>
  )
}

export default ReviewList