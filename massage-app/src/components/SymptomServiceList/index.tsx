import { View, ScrollView, Text, Image } from '@tarojs/components'
import SymptomServiceCard from '../SymptomServiceCard'
import './index.scss'

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
}

interface SymptomServiceListProps {
  services: SymptomService[]
  therapists: Therapist[]
  onAddToCart: (service: SymptomService, therapistId: string) => void
  cartServiceIds: string[]
  className?: string
}

const SymptomServiceList: React.FC<SymptomServiceListProps> = ({
  services,
  therapists,
  onAddToCart,
  cartServiceIds,
  className
}) => {
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
              {item.availableTherapists.map(therapist => (
                <View
                  key={therapist.id}
                  className="therapist-option"
                  onClick={() => onAddToCart(item.service, therapist.id)}
                >
                  <Image
                    className="therapist-mini-avatar"
                    src={therapist.avatar}
                    mode="aspectFill"
                  />
                  <Text className="therapist-name">{therapist.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default SymptomServiceList