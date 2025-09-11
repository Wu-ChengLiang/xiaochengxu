import type { Service } from '@/types'

export const mockServices: Service[] = [
  {
    id: 'service-001',
    name: '【冬季养生】肩颈腰背推拿+热疗60分钟',
    description: '40分钟肩颈推拿+20分钟背部热敷',
    duration: 60,
    price: 99,
    category: '冬季养生',
    popular: false
  },
  {
    id: 'service-002',
    name: '【舒肝润肺】推拿+艾灸｜养身伴侣90分钟（商家主推）',
    description: '全身推拿60分钟+30分钟腰背悬灸',
    duration: 90,
    price: 239,
    category: '舒肝润肺',
    popular: true
  },
  {
    id: 'service-003',
    name: '【不满意退】颈肩腰腿痛特色调理60分钟',
    description: '全身推拿60分钟包含：疼痛类问题，推拿，整脊，艾灸，刮痧/拔罐，根据客人体质搭配',
    duration: 60,
    price: 399,
    category: '特色调理',
    popular: true
  },
  {
    id: 'service-004',
    name: '【深度放松】全身推拿20年经典60分钟',
    description: '全身推拿60分钟包含：肩颈、腰背、腿部',
    duration: 60,
    price: 189,
    category: '深度放松',
    popular: false
  },
  {
    id: 'service-005',
    name: '【体态调整】大师手法中式整脊60分钟',
    description: '60分钟正骨：骨盆/圆肩驼背/体态矫正/O形腿/腹直肌',
    duration: 60,
    price: 269,
    category: '体态调整',
    popular: false
  },
  {
    id: 'service-006',
    name: '【专项调理】纤养瘦身·脾胃脏腑调理|60分钟',
    description: '60分钟脏腑调理 包含：经络，推拿，艾灸、根据客人体质搭配',
    duration: 60,
    price: 299,
    category: '专项调理',
    popular: false
  },
  {
    id: 'service-007',
    name: '【特色养生】关元灸手工悬灸60分钟',
    description: '手工艾灸：腹部关元穴+足底涌泉穴',
    duration: 60,
    price: 259,
    category: '特色养生',
    popular: false
  },
  {
    id: 'service-008',
    name: '【净排寒气】拔罐/刮痧二选一',
    description: '肩颈或腰背',
    duration: 15,
    price: 59,
    category: '净排寒气',
    popular: false
  },
  {
    id: 'service-009',
    name: '【初次专享】肩颈疏通+肌肉放松',
    description: '45分钟肩颈推拿按摩',
    duration: 45,
    price: 99,
    category: '初次专享',
    popular: true
  },
  {
    id: 'service-010',
    name: '【芳香滋养】沉浸式精油SPA',
    description: '60分钟背部精油SPA',
    duration: 60,
    price: 199,
    category: '芳香滋养',
    popular: false
  },
  {
    id: 'service-011',
    name: '【本店热销】特色铺姜关元灸60分钟',
    description: '60分钟背部精油SPA',
    duration: 60,
    price: 259,
    category: '本店热销',
    popular: true
  }
]