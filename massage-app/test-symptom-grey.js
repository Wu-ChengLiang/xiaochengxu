/**
 * 症状页面灰显逻辑测试脚本
 * 这是一个独立的 Node.js 测试，模拟后端 API 数据来验证灰显逻辑
 */

// 模拟后端返回的排班数据
const mockTherapists = [
  {
    id: '104',
    name: '朴老师',
    avatar: 'https://example.com/therapist-104.jpg',
    rating: 4.8,
    availability: [
      {
        date: '2025-10-28',
        dayOfWeek: '周二',
        workTime: '9:00-21:00',
        slots: [
          { time: '09:00', available: true },
          { time: '10:00', available: false }, // ❌ 已被预约
          { time: '11:00', available: true },
          { time: '12:00', available: false }, // ❌ 已被预约
          { time: '13:00', available: true }
        ]
      }
    ]
  },
  {
    id: '105',
    name: '张师傅',
    avatar: 'https://example.com/therapist-105.jpg',
    rating: 4.6,
    availability: [
      {
        date: '2025-10-28',
        dayOfWeek: '周二',
        workTime: '9:00-21:00',
        slots: [
          { time: '09:00', available: true },
          { time: '10:00', available: true },
          { time: '11:00', available: true },
          { time: '12:00', available: true },
          { time: '13:00', available: true }
        ]
      }
    ]
  }
]

/**
 * 灰显判断函数（从 SymptomServiceList 组件提取）
 */
function isTherapistAvailable(therapist, selectedDate, selectedTime) {
  // 检查必要数据
  if (!therapist.availability) {
    console.warn(`⚠️  技师 ${therapist.id} 排班数据缺失`)
    return true // 无排班数据，无法判断，标记为可用
  }

  if (!selectedDate || !selectedTime) {
    console.warn(`⚠️  未选择日期或时间 (date: ${selectedDate}, time: ${selectedTime})`)
    return true // 参数缺失，无法判断，标记为可用
  }

  // 查找指定日期的排班
  const dayAvailability = therapist.availability.find(a => a.date === selectedDate)
  if (!dayAvailability) {
    console.warn(`⚠️  技师 ${therapist.id} 在 ${selectedDate} 无排班数据`)
    return true // 没有该日期数据，表示无排班或休息
  }

  // 查找指定时段
  const slot = dayAvailability.slots.find(s => s.time === selectedTime)

  if (!slot) {
    console.warn(
      `⚠️  技师 ${therapist.id} 在 ${selectedDate} ${selectedTime} 无此时段\n` +
      `   可用时段: ${dayAvailability.slots.map(s => s.time).join(', ')}`
    )
    return false // 时段不存在，标记为不可用
  }

  return slot.available
}

// ============================================
// 测试用例
// ============================================

console.log('\n==================== 症状页面灰显逻辑测试 ====================\n')

const tests = [
  {
    name: '测试1：朴老师在10:00已被预约 → 应该灰显',
    selectedDate: '2025-10-28',
    selectedTime: '10:00',
    therapistId: '104',
    expectedResult: false
  },
  {
    name: '测试2：张师傅在10:00可用 → 应该白显',
    selectedDate: '2025-10-28',
    selectedTime: '10:00',
    therapistId: '105',
    expectedResult: true
  },
  {
    name: '测试3：朴老师在11:00可用 → 应该白显',
    selectedDate: '2025-10-28',
    selectedTime: '11:00',
    therapistId: '104',
    expectedResult: true
  },
  {
    name: '测试4：朴老师在12:00已被预约 → 应该灰显',
    selectedDate: '2025-10-28',
    selectedTime: '12:00',
    therapistId: '104',
    expectedResult: false
  },
  {
    name: '测试5：张师傅在12:00可用 → 应该白显',
    selectedDate: '2025-10-28',
    selectedTime: '12:00',
    therapistId: '105',
    expectedResult: true
  },
  {
    name: '测试6：选择14:00（不在排班范围内）→ 应该灰显',
    selectedDate: '2025-10-28',
    selectedTime: '14:00',
    therapistId: '104',
    expectedResult: false
  },
  {
    name: '测试7：selectedTime为空 → 应该白显（降级处理）',
    selectedDate: '2025-10-28',
    selectedTime: '',
    therapistId: '104',
    expectedResult: true
  },
  {
    name: '测试8：selectedDate为空 → 应该白显（降级处理）',
    selectedDate: '',
    selectedTime: '10:00',
    therapistId: '104',
    expectedResult: true
  }
]

let passedCount = 0
let failedCount = 0

tests.forEach((test, index) => {
  const therapist = mockTherapists.find(t => t.id === test.therapistId)
  const result = isTherapistAvailable(therapist, test.selectedDate, test.selectedTime)
  const isAvailable = result ? '白显（可用）' : '灰显（不可用）'
  const expectedStatus = test.expectedResult ? '白显（可用）' : '灰显（不可用）'

  const passed = result === test.expectedResult
  const status = passed ? '✅ PASS' : '❌ FAIL'

  console.log(`${status} | ${test.name}`)
  console.log(`     实际结果: ${isAvailable}`)
  console.log(`     期望结果: ${expectedStatus}`)
  console.log()

  if (passed) {
    passedCount++
  } else {
    failedCount++
  }
})

// ============================================
// 汇总
// ============================================

console.log('='.repeat(60))
console.log(`\n📊 测试结果汇总:`)
console.log(`   ✅ 通过: ${passedCount}/${tests.length}`)
console.log(`   ❌ 失败: ${failedCount}/${tests.length}`)
console.log()

if (failedCount === 0) {
  console.log('🎉 所有测试通过！灰显逻辑工作正常。\n')
  process.exit(0)
} else {
  console.log('⚠️  部分测试失败，请检查灰显逻辑。\n')
  process.exit(1)
}
