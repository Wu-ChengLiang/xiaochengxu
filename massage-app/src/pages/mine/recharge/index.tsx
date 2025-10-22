import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { walletService, RechargeOption } from '@/services/wallet.service'
import { paymentService } from '@/services/payment.service'  // ✅ 添加缺失的导入
import './index.scss'

const Recharge: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [selectedBonus, setSelectedBonus] = useState(0)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [rechargeOptions, setRechargeOptions] = useState<RechargeOption[]>([])

  // 从API获取充值配置
  useEffect(() => {
    loadRechargeOptions()
  }, [])

  const loadRechargeOptions = async () => {
    try {
      const options = await walletService.getRechargeOptions()
      setRechargeOptions(options)
    } catch (error) {
      console.error('获取充值配置失败:', error)
      // 使用默认配置（与礼卡页面保持一致）
      setRechargeOptions([
        { id: 1, amount: 1000, bonus: 100, label: '¥1000', sortOrder: 1 },
        { id: 2, amount: 3000, bonus: 500, label: '¥3000', sortOrder: 2 }
      ])
    }
  }

  const handleAmountSelect = (amount: number, bonus: number = 0) => {
    setSelectedAmount(amount)
    setSelectedBonus(bonus)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: any) => {
    const value = e.detail?.value || e.target?.value || ''
    if (/^\d*$/.test(value)) {
      setCustomAmount(value)
      setSelectedAmount(0)
      setSelectedBonus(0)
    }
  }

  const handleRecharge = async () => {
    const amount = selectedAmount || Number(customAmount)
    const bonus = selectedBonus || 0

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
      // 创建充值订单
      const order = await walletService.createRechargeOrder(amount, bonus)

      console.log('💰 充值订单创建成功:', order)
      console.log('💰 订单号:', order.orderNo)
      console.log('💰 支付参数:', order.wxPayParams)

      // 调起微信支付
      if (order.wxPayParams) {
        // 使用统一支付服务
        // ✅ order.amount 已经是分（wallet.service.ts 中已转换）
        const paymentSuccess = await paymentService.pay({
          orderNo: order.orderNo,
          amount: order.amount || (amount * 100), // 使用订单中的金额（已是分）
          paymentMethod: 'wechat',
          title: `充值${amount}元${bonus > 0 ? `(赠${bonus}元)` : ''}`,
          wxPayParams: order.wxPayParams
        } as any)

        if (paymentSuccess) {
          Taro.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            Taro.navigateBack()
          }, 2000)
        }
      } else {
        throw new Error('获取支付参数失败')
      }
    } catch (error: any) {
      if (error.message?.includes('用户取消') || error.errMsg?.includes('cancel')) {
        Taro.showToast({
          title: '支付已取消',
          icon: 'none'
        })
      } else {
        Taro.showToast({
          title: error.message || '充值失败，请重试',
          icon: 'none'
        })
      }
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
              key={option.id || option.amount}
              className={`amount-card ${selectedAmount === option.amount ? 'active' : ''}`}
              onClick={() => handleAmountSelect(option.amount, option.bonus)}
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