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
  id?: string  // 唯一标识符（可选，向后兼容）
  serviceId: string
  serviceName: string
  duration: number
  price: number
  discountPrice?: number
  date: string
  time: string
  therapistId: string
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

  // 获取该门店的所有推拿师 + 排班信息
  useEffect(() => {
    if (storeId && selectedDate) {
      const fetchTherapists = async () => {
        try {
          // 并行获取两个数据源
          const [basicInfo, availabilityData] = await Promise.all([
            therapistService.getTherapistsByStore(storeId as string),
            therapistService.getTherapistsAvailability(
              storeId as string,
              selectedDate as string
            )
          ])

          // 合并基本信息和排班数据
          const merged = basicInfo.list.map(therapist => {
            const availabilityTherapist = availabilityData.find((a: any) => a.id === therapist.id)
            return {
              ...therapist,
              availability: availabilityTherapist?.availability || []
            }
          })

          console.log('✅ 技师数据合并成功:', merged)
          setTherapists(merged)
        } catch (error) {
          console.error('❌ 获取技师信息失败:', error)
          // Fallback: 只使用基本信息
          therapistService.getTherapistsByStore(storeId as string).then(res => {
            setTherapists(res.list)
          })
        }
      }

      fetchTherapists()
    }
  }, [storeId, selectedDate])

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
    console.log('🎯 添加到购物车 - therapistId:', therapistId)
    const therapist = therapists.find(t => t.id === therapistId)
    console.log('🎯 找到的技师:', therapist)

    if (!therapist) {
      console.error('❌ 未找到技师，therapistId:', therapistId)
      return
    }

    const newItem: CartItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: selectedDate as string || new Date().toISOString().split('T')[0],
      time: decodedTime || '10:00',  // 使用解码后的时间，默认10:00
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    }

    console.log('🎯 新购物车项目:', newItem)
    console.log('🎯 新项目的therapistId:', newItem.therapistId)

    setCartItems([...cartItems, newItem])

    Taro.showToast({
      title: '已添加到购物车',
      icon: 'none'
    })
  }


  // 去结算
  // 清空购物车
  const handleClearCart = () => {
    setCartItems([])
    Taro.showToast({
      title: '购物车已清空',
      icon: 'none'
    })
  }

  // 删除单个商品
  const handleRemoveItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newItems)
    Taro.showToast({
      title: '已移除商品',
      icon: 'none'
    })
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Taro.showToast({
        title: '请先选择服务项目',
        icon: 'none'
      })
      return
    }

    console.log('🔄 准备结算，购物车内容:', cartItems)
    console.log('🔄 第一个项目:', cartItems[0])
    console.log('🔄 第一个项目的therapistId:', cartItems[0]?.therapistId)

    const params = {
      items: JSON.stringify(cartItems),
      storeId,
      storeName,
      from: 'symptom'
    }

    console.log('🔄 传递的参数:', params)

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
          selectedDate={selectedDate as string}
          selectedTime={decodedTime}
          onAddToCart={handleAddToCart}
          cartServiceIds={cartServiceIds}
        />
      </View>

      {/* 底部购物车 */}
      <ShoppingCart
        items={cartItems}
        onCheckout={handleCheckout}
        onMaskClick={handleClearCart}
        onRemoveItem={handleRemoveItem}
        simpleClearMode={true}
      />
    </View>
  )
}

export default SymptomPage