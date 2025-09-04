import { View, Text, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface Category {
  id: string
  name: string
}

interface SymptomCategoryTabsProps {
  categories: Category[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

const SymptomCategoryTabs: React.FC<SymptomCategoryTabsProps> = ({
  categories,
  activeId,
  onChange,
  className
}) => {
  return (
    <ScrollView 
      className={classNames('symptom-category-tabs', className)}
      scrollY
      showScrollbar={false}
    >
      {categories.map((category) => (
        <View
          key={category.id}
          className={classNames('category-item', {
            'active': category.id === activeId
          })}
          onClick={() => onChange(category.id)}
        >
          <Text className="category-name">{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default SymptomCategoryTabs