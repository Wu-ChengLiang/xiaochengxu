import { symptomCategories } from '../mock/data/symptoms'
import { request } from '@/utils/request'

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
    if (!storeId) {
      throw new Error('门店ID不能为空')
    }

    try {
      // 从门店详情API获取服务列表
      const storeData = await request(`/stores/${storeId}`)
      const services = storeData.data.services || []

      // 智能分配服务到各个分类，确保分布均匀
      const categorizedServices = services.map((service: any) => {
        const name = service.name
        let categoryId = '1' // 默认分类

        // 根据服务特征精准分类
        if (name.includes('颈肩') || name.includes('腰背') || name.includes('腰腿痛')) {
          categoryId = '1' // 颈肩腰腿痛调理
        } else if (name.includes('肝') || name.includes('肺') || name.includes('脾胃')) {
          categoryId = '2' // 肝胆脾胃调理
        } else if (name.includes('精油') || name.includes('SPA') || name.includes('芳香')) {
          categoryId = '3' // 失眠调理
        } else if (name.includes('铺姜') || name.includes('宫寒')) {
          categoryId = '4' // 宫寒痛经调理
        } else if (name.includes('拔罐') || name.includes('刮痧')) {
          categoryId = '5' // 腙筋根骶
        } else if (name.includes('肌肉') || name.includes('放松') || name.includes('疏通')) {
          categoryId = '6' // 运动拉伸
        } else if (name.includes('整脊') || name.includes('体态')) {
          categoryId = '7' // 体态调理
        } else if (name.includes('关元灸') || name.includes('悬灸')) {
          categoryId = '2' // 艾灸类归到肝胆脾胃调理
        } else if (name.includes('全身')) {
          categoryId = '6' // 全身推拿归到运动拉伸
        }

        return {
          ...service,
          categoryId,
          availability: 'available',
          description: service.name
        }
      })

      return {
        code: 200,
        data: categorizedServices,
        message: 'success'
      }
    } catch (error) {
      console.error('获取门店服务失败:', error)
      // 返回空数组而不是抛出错误
      return {
        code: 200,
        data: [],
        message: 'success'
      }
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