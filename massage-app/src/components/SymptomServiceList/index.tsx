import { View, ScrollView } from '@tarojs/components'
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
}

interface SymptomServiceListProps {
  services: SymptomService[]
  onAddToCart: (service: SymptomService) => void
  cartServiceIds: string[]
  className?: string
}

const SymptomServiceList: React.FC<SymptomServiceListProps> = ({
  services,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  return (
    <ScrollView 
      className={`symptom-service-list ${className || ''}`}
      scrollY
      showScrollbar={false}
    >
      <View className="service-list-content">
        {services.map((service) => (
          <SymptomServiceCard
            key={service.id}
            service={service}
            onAdd={() => onAddToCart(service)}
            isInCart={cartServiceIds.includes(service.id)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default SymptomServiceList