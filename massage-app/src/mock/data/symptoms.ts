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
    name: '颈椎调理',
    description: '缓解颈椎疼痛、落枕',
    duration: 60,
    price: 258,
    discountPrice: 229,
    availability: 'available' as const
  },
  {
    id: 's2',
    categoryId: '1',
    name: '肩周炎调理',
    description: '改善肩部活动受限',
    duration: 60,
    price: 258,
    discountPrice: 229,
    availability: 'available' as const
  },
  {
    id: 's3',
    categoryId: '1',
    name: '腰腿痛调理',
    description: '缓解腰部及腿部疼痛',
    duration: 70,
    price: 298,
    discountPrice: 268,
    availability: 'available' as const
  },

  // 肝胆脾胃调理
  {
    id: 's4',
    categoryId: '2',
    name: '脾胃调理',
    description: '改善消化功能',
    duration: 60,
    price: 238,
    discountPrice: 218,
    availability: 'available' as const
  },
  {
    id: 's5',
    categoryId: '2',
    name: '肝胆疏通',
    description: '疏肝理气、排毒养颜',
    duration: 60,
    price: 258,
    discountPrice: 238,
    availability: 'busy' as const
  },
  {
    id: 's6',
    categoryId: '2',
    name: '消化系统调理',
    description: '调理肠胃、改善便秘',
    duration: 50,
    price: 218,
    discountPrice: 198,
    availability: 'available' as const
  },

  // 失眠调理
  {
    id: 's7',
    categoryId: '3',
    name: '安神助眠',
    description: '改善睡眠质量',
    duration: 60,
    price: 268,
    discountPrice: 248,
    availability: 'available' as const
  },
  {
    id: 's8',
    categoryId: '3',
    name: '头部放松',
    description: '缓解头痛、精神压力',
    duration: 45,
    price: 198,
    discountPrice: 178,
    availability: 'available' as const
  },
  {
    id: 's9',
    categoryId: '3',
    name: '深度睡眠调理',
    description: '调节神经系统、深度放松',
    duration: 70,
    price: 318,
    discountPrice: 288,
    availability: 'busy' as const
  },

  // 宫寒痛经调理
  {
    id: 's10',
    categoryId: '4',
    name: '温宫暖巢',
    description: '调理宫寒、改善手脚冰凉',
    duration: 60,
    price: 278,
    discountPrice: 258,
    availability: 'available' as const
  },
  {
    id: 's11',
    categoryId: '4',
    name: '痛经调理',
    description: '缓解经期不适',
    duration: 50,
    price: 238,
    discountPrice: 218,
    availability: 'available' as const
  },
  {
    id: 's12',
    categoryId: '4',
    name: '妇科保养',
    description: '调理月经不调、保养卵巢',
    duration: 70,
    price: 328,
    discountPrice: 298,
    availability: 'available' as const
  },

  // 腙筋根骶
  {
    id: 's13',
    categoryId: '5',
    name: '筋膜松解',
    description: '深层筋膜放松',
    duration: 60,
    price: 298,
    discountPrice: 268,
    availability: 'available' as const
  },
  {
    id: 's14',
    categoryId: '5',
    name: '根骶调理',
    description: '骶骨矫正、骨盆调整',
    duration: 70,
    price: 358,
    discountPrice: 328,
    availability: 'busy' as const
  },

  // 运动拉伸
  {
    id: 's15',
    categoryId: '6',
    name: '运动后恢复',
    description: '缓解运动后肌肉酸痛',
    duration: 50,
    price: 198,
    discountPrice: 178,
    availability: 'available' as const
  },
  {
    id: 's16',
    categoryId: '6',
    name: '筋膜拉伸',
    description: '提升身体柔韧性',
    duration: 60,
    price: 238,
    discountPrice: 218,
    availability: 'available' as const
  },
  {
    id: 's17',
    categoryId: '6',
    name: '运动损伤调理',
    description: '运动损伤康复调理',
    duration: 70,
    price: 288,
    discountPrice: 258,
    availability: 'available' as const
  },

  // 体态调理
  {
    id: 's18',
    categoryId: '7',
    name: '体态矫正',
    description: '改善不良体态',
    duration: 60,
    price: 278,
    discountPrice: 248,
    availability: 'available' as const
  },
  {
    id: 's19',
    categoryId: '7',
    name: '驼背调理',
    description: '改善驼背、圆肩',
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: 'available' as const
  },
  {
    id: 's20',
    categoryId: '7',
    name: '骨盆矫正',
    description: '调整骨盆前倾、后倾',
    duration: 70,
    price: 328,
    discountPrice: 298,
    availability: 'full' as const
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