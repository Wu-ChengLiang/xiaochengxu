import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtFloatLayout, AtRate, AtTextarea, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import type { OrderData } from '@/services/order'
import './index.scss'

interface ReviewModalProps {
  visible: boolean
  orderInfo: OrderData
  onClose: () => void
  onSubmit: (reviewData: {
    appointmentId: number
    rating: number
    content: string
    tags: string[]
  }) => Promise<void>
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  orderInfo,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 快捷评价标签
  const quickTags = [
    '手法专业', '服务态度好', '效果显著',
    '环境舒适', '准时守约', '物超所值'
  ]

  // 根据评分获取对应的文案
  const getRatingText = (score: number) => {
    const textMap: Record<number, string> = {
      1: '很不满意',
      2: '不满意',
      3: '一般',
      4: '满意',
      5: '非常满意'
    }
    return textMap[score] || ''
  }

  // 切换标签选中状态
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  // 判断是否可以提交
  const canSubmit = content.length >= 10 && !isSubmitting

  // 处理提交
  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      // 从orderInfo中获取appointmentId
      // 如果extraData中有appointmentId，使用它；否则尝试其他字段
      const appointmentId =
        (orderInfo.extraData?.appointmentId) ||
        (orderInfo as any).appointmentId ||
        123 // 默认值，实际应该从订单数据获取

      await onSubmit({
        appointmentId,
        rating,
        content,
        tags: selectedTags
      })

      // 提交成功后重置表单
      setRating(5)
      setContent('')
      setSelectedTags([])

      Taro.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 2000
      })

      // 延迟关闭模态层，让用户看到成功提示
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '评价失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理取消
  const handleCancel = () => {
    if (content.length > 0 || selectedTags.length > 0) {
      Taro.showModal({
        title: '确认取消',
        content: '已填写的内容将不会保存，确定取消吗？',
        success: (res) => {
          if (res.confirm) {
            // 重置表单
            setRating(5)
            setContent('')
            setSelectedTags([])
            onClose()
          }
        }
      })
    } else {
      onClose()
    }
  }

  return (
    <AtFloatLayout
      isOpened={visible}
      title="评价服务"
      onClose={handleCancel}
    >
      <View className="review-modal">
        {/* 顶部信息 */}
        <View className="modal-header">
          <View className="therapist-info">
            <Image
              className="avatar"
              src={orderInfo.therapistAvatar || 'https://img.yzcdn.cn/vant/cat.jpeg'}
              mode="aspectFill"
            />
            <View className="info">
              <Text className="name">{orderInfo.therapistName}</Text>
              <Text className="service">{orderInfo.serviceName}</Text>
            </View>
          </View>
        </View>

        {/* 星级评分 */}
        <View className="rating-section">
          <Text className="rating-label">服务评分</Text>
          <View className="star-container">
            <AtRate
              value={rating}
              onChange={(value) => setRating(value)}
              size={28}
              max={5}
            />
            <Text className="rating-text">{getRatingText(rating)}</Text>
          </View>
        </View>

        {/* 快捷标签（4星及以上显示） */}
        {rating >= 4 && (
          <View className="quick-tags">
            <Text className="tags-label">快速评价</Text>
            <View className="tags-container">
              {quickTags.map(tag => (
                <View
                  key={tag}
                  className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 文字评价 */}
        <View className="content-section">
          <Text className="content-label">详细评价</Text>
          <AtTextarea
            value={content}
            onChange={(value) => setContent(value)}
            placeholder="分享您的服务体验，帮助其他顾客（10-500字）"
            maxLength={500}
            height={120}
            count
            className="content-textarea"
          />
        </View>

        {/* 底部操作 */}
        <View className="modal-footer">
          <View className="buttons">
            <View className="btn-cancel" onClick={handleCancel}>
              取消
            </View>
            <View
              className={`btn-submit ${canSubmit ? '' : 'disabled'}`}
              onClick={handleSubmit}
            >
              {isSubmitting ? '提交中...' : '提交评价'}
            </View>
          </View>
        </View>
      </View>
    </AtFloatLayout>
  )
}

export default ReviewModal