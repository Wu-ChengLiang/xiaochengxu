import { sleep } from '@/utils/common'
import type { Appointment, ApiResponse, PageData } from '@/types'
import { mockAppointments, getAppointmentsByUserId } from '@/mock/data/appointments'
import { getTherapistAvailability, getTherapistDayAvailability, bookTimeSlot, cancelTimeSlot, type TimeSlot } from '@/mock/data/availability'

// 创建预约请求参数
export interface CreateAppointmentParams {
  userId: string
  storeId: string
  storeName: string
  therapistId: string
  therapistName: string
  serviceId: string
  serviceName: string
  appointmentTime: string // ISO格式日期时间
  duration: number
  price: number
  discountPrice?: number
  notes?: string
}

// 预约服务
class AppointmentService {
  // 获取用户预约列表
  async getUserAppointments(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<ApiResponse<PageData<Appointment>>> {
    await sleep(300)
    
    let appointments = getAppointmentsByUserId(userId)
    
    // 按状态筛选
    if (status) {
      appointments = appointments.filter(apt => apt.status === status)
    }
    
    // 按创建时间倒序排序
    appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = appointments.slice(start, end)
    
    return {
      code: 200,
      data: {
        list,
        total: appointments.length,
        page,
        pageSize,
        hasMore: end < appointments.length
      },
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 获取预约详情
  async getAppointmentDetail(appointmentId: string): Promise<ApiResponse<Appointment>> {
    await sleep(200)
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId)
    if (!appointment) {
      throw new Error('预约记录不存在')
    }
    
    return {
      code: 200,
      data: appointment,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 获取推拿师可预约时间
  async getTherapistAvailability(therapistId: string, date?: string): Promise<ApiResponse<TimeSlot[]>> {
    await sleep(300)
    
    if (date) {
      // 获取指定日期的可预约时间
      const timeSlots = getTherapistDayAvailability(therapistId, date)
      return {
        code: 200,
        data: timeSlots,
        message: 'success',
        timestamp: Date.now()
      }
    } else {
      // 获取当天的可预约时间
      const today = new Date().toISOString().split('T')[0]
      const timeSlots = getTherapistDayAvailability(therapistId, today)
      return {
        code: 200,
        data: timeSlots,
        message: 'success',
        timestamp: Date.now()
      }
    }
  }
  
  // 创建预约
  async createAppointment(params: CreateAppointmentParams): Promise<ApiResponse<Appointment>> {
    await sleep(500)
    
    // 验证参数
    if (!params.userId || !params.therapistId || !params.appointmentTime) {
      throw new Error('缺少必需参数')
    }
    
    // 检查时间是否可用
    const appointmentDate = new Date(params.appointmentTime)
    const date = appointmentDate.toISOString().split('T')[0]
    const time = appointmentDate.toTimeString().slice(0, 5)
    
    const availability = getTherapistDayAvailability(params.therapistId, date)
    const timeSlot = availability.find(slot => slot.time === time)
    
    if (!timeSlot || !timeSlot.available) {
      throw new Error('该时间段不可预约')
    }
    
    // 生成预约ID
    const appointmentId = `appointment-${Date.now()}`
    
    // 创建预约记录
    const appointment: Appointment = {
      id: appointmentId,
      userId: params.userId,
      storeId: params.storeId,
      storeName: params.storeName,
      therapistId: params.therapistId,
      therapistName: params.therapistName,
      serviceId: params.serviceId,
      serviceName: params.serviceName,
      appointmentTime: params.appointmentTime,
      duration: params.duration,
      price: params.price,
      discountPrice: params.discountPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      qrCode: `QR${appointmentId.slice(-3)}_${date.replace(/-/g, '')}_${time.replace(':', '')}`
    }
    
    // 预约时间段
    const booked = bookTimeSlot(params.therapistId, date, time, appointmentId)
    if (!booked) {
      throw new Error('预约时间段失败')
    }
    
    // 添加到预约列表
    mockAppointments.push(appointment)
    
    return {
      code: 200,
      data: appointment,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 确认预约
  async confirmAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    await sleep(300)
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId)
    if (!appointment) {
      throw new Error('预约记录不存在')
    }
    
    if (appointment.status !== 'pending') {
      throw new Error('预约状态不正确')
    }
    
    appointment.status = 'confirmed'
    
    return {
      code: 200,
      data: appointment,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 取消预约
  async cancelAppointment(appointmentId: string, reason?: string): Promise<ApiResponse<Appointment>> {
    await sleep(300)
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId)
    if (!appointment) {
      throw new Error('预约记录不存在')
    }
    
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      throw new Error('该预约不能取消')
    }
    
    // 释放时间段
    const appointmentDate = new Date(appointment.appointmentTime)
    const date = appointmentDate.toISOString().split('T')[0]
    const time = appointmentDate.toTimeString().slice(0, 5)
    
    cancelTimeSlot(appointment.therapistId, date, time)
    
    appointment.status = 'cancelled'
    
    return {
      code: 200,
      data: appointment,
      message: 'success',
      timestamp: Date.now()
    }
  }
  
  // 完成预约
  async completeAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    await sleep(300)
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId)
    if (!appointment) {
      throw new Error('预约记录不存在')
    }
    
    if (appointment.status !== 'confirmed') {
      throw new Error('预约状态不正确')
    }
    
    appointment.status = 'completed'
    
    return {
      code: 200,
      data: appointment,
      message: 'success',
      timestamp: Date.now()
    }
  }
}

export const appointmentService = new AppointmentService()
export default appointmentService