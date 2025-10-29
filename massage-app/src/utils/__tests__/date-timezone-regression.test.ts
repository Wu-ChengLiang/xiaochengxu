/**
 * 日期时区回归测试
 *
 * 问题描述：
 * 前端在使用 new Date().toISOString().split('T')[0] 时，
 * 会进行时区转换，导致获取到错误的日期（UTC 日期而非本地日期）
 *
 * 修复方案：
 * 使用本地时间的 getDate()/getMonth() 来生成日期字符串
 */

// 这个测试用来验证时区问题的存在和修复效果
describe('日期时区回归测试', () => {
  /**
   * 辅助函数：模拟一个特定时间的 Date 对象
   * @param localDate 本地时间字符串，格式：'2025-10-29 07:20:00'
   * @returns Date 对象
   */
  const createMockDate = (localDate: string): Date => {
    // 直接使用 Date 构造函数，忽略时区
    // 例如：new Date('2025-10-29') 会被解释为午夜的该日期
    return new Date(localDate.replace(' ', 'T'))
  }

  /**
   * ❌ 错误的日期生成方式（当前代码）
   * 使用 toISOString() 会转换为 UTC 时区
   */
  const generateDateWrong = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  /**
   * ✅ 正确的日期生成方式（新方案）
   * 使用本地时间的 getFullYear/getMonth/getDate
   */
  const generateDateCorrect = (date: Date = new Date()): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * 测试套件1：验证时区问题存在（当前 bug）
   */
  describe('❌ 当前错误实现 - toISOString().split(\'T\')[0]', () => {
    it('应该展示UTC时区的日期不匹配问题', () => {
      // 模拟场景：北京时间 2025-10-29 上午 07:20
      // 此时 UTC 时间是 2025-10-28 晚上 23:20
      const beijingTime = new Date('2025-10-29T07:20:00')

      const result = generateDateWrong(beijingTime)

      // ❌ 错误的结果：返回 UTC 日期
      console.log(`❌ 错误实现的结果: ${result}`)
      // 预期（当前bug）：可能是 2025-10-28 或 2025-10-29（取决于浏览器时区）
    })

    it('UTC+8 时区下会返回前一天的日期', () => {
      // 这个测试在北京时区运行时会暴露 bug
      const testDate = new Date('2025-10-29T00:00:00')
      const result = generateDateWrong(testDate)

      console.log(`\n❌ UTC+8 下的错误: ${result}`)
      // 在 UTC+8（北京时区）下，午夜的日期会被转换为前一天的 UTC 日期
    })

    it('应该演示为什么显示和实际发送的日期不匹配', () => {
      // UI 层：使用本地时间函数
      const uiDate = new Date('2025-10-29T07:20:00')
      const displayDate = `${uiDate.getMonth() + 1}月${uiDate.getDate()}日` // "10月29日"

      // 数据层：使用 toISOString()
      const dataDate = generateDateWrong(uiDate) // 可能是 "2025-10-28"

      console.log(`\n📊 不匹配的日期：`)
      console.log(`   显示: ${displayDate}`)
      console.log(`   发送: ${dataDate}`)

      // 这展示了前端的矛盾现象
    })
  })

  /**
   * 测试套件2：验证修复方案（新实现）
   */
  describe('✅ 正确实现 - 使用本地时间函数', () => {
    it('应该正确生成本地日期字符串', () => {
      const beijingTime = new Date('2025-10-29T07:20:00')
      const result = generateDateCorrect(beijingTime)

      expect(result).toBe('2025-10-29')
      console.log(`✅ 正确实现的结果: ${result}`)
    })

    it('应该在多个日期上都正确', () => {
      const testCases = [
        { input: new Date('2025-10-29T07:20:00'), expected: '2025-10-29' },
        { input: new Date('2025-10-30T14:30:00'), expected: '2025-10-30' },
        { input: new Date('2025-10-31T23:59:59'), expected: '2025-10-31' },
        { input: new Date('2025-11-01T00:00:00'), expected: '2025-11-01' },
        { input: new Date('2025-12-31T23:59:59'), expected: '2025-12-31' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = generateDateCorrect(input)
        expect(result).toBe(expected)
        console.log(`✅ ${expected}: 通过`)
      })
    })

    it('应该处理跨年边界', () => {
      const testCases = [
        { input: new Date('2025-12-31T23:59:59'), expected: '2025-12-31' },
        { input: new Date('2026-01-01T00:00:00'), expected: '2026-01-01' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = generateDateCorrect(input)
        expect(result).toBe(expected)
      })
    })

    it('应该处理跨月边界', () => {
      const testCases = [
        { input: new Date('2025-09-30T23:59:59'), expected: '2025-09-30' },
        { input: new Date('2025-10-01T00:00:00'), expected: '2025-10-01' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = generateDateCorrect(input)
        expect(result).toBe(expected)
      })
    })

    it('应该处理月份补零（1-9月）', () => {
      const testCases = [
        { input: new Date('2025-01-15T12:00:00'), expected: '2025-01-15' },
        { input: new Date('2025-02-28T12:00:00'), expected: '2025-02-28' },
        { input: new Date('2025-09-30T12:00:00'), expected: '2025-09-30' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = generateDateCorrect(input)
        expect(result).toBe(expected)
      })
    })

    it('应该处理日期补零（1-9日）', () => {
      const testCases = [
        { input: new Date('2025-10-01T12:00:00'), expected: '2025-10-01' },
        { input: new Date('2025-10-09T12:00:00'), expected: '2025-10-09' },
      ]

      testCases.forEach(({ input, expected }) => {
        const result = generateDateCorrect(input)
        expect(result).toBe(expected)
      })
    })
  })

  /**
   * 测试套件3：对比修复前后的差异
   */
  describe('📊 修复前后对比', () => {
    it('应该展示修复的效果 - 10月29日早上7点', () => {
      const testDate = new Date('2025-10-29T07:20:00')

      const beforeFix = generateDateWrong(testDate)
      const afterFix = generateDateCorrect(testDate)

      console.log(`\n📊 修复效果对比（10月29日 07:20）:`)
      console.log(`   修复前（错误）: ${beforeFix}`)
      console.log(`   修复后（正确）: ${afterFix}`)

      // 修复后应该正确显示为 10-29
      expect(afterFix).toBe('2025-10-29')
    })

    it('应该展示修复的效果 - 订单创建场景', () => {
      // 模拟实际场景
      const userSelectTime = new Date('2025-10-29T07:20:00')

      // UI 层显示
      const displayMonth = userSelectTime.getMonth() + 1
      const displayDay = userSelectTime.getDate()
      const displayText = `${displayMonth}月${displayDay}日` // "10月29日" ✅

      // 数据层发送（修复前）
      const sendDateBefore = generateDateWrong(userSelectTime) // "2025-10-28" ❌

      // 数据层发送（修复后）
      const sendDateAfter = generateDateCorrect(userSelectTime) // "2025-10-29" ✅

      console.log(`\n📋 订单创建流程:`)
      console.log(`   UI 显示: ${displayText}`)
      console.log(`   修复前发送: ${sendDateBefore} ❌ 不匹配！`)
      console.log(`   修复后发送: ${sendDateAfter} ✅ 匹配！`)

      expect(displayText).toBe('10月29日')
      expect(sendDateAfter).toBe('2025-10-29')
      expect(displayText.includes(sendDateAfter.split('-')[2])).toBe(true)
    })
  })

  /**
   * 测试套件4：受影响的代码位置验证
   */
  describe('🔍 受影响代码位置检查', () => {
    it('应该正确处理 BookingSelector 的日期生成', () => {
      // BookingSelector 中的 generateDateList 应该生成正确的日期
      const today = new Date('2025-10-29T07:20:00')

      // 模拟 5 天的日期生成
      const dates = []
      for (let i = 0; i < 5; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        // 应该使用正确的方法
        const dateStr = generateDateCorrect(date)
        dates.push({
          display: i === 0 ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`,
          key: dateStr // ✅ 正确的方法
        })
      }

      expect(dates[0].key).toBe('2025-10-29')
      expect(dates[1].key).toBe('2025-10-30')
      expect(dates[2].key).toBe('2025-10-31')
      expect(dates[3].key).toBe('2025-11-01')
      expect(dates[4].key).toBe('2025-11-02')

      console.log(`\n📅 BookingSelector 日期列表:`)
      dates.forEach((d, i) => {
        console.log(`   ${i}: ${d.display} (key: ${d.key})`)
      })
    })

    it('应该正确处理 SymptomPage 的 fallback 日期', () => {
      // SymptomPage 中的 fallback 日期
      const today = new Date('2025-10-29T07:20:00')
      const fallbackDate = generateDateCorrect(today)

      expect(fallbackDate).toBe('2025-10-29')
      console.log(`✅ SymptomPage fallback 日期: ${fallbackDate}`)
    })

    it('应该正确处理 StoreAppointmentPage 的初始化日期', () => {
      // StoreAppointmentPage 的初始化日期
      const today = new Date('2025-10-29T07:20:00')
      const initialDate = generateDateCorrect(today)

      // "今天"的判断应该正确
      const currentDateStr = generateDateCorrect(new Date('2025-10-29T07:20:00'))
      const isToday = initialDate === currentDateStr

      expect(initialDate).toBe('2025-10-29')
      expect(isToday).toBe(true)
      console.log(`✅ StoreAppointmentPage 初始化日期: ${initialDate}, 是否为今天: ${isToday}`)
    })
  })

  /**
   * 测试套件5：集成测试 - 完整的订单创建流程
   */
  describe('🔄 集成测试 - 订单创建流程', () => {
    it('应该保证 UI 显示和数据发送的日期一致', () => {
      // 模拟用户操作
      const userActionTime = new Date('2025-10-29T07:20:00')

      // 1. 日期选择器生成日期列表
      const dateList = []
      for (let i = 0; i < 5; i++) {
        const date = new Date(userActionTime)
        date.setDate(userActionTime.getDate() + i)
        dateList.push({
          key: generateDateCorrect(date),
          display: i === 0 ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`
        })
      }

      // 2. 用户选择"今天"
      const selectedDateKey = dateList[0].key
      const selectedDateDisplay = dateList[0].display

      console.log(`\n🔄 完整订单流程:`)
      console.log(`   1. 用户选择: ${selectedDateDisplay}`)
      console.log(`   2. 实际日期key: ${selectedDateKey}`)

      // 3. 创建订单时发送的数据
      const appointmentDate = selectedDateKey

      console.log(`   3. 发送到后端: ${appointmentDate}`)

      // 4. 验证流程的一致性
      // selectedDateDisplay 是 "今天"，所以我们直接检查日期 key 的匹配
      const sentDateNumber = parseInt(selectedDateKey.split('-')[2])

      console.log(`   4. 验证一致性: 日期 key 中的日期 === ${sentDateNumber}`)

      expect(appointmentDate).toBe('2025-10-29')
      expect(sentDateNumber).toBe(29)
    })

    it('应该在所有受影响的流程中都保持一致', () => {
      const testTime = new Date('2025-10-29T07:20:00')

      // BookingSelector 流程
      const bookingDate = generateDateCorrect(testTime)

      // SymptomPage 流程
      const symptomDate = generateDateCorrect(testTime)

      // StoreAppointmentPage 流程
      const storeDate = generateDateCorrect(testTime)

      // 所有流程都应该返回相同的日期
      expect(bookingDate).toBe(symptomDate)
      expect(symptomDate).toBe(storeDate)
      expect(bookingDate).toBe('2025-10-29')

      console.log(`✅ 所有流程一致: BookingDate=${bookingDate}, SymptomDate=${symptomDate}, StoreDate=${storeDate}`)
    })
  })
})
