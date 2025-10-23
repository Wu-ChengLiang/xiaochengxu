/**
 * 日期格式转换工具
 *
 * 问题：iOS 不支持 "2025-10-22 11:35:45" 格式
 * 解决：转换为 ISO 8601 格式 "2025-10-22T11:35:45"
 *
 * 支持的格式：
 * - "yyyy/MM/dd"
 * - "yyyy/MM/dd HH:mm:ss"
 * - "yyyy-MM-dd"
 * - "yyyy-MM-ddTHH:mm:ss"
 * - "yyyy-MM-ddTHH:mm:ss+HH:mm"
 */

/**
 * 将日期字符串转换为 iOS 兼容的格式
 * @param dateStr 日期字符串，如 "2025-10-22 11:35:45"
 * @returns iOS 兼容的日期字符串，如 "2025-10-22T11:35:45"
 */
export const toIOSCompatibleDate = (dateStr: string | undefined | null): string | null => {
  if (!dateStr) {
    return null
  }

  // 已经是 ISO 8601 格式，直接返回
  if (dateStr.includes('T')) {
    return dateStr
  }

  // 将空格替换为 T，转换为 ISO 8601 格式
  // "2025-10-22 11:35:45" → "2025-10-22T11:35:45"
  return dateStr.replace(' ', 'T')
}

/**
 * 安全地解析日期字符串
 * @param dateStr 日期字符串
 * @returns Date 对象，如果解析失败返回 null
 */
export const parseDate = (dateStr: string | undefined | null): Date | null => {
  if (!dateStr) {
    return null
  }

  // 转换为 iOS 兼容格式再解析
  const isoDate = toIOSCompatibleDate(dateStr)
  if (!isoDate) {
    return null
  }

  const date = new Date(isoDate)

  // 检查是否为有效的日期
  if (isNaN(date.getTime())) {
    console.warn('⚠️ 无效的日期格式:', dateStr)
    return null
  }

  return date
}

/**
 * 格式化日期为本地格式
 * @param dateStr 日期字符串
 * @param format 格式字符串，如 "yyyy-MM-dd HH:mm"
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  dateStr: string | undefined | null,
  format: string = 'yyyy-MM-dd HH:mm'
): string => {
  const date = parseDate(dateStr)
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
