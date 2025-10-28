import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import { getLocationService } from '@/services/location'
import { storeService } from '@/services/store'
import { therapistService } from '@/services/therapist'
import StoreCard from '@/components/StoreCard'
import TherapistCard from '@/components/TherapistCard'
import BottomSheet from '@/components/BottomSheet'
import type { Store, Therapist } from '@/types'
import './index.scss'


const Appointment: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState<Store[]>([])
  const [allStores, setAllStores] = useState<Store[]>([])  // 所有门店数据
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [showStoreSheet, setShowStoreSheet] = useState(false)  // 控制门店弹出层
  const [searchValue, setSearchValue] = useState('')  // 搜索框值

  // 更多技师相关状态
  const [showTherapistSheet, setShowTherapistSheet] = useState(false)  // 控制技师弹出层
  const [therapistSearchValue, setTherapistSearchValue] = useState('')  // 技师搜索框值
  const [searchedTherapists, setSearchedTherapists] = useState<Therapist[]>([])  // 搜索结果
  const [therapistLoading, setTherapistLoading] = useState(false)  // 技师搜索加载状态
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)  // 用户位置


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // 获取用户位置
      const location = await getLocationService.getCurrentLocation()
      setUserLocation(location)  // 保存用户位置，供搜索时使用

      // 获取附近门店（只显示最近的2家）
      try {
        const nearbyStores = await storeService.getNearbyStores(
          location.latitude,
          location.longitude,
          1,
          2
        )
        setStores(nearbyStores.list)
      } catch (error) {
        console.error('❌ 获取附近门店失败:', error)
        Taro.showToast({
          title: '获取附近门店失败，请检查网络',
          icon: 'none'
        })
        setStores([])
      }

      // 获取所有门店数据（用于更多门店）
      try {
        const allStoresData = await storeService.getNearbyStores(
          location.latitude,
          location.longitude,
          1,
          20  // 获取更多数据
        )
        setAllStores(allStoresData.list)
      } catch (error) {
        console.error('❌ 获取所有门店失败:', error)
        setAllStores([])
      }

      // 获取推荐推拿师（使用新的带距离计算的方法）
      try {
        const recommendedTherapists = await therapistService.getRecommendedTherapistsWithDistance(
          1,
          10
        )
        setTherapists(recommendedTherapists.list)
      } catch (error) {
        console.error('❌ 获取推荐推拿师失败:', error)
        Taro.showToast({
          title: '获取推拿师列表失败，请检查网络',
          icon: 'none'
        })
        setTherapists([])
      }

    } catch (error) {
      console.error('❌ 加载页面数据失败:', error)

      Taro.showToast({
        title: '页面加载失败，请刷新重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStoreClick = (store: Store) => {
    Taro.navigateTo({
      url: `/pages/appointment/store/index?id=${store.id}`
    })
  }

  const handleTherapistClick = (therapist: Therapist) => {
    // 跳转到推拿师预约页面
    Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${therapist.id}&storeId=${therapist.storeId}`
    })
  }



  const handleMoreStores = () => {
    setShowStoreSheet(true)
  }

  // 打开更多技师弹出层
  const handleMoreTherapists = () => {
    setShowTherapistSheet(true)
    setTherapistSearchValue('')
    setSearchedTherapists([])
  }

  // 计算技师的距离
  const calculateTherapistDistances = async (therapists: Therapist[]) => {
    if (!userLocation) return therapists

    try {
      const therapistsWithDistance = await Promise.all(
        therapists.map(async (therapist) => {
          try {
            const storeData = await storeService.getStoreDetail(therapist.storeId)
            const store = storeData?.data || storeData

            let distance: number | null = null
            if (store?.latitude && store?.longitude) {
              distance = getLocationService.calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                store.latitude,
                store.longitude
              )
            }

            return { ...therapist, distance }
          } catch (error) {
            console.warn(`获取技师 ${therapist.id} 门店信息失败:`, error)
            return { ...therapist, distance: null }
          }
        })
      )

      return therapistsWithDistance
    } catch (error) {
      console.error('计算距离失败:', error)
      return therapists
    }
  }

  // 搜索技师
  const handleTherapistSearch = async (keyword: string) => {
    setTherapistSearchValue(keyword)

    if (keyword.trim() === '') {
      setSearchedTherapists([])
      return
    }

    try {
      setTherapistLoading(true)

      // 调用搜索 API，获取前 10 个结果
      const result = await therapistService.searchTherapists(
        keyword,
        1,    // page
        10    // pageSize - 只获取前 10 个
      )

      console.log('✅ 搜索技师结果:', result)

      // 补充距离信息
      const therapistsWithDistance = await calculateTherapistDistances(result.list || [])

      setSearchedTherapists(therapistsWithDistance)
    } catch (error) {
      console.error('搜索技师失败:', error)
      Taro.showToast({
        title: '搜索失败，请重试',
        icon: 'none'
      })
      setSearchedTherapists([])
    } finally {
      setTherapistLoading(false)
    }
  }

  return (
    <View className="appointment-page">
      {/* 门店预约 */}
      <View className="stores-section">
        <View className="section-header">
          <Text className="section-title">门店预约</Text>
          <Text className="more-link" onClick={handleMoreStores}>
            更多门店
            <AtIcon value="chevron-right" size="14" color="#a40035" />
          </Text>
        </View>
        <View className="store-list">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onClick={() => handleStoreClick(store)}
            />
          ))}
        </View>
      </View>
      
      {/* 推拿师预约 */}
      <View className="therapists-section">
        <View className="section-header">
          <Text className="section-title">推拿师预约</Text>
          <Text className="more-link" onClick={handleMoreTherapists}>
            更多技师
            <AtIcon value="chevron-right" size="14" color="#a40035" />
          </Text>
        </View>
        <View className="therapist-list">
          {therapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              onClick={() => handleTherapistClick(therapist)}
            />
          ))}
        </View>
      </View>
      
      {/* 更多门店弹出层 */}
      <BottomSheet
        visible={showStoreSheet}
        title="更多门店"
        onClose={() => setShowStoreSheet(false)}
        height="80%"
      >
        {/* 城市选择和搜索框 */}
        <View className="store-sheet-header">
          <View className="city-selector">
            <Text className="city-name">上海市</Text>
            <Text className="city-arrow">▼</Text>
          </View>
          <View className="search-box">
            <AtIcon value="search" size="16" color="#999" />
            <Input 
              className="search-input"
              placeholder="搜索门店"
              value={searchValue}
              onInput={(e) => setSearchValue(e.detail.value)}
            />
          </View>
        </View>
        
        {/* 门店列表 */}
        <View className="store-sheet-list">
          {allStores
            .filter(store => 
              searchValue === '' || 
              store.name.includes(searchValue) || 
              store.address.includes(searchValue)
            )
            .map((store) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                onClick={() => {
                  handleStoreClick(store)
                  setShowStoreSheet(false)
                }}
              />
            ))
          }
        </View>
      </BottomSheet>

      {/* 更多技师弹出层 */}
      <BottomSheet
        visible={showTherapistSheet}
        title="更多技师"
        onClose={() => setShowTherapistSheet(false)}
        height="80%"
      >
        {/* 搜索框 */}
        <View className="therapist-sheet-header">
          <View className="search-box">
            <AtIcon value="search" size="16" color="#999" />
            <Input
              className="search-input"
              placeholder="搜索推拿师"
              value={therapistSearchValue}
              onInput={(e) => handleTherapistSearch(e.detail.value)}
            />
          </View>
        </View>

        {/* 加载状态 */}
        {therapistLoading && (
          <View className="therapist-sheet-list loading">
            <Text>搜索中...</Text>
          </View>
        )}

        {/* 搜索结果列表 */}
        {!therapistLoading && (
          <View className="therapist-sheet-list">
            {therapistSearchValue === '' ? (
              // 未搜索时的提示
              <View className="empty-state">
                <Text>请输入推拿师名称进行搜索</Text>
              </View>
            ) : searchedTherapists.length === 0 ? (
              // 搜索无结果
              <View className="empty-state">
                <Text>未找到匹配的推拿师</Text>
              </View>
            ) : (
              // 搜索结果
              searchedTherapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onClick={() => {
                    handleTherapistClick(therapist)
                    setShowTherapistSheet(false)
                  }}
                />
              ))
            )}
          </View>
        )}
      </BottomSheet>
    </View>
  )
}

export default Appointment