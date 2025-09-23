import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtModal, AtModalContent } from 'taro-ui'
import Taro from '@tarojs/taro'
import './index.scss'

interface NewUserVoucherModalProps {
  isOpened: boolean
  discountPercentage: number
  onClose: () => void
  onUse: () => void
}

const NewUserVoucherModal: React.FC<NewUserVoucherModalProps> = ({
  isOpened,
  discountPercentage,
  onClose,
  onUse
}) => {
  const handleUse = () => {
    onUse()
    // 跳转到预约页面
    Taro.switchTab({
      url: '/pages/appointment/index'
    })
  }

  const handleViewVouchers = () => {
    onClose()
    // 跳转到券包页面
    Taro.navigateTo({
      url: '/pages/mine/vouchers/index'
    })
  }

  return (
    <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
      <AtModalContent>
        <View className="new-user-voucher-modal">
          {/* 庆祝背景 */}
          <View className="celebration-bg">
            <View className="confetti confetti-1">🎉</View>
            <View className="confetti confetti-2">🎊</View>
            <View className="confetti confetti-3">✨</View>
            <View className="confetti confetti-4">🎁</View>
          </View>

          {/* 标题 */}
          <View className="modal-header">
            <Text className="welcome-text">欢迎新用户</Text>
            <Text className="congrats-text">恭喜获得专属优惠券！</Text>
          </View>

          {/* 优惠券展示 */}
          <View className="voucher-display">
            <View className="voucher-card-preview">
              <View className="discount-area">
                <Text className="discount-value">{discountPercentage}%</Text>
                <Text className="discount-label">OFF</Text>
              </View>
              <View className="voucher-details">
                <Text className="voucher-title">新人专享券</Text>
                <Text className="voucher-subtitle">全场服务{100 - discountPercentage}折</Text>
                <Text className="voucher-desc">适用于所有推拿服务</Text>
              </View>
            </View>
          </View>

          {/* 优惠说明 */}
          <View className="benefits-list">
            <View className="benefit-item">
              <Text className="benefit-icon">✅</Text>
              <Text className="benefit-text">所有服务均可使用</Text>
            </View>
            <View className="benefit-item">
              <Text className="benefit-icon">✅</Text>
              <Text className="benefit-text">自动应用最优折扣</Text>
            </View>
            <View className="benefit-item">
              <Text className="benefit-icon">✅</Text>
              <Text className="benefit-text">有效期长达一年</Text>
            </View>
          </View>

          {/* 操作按钮 */}
          <View className="modal-actions">
            <View className="primary-btn" onClick={handleUse}>
              立即使用
            </View>
            <View className="secondary-btn" onClick={handleViewVouchers}>
              查看我的券包
            </View>
            <View className="close-btn" onClick={onClose}>
              稍后再说
            </View>
          </View>
        </View>
      </AtModalContent>
    </AtModal>
  )
}

export default NewUserVoucherModal