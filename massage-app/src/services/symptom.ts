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