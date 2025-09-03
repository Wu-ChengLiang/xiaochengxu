import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtButton, AtTabs, AtTabsPane } from 'taro-ui'
import { bannerGoodnight } from '@/mock/data/images'
import './index.scss'

interface Promotion {
  id: string
  title: string
  subtitle: string
  originalPrice: number
  discountPrice: number
  discount: string
  image: string
  validUntil: string
  remainingQuota: number
  totalQuota: number
  description: string[]
}

const mockPromotions: Promotion[] = [
  {
    id: 'promo-001',
    title: '晚安好眠套餐',
    subtitle: '深度放松，一夜好眠',
    originalPrice: 398,
    discountPrice: 298,
    discount: '7.5折',
    image: bannerGoodnight,
    validUntil: '2024-12-31',
    remainingQuota: 86,
    totalQuota: 200,
    description: [
      '60分钟专业推拿服务',
      '针对性睡眠改善方案',
      '赠送香薰精油一份',
      '可选时段：晚7点-10点'
    ]
  },
  {
    id: 'promo-002',
    title: '肩颈理疗套餐',
    subtitle: '告别肩颈疼痛',
    originalPrice: 298,
    discountPrice: 198,
    discount: '6.6折',
    image: bannerGoodnight,
    validUntil: '2024-12-31',
    remainingQuota: 142,
    totalQuota: 300,
    description: [
      '45分钟专业肩颈推拿',
      '热敷理疗服务',
      '专业推拿师一对一服务',
      '适用所有门店'
    ]
  },
  {
    id: 'promo-003',
    title: '新客专享套餐',
    subtitle: '首次体验优惠',
    originalPrice: 198,
    discountPrice: 99,
    discount: '5折',
    image: bannerGoodnight,
    validUntil: '2024-12-31',
    remainingQuota: 58,
    totalQuota: 100,
    description: [
      '30分钟基础推拿服务',
      '专业体质评估一次',
      '仅限新用户购买',
      '每人限购一次'
    ]
  }
]

const PromotionPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setPromotions(mockPromotions)
      setLoading(false)
    }, 500)
  }, [])

  const handlePurchase = (promotion: Promotion) => {
    // 跳转到预约确认页面
    Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=promotion&id=${promotion.id}`
    })
  }

  const tabList = [
    { title: '全部优惠' },
    { title: '限时特惠' },
    { title: '新客专享' }
  ]

  const filterPromotions = (tabIndex: number) => {
    switch (tabIndex) {
      case 1:
        return promotions.filter(p => p.discount && parseFloat(p.discount) < 8)
      case 2:
        return promotions.filter(p => p.title.includes('新客'))
      default:
        return promotions
    }
  }

  const renderPromotion = (promotion: Promotion) => (
    <View className="promotion-card" key={promotion.id}>
      <Image 
        className="promotion-image" 
        src={promotion.image} 
        mode="aspectFill"
      />
      <View className="promotion-content">
        <View className="promotion-header">
          <View className="title-section">
            <Text className="promotion-title">{promotion.title}</Text>
            <Text className="promotion-subtitle">{promotion.subtitle}</Text>
          </View>
          <View className="discount-badge">
            <Text className="discount-text">{promotion.discount}</Text>
          </View>
        </View>

        <View className="price-section">
          <View className="prices">
            <Text className="discount-price">¥{promotion.discountPrice}</Text>
            <Text className="original-price">¥{promotion.originalPrice}</Text>
          </View>
          <View className="quota-info">
            <Text className="quota-text">剩余{promotion.remainingQuota}份</Text>
            <View className="quota-progress">
              <View 
                className="quota-progress-fill" 
                style={{ width: `${(promotion.remainingQuota / promotion.totalQuota) * 100}%` }}
              />
            </View>
          </View>
        </View>

        <View className="description-section">
          {promotion.description.map((desc, index) => (
            <Text key={index} className="description-item">• {desc}</Text>
          ))}
        </View>

        <View className="promotion-footer">
          <Text className="valid-date">有效期至 {promotion.validUntil}</Text>
          <AtButton
            type="primary"
            size="small"
            className="purchase-btn"
            onClick={() => handlePurchase(promotion)}
          >
            立即抢购
          </AtButton>
        </View>
      </View>
    </View>
  )

  return (
    <View className="promotion-page">
      <View className="page-header">
        <Text className="page-title">优惠专区</Text>
        <Text className="page-subtitle">限时特惠，手慢无</Text>
      </View>

      <AtTabs
        current={currentTab}
        tabList={tabList}
        onClick={setCurrentTab}
        className="promotion-tabs"
      >
        {tabList.map((_, index) => (
          <AtTabsPane current={currentTab} index={index} key={index}>
            <ScrollView scrollY className="promotion-list">
              {loading ? (
                <View className="loading-container">
                  <Text className="loading-text">加载中...</Text>
                </View>
              ) : (
                filterPromotions(index).map(promotion => renderPromotion(promotion))
              )}
            </ScrollView>
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

export default PromotionPage