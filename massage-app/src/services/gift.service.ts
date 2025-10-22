import {
  GiftCard,
  Product,
  CreateOrderRequest,
  OrderResponse
} from '@/types'
import { post } from '@/utils/request'
import { ASSETS_CONFIG } from '@/config/assets'

// 静态礼卡数据（替代mock）
const GIFT_CARDS: GiftCard[] = [
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

// 暖贴产品数据
const NUANTIE_PRODUCTS: Product[] = [
  {
    id: 'nuantie-waist',
    name: '蕲艾腰腹暖贴',
    image: 'http://mingyitang1024.com/static/gift/product/nuantie/yaofu.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '贴',
    description: '自发热艾草暖护腰贴',
    features: ['自发热艾草', '暖护腰贴', '道地蕲艾'],
    specifications: {}
  },
  {
    id: 'nuantie-knee',
    name: '蕲艾护膝暖贴',
    image: 'http://mingyitang1024.com/static/gift/product/nuantie/huxi.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '贴',
    description: '自发热艾草护膝 驱寒保暖',
    features: ['自发热艾草', '护膝', '驱寒保暖'],
    specifications: {}
  },
  {
    id: 'nuantie-moxa',
    name: '蕲艾灸贴',
    image: 'http://mingyitang1024.com/static/gift/product/nuantie/xinai.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '贴',
    description: '自发热艾草精油穴位灸贴',
    features: ['自发热艾草', '精油穴位灸贴', '道地蕲艾'],
    specifications: {}
  }
]

// 艾条产品数据
const AIJIU_PRODUCTS: Product[] = [
  {
    id: 'aijiu-stick',
    name: '蕲艾条',
    image: 'http://mingyitang1024.com/static/gift/product/aijiu/xinaitiao.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '条',
    description: '艾灸艾条 3年陈艾',
    features: ['3年陈艾', '艾灸艾条', '道地蕲艾'],
    specifications: {}
  },
  {
    id: 'aijiu-moxa-ball',
    name: '蕲艾饼',
    image: 'http://mingyitang1024.com/static/gift/product/aijiu/xinaibing.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '饼',
    description: '道地蕲艾泡脚泡澡艾草饼',
    features: ['泡脚泡澡', '艾草饼', '道地蕲艾'],
    specifications: {}
  },
  {
    id: 'aijiu-column',
    name: '新艾柱',
    image: 'http://mingyitang1024.com/static/gift/product/aijiu/xinaizhu.jpg',
    price: 9900,      // ¥99
    originalPrice: 9900,
    unit: '柱',
    description: '李时珍故里特产新艾柱',
    features: ['新艾柱', '李时珍故里特产', '艾灸'],
    specifications: {}
  }
]

// 静态商品数据（替代mock）
// ✅ 注意：price 和 originalPrice 使用整数分为单位，不使用小数
// 例如: 299.00元 = 29900分，19900分 = 199元
const PRODUCTS: Product[] = [
  ...NUANTIE_PRODUCTS,
  ...AIJIU_PRODUCTS
]

/**
 * 获取当前用户ID
 * TODO: 从全局状态或本地存储获取实际用户ID
 */
const getCurrentUserId = (): number => {
  // 临时使用固定用户ID，后续从用户状态管理获取
  return 1
}

/**
 * 礼卡服务
 */
export class GiftService {
  /**
   * 获取所有礼卡
   */
  static getAllGiftCards(): GiftCard[] {
    return GIFT_CARDS
  }

  /**
   * 根据ID获取礼卡详情
   */
  static getGiftCardById(id: string): GiftCard | undefined {
    return GIFT_CARDS.find(card => card.id === id)
  }

  /**
   * 获取所有商品
   */
  static getAllProducts(): Product[] {
    return PRODUCTS
  }

  /**
   * 根据ID获取商品详情
   */
  static getProductById(id: string): Product | undefined {
    return PRODUCTS.find(product => product.id === id)
  }

  /**
   * 获取暖贴产品列表
   */
  static getNuantieProducts(): Product[] {
    return NUANTIE_PRODUCTS
  }

  /**
   * 获取艾条产品列表
   */
  static getAijiuProducts(): Product[] {
    return AIJIU_PRODUCTS
  }

  /**
   * 创建礼卡购买订单
   * @param params.cardId 礼卡ID
   * @param params.amount 礼卡面值（分为单位）
   */
  static async createGiftCardOrder(params: {
    cardId: string                      // ✅ 新增：礼卡ID
    amount: number      // ✅ 分为单位
    quantity: number
    paymentMethod: 'wechat' | 'balance'
    customMessage?: string
  }): Promise<OrderResponse> {
    try {
      const orderData: CreateOrderRequest = {
        orderType: 'product',
        userId: getCurrentUserId(),
        title: `电子礼卡 ¥${(params.amount / 100).toFixed(2)}`,
        amount: params.amount * params.quantity,  // ✅ 直接相乘，结果是分
        paymentMethod: params.paymentMethod,
        extraData: {
          productType: 'gift_card',
          cardId: params.cardId,              // ✅ 新增：记录礼卡ID，方便未来扩展
          cardType: 'electronic',
          faceValue: params.amount,  // ✅ 保持分为单位
          quantity: params.quantity,
          customMessage: params.customMessage || '世界上最好的爸爸'
        }
      }

      const response = await post('/orders/create', orderData, {
        showLoading: true,
        loadingTitle: '创建订单中...'
      })

      return response.data
    } catch (error: any) {
      console.error('创建礼卡订单失败:', error)
      throw new Error(error.message || '创建礼卡订单失败')
    }
  }

  /**
   * 创建商品购买订单
   */
  static async createProductOrder(params: {
    productId: string
    quantity: number
    paymentMethod: 'wechat' | 'balance'
  }): Promise<OrderResponse> {
    try {
      const product = this.getProductById(params.productId)
      if (!product) {
        throw new Error('商品不存在')
      }

      const orderData: CreateOrderRequest = {
        orderType: 'product',
        userId: getCurrentUserId(),
        title: product.name,
        amount: product.price * params.quantity,  // ✅ 直接相乘，结果是分（product.price已是分为单位）
        paymentMethod: params.paymentMethod,
        extraData: {
          productType: 'merchandise',
          productId: params.productId,
          quantity: params.quantity,
          specifications: product.specifications
        }
      }

      const response = await post('/orders/create', orderData, {
        showLoading: true,
        loadingTitle: '创建订单中...'
      })

      return response.data
    } catch (error: any) {
      console.error('创建商品订单失败:', error)
      throw new Error(error.message || '创建商品订单失败')
    }
  }

}