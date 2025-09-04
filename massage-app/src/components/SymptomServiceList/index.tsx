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
  // 按推拿师分组服务
  const groupedServices = therapists.map(therapist => {
    const therapistServices = services.filter(service => service.therapistId === therapist.id)
    return {
      therapist,
      services: therapistServices
    }
  }).filter(group => group.services.length > 0)

  return (
    <ScrollView 
      className={`symptom-service-list ${className || ''}`}
      scrollY
      showScrollbar={false}
    >
      <View className="service-list-content">
        {groupedServices.map((group) => (
          <View key={group.therapist.id} className="therapist-group">
            {/* 推拿师信息头部 */}
            <View className="therapist-header">
              <Image 
                className="therapist-avatar" 
                src={group.therapist.avatar}
                mode="aspectFill"
              />
              <View className="therapist-info">
                <Text className="therapist-name">{group.therapist.name}</Text>
                <Text className="therapist-level">LV{group.therapist.level || 1}</Text>
              </View>
              <View className="therapist-rating">
                <Text className="rating-score">{group.therapist.rating}分</Text>
                <Text className="view-details">查看详情{'>'}</Text>
              </View>
            </View>
            
            {/* 该推拿师的服务列表 */}
            {group.services.map((service) => (
              <SymptomServiceCard
                key={service.id}
                service={service}
                onAdd={() => onAddToCart(service, group.therapist.id)}
                isInCart={cartServiceIds.includes(service.id)}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default SymptomServiceList