import { useState, useEffect, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import TherapistHeader from '../../../components/TherapistHeader'
import SymptomCategoryTabs from '../../../components/SymptomCategoryTabs'
import SymptomServiceList from '../../../components/SymptomServiceList'
import ShoppingCart from '../therapist/components/ShoppingCart'
import { symptomService } from '../../../services/symptom'
import { therapistService } from '../../../services/therapist'
import './index.scss'

interface CartItem {
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistName: string
  therapistAvatar?: string
}

const SymptomPage = () => {
  const router = useRouter()
  const { storeId, storeName, selectedDate, selectedTime } = router.params

  // 解码URL参数中的时间（处理URL编码的冒号）
  const decodedTime = selectedTime ? decodeURIComponent(selectedTime as string) : ''

  const [therapists, setTherapists] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // 获取该门店的所有推拿师
  useEffect(() => {
    if (storeId) {
      therapistService.getTherapistsByStore(storeId as string).then(res => {
        setTherapists(res.list)
      })
    }
  }, [storeId])

  // 获取症状分类
  useEffect(() => {
    symptomService.getCategories().then(res => {
      setCategories(res.data)
      if (res.data.length > 0) {
        setActiveCategoryId(res.data[0].id)
      }
    })
  }, [])

  // 获取该门店所有推拿师的服务列表
  useEffect(() => {
    if (storeId) {
      setLoading(true)
      symptomService.getStoreSymptomServices(storeId as string).then(res => {
        setServices(res.data)
        setLoading(false)
      })
    }
  }, [storeId])

  // 根据分类筛选服务
  const filteredServices = useMemo(() => {
    return services.filter(service => service.categoryId === activeCategoryId)
  }, [services, activeCategoryId])

  // 购物车中的服务ID列表
  const cartServiceIds = useMemo(() => {
    return cartItems.map(item => item.serviceId)
  }, [cartItems])

  // 添加到购物车
  const handleAddToCart = (service: any, therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId)
    if (!therapist) return

    const newItem: CartItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: selectedDate as string || new Date().toISOString().split('T')[0],
      time: decodedTime || '10:00',  // 使用解码后的时间，默认10:00
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    }

    setCartItems([...cartItems, newItem])

    Taro.showToast({
      title: '已添加到购物车',
      icon: 'none'
    })
  }


  // 去结算
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Taro.showToast({
        title: '请先选择服务项目',
        icon: 'none'
      })
      return
    }

    const params = {
      items: JSON.stringify(cartItems),
      storeId,
      storeName,
      from: 'symptom'
    }

    Taro.navigateTo({
      url: `/pages/booking/confirm/index?${Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`
    })
  }

  if (loading) {
    return <View className="symptom-page loading">加载中...</View>
  }

  return (
    <View className="symptom-page">

      {/* 主内容区 */}
      <View className="symptom-content">
        {/* 左侧分类标签 */}
        <SymptomCategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        {/* 右侧服务列表 - 按推拿师分组展示 */}
        <SymptomServiceList
          services={filteredServices}
          therapists={therapists}
          onAddToCart={handleAddToCart}
          cartServiceIds={cartServiceIds}
        />
      </View>

      {/* 底部购物车 */}
      <ShoppingCart
        items={cartItems}
        onCheckout={handleCheckout}
      />
    </View>
  )
}

export default SymptomPage