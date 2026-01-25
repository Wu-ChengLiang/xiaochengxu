/**
 * 时间槽处理逻辑测试
 * 验证 API 返回的 10 分钟粒度数据的正确处理
 */

// 模拟 API 返回的数据格式
interface TimeSlot {
  time: string
  available: boolean
  status?: 'available' | 'busy' | 'break'
}

/**
 * 将 API 返回的平铺时间槽数组按小时分组
 * @param slots API 返回的完整时间槽列表（72个 10分钟粒度）
 * @returns 按小时分组的二维数组
 */
function groupSlotsByHour(slots: TimeSlot[]): TimeSlot[][] {
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

describe('时间槽处理逻辑', () => {
  describe('groupSlotsByHour - 按小时分组', () => {
    test('应该正确分组完整的 72 个时间槽', () => {
      // 模拟 API 返回的完整数据
      const apiSlots: TimeSlot[] = []
      for (let hour = 9; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          apiSlots.push({
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            available: true,
            status: 'available'
          })
        }
      }

      const result = groupSlotsByHour(apiSlots)

      // 应该有 13 个小时（9-21）
      expect(result.length).toBe(13)

      // 每个小时应该有 6 个时间槽（:00, :10, :20, :30, :40, :50）
      result.forEach((hourSlots, index) => {
        expect(hourSlots.length).toBe(6)

        // 验证时间格式正确
        const hour = 9 + index
        const hourStr = hour.toString().padStart(2, '0')
        hourSlots.forEach((slot, slotIndex) => {
          const expectedMinute = slotIndex * 10
          const expectedTime = `${hourStr}:${expectedMinute.toString().padStart(2, '0')}`
          expect(slot.time).toBe(expectedTime)
        })
      })
    })

    test('应该正确处理有预约冲突的时间槽', () => {
      // 模拟 09:30-10:30 被占用的情况
      const apiSlots: TimeSlot[] = [
        { time: '09:00', available: true, status: 'available' },
        { time: '09:10', available: true, status: 'available' },
        { time: '09:20', available: true, status: 'available' },
        { time: '09:30', available: false, status: 'busy' },
        { time: '09:40', available: false, status: 'busy' },
        { time: '09:50', available: false, status: 'busy' },
        { time: '10:00', available: false, status: 'busy' },
        { time: '10:10', available: false, status: 'busy' },
        { time: '10:20', available: false, status: 'busy' },
        { time: '10:30', available: true, status: 'available' },
        { time: '10:40', available: true, status: 'available' },
        { time: '10:50', available: true, status: 'available' },
      ]

      const result = groupSlotsByHour(apiSlots)

      // 第一个小时（9点）应该有 6 个槽
      expect(result[0].length).toBe(6)
      expect(result[0][0].available).toBe(true)   // 09:00
      expect(result[0][1].available).toBe(true)   // 09:10
      expect(result[0][2].available).toBe(true)   // 09:20
      expect(result[0][3].available).toBe(false)  // 09:30
      expect(result[0][4].available).toBe(false)  // 09:40
      expect(result[0][5].available).toBe(false)  // 09:50

      // 第二个小时（10点）应该有 6 个槽
      expect(result[1].length).toBe(6)
      expect(result[1][0].available).toBe(false)  // 10:00
      expect(result[1][1].available).toBe(false)  // 10:10
      expect(result[1][2].available).toBe(false)  // 10:20
      expect(result[1][3].available).toBe(true)   // 10:30
      expect(result[1][4].available).toBe(true)   // 10:40
      expect(result[1][5].available).toBe(true)   // 10:50
    })

    test('应该正确处理 9 点可用的情况', () => {
      const apiSlots: TimeSlot[] = [
        { time: '09:00', available: true, status: 'available' },
        { time: '09:10', available: true, status: 'available' },
        { time: '09:20', available: true, status: 'available' },
        { time: '09:30', available: true, status: 'available' },
        { time: '09:40', available: true, status: 'available' },
        { time: '09:50', available: true, status: 'available' },
      ]

      const result = groupSlotsByHour(apiSlots)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0][0].time).toBe('09:00')
      expect(result[0][0].available).toBe(true)
    })

    test('应该正确处理 10:10 的可用性', () => {
      const apiSlots: TimeSlot[] = [
        { time: '10:00', available: true, status: 'available' },
        { time: '10:10', available: true, status: 'available' },
        { time: '10:20', available: true, status: 'available' },
      ]

      const result = groupSlotsByHour(apiSlots)

      expect(result[0][1].time).toBe('10:10')
      expect(result[0][1].available).toBe(true)
    })

    test('应该直接使用 API 返回的 available 状态，不做推断', () => {
      // 关键测试：即使 10:00 不可用，10:10 也可能可用
      const apiSlots: TimeSlot[] = [
        { time: '10:00', available: false, status: 'busy' },
        { time: '10:10', available: true, status: 'available' },  // 这是 API 返回的真实状态
        { time: '10:20', available: false, status: 'busy' },
      ]

      const result = groupSlotsByHour(apiSlots)

      // 不应该因为 10:00 不可用就推断 10:10 也不可用
      expect(result[0][1].available).toBe(true)
      expect(result[0][1].status).toBe('available')
    })
  })
})
