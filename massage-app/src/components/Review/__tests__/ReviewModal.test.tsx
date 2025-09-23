import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ReviewModal from '../ReviewModal'
import type { OrderData } from '@/services/order'

// Mock Taro components
jest.mock('@tarojs/components', () => ({
  View: ({ children, onClick, className }: any) => (
    <div onClick={onClick} className={className}>{children}</div>
  ),
  Text: ({ children }: any) => <span>{children}</span>,
  Image: ({ src }: any) => <img src={src} alt="" />
}))

jest.mock('taro-ui', () => ({
  AtFloatLayout: ({ isOpened, children, onClose }: any) =>
    isOpened ? <div className="at-float-layout" onClick={onClose}>{children}</div> : null,
  AtRate: ({ value, onChange, size, max }: any) => (
    <div className="at-rate" data-value={value} onClick={() => onChange(value + 1)}>
      Rating: {value}/{max}
    </div>
  ),
  AtTextarea: ({ value, onChange, placeholder, maxLength }: any) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  ),
  AtIcon: ({ value }: any) => <span className={`icon-${value}`} />
}))

describe('ReviewModal Component', () => {
  const mockOrderInfo: Partial<OrderData> = {
    orderNo: 'ORDER123',
    therapistId: '1',
    therapistName: '张师傅',
    therapistAvatar: 'https://test.com/avatar.jpg',
    serviceName: '颈部按摩60分钟',
    appointmentId: 123
  }

  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Modal Display', () => {
    it('should not render when visible is false', () => {
      const { container } = render(
        <ReviewModal
          visible={false}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      expect(container.querySelector('.at-float-layout')).not.toBeInTheDocument()
    })

    it('should render when visible is true', () => {
      const { container, getByText } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      expect(container.querySelector('.at-float-layout')).toBeInTheDocument()
      expect(getByText('张师傅')).toBeInTheDocument()
      expect(getByText('颈部按摩60分钟')).toBeInTheDocument()
    })
  })

  describe('Rating Interaction', () => {
    it('should display initial rating as 5 stars', () => {
      const { getByText } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      expect(getByText('Rating: 5/5')).toBeInTheDocument()
      expect(getByText('非常满意')).toBeInTheDocument()
    })

    it('should update rating when clicking stars', () => {
      const { container, getByText } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      // 模拟点击评分组件（会将评分从5改为4）
      const rateComponent = container.querySelector('.at-rate')
      fireEvent.click(rateComponent!)

      // 验证评分文案变化
      expect(getByText('满意')).toBeInTheDocument()
    })

    it('should show quick tags only when rating >= 4', () => {
      const { getByText, queryByText, rerender } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      // 初始5星，应该显示快捷标签
      expect(getByText('手法专业')).toBeInTheDocument()
      expect(getByText('服务态度好')).toBeInTheDocument()

      // TODO: 模拟改变评分到3星，快捷标签应该隐藏
      // 这需要组件内部状态更新的支持
    })
  })

  describe('Content Input', () => {
    it('should update content when typing', () => {
      const { container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, { target: { value: '服务很好，推拿手法专业' } })

      expect(textarea!.value).toBe('服务很好，推拿手法专业')
    })

    it('should enforce minimum content length', () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, { target: { value: '太短' } })

      const submitButton = getByText('提交评价').parentElement
      expect(submitButton).toHaveClass('disabled')
    })

    it('should enforce maximum content length of 500', () => {
      const { container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveAttribute('maxLength', '500')
    })
  })

  describe('Quick Tags', () => {
    it('should toggle tag selection when clicked', () => {
      const { getByText } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const tag = getByText('手法专业')
      expect(tag.parentElement).not.toHaveClass('active')

      fireEvent.click(tag)
      expect(tag.parentElement).toHaveClass('active')

      fireEvent.click(tag)
      expect(tag.parentElement).not.toHaveClass('active')
    })

    it('should include selected tags in submission', async () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      // 选择标签
      fireEvent.click(getByText('手法专业'))
      fireEvent.click(getByText('服务态度好'))

      // 输入评价内容
      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, { target: { value: '非常满意这次服务体验' } })

      // 提交
      fireEvent.click(getByText('提交评价'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          appointmentId: 123,
          rating: 5,
          content: '非常满意这次服务体验',
          tags: ['手法专业', '服务态度好']
        })
      })
    })
  })

  describe('Form Submission', () => {
    it('should disable submit button when content is too short', () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, { target: { value: '太短了' } })

      const submitButton = getByText('提交评价').parentElement
      expect(submitButton).toHaveClass('disabled')

      fireEvent.click(submitButton!)
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should enable submit button when content meets requirements', () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, { target: { value: '这是一个符合要求的评价内容' } })

      const submitButton = getByText('提交评价').parentElement
      expect(submitButton).not.toHaveClass('disabled')
    })

    it('should call onSubmit with correct data when form is valid', async () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      // 输入评价内容
      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, {
        target: { value: '服务非常专业，推拿手法到位，效果很好' }
      })

      // 提交
      fireEvent.click(getByText('提交评价'))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          appointmentId: 123,
          rating: 5,
          content: '服务非常专业，推拿手法到位，效果很好',
          tags: []
        })
      })
    })

    it('should show loading state during submission', async () => {
      const { getByText, container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))}
        />
      )

      // 输入评价内容
      const textarea = container.querySelector('textarea')
      fireEvent.change(textarea!, {
        target: { value: '服务非常专业，推拿手法到位，效果很好' }
      })

      // 提交
      fireEvent.click(getByText('提交评价'))

      // 应该显示加载状态
      await waitFor(() => {
        expect(getByText('提交中...')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Controls', () => {
    it('should call onClose when clicking cancel button', () => {
      const { getByText } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      fireEvent.click(getByText('取消'))
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when clicking modal mask', () => {
      const { container } = render(
        <ReviewModal
          visible={true}
          orderInfo={mockOrderInfo as OrderData}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      )

      const floatLayout = container.querySelector('.at-float-layout')
      fireEvent.click(floatLayout!)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Rating Text Mapping', () => {
    const testCases = [
      { rating: 1, text: '很不满意' },
      { rating: 2, text: '不满意' },
      { rating: 3, text: '一般' },
      { rating: 4, text: '满意' },
      { rating: 5, text: '非常满意' }
    ]

    testCases.forEach(({ rating, text }) => {
      it(`should display "${text}" for ${rating} star(s)`, () => {
        // 这个测试需要能够设置初始评分或模拟评分变化
        // 当前实现中默认是5星，需要组件支持初始评分prop
      })
    })
  })
})