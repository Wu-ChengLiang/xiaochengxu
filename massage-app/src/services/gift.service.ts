import Taro from '@tarojs/taro'
import {
  GiftCard,
  Product,
  CreateOrderRequest,
  OrderResponse,
  PayOrderRequest,
  ApiResponse
} from '@/types'
import { getApiBaseUrl } from '@/config/api'

const API_BASE = getApiBaseUrl()

// 静态礼卡数据（替代mock）
const GIFT_CARDS: GiftCard[] = [
  {
    id: 'member-card',
    type: 'member',
    name: '会员礼卡',
    image: '/assets/images/gift/card/member-card.png',
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
    image: '/assets/images/gift/card/gift-card.png',
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

// 静态商品数据（替代mock）
const PRODUCTS: Product[] = [
  {
    id: 'pillow',
    name: '护颈助眠小枕',
    image: '/assets/images/gift/product/neck-pillow.png',
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
    image: '/assets/images/gift/product/health-food.png',
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
   * 创建礼卡购买订单
   */
  static async createGiftCardOrder(params: {
    amount: number
    quantity: number
    paymentMethod: 'wechat' | 'balance'
    customMessage?: string
  }): Promise<OrderResponse> {
    const request: CreateOrderRequest = {
      orderType: 'product',
      userId: getCurrentUserId(),
      title: `电子礼卡 ¥${(params.amount / 100).toFixed(0)}`,
      amount: params.amount * params.quantity,
      paymentMethod: params.paymentMethod,
      extraData: {
        productType: 'gift_card',
        cardType: 'electronic',
        faceValue: params.amount,
        quantity: params.quantity,
        customMessage: params.customMessage || '世界上最好的爸爸'
      }
    }

    const response = await Taro.request({
      url: `${API_BASE}/api/v2/orders/create`,
      method: 'POST',
      data: request,
      header: {
        'Content-Type': 'application/json'
      }
    })

    const result = response.data as ApiResponse<OrderResponse>
    if (result.code !== 0) {
      throw new Error(result.message)
    }

    return result.data
  }

  /**
   * 创建商品购买订单
   */
  static async createProductOrder(params: {
    productId: string
    quantity: number
    paymentMethod: 'wechat' | 'balance'
  }): Promise<OrderResponse> {
    const product = this.getProductById(params.productId)
    if (!product) {
      throw new Error('商品不存在')
    }

    const request: CreateOrderRequest = {
      orderType: 'product',
      userId: getCurrentUserId(),
      title: product.name,
      amount: product.price * 100 * params.quantity, // 转换为分
      paymentMethod: params.paymentMethod,
      extraData: {
        productType: 'merchandise',
        productId: params.productId,
        quantity: params.quantity,
        specifications: product.specifications
      }
    }

    const response = await Taro.request({
      url: `${API_BASE}/api/v2/orders/create`,
      method: 'POST',
      data: request,
      header: {
        'Content-Type': 'application/json'
      }
    })

    const result = response.data as ApiResponse<OrderResponse>
    if (result.code !== 0) {
      throw new Error(result.message)
    }

    return result.data
  }

  /**
   * 支付订单
   */
  static async payOrder(params: PayOrderRequest): Promise<OrderResponse> {
    const response = await Taro.request({
      url: `${API_BASE}/api/v2/orders/pay`,
      method: 'POST',
      data: params,
      header: {
        'Content-Type': 'application/json'
      }
    })

    const result = response.data as ApiResponse<OrderResponse>
    if (result.code !== 0) {
      throw new Error(result.message)
    }

    return result.data
  }

  /**
   * 处理微信支付
   */
  static async handleWechatPay(wxPayParams: {
    prepayId: string
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      Taro.requestPayment({
        timeStamp: wxPayParams.timeStamp,
        nonceStr: wxPayParams.nonceStr,
        package: wxPayParams.package,
        signType: wxPayParams.signType as any,
        paySign: wxPayParams.paySign,
        success: () => {
          resolve()
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '支付失败'))
        }
      })
    })
  }
}