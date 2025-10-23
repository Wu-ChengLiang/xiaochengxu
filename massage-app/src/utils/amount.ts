/**
 * 金额单位统一处理工具库
 *
 * 金额单位规范：
 * - API返回：分（fen）- 整数，无精度问题
 * - 服务层返回：分（fen）- 保持API返回的原始单位，供上层调用
 * - UI展示：元（yuan）- 调用转换函数在组件中转换
 *
 * 这样做的好处：
 * 1. 服务层逻辑清晰，直接从API获取分为单位的数据，无需转换
 * 2. 组件层负责显示，转换逻辑集中在UI层
 * 3. 避免中间层多次转换导致的精度问题
 */

/**
 * 将分转换为元（四舍五入）
 * @param amountInCents 金额（分）
 * @returns 金额（元）
 */
export function centsToYuan(amountInCents: number | undefined | null): number {
  if (!amountInCents && amountInCents !== 0) return 0
  return Math.round(amountInCents) / 100
}

/**
 * 将元转换为分（避免浮点数精度问题）
 * @param amountInYuan 金额（元）
 * @returns 金额（分）
 */
export function yuanToCents(amountInYuan: number | undefined | null): number {
  if (!amountInYuan && amountInYuan !== 0) return 0
  return Math.round(amountInYuan * 100)
}

/**
 * 格式化金额为显示字符串（元）
 * @param amountInCents 金额（分）
 * @param options 选项
 * @returns 格式化后的字符串，如 "99.99元"
 */
export function formatAmount(
  amountInCents: number | undefined | null,
  options?: {
    symbol?: string  // 货币符号，默认"￥"
    suffix?: string  // 后缀，默认"元"
    precision?: number  // 小数位数，默认2
  }
): string {
  const {
    symbol = '￥',
    suffix = '元',
    precision = 2
  } = options || {}

  // 🚀 改进：更清晰的容错处理，避免NaN
  if (amountInCents === undefined || amountInCents === null) {
    return `${symbol}0.00${suffix}`
  }

  // 验证是否为有效数字
  if (typeof amountInCents !== 'number' || isNaN(amountInCents)) {
    console.warn('⚠️ formatAmount: 无效的金额输入', { amountInCents, type: typeof amountInCents })
    return `${symbol}0.00${suffix}`
  }

  const yuan = centsToYuan(amountInCents)

  // 防御性检查：确保结果不是NaN
  if (isNaN(yuan)) {
    console.error('❌ formatAmount: 金额转换结果为NaN', { amountInCents, yuan })
    return `${symbol}0.00${suffix}`
  }

  return `${symbol}${yuan.toFixed(precision)}${suffix}`
}

/**
 * 获取节省金额的显示文本
 * @param originalPrice 原价（分）
 * @param discountPrice 折扣价（分）
 * @returns 如 "节省￥10.00"
 */
export function getSavingsText(
  originalPrice: number | undefined,
  discountPrice: number | undefined
): string {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) {
    return ''
  }

  const savings = originalPrice - discountPrice
  return `节省${formatAmount(savings)}`
}

/**
 * 计算折扣率百分比
 * @param originalPrice 原价（分）
 * @param discountPrice 折扣价（分）
 * @returns 折扣率，如0.8表示8折
 */
export function getDiscountRate(
  originalPrice: number | undefined,
  discountPrice: number | undefined
): number {
  if (!originalPrice || originalPrice === 0) return 1
  if (!discountPrice) return 0

  return Math.round((discountPrice / originalPrice) * 10) / 10
}

/**
 * 判断金额是否有效（大于0）
 */
export function isValidAmount(amount: number | undefined | null): boolean {
  return Boolean(amount) && amount! > 0
}
