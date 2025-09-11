// 推拿师可预约时间数据
export interface TimeSlot {
  time: string
  available: boolean
  bookedBy?: string // 如果已被预约，记录预约ID
}

export interface DayAvailability {
  date: string
  timeSlots: TimeSlot[]
}

export interface TherapistAvailability {
  therapistId: string
  availability: DayAvailability[]
}

// 生成时间段（每10分钟一个）
const generateTimeSlots = (startHour: number = 9, endHour: number = 21): TimeSlot[] => {
  const slots: TimeSlot[] = []
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      // 模拟可用性：
      // 1. 午休时间(12:00-13:30)不可用
      // 2. 随机一些时段已被预约
      let available = true
      let bookedBy: string | undefined
      
      if (hour === 12 || (hour === 13 && minute < 30)) {
        available = false // 午休时间
      } else if (Math.random() < 0.3) {
        available = false // 30%的时段已被预约
        bookedBy = `appointment-${Math.floor(Math.random() * 1000)}`
      }
      
      slots.push({
        time,
        available,
        bookedBy
      })
    }
  }
  
  return slots
}

// 生成接下来7天的可预约时间
const generateWeekAvailability = (): DayAvailability[] => {
  const availability: DayAvailability[] = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    availability.push({
      date: date.toISOString().split('T')[0],
      timeSlots: generateTimeSlots()
    })
  }
  
  return availability
}

// 推拿师可预约时间数据
export const therapistAvailability: TherapistAvailability[] = [
  {
    therapistId: 'therapist-101',
    availability: generateWeekAvailability()
  },
  {
    therapistId: 'therapist-102', 
    availability: generateWeekAvailability()
  },
  {
    therapistId: 'therapist-103',
    availability: generateWeekAvailability()
  },
  {
    therapistId: 'therapist-104',
    availability: generateWeekAvailability()
  },
  {
    therapistId: 'therapist-105',
    availability: generateWeekAvailability()
  }
  // 可以为更多推拿师生成数据
]

// 获取指定推拿师的可预约时间
export const getTherapistAvailability = (therapistId: string): TherapistAvailability | null => {
  return therapistAvailability.find(item => item.therapistId === therapistId) || null
}

// 获取指定推拿师指定日期的可预约时间
export const getTherapistDayAvailability = (therapistId: string, date: string): TimeSlot[] => {
  const availability = getTherapistAvailability(therapistId)
  if (!availability) return []
  
  const dayAvailability = availability.availability.find(day => day.date === date)
  return dayAvailability?.timeSlots || []
}

// 预约时间段（模拟预约操作）
export const bookTimeSlot = (therapistId: string, date: string, time: string, appointmentId: string): boolean => {
  const availability = getTherapistAvailability(therapistId)
  if (!availability) return false
  
  const dayAvailability = availability.availability.find(day => day.date === date)
  if (!dayAvailability) return false
  
  const timeSlot = dayAvailability.timeSlots.find(slot => slot.time === time)
  if (!timeSlot || !timeSlot.available) return false
  
  // 标记为已预约
  timeSlot.available = false
  timeSlot.bookedBy = appointmentId
  
  return true
}

// 取消预约时间段
export const cancelTimeSlot = (therapistId: string, date: string, time: string): boolean => {
  const availability = getTherapistAvailability(therapistId)
  if (!availability) return false
  
  const dayAvailability = availability.availability.find(day => day.date === date)
  if (!dayAvailability) return false
  
  const timeSlot = dayAvailability.timeSlots.find(slot => slot.time === time)
  if (!timeSlot) return false
  
  // 释放时间段
  timeSlot.available = true
  timeSlot.bookedBy = undefined
  
  return true
}