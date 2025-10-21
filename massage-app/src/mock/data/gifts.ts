import { ASSETS_CONFIG } from '@/config/assets'

// 礼卡数据
export const giftCards = [
  {
    id: 'member-card',
    type: 'member',
    name: '会员礼卡',
    image: ASSETS_CONFIG.giftCard.member,
    description: '尊享会员专属优惠',
    features: [
      '全门店通用',
      '长期有效',
      '可累计积分',
      '享受会员价'
    ],
    terms: '本卡为不记名卡片，请妥善保管'
  },
  {
    id: 'electronic-card',
    type: 'electronic',
    name: '电子礼卡',
    image: ASSETS_CONFIG.giftCard.electronic,
    description: '便捷的电子礼品卡',
    features: [
      '即买即用',
      '可转赠好友',
      '线上购买',
      '扫码使用'
    ],
    terms: '电子卡有效期为购买之日起一年内'
  }
]

// 周边商品数据
export const products = [
  {
    id: 'pillow',
    name: '护颈助眠小枕',
    image: ASSETS_CONFIG.product.pillow,
    price: 299.00,
    originalPrice: 399.00,
    unit: '个',
    description: '人体工学设计，缓解颈部压力',
    features: [
      '记忆棉材质',
      '人体工学设计',
      '可拆洗枕套',
      '透气排汗'
    ],
    specifications: {
      '材质': '记忆棉+天鹅绒',
      '尺寸': '50cm x 30cm x 10cm',
      '重量': '1.2kg',
      '颜色': '灰色/米色'
    }
  },
  {
    id: 'therapy',
    name: '药食同源理疗包',
    image: ASSETS_CONFIG.product.therapy,
    price: 199.00,
    originalPrice: 299.00,
    unit: '套',
    description: '传统中药配方，祛寒除湿',
    features: [
      '纯中药配方',
      '热敷理疗',
      '可重复使用',
      '便携设计'
    ],
    specifications: {
      '成分': '艾草、生姜、当归等',
      '规格': '单包200g，一套3包',
      '使用方法': '微波加热2-3分钟',
      '有效期': '生产日期起24个月'
    }
  }
]

// 获取所有礼卡
export const getAllGiftCards = () => {
  return giftCards
}

// 根据ID获取礼卡详情
export const getGiftCardById = (id: string) => {
  return giftCards.find(card => card.id === id)
}

// 获取所有商品
export const getAllProducts = () => {
  return products
}

// 根据ID获取商品详情
export const getProductById = (id: string) => {
  return products.find(product => product.id === id)
}