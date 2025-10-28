import { View, ScrollView, Text, Image } from '@tarojs/components'
import SymptomServiceCard from '../SymptomServiceCard'
import './index.scss'

interface TherapistTimeSlot {
  time: string
  available: boolean
}

interface TherapistDayAvailability {
  date: string
  dayOfWeek: string
  workTime: string
  slots: TherapistTimeSlot[]
}

interface SymptomService {
  id: string
  name: string
  description: string
  duration: number
  price: number
  discountPrice?: number
  availability: 'available' | 'busy' | 'full'
  therapistId?: string
}

interface Therapist {
  id: string
  name: string
  avatar: string
  rating: number
  level?: number
  availability?: TherapistDayAvailability[]
}

interface SymptomServiceListProps {
  services: SymptomService[]
  therapists: Therapist[]
  selectedDate: string
  selectedTime: string
  onAddToCart: (service: SymptomService, therapistId: string) => void
  cartServiceIds: string[]
  className?: string
}

const SymptomServiceList: React.FC<SymptomServiceListProps> = ({
  services,
  therapists,
  selectedDate,
  selectedTime,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  // 检查技师在指定日期/时间是否有空
  const isTherapistAvailable = (therapist: Therapist): boolean => {
    // 检查必要数据
    if (!therapist.availability) {
      console.warn('技师排班数据缺失:', therapist.id)
      return true // 无排班数据，无法判断，标记为可用（用户可尝试预约）
    }

    if (!selectedDate || !selectedTime) {
      console.warn('未选择日期或时间', { selectedDate, selectedTime })
      return true // 参数缺失，无法判断，标记为可用
    }

    // 查找指定日期的排班
    const dayAvailability = therapist.availability.find(a => a.date === selectedDate)
    if (!dayAvailability) {
      console.warn(`技师 ${therapist.id} 在 ${selectedDate} 无排班数据`)
      return true // 没有该日期数据，表示无排班或休息，标记为可用（提示用户）
    }

    // 查找指定时段
    const slot = dayAvailability.slots.find(s => s.time === selectedTime)

    // 关键修改：不再有默认值
    // - 如果找到时段，返回其可用状态
    // - 如果找不到时段，说明该时段不在排班范围内，返回 false（不可用）
    if (!slot) {
      console.warn(`技师 ${therapist.id} 在 ${selectedDate} ${selectedTime} 无此时段`, {
        availableSlots: dayAvailability.slots.map(s => s.time)
      })
      return false // 时段不存在，标记为不可用
    }

    return slot.available
  }

  // 按服务显示，每个服务显示所有可选推拿师
  const servicesWithTherapists = services.map(service => {
    return {
      service,
      availableTherapists: therapists // 所有推拿师都可以提供该服务
    }
  })

  return (
    <ScrollView
      className={`symptom-service-list ${className || ''}`}
      scrollY
      showScrollbar={false}
    >
      <View className="service-list-content">
        {servicesWithTherapists.map((item) => (
          <View key={item.service.id} className="service-item-container">
            {/* 服务卡片 */}
            <SymptomServiceCard
              service={item.service}
              onAdd={() => {}} // 暂时禁用直接添加
              isInCart={cartServiceIds.includes(item.service.id)}
            />

            {/* 推拿师区域 */}
            <View className="therapist-options">
              {item.availableTherapists.map(therapist => {
                const available = isTherapistAvailable(therapist)
                return (
                  <View
                    key={therapist.id}
                    className={`therapist-option ${available ? 'available' : 'booked'}`}
                    onClick={() => available && onAddToCart(item.service, therapist.id)}
                  >
                    {/* 头像容器 */}
                    <View className="therapist-avatar-wrapper">
                      <Image
                        className="therapist-mini-avatar"
                        src={therapist.avatar}
                        mode="aspectFill"
                      />
                      {/* 已预约标签 */}
                      {!available && (
                        <View className="booked-badge">
                          <Text className="badge-text">已预约</Text>
                        </View>
                      )}
                    </View>
                    <Text className="therapist-name">{therapist.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default SymptomServiceList