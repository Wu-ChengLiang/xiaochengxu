import { symptomCategories, symptomServices, getTherapistSymptomServices } from '../mock/data/symptoms'
import { mockTherapists } from '../mock/data/therapists'

// 模拟网络延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const symptomService = {
  // 获取症状分类
  async getCategories() {
    await sleep(100)
    return {
      code: 200,
      data: symptomCategories,
      message: 'success'
    }
  },

  // 获取推拿师的症状服务列表
  async getTherapistSymptomServices(therapistId: string) {
    await sleep(200)
    
    if (!therapistId) {
      throw new Error('推拿师ID不能为空')
    }
    
    const services = getTherapistSymptomServices(therapistId)
    
    return {
      code: 200,
      data: services,
      message: 'success'
    }
  },

  // 获取门店所有推拿师的症状服务列表
  async getStoreSymptomServices(storeId: string) {
    await sleep(200)
    
    if (!storeId) {
      throw new Error('门店ID不能为空')
    }
    
    // 根据门店ID获取该门店的所有推拿师
    const storeTherapists = mockTherapists.filter(t => t.storeId === storeId)
    
    // 汇总所有推拿师的服务
    const allServices: any[] = []
    
    storeTherapists.forEach(therapist => {
      const services = getTherapistSymptomServices(therapist.id)
      services.forEach(service => {
        allServices.push({
          ...service,
          therapistId: therapist.id, // 添加推拿师ID以便展示时分组
          therapistName: therapist.name, // 添加推拿师名称
          therapistAvatar: therapist.avatar // 添加推拿师头像
        })
      })
    })
    
    return {
      code: 200,
      data: allServices,
      message: 'success'
    }
  },

  // 根据分类ID获取服务列表
  async getServicesByCategory(therapistId: string, categoryId: string) {
    await sleep(150)
    
    const allServices = getTherapistSymptomServices(therapistId)
    const filteredServices = allServices.filter(service => service.categoryId === categoryId)
    
    return {
      code: 200,
      data: filteredServices,
      message: 'success'
    }
  }
}