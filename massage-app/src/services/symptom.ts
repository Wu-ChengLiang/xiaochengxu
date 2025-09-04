import { symptomCategories, symptomServices, getTherapistSymptomServices } from '../mock/data/symptoms'

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
    
    // 模拟获取门店所有推拿师的服务
    // 实际应该根据门店ID获取所有推拿师，然后汇总他们的服务
    const allServices: any[] = []
    
    // 模拟数据：假设该门店有多个推拿师，每个推拿师有自己的服务
    const mockTherapistIds = ['therapist-001', 'therapist-002']
    
    mockTherapistIds.forEach(therapistId => {
      const services = getTherapistSymptomServices(therapistId)
      services.forEach(service => {
        allServices.push({
          ...service,
          therapistId // 添加推拿师ID以便展示时分组
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