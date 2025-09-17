import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { walletService } from '@/services/wallet.service'
import './index.scss'

const Recharge: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // 获取充值选项
  const rechargeOptions = walletService.getRechargeOptions()

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: any) => {
    const value = e.detail?.value || e.target?.value || ''
    if (/^\d*$/.test(value)) {
      setCustomAmount(value)
      setSelectedAmount(0)
    }
  }

  const handleRecharge = async () => {
    const amount = selectedAmount || Number(customAmount)

    if (!amount || amount <= 0) {
      Taro.showToast({
        title: '请选择或输入充值金额',
        icon: 'none'
      })
      return
    }

    if (amount > 50000) {
      Taro.showToast({
        title: '单次充值金额不能超过5万元',
        icon: 'none'
      })
      return
    }

    setLoading(true)

    try {
      // 模拟微信支付
      Taro.showLoading({ title: '正在支付...' })

      // Mock 支付延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 查找对应的充值选项，获取赠送金额
      const option = rechargeOptions.find(opt => opt.amount === amount)
      const bonus = option?.bonus || 0
      const totalAmount = amount + bonus

      // 充值到余额
      const result = await walletService.recharge(
        totalAmount,
        bonus > 0 ? `充值${amount}元，赠送${bonus}元` : `充值${amount}元`
      )

      Taro.hideLoading()

      if (result.success) {
        Taro.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 2000
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 2000)
      } else {
        Taro.showToast({
          title: result.message || '充值失败',
          icon: 'none'
        })
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '充值失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="recharge-page">
      {/* 充值金额选择 */}
      <View className="amount-section">
        <Text className="section-title">选择充值金额</Text>
        <View className="amount-grid">
          {rechargeOptions.map((option) => (
            <View
              key={option.amount}
              className={`amount-card ${selectedAmount === option.amount ? 'active' : ''}`}
              onClick={() => handleAmountSelect(option.amount)}
            >
              <Text className="amount">¥{option.amount}</Text>
              {option.bonus > 0 && (
                <Text className="bonus">赠送{option.bonus}元</Text>
              )}
            </View>
          ))}
        </View>

        {/* 自定义金额 */}
        <View className="custom-amount">
          <Text className="label">其他金额</Text>
          <View className="input-wrapper">
            <Text className="prefix">¥</Text>
            <input
              className="input"
              type="number"
              placeholder="请输入充值金额"
              value={customAmount}
              onInput={handleCustomAmountChange}
            />
          </View>
        </View>
      </View>

      {/* 充值说明 */}
      <View className="tips-section">
        <Text className="section-title">充值说明</Text>
        <View className="tips-list">
          <View className="tip-item">
            <Text className="dot">•</Text>
            <Text className="text">充值金额将实时到账，可用于支付推拿服务</Text>
          </View>
          <View className="tip-item">
            <Text className="dot">•</Text>
            <Text className="text">余额不支持提现，请合理充值</Text>
          </View>
          <View className="tip-item">
            <Text className="dot">•</Text>
            <Text className="text">充值赠送金额与本金同等使用</Text>
          </View>
        </View>
      </View>

      {/* 底部充值按钮 */}
      <View className="bottom-bar">
        <Button
          className="recharge-btn"
          onClick={handleRecharge}
          disabled={loading}
        >
          <AtIcon value="credit-card" size="20" />
          <Text>立即充值</Text>
        </Button>
      </View>
    </View>
  )
}

export default Recharge