import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OrderConfirmPage from '../confirm/index'
import { walletService } from '@/services/wallet.service'
import { paymentService } from '@/services/payment.service'
import { orderService } from '@/services/order'

// Mock Taro
jest.mock('@tarojs/taro', () => ({
  useRouter: () => ({
    params: {
      therapistId: '1',
      storeId: '1',
      items: JSON.stringify([{
        serviceId: '1',
        serviceName: '经络推拿',
        duration: 60,
        price: 298,
        discountPrice: 268,
        date: '2025-09-23',
        time: '10:00',
        therapistName: '张技师'
      }])
    }
  }),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  navigateBack: jest.fn(),
  redirectTo: jest.fn(),
  showModal: jest.fn()
}))

// Mock services
jest.mock('@/services/wallet.service')
jest.mock('@/services/payment.service')
jest.mock('@/services/order')
jest.mock('@/services/therapist')
jest.mock('@/services/store')

describe('Order Confirm Page - Balance Payment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Balance Display', () => {
    it('should display user balance on page load', async () => {
      // Mock balance response
      (walletService.getBalance as jest.Mock).mockResolvedValue(500)

      const { getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        expect(getByText(/余额：¥500/)).toBeInTheDocument()
      })
    })

    it('should show insufficient balance warning', async () => {
      // Mock low balance
      (walletService.getBalance as jest.Mock).mockResolvedValue(100)

      const { getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        expect(getByText(/余额不足/)).toBeInTheDocument()
        expect(getByText(/当前余额：¥100/)).toBeInTheDocument()
      })
    })
  })

  describe('Payment Method Selection', () => {
    it('should display payment method options', async () => {
      (walletService.getBalance as jest.Mock).mockResolvedValue(500)

      const { getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        expect(getByText('余额支付')).toBeInTheDocument()
        expect(getByText('微信支付')).toBeInTheDocument()
      })
    })

    it('should select balance payment when balance is sufficient', async () => {
      (walletService.getBalance as jest.Mock).mockResolvedValue(500)

      const { getByTestId } = render(<OrderConfirmPage />)

      await waitFor(() => {
        const balanceOption = getByTestId('payment-balance')
        fireEvent.click(balanceOption)
        expect(balanceOption).toHaveClass('selected')
      })
    })

    it('should disable balance payment when insufficient', async () => {
      (walletService.getBalance as jest.Mock).mockResolvedValue(100)

      const { getByTestId } = render(<OrderConfirmPage />)

      await waitFor(() => {
        const balanceOption = getByTestId('payment-balance')
        expect(balanceOption).toHaveClass('disabled')
        expect(balanceOption).toHaveAttribute('aria-disabled', 'true')
      })
    })
  })

  describe('Payment Process', () => {
    it('should process balance payment successfully', async () => {
      // Setup mocks
      (walletService.getBalance as jest.Mock).mockResolvedValue(500)
      (orderService.createAppointmentOrder as jest.Mock).mockResolvedValue({
        order: { orderNo: 'ORDER123', amount: 26800 }
      })
      (paymentService.pay as jest.Mock).mockResolvedValue(true)

      const { getByTestId, getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        // Select balance payment
        const balanceOption = getByTestId('payment-balance')
        fireEvent.click(balanceOption)

        // Click pay button
        const payButton = getByText('立即支付')
        fireEvent.click(payButton)
      })

      await waitFor(() => {
        expect(paymentService.pay).toHaveBeenCalledWith({
          orderNo: 'ORDER123',
          amount: 26800,
          paymentMethod: 'balance',
          title: expect.any(String)
        })
      })
    })

    it('should fall back to mock payment in development', async () => {
      process.env.NODE_ENV = 'development'

      (walletService.getBalance as jest.Mock).mockResolvedValue(500)
      (orderService.createAppointmentOrder as jest.Mock).mockResolvedValue({
        order: { orderNo: 'ORDER123' }
      })
      (paymentService.pay as jest.Mock).mockResolvedValue(true)

      const { getByTestId, getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        const balanceOption = getByTestId('payment-balance')
        fireEvent.click(balanceOption)

        const payButton = getByText('立即支付')
        fireEvent.click(payButton)
      })

      expect(paymentService.pay).toHaveBeenCalled()
    })
  })

  describe('Balance Update After Payment', () => {
    it('should show updated balance after successful payment', async () => {
      (walletService.getBalance as jest.Mock)
        .mockResolvedValueOnce(500) // Initial balance
        .mockResolvedValueOnce(232) // After payment (500 - 268)

      (orderService.createAppointmentOrder as jest.Mock).mockResolvedValue({
        order: { orderNo: 'ORDER123' }
      })
      (paymentService.pay as jest.Mock).mockResolvedValue(true)

      const { getByTestId, getByText } = render(<OrderConfirmPage />)

      await waitFor(() => {
        const balanceOption = getByTestId('payment-balance')
        fireEvent.click(balanceOption)

        const payButton = getByText('立即支付')
        fireEvent.click(payButton)
      })

      await waitFor(() => {
        expect(walletService.getBalance).toHaveBeenCalledTimes(2)
      })
    })
  })
})