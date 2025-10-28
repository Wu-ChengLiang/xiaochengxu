import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import SymptomServiceList from '../index'

// Mock Taro components
jest.mock('@tarojs/components', () => ({
  View: ({ children, className, onClick }: any) => (
    <div className={className} onClick={onClick}>{children}</div>
  ),
  Text: ({ children }: any) => <span>{children}</span>,
  Image: ({ src, className }: any) => <img src={src} className={className} alt="" />,
  ScrollView: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  )
}))

describe('SymptomServiceList - 灰显逻辑测试', () => {
  // 模拟后端API返回的排班数据（来自 /api/v2/stores/:storeId/therapists/availability）
  const mockTherapists = [
    {
      id: '104',
      name: '朴老师',
      avatar: 'https://example.com/therapist-104.jpg',
      rating: 4.8,
      level: 3,
      availability: [
        {
          date: '2025-10-28',
          dayOfWeek: '周二',
          workTime: '9:00-21:00',
          slots: [
            { time: '09:00', available: true },
            { time: '10:00', available: false }, // 已被预约
            { time: '11:00', available: true },
            { time: '12:00', available: false }, // 已被预约
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
      level: 2,
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

  const mockServices = [
    {
      id: '1',
      name: '肩颈调理',
      description: '60分钟肩颈按摩',
      duration: 60,
      price: 188,
      availability: 'available' as const
    }
  ]

  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('灰显判断 - 选中 10:00 时间', () => {
    it('测试1：朴老师在10:00已被预约 → 应该灰显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="10:00" // ✅ 选择 10:00
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      // 找到"朴老师"的技师选项
      const therapistOptions = container.querySelectorAll('.therapist-option')
      const paoLaoshiOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('朴老师')
      )

      // 验证朴老师在 10:00 应该是灰显状态（booked）
      expect(paoLaoshiOption).toHaveClass('booked')
      expect(paoLaoshiOption).not.toHaveClass('available')
      console.log('✅ 测试1通过：朴老师 10:00 灰显（已预约）')
    })

    it('测试2：张师傅在10:00可用 → 应该白显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const zhangShifuOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('张师傅')
      )

      // 验证张师傅在 10:00 应该是可用状态（available）
      expect(zhangShifuOption).toHaveClass('available')
      expect(zhangShifuOption).not.toHaveClass('booked')
      console.log('✅ 测试2通过：张师傅 10:00 白显（可用）')
    })

    it('测试3：朴老师在11:00可用 → 应该白显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="11:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const paoLaoshiOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('朴老师')
      )

      // 验证朴老师在 11:00 应该是可用状态
      expect(paoLaoshiOption).toHaveClass('available')
      expect(paoLaoshiOption).not.toHaveClass('booked')
      console.log('✅ 测试3通过：朴老师 11:00 白显（可用）')
    })
  })

  describe('灰显判断 - 选中 12:00 时间', () => {
    it('测试4：朴老师在12:00已被预约 → 应该灰显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="12:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const paoLaoshiOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('朴老师')
      )

      expect(paoLaoshiOption).toHaveClass('booked')
      expect(paoLaoshiOption).not.toHaveClass('available')
      console.log('✅ 测试4通过：朴老师 12:00 灰显（已预约）')
    })

    it('测试5：张师傅在12:00可用 → 应该白显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="12:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const zhangShifuOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('张师傅')
      )

      expect(zhangShifuOption).toHaveClass('available')
      expect(zhangShifuOption).not.toHaveClass('booked')
      console.log('✅ 测试5通过：张师傅 12:00 白显（可用）')
    })
  })

  describe('灰显判断 - 时段不存在的情况', () => {
    it('测试6：选择 14:00（不在排班范围内）→ 应该灰显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="14:00" // ⚠️ 不在 slots 中
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')

      // 两个技师都应该灰显，因为该时段不存在
      therapistOptions.forEach(option => {
        expect(option).toHaveClass('booked')
        expect(option).not.toHaveClass('available')
      })
      console.log('✅ 测试6通过：时段不存在，所有技师灰显')
    })
  })

  describe('灰显判断 - 参数缺失的情况', () => {
    it('测试7：selectedTime为空 → 应该所有技师白显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="" // ⚠️ 时间参数缺失
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')

      // 参数缺失时，所有技师都白显（无法判断）
      therapistOptions.forEach(option => {
        expect(option).toHaveClass('available')
        expect(option).not.toHaveClass('booked')
      })
      console.log('✅ 测试7通过：参数缺失，所有技师白显（降级处理）')
    })

    it('测试8：selectedDate为空 → 应该所有技师白显', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="" // ⚠️ 日期参数缺失
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')

      therapistOptions.forEach(option => {
        expect(option).toHaveClass('available')
        expect(option).not.toHaveClass('booked')
      })
      console.log('✅ 测试8通过：日期缺失，所有技师白显（降级处理）')
    })
  })

  describe('灰显判断 - 无排班数据的情况', () => {
    it('测试9：技师无排班数据 → 应该白显（降级处理）', () => {
      const therapistsWithoutAvailability = [
        {
          id: '106',
          name: '李师傅',
          avatar: 'https://example.com/therapist-106.jpg',
          rating: 4.5,
          level: 2
          // ⚠️ 没有 availability 字段
        }
      ]

      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={therapistsWithoutAvailability as any}
          selectedDate="2025-10-28"
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')

      therapistOptions.forEach(option => {
        expect(option).toHaveClass('available')
      })
      console.log('✅ 测试9通过：无排班数据，白显（降级处理）')
    })
  })

  describe('点击预约按钮', () => {
    it('测试10：点击可用技师 → 应该调用 onAddToCart', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const zhangShifuOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('张师傅')
      ) as HTMLElement

      // 点击可用的技师
      zhangShifuOption.click()

      // 验证调用了 onAddToCart
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockServices[0], '105')
      console.log('✅ 测试10通过：点击可用技师成功调用预约')
    })

    it('测试11：点击已预约技师 → 不应该调用 onAddToCart', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      const therapistOptions = container.querySelectorAll('.therapist-option')
      const paoLaoshiOption = Array.from(therapistOptions).find(el =>
        el.textContent?.includes('朴老师')
      ) as HTMLElement

      // 点击已预约的技师
      paoLaoshiOption.click()

      // 不应该调用 onAddToCart（因为 available=false）
      expect(mockOnAddToCart).not.toHaveBeenCalled()
      console.log('✅ 测试11通过：已预约技师不可点击')
    })
  })

  describe('灰显标签显示', () => {
    it('测试12：已预约技师应该显示"已预约"标签', () => {
      const { container } = render(
        <SymptomServiceList
          services={mockServices}
          therapists={mockTherapists}
          selectedDate="2025-10-28"
          selectedTime="10:00"
          onAddToCart={mockOnAddToCart}
          cartServiceIds={[]}
        />
      )

      // 查找朴老师的"已预约"标签
      const bookedBadges = container.querySelectorAll('.booked-badge')
      expect(bookedBadges.length).toBeGreaterThan(0)

      const badgeText = container.querySelector('.badge-text')
      expect(badgeText?.textContent).toBe('已预约')
      console.log('✅ 测试12通过：灰显技师显示"已预约"标签')
    })
  })
})
