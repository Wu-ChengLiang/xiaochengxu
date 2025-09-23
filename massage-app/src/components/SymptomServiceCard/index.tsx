import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface SymptomServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    duration: number
    price: number
    discountPrice?: number
    availability: 'available' | 'busy' | 'full'
  }
  onAdd: () => void
  isInCart?: boolean
  className?: string
}

const SymptomServiceCard: React.FC<SymptomServiceCardProps> = ({
  service,
  onAdd,
  isInCart = false,
  className
}) => {
  return (
    <View className={classNames('symptom-service-card', className)}>
      <View className="service-header">
        <Text className="service-name">{service.name}</Text>
      </View>
      
      <Text className="service-description">{service.description}</Text>
      
      <View className="service-footer">
        <View className="service-info">
          <Text className="service-duration">{service.duration}分钟</Text>
          <View className="service-price">
            <Text className="price-current">¥{service.discountPrice || service.price}</Text>
            {service.discountPrice && (
              <Text className="price-original">¥{service.price}</Text>
            )}
          </View>
        </View>
        
        <View 
          className={classNames('add-button', {
            'in-cart': isInCart,
            'disabled': service.availability === 'full'
          })}
          onClick={service.availability !== 'full' ? onAdd : undefined}
        >
          {service.availability === 'full' ? (
            <Text className="button-text">已满</Text>
          ) : (
            <Text className="iconfont icon-add"></Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default SymptomServiceCard