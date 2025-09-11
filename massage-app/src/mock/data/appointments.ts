import type { Appointment } from '@/types'

// 模拟预约数据
export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-001',
    userId: 'user-001',
    storeId: 'store-011',
    storeName: '名医堂•颈肩腰腿特色调理（世纪公园店）',
    therapistId: 'therapist-101',
    therapistName: '宋老师',
    serviceId: 'service-001',
    serviceName: '颈肩调理',
    appointmentTime: '2024-01-15T14:00:00.000Z',
    duration: 60,
    price: 128,
    discountPrice: 98,
    status: 'confirmed',
    createdAt: '2024-01-10T10:00:00.000Z',
    qrCode: 'QR001_15012024_1400'
  },
  {
    id: 'appointment-002', 
    userId: 'user-001',
    storeId: 'store-027',
    storeName: '名医堂•颈肩腰腿特色调理（东方路店）',
    therapistId: 'therapist-104',
    therapistName: '朴老师',
    serviceId: 'service-003',
    serviceName: '足底按摩',
    appointmentTime: '2024-01-12T16:30:00.000Z',
    duration: 45,
    price: 88,
    status: 'completed',
    createdAt: '2024-01-08T09:30:00.000Z',
    qrCode: 'QR002_12012024_1630'
  },
  {
    id: 'appointment-003',
    userId: 'user-001',
    storeId: 'store-011',
    storeName: '名医堂•颈肩腰腿特色调理（世纪公园店）',
    therapistId: 'therapist-102',
    therapistName: '钟老师', 
    serviceId: 'service-002',
    serviceName: '全身推拿',
    appointmentTime: '2024-01-18T10:00:00.000Z',
    duration: 90,
    price: 198,
    discountPrice: 158,
    status: 'pending',
    createdAt: '2024-01-12T15:20:00.000Z',
    qrCode: 'QR003_18012024_1000'
  },
  {
    id: 'appointment-004',
    userId: 'user-002',
    storeId: 'store-027',
    storeName: '名医堂•颈肩腰腿特色调理（东方路店）',
    therapistId: 'therapist-105',
    therapistName: '杨老师',
    serviceId: 'service-004',
    serviceName: '拔罐刮痧',
    appointmentTime: '2024-01-16T15:00:00.000Z',
    duration: 30,
    price: 68,
    discountPrice: 58,
    status: 'confirmed',
    createdAt: '2024-01-11T11:45:00.000Z',
    qrCode: 'QR004_16012024_1500'
  },
  {
    id: 'appointment-005',
    userId: 'user-001',
    storeId: 'store-011',
    storeName: '名医堂•颈肩腰腿特色调理（世纪公园店）',
    therapistId: 'therapist-103',
    therapistName: '马老师',
    serviceId: 'service-005',
    serviceName: '中医理疗',
    appointmentTime: '2024-01-09T13:30:00.000Z',
    duration: 120,
    price: 298,
    discountPrice: 238,
    status: 'cancelled',
    createdAt: '2024-01-05T16:10:00.000Z',
    qrCode: 'QR005_09012024_1330'
  }
]

// 按用户ID获取预约记录
export const getAppointmentsByUserId = (userId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.userId === userId)
}

// 按推拿师ID获取预约记录
export const getAppointmentsByTherapistId = (therapistId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.therapistId === therapistId)
}

// 按门店ID获取预约记录
export const getAppointmentsByStoreId = (storeId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.storeId === storeId)
}