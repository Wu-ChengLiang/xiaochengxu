import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import { voucherService } from '@/services/voucher.service'
import { Voucher } from '@/types/voucher'
import './index.scss'

const VouchersPage: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)

  const tabList = [
    { title: '可用券' },
    { title: '已使用' },
    { title: '已过期' }
  ]

  useEffect(() => {
    loadVouchers()
  }, [])

  const loadVouchers = async () => {
    setLoading(true)
    try {
      const allVouchers = await voucherService.getMyVouchers()
      setVouchers(allVouchers)
    } catch (error) {
      console.error('加载礼券失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 过滤不同状态的券
  const getFilteredVouchers = (status: 'unused' | 'used' | 'expired') => {
    const now = new Date()
    return vouchers.filter(voucher => {
      if (status === 'expired') {
        // 检查是否过期
        const validTo = new Date(voucher.validTo)
        return validTo < now && voucher.status !== 'used'
      }
      return voucher.status === status
    })
  }

  // 格式化有效期
  const formatValidDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`
  }

  // 渲染券卡片
  const renderVoucherCard = (voucher: Voucher) => {
    const isExpired = new Date(voucher.validTo) < new Date()
    const isUsed = voucher.status === 'used'

    return (
      <View
        key={voucher.id}
        className={`voucher-card ${isUsed ? 'used' : ''} ${isExpired ? 'expired' : ''}`}
      >
        <View className="voucher-left">
          <View className="discount-value">
            {voucher.type === 'discount' && voucher.discountPercentage && (
              <>
                <Text className="discount-number">{voucher.discountPercentage}</Text>
                <Text className="discount-unit">%</Text>
              </>
            )}
            {voucher.type === 'cash' && voucher.cashValue && (
              <>
                <Text className="discount-unit">¥</Text>
                <Text className="discount-number">{(voucher.cashValue / 100).toFixed(0)}</Text>
              </>
            )}
          </View>
          <Text className="discount-type">优惠券</Text>
        </View>

        <View className="voucher-right">
          <View className="voucher-info">
            <Text className="voucher-name">{voucher.name}</Text>
            <Text className="voucher-desc">{voucher.description}</Text>
            {voucher.minAmount && voucher.minAmount > 0 && (
              <Text className="voucher-condition">
                满{(voucher.minAmount / 100).toFixed(0)}元可用
              </Text>
            )}
            <Text className="voucher-validity">
              有效期至 {formatValidDate(voucher.validTo)}
            </Text>
          </View>

          <View className="voucher-status">
            {isUsed && (
              <View className="status-tag used">
                <AtIcon value="check-circle" size="14" />
                <Text>已使用</Text>
              </View>
            )}
            {isExpired && !isUsed && (
              <View className="status-tag expired">
                <AtIcon value="clock" size="14" />
                <Text>已过期</Text>
              </View>
            )}
            {!isUsed && !isExpired && (
              <View
                className="use-btn"
                onClick={() => {
                  Taro.navigateTo({ url: '/pages/appointment/index' })
                }}
              >
                立即使用
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  const renderEmptyState = (type: string) => {
    return (
      <View className="empty-state">
        <AtIcon value="tag" size="60" color="#ccc" />
        <Text className="empty-text">暂无{type}</Text>
        {type === '可用券' && (
          <View
            className="go-shop-btn"
            onClick={() => {
              Taro.switchTab({ url: '/pages/appointment/index' })
            }}
          >
            去预约服务
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <View className="vouchers-page">
        <View className="loading">加载中...</View>
      </View>
    )
  }

  const availableVouchers = getFilteredVouchers('unused')
  const usedVouchers = getFilteredVouchers('used')
  const expiredVouchers = getFilteredVouchers('expired')

  return (
    <View className="vouchers-page">
      <AtTabs current={current} tabList={tabList} onClick={setCurrent}>
        <AtTabsPane current={current} index={0}>
          <ScrollView scrollY className="voucher-list">
            {availableVouchers.length > 0 ? (
              availableVouchers.map(renderVoucherCard)
            ) : (
              renderEmptyState('可用券')
            )}
          </ScrollView>
        </AtTabsPane>

        <AtTabsPane current={current} index={1}>
          <ScrollView scrollY className="voucher-list">
            {usedVouchers.length > 0 ? (
              usedVouchers.map(renderVoucherCard)
            ) : (
              renderEmptyState('已使用的券')
            )}
          </ScrollView>
        </AtTabsPane>

        <AtTabsPane current={current} index={2}>
          <ScrollView scrollY className="voucher-list">
            {expiredVouchers.length > 0 ? (
              expiredVouchers.map(renderVoucherCard)
            ) : (
              renderEmptyState('已过期的券')
            )}
          </ScrollView>
        </AtTabsPane>
      </AtTabs>

      {/* 使用规则说明 */}
      <View className="rules-section">
        <View className="rules-title">使用规则</View>
        <View className="rules-content">
          <View className="rule-item">1. 优惠券在有效期内可用于预约服务</View>
          <View className="rule-item">2. 每次预约仅可使用一张优惠券</View>
          <View className="rule-item">3. 优惠券不可兑现、不可转让</View>
          <View className="rule-item">4. 最终解释权归名医堂所有</View>
        </View>
      </View>
    </View>
  )
}

export default VouchersPage