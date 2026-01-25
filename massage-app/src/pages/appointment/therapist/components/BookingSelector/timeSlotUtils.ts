/**
 * 时间槽处理工具函数
 * 处理 API 返回的 10 分钟粒度时间槽数据
 */

export interface TimeSlot {
  time: string
  available: boolean
  status?: 'available' | 'busy' | 'break'
}

/**
 * 将 API 返回的平铺时间槽数组按小时分组
 * @param slots API 返回的完整时间槽列表（72个 10分钟粒度）
 * @returns 按小时分组的二维数组
 */
export function groupSlotsByHour(slots: TimeSlot[]): TimeSlot[][] {
  const grid: TimeSlot[][] = []

  for (let hour = 9; hour <= 21; hour++) {
    const hourStr = hour.toString().padStart(2, '0')
    const hourSlots = slots.filter(slot => {
      const slotHour = slot.time.split(':')[0]
      return slotHour === hourStr
    })

    if (hourSlots.length > 0) {
      grid.push(hourSlots)
    }
  }

  return grid
}
