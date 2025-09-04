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
  const { therapistId, therapistName, storeId, storeName } = router.params

  const [therapist, setTherapist] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // 获取推拿师信息
  useEffect(() => {
    if (therapistId) {
      therapistService.getTherapistDetail(therapistId as string).then(res => {
        setTherapist(res.data)
      })
    }
  }, [therapistId])

  // 获取症状分类
  useEffect(() => {
    symptomService.getCategories().then(res => {
      setCategories(res.data)
      if (res.data.length > 0) {
        setActiveCategoryId(res.data[0].id)
      }
    })
  }, [])

  // 获取服务列表
  useEffect(() => {
    if (therapistId) {
      setLoading(true)
      symptomService.getTherapistSymptomServices(therapistId as string).then(res => {
        setServices(res.data)
        setLoading(false)
      })
    }
  }, [therapistId])

  // 根据分类筛选服务
  const filteredServices = useMemo(() => {
    return services.filter(service => service.categoryId === activeCategoryId)
  }, [services, activeCategoryId])

  // 购物车中的服务ID列表
  const cartServiceIds = useMemo(() => {
    return cartItems.map(item => item.serviceId)
  }, [cartItems])

  // 添加到购物车
  const handleAddToCart = (service: any) => {
    if (!therapist) return

    const newItem: CartItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: new Date().toISOString(),
      time: '待选择',
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    }

    setCartItems([...cartItems, newItem])

    Taro.showToast({
      title: '已添加到购物车',
      icon: 'none'
    })
  }

  // 查看推拿师详情
  const handleViewDetail = () => {
    Taro.navigateTo({
      url: `/pages/appointment/therapist/index?id=${therapistId}&storeId=${storeId}&storeName=${storeName}`
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
      therapistId,
      therapistName,
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

  if (!therapist) {
    return <View className="symptom-page loading">加载中...</View>
  }

  return (
    <View className="symptom-page">
      {/* 推拿师信息头部 */}
      <TherapistHeader
        therapist={{
          id: therapist.id,
          name: therapist.name,
          avatar: therapist.avatar,
          level: therapist.level || 3,
          rating: therapist.rating
        }}
        onDetailClick={handleViewDetail}
      />

      {/* 主内容区 */}
      <View className="symptom-content">
        {/* 左侧分类标签 */}
        <SymptomCategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />

        {/* 右侧服务列表 */}
        <SymptomServiceList
          services={filteredServices}
          onAddToCart={handleAddToCart}
          cartServiceIds={cartServiceIds}
        />
      </View>

      {/* 底部购物车 */}
      <ShoppingCart
        items={cartItems}
        therapist={therapist}
        onCheckout={handleCheckout}
      />
    </View>
  )
}

export default SymptomPage