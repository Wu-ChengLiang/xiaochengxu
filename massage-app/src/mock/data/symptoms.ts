// 症状分类数据
export const symptomCategories = [
  { id: '1', name: '头颈肩痛', order: 1 },
  { id: '2', name: '对症推拿', order: 2 },
  { id: '3', name: '运动排酸', order: 3 },
  { id: '4', name: '睡眠调理', order: 4 },
  { id: '5', name: '腰酸背痛', order: 5 },
  { id: '6', name: '整脊踩背', order: 6 },
  { id: '7', name: '肠胃调理', order: 7 },
  { id: '8', name: '足疗+踩背', order: 8 },
  { id: '9', name: '焦虑失眠', order: 9 },
  { id: '10', name: '温宫暖巢', order: 10 },
  { id: '11', name: '运动拉伸', order: 11 }
]

// 症状服务项目数据
export const symptomServices = [
  // 头颈肩痛
  {
    id: 's1',
    categoryId: '1',
    name: '头颈肩痛',
    description: '落枕',
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: 'available' as const
  },
  
  // 对症推拿
  {
    id: 's2',
    categoryId: '2',
    name: '整脊踩背',
    description: '运动臂腿酸痛',
    duration: 40,
    price: 169,
    discountPrice: 149,
    availability: 'available' as const
  },
  
  // 运动排酸
  {
    id: 's3',
    categoryId: '3',
    name: '运动排酸',
    description: '',
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: 'busy' as const
  },
  
  // 睡眠调理
  {
    id: 's4',
    categoryId: '4',
    name: '肠胃调理',
    description: '改善胃肠功能、足疗',
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: 'available' as const
  },
  
  // 腰酸背痛
  {
    id: 's5',
    categoryId: '5',
    name: '腰酸背痛',
    description: '',
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: 'available' as const
  },
  
  // 整脊踩背
  {
    id: 's6',
    categoryId: '6',
    name: '足疗+踩背',
    description: '运动小腿胀痛',
    duration: 70,
    price: 279,
    discountPrice: 259,
    availability: 'available' as const
  },
  
  // 肠胃调理
  {
    id: 's7',
    categoryId: '7',
    name: '肠胃调理',
    description: '',
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: 'full' as const
  },
  
  // 足疗+踩背
  {
    id: 's8',
    categoryId: '8',
    name: '足疗+踩背',
    description: '运动小腿胀痛',
    duration: 70,
    price: 279,
    discountPrice: 259,
    availability: 'available' as const
  },
  
  // 焦虑失眠
  {
    id: 's9',
    categoryId: '9',
    name: '焦虑失眠',
    description: '提高睡眠质量',
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: 'busy' as const
  },
  
  // 温宫暖巢
  {
    id: 's10',
    categoryId: '10',
    name: '头颈肩痛',
    description: '落枕',
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: 'full' as const
  },
  
  // 运动拉伸
  {
    id: 's11',
    categoryId: '11',
    name: '运动拉伸',
    description: '',
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: 'available' as const
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