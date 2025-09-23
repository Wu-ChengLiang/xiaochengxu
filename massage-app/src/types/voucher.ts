/**
 * 礼券相关类型定义
 */

export interface Voucher {
  id: string
  userId: string
  type: 'discount' | 'cash' | 'gift'  // 折扣券、现金券、礼品券
  name: string                        // 券名称
  description: string                 // 描述
  discountRate?: number              // 折扣率：如 0.68 表示68折
  discountPercentage?: number        // 折扣百分比：如 32 表示32%优惠
  cashValue?: number                 // 现金面值（分）
  minAmount?: number                 // 最低消费金额（分）
  validFrom: string                  // 生效时间
  validTo: string                    // 过期时间
  status: 'unused' | 'used' | 'expired' // 券状态
  usedAt?: string                    // 使用时间
  orderNo?: string                   // 关联订单号
  isAutoApply?: boolean              // 是否自动应用
}

/**
 * 根据折扣率生成虚拟优惠券
 */
export function generateVoucherFromDiscountRate(discountRate: number, userId: string): Voucher | null {
  if (!discountRate || discountRate >= 1) {
    return null // 无折扣或折扣率无效
  }

  const discountPercentage = Math.round((1 - discountRate) * 100)
  const now = new Date()
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

  return {
    id: `virtual_${userId}_discount`,
    userId: userId.toString(),
    type: 'discount',
    name: discountPercentage >= 30 ? '新人专享券' : '会员折扣券',
    description: `全场服务${Math.round(discountRate * 100)}折`,
    discountRate: discountRate,
    discountPercentage: discountPercentage,
    validFrom: now.toISOString(),
    validTo: oneYearLater.toISOString(),
    status: 'unused',
    isAutoApply: true
  }
}

/**
 * 计算折扣后的价格
 */
export function calculateDiscountPrice(originalPrice: number, discountRate: number): {
  originalPrice: number
  finalPrice: number
  savedAmount: number
  discountDisplay: string
} {
  const finalPrice = Math.round(originalPrice * discountRate)
  const savedAmount = originalPrice - finalPrice
  const discountPercentage = Math.round(discountRate * 100)

  return {
    originalPrice,
    finalPrice,
    savedAmount,
    discountDisplay: `${discountPercentage}折`
  }
}