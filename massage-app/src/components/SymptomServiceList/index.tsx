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
    if (!therapist.availability || !selectedDate || !selectedTime) {
      return true // 无排班数据时，默认可用
    }

    const dayAvailability = therapist.availability.find(a => a.date === selectedDate)
    if (!dayAvailability) {
      return true // 没有该日期数据，默认可用
    }

    const slot = dayAvailability.slots.find(s => s.time === selectedTime)
    return slot?.available ?? true // 默认可用
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