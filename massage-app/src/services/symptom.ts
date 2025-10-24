import { symptomCategories } from '../mock/data/symptoms'
import { request } from '@/utils/request'

/**
 * 智能分类函数：根据服务名称自动分配到症状分类
 * @param name 服务名称
 * @returns 分类ID
 */
function classifyServiceByName(name: string): string {
  // 优先匹配更具体的关键词
  if (name.includes('精油') || name.includes('SPA') || name.includes('芳香')) {
    return '7' // 体态调理
  } else if (name.includes('颈肩') || name.includes('腰背') || name.includes('腰腿痛') || name.includes('特色调理')) {
    return '1' // 颈肩腰腿痛调理
  } else if (name.includes('肝') || name.includes('舒肝') || name.includes('肺') || name.includes('脾胃')) {
    return '2' // 肝胆脾胃调理
  } else if (name.includes('铺姜') || name.includes('宫寒')) {
    return '4' // 宫寒痛经调理
  } else if (name.includes('拔罐') || name.includes('刮痧')) {
    return '5' // 腙筋根骶
  } else if (name.includes('整脊') || name.includes('体态')) {
    return '7' // 体态调理
  } else if (name.includes('关元灸') || name.includes('悬灸')) {
    return '2' // 艾灸类归到肝胆脾胃调理
  } else if (name.includes('全身') || name.includes('放松') || name.includes('深度')) {
    return '3' // 失眠调理
  } else if (name.includes('肌肉') || name.includes('疏通') || name.includes('拉伸')) {
    return '6' // 运动拉伸
  }

  return '1' // 默认分类：颈肩腰腿痛调理
}

export const symptomService = {
  // 获取症状分类
  async getCategories() {
    return {
      code: 200,
      data: symptomCategories,
      message: 'success'
    }
  },

  /**
   * 获取推拿师的症状服务列表
   * ✅ 改进：现在从推拿师所属的门店API获取真实服务数据，而不是使用过时的mock
   * @param therapistId 推拿师ID
   * @returns 服务列表（带分类）
   */
  async getTherapistSymptomServices(therapistId: string) {
    if (!therapistId) {
      throw new Error('推拿师ID不能为空')
    }

    try {
      // 第一步：获取推拿师详情（包含所属门店ID）
      const therapistResponse = await request(`/therapists/${therapistId}`)
      const therapist = therapistResponse.data

      if (!therapist || !therapist.storeId) {
        console.error(`推拿师 ${therapistId} 的门店信息不存在`)
        return {
          code: 200,
          data: [],
          message: 'success'
        }
      }

      // 第二步：从门店API获取实际服务列表
      const storeData = await request(`/stores/${therapist.storeId}`)
      const services = storeData.data.services || []

      // 第三步：智能分类
      const categorizedServices = services.map((service: any) => ({
        ...service,
        categoryId: classifyServiceByName(service.name),
        availability: 'available',
        description: service.name
      }))

      console.log(`✅ 获取推拿师 ${therapistId} 的服务列表成功，共 ${categorizedServices.length} 个服务`)

      return {
        code: 200,
        data: categorizedServices,
        message: 'success'
      }
    } catch (error: any) {
      console.error(`❌ 获取推拿师 ${therapistId} 的服务失败:`, error.message)
      // 返回空数组而不是抛出错误，保证前端不会崩溃
      return {
        code: 200,
        data: [],
        message: 'success'
      }
    }
  },

  /**
   * 获取门店所有推拿师的症状服务列表
   * ✅ 保留不变：已经在使用真实API
   * @param storeId 门店ID
   * @returns 服务列表（带分类）
   */
  async getStoreSymptomServices(storeId: string) {
    if (!storeId) {
      throw new Error('门店ID不能为空')
    }

    try {
      // 从门店详情API获取服务列表
      const storeData = await request(`/stores/${storeId}`)
      const services = storeData.data.services || []

      // 智能分类
      const categorizedServices = services.map((service: any) => ({
        ...service,
        categoryId: classifyServiceByName(service.name),
        availability: 'available',
        description: service.name
      }))

      console.log(`✅ 获取门店 ${storeId} 的服务列表成功，共 ${categorizedServices.length} 个服务`)

      return {
        code: 200,
        data: categorizedServices,
        message: 'success'
      }
    } catch (error: any) {
      console.error(`❌ 获取门店 ${storeId} 的服务失败:`, error.message)
      // 返回空数组而不是抛出错误
      return {
        code: 200,
        data: [],
        message: 'success'
      }
    }
  },

  /**
   * 根据分类ID获取服务列表
   * ✅ 改进：现在直接从API数据过滤，而不是使用mock
   * @param therapistId 推拿师ID
   * @param categoryId 分类ID
   * @returns 分类服务列表
   */
  async getServicesByCategory(therapistId: string, categoryId: string) {
    if (!therapistId) {
      throw new Error('推拿师ID不能为空')
    }

    // 获取推拿师的所有服务
    const allServicesResponse = await this.getTherapistSymptomServices(therapistId)
    const allServices = allServicesResponse.data || []

    // 按分类过滤
    const filteredServices = allServices.filter(service => service.categoryId === categoryId)

    return {
      code: 200,
      data: filteredServices,
      message: 'success'
    }
  }
}