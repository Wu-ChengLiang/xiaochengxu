import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import './index.scss'

interface TherapistHeaderProps {
  therapist: {
    id: string
    name: string
    avatar: string
    level: number
    rating: number
  }
  onDetailClick?: () => void
  className?: string
}

const TherapistHeader: React.FC<TherapistHeaderProps> = ({
  therapist,
  onDetailClick,
  className
}) => {
  return (
    <View className={classNames('therapist-header', className)}>
      <View className="therapist-info">
        <Image 
          className="therapist-avatar" 
          src={therapist.avatar}
          mode="aspectFill"
        />
        <View className="therapist-details">
          <View className="therapist-name-row">
            <Text className="therapist-name">{therapist.name}</Text>
            <Text className="therapist-level">LV{therapist.level}</Text>
          </View>
          <Text className="therapist-rating">{therapist.rating}分</Text>
        </View>
      </View>
      <View className="detail-link" onClick={onDetailClick}>
        <Text>查看详情</Text>
        <Text className="iconfont icon-right"></Text>
      </View>
    </View>
  )
}

export default TherapistHeader