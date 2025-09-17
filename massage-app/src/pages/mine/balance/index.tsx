import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { walletService, Transaction } from '@/services/wallet.service'
import './index.scss'

const Balance: React.FC = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, [])

  // 触底加载更多
  useReachBottom(() => {
    if (hasMore && !loading) {
      fetchTransactions(page + 1)
    }
  })

  const fetchBalance = async () => {
    const currentBalance = await walletService.getBalance()
    setBalance(currentBalance)
  }

  const fetchTransactions = async (pageNum: number = 1) => {
    if (loading) return

    setLoading(true)
    try {
      const list = await walletService.getTransactions(pageNum, 20)

      if (pageNum === 1) {
        setTransactions(list)
      } else {
        setTransactions(prev => [...prev, ...list])
      }

      setPage(pageNum)
      setHasMore(list.length === 20)
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecharge = () => {
    Taro.navigateTo({
      url: '/pages/mine/recharge/index'
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    const dateString = isToday ? '今天' : `${month}月${day}日`
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    return `${dateString} ${timeString}`
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'recharge':
        return 'add-circle'
      case 'consume':
        return 'subtract-circle'
      case 'refund':
        return 'reload'
      default:
        return 'money'
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'recharge':
      case 'refund':
        return '#52c41a'
      case 'consume':
        return '#333'
      default:
        return '#999'
    }
  }

  const formatAmount = (amount: number) => {
    return amount > 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2)
  }

  return (
    <View className="balance-page">
      {/* 余额卡片 */}
      <View className="balance-card">
        <View className="card-content">
          <Text className="label">当前余额</Text>
          <View className="amount-wrapper">
            <Text className="currency">¥</Text>
            <Text className="amount">{balance.toFixed(2)}</Text>
          </View>
          <View className="action-btn" onClick={handleRecharge}>
            <AtIcon value="add" size="16" color="#fff" />
            <Text>充值</Text>
          </View>
        </View>
      </View>

      {/* 交易记录 */}
      <View className="transaction-section">
        <Text className="section-title">交易记录</Text>

        {transactions.length === 0 ? (
          <View className="empty">
            <AtIcon value="file-generic" size="48" color="#ccc" />
            <Text className="empty-text">暂无交易记录</Text>
          </View>
        ) : (
          <ScrollView className="transaction-list" scrollY>
            {transactions.map((transaction) => (
              <View key={transaction.id} className="transaction-item">
                <View className="left">
                  <AtIcon
                    value={getTransactionIcon(transaction.type)}
                    size="32"
                    color={getTransactionColor(transaction.type)}
                  />
                  <View className="info">
                    <Text className="description">{transaction.description}</Text>
                    <Text className="time">{formatDate(transaction.createdAt)}</Text>
                  </View>
                </View>
                <View className="right">
                  <Text
                    className={`amount ${transaction.amount > 0 ? 'income' : 'expense'}`}
                  >
                    {formatAmount(transaction.amount)}
                  </Text>
                  <Text className="balance">余额: {transaction.balance.toFixed(2)}</Text>
                </View>
              </View>
            ))}

            {loading && (
              <View className="loading">
                <Text>加载中...</Text>
              </View>
            )}

            {!hasMore && transactions.length > 0 && (
              <View className="no-more">
                <Text>没有更多了</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

export default Balance