// 症状分类数据
export const symptomCategories = [
  { id: '1', name: '颈肩腰腿痛调理', order: 1 },
  { id: '2', name: '肝胆脾胃调理', order: 2 },
  { id: '3', name: '失眠调理', order: 3 },
  { id: '4', name: '宫寒痛经调理', order: 4 },
  { id: '5', name: '腙筋根骶', order: 5 },
  { id: '6', name: '运动拉伸', order: 6 },
  { id: '7', name: '体态调理', order: 7 }
]

// 症状服务项目数据
export const symptomServices = [
  // 颈肩腰腿痛调理
  {
    id: 's1',
    categoryId: '1',
    name: '【不满意退】颈肩腰腿痛特色调理60分钟',
    description: '专业手法调理各类痛症',
    duration: 60,
    price: 298,
    discountPrice: 258,
    availability: 'available' as const,
    tag: '不满意退'
  },
  {
    id: 's2',
    categoryId: '1',
    name: '【冬季养生】肩颈腰背推拿+热疗60分钟',
    description: '温经通络，驱寒养生',
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: 'available' as const,
    tag: '冬季养生'
  },
  {
    id: 's3',
    categoryId: '1',
    name: '【初次专享】肩颈疏通+肌肉放松',
    description: '新客特惠，深度放松',
    duration: 60,
    price: 198,
    discountPrice: 98,
    availability: 'available' as const,
    tag: '初次专享'
  },

  // 肝胆脾胃调理
  {
    id: 's4',
    categoryId: '2',
    name: '【舒肝润肺】推拿+艾灸｜养身伴侣90分钟',
    description: '疏肝理气，润肺养阴',
    duration: 90,
    price: 398,
    discountPrice: 358,
    availability: 'available' as const,
    tag: '热销'
  },
  {
    id: 's5',
    categoryId: '2',
    name: '【专项调理】纤养瘦身·脾胃脏腑调理60分钟',
    description: '调理脾胃，健康瘦身',
    duration: 60,
    price: 318,
    discountPrice: 288,
    availability: 'available' as const,
    tag: '专项调理'
  },

  // 失眠调理
  {
    id: 's6',
    categoryId: '3',
    name: '【深度放松】全身推拿20年经典60分钟',
    description: '经典手法，深度助眠',
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: 'available' as const,
    tag: '经典'
  },

  // 宫寒痛经调理
  {
    id: 's7',
    categoryId: '4',
    name: '【特色养生】关元灸手工悬灸60分钟',
    description: '温补肾阳，调理宫寒',
    duration: 60,
    price: 288,
    discountPrice: 258,
    availability: 'available' as const,
    tag: '特色'
  },
  {
    id: 's8',
    categoryId: '4',
    name: '【本店热销】特色铺姜关元灸60分钟',
    description: '铺姜温灸，暖宫调经',
    duration: 60,
    price: 298,
    discountPrice: 268,
    availability: 'busy' as const,
    tag: '热销'
  },

  // 腙筋根骶
  {
    id: 's9',
    categoryId: '5',
    name: '【体态调整】大师手法中式整脊60分钟',
    description: '正骨整脊，调整体态',
    duration: 60,
    price: 398,
    discountPrice: 368,
    availability: 'available' as const,
    tag: '大师手法'
  },

  // 运动拉伸
  {
    id: 's10',
    categoryId: '6',
    name: '运动恢复拉伸',
    description: '专业运动后恢复',
    duration: 45,
    price: 198,
    discountPrice: 168,
    availability: 'available' as const
  },

  // 体态调理
  {
    id: 's11',
    categoryId: '7',
    name: '【净排寒气】拔罐/刮痧二选一',
    description: '祛湿排寒，疏通经络',
    duration: 30,
    price: 128,
    discountPrice: 98,
    availability: 'available' as const,
    tag: '二选一'
  },
  {
    id: 's12',
    categoryId: '7',
    name: '【芳香滋养】沉浸式精油SPA',
    description: '精油护理，身心放松',
    duration: 90,
    price: 428,
    discountPrice: 398,
    availability: 'available' as const,
    tag: '精油SPA'
  }
]

// 获取推拿师支持的症状服务
export const getTherapistSymptomServices = (therapistId: string) => {
  // 模拟不同推拿师支持不同的服务项目
  // 这里简化处理，返回所有服务
  return symptomServices.map(service => ({
    ...service,
    therapistId,
    // 模拟动态可用性
    availability: Math.random() > 0.7 ? 'busy' : service.availability
  }))
}