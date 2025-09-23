/**
 * 礼券服务
 */
import { Voucher, generateVoucherFromDiscountRate } from '@/types/voucher'
import { getCurrentUserInfo } from '@/utils/user'
import Taro from '@tarojs/taro'

class VoucherService {
  private vouchers: Voucher[] = []
  private currentVoucher: Voucher | null = null

  /**
   * 获取当前用户的礼券列表
   */
  async getMyVouchers(): Promise<Voucher[]> {
    const userInfo = getCurrentUserInfo()
    if (!userInfo) {
      return []
    }

    // 根据用户折扣率生成虚拟券
    if (userInfo.discountRate && userInfo.discountRate < 1) {
      const voucher = generateVoucherFromDiscountRate(userInfo.discountRate, userInfo.id.toString())
      if (voucher) {
        this.vouchers = [voucher]
        return [voucher]
      }
    }

    return []
  }

  /**
   * 获取可用礼券列表
   */
  async getAvailableVouchers(orderAmount: number): Promise<Voucher[]> {
    const allVouchers = await this.getMyVouchers()
    const now = new Date()

    return allVouchers.filter(voucher => {
      // 检查状态
      if (voucher.status !== 'unused') return false

      // 检查有效期
      const validFrom = new Date(voucher.validFrom)
      const validTo = new Date(voucher.validTo)
      if (now < validFrom || now > validTo) return false

      // 检查最低消费金额
      if (voucher.minAmount && orderAmount < voucher.minAmount) return false

      return true
    })
  }

  /**
   * 设置当前选中的礼券
   */
  setCurrentVoucher(voucher: Voucher | null) {
    this.currentVoucher = voucher
    // 存储到本地，方便订单页面使用
    if (voucher) {
      Taro.setStorageSync('selectedVoucher', voucher)
    } else {
      Taro.removeStorageSync('selectedVoucher')
    }
  }

  /**
   * 获取当前选中的礼券
   */
  getCurrentVoucher(): Voucher | null {
    if (!this.currentVoucher) {
      // 尝试从本地存储恢复
      try {
        this.currentVoucher = Taro.getStorageSync('selectedVoucher')
      } catch (e) {
        console.error('获取选中礼券失败:', e)
      }
    }
    return this.currentVoucher
  }

  /**
   * 标记礼券为已使用
   */
  markVoucherAsUsed(voucherId: string, orderNo: string) {
    const voucher = this.vouchers.find(v => v.id === voucherId)
    if (voucher) {
      voucher.status = 'used'
      voucher.usedAt = new Date().toISOString()
      voucher.orderNo = orderNo
    }
    // 清除选中的券
    this.setCurrentVoucher(null)
  }

  /**
   * 检查是否为新用户（有新人券）
   */
  isNewUser(): boolean {
    const userInfo = getCurrentUserInfo()
    if (!userInfo || !userInfo.discountRate) return false

    // 32%及以上的优惠认为是新用户
    const discountPercentage = Math.round((1 - userInfo.discountRate) * 100)
    return discountPercentage >= 30
  }

  /**
   * 获取新人礼券信息（用于弹窗展示）
   */
  getNewUserVoucherInfo(): {
    hasVoucher: boolean
    discountPercentage?: number
    description?: string
  } {
    const userInfo = getCurrentUserInfo()
    if (!userInfo || !userInfo.discountRate || userInfo.discountRate >= 1) {
      return { hasVoucher: false }
    }

    const discountPercentage = Math.round((1 - userInfo.discountRate) * 100)
    return {
      hasVoucher: true,
      discountPercentage,
      description: `恭喜获得新人专享${discountPercentage}%优惠券！`
    }
  }
}

export const voucherService = new VoucherService()