// 用户模型
export interface User {
  id: string
  nickname: string
  avatar: string
  phone: string
  memberLevel: number  // 会员等级
  points: number       // 积分
  balance: number      // 账户余额
  frozenBalance?: number // 冻结余额（可选）
  createdAt: string
  updatedAt: string
}

// 门店模型
export interface Store {
  id: string
  name: string
  images?: string[]  // 详情页用
  image?: string     // 列表页用
  address: string
  phone: string
  businessHours: string  // "10:00-22:00" 格式
  // API直接返回经纬度字段，不是嵌套的location对象
  latitude?: number
  longitude?: number
  // 兼容旧的location格式
  location?: {
    latitude: number
    longitude: number
  }
  distance?: number  // 计算得出的距离（km）
  status: 'normal' | 'busy' | 'full'  // 正常、繁忙、爆满
  services?: StoreService[] // 服务项目列表（详情页用）
  therapists?: StoreTherapist[] // 门店推拿师列表（详情页用）
  therapistCount?: number   // 在岗推拿师数量
}

// 门店服务项目模型
export interface StoreService {
  id: string
  name: string
  price: number     // 价格（分）
  duration: number  // 时长（分钟）
}

// 门店推拿师模型（简化版，用于门店详情）
export interface StoreTherapist {
  id: string
  name: string
  avatar: string
  title: string
  rating: number
  status: 'available' | 'busy' | 'rest'
}

// 推拿师模型
export interface Therapist {
  id: string
  storeId: string
  storeName?: string
  storeAddress?: string  // 门店地址
  name: string
  avatar: string
  title: string         // 职位头衔，如"高级推拿师"
  rating: number        // 评分
  ratingCount: number   // 评价数
  expertise: string[]   // 擅长项目
  yearsOfExperience: number
  serviceCount?: number // 服务次数
  bio?: string          // 技师简介
  certificates?: string[] // 资质证书
  status: 'available' | 'busy' | 'rest'
  distance?: number     // 继承自门店的距离
}

// 预约模型
// ✅ 时间字段与API对齐：appointmentDate + startTime 分开存储
export interface Appointment {
  id: string
  userId: string
  storeId: string
  storeName: string
  therapistId: string
  therapistName: string
  serviceId: string
  serviceName: string
  appointmentDate: string  // ✅ 改为 appointmentDate（日期 YYYY-MM-DD）
  startTime: string        // ✅ 改为 startTime（时间 HH:mm）
  endTime?: string         // ✅ 新增：结束时间（可选）
  duration: number  // 分钟
  price: number
  discountPrice?: number
  status: 'pending' | 'confirmed' | 'serving' | 'completed' | 'cancelled'
  createdAt: string
  qrCode?: string  // 核销码
}

// 服务项目模型
export interface Service {
  id: string
  name: string
  description: string
  duration: number  // 分钟
  price: number
  category: string  // 分类
  popular?: boolean // 是否热门
}

// 优惠活动模型
export interface Campaign {
  id: string
  title: string
  subtitle: string
  image: string
  type: 'discount' | 'coupon' | 'gift'
  startTime: string
  endTime: string
  rules: any  // 活动规则
}

// 礼卡模型
export interface GiftCard {
  id: string
  type: 'member' | 'electronic'
  name: string
  image: string
  description: string
  features: string[]
  terms: string
}

// 周边商品模型
export interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  unit: string
  description: string
  features: string[]
  specifications: Record<string, string>
}

// 订单创建请求
export interface CreateOrderRequest {
  orderType: 'service' | 'product' | 'recharge'
  userId: number
  title: string
  amount: number
  paymentMethod: 'wechat' | 'balance'
  extraData?: any
}

// 订单响应
export interface OrderResponse {
  orderNo: string
  orderType: string
  title: string
  amount: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  wxPayParams?: {
    prepayId: string
    timeStamp: string
    nonceStr: string
    package: string
    signType: string
    paySign: string
  }
}

// 支付订单请求
export interface PayOrderRequest {
  orderNo: string
  paymentMethod: 'wechat' | 'balance'
}

// API 响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

// 分页数据格式
export interface PageData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 推拿师排班相关类型
// 推拿师某个时段的可用性
export interface TherapistTimeSlot {
  time: string              // "09:00"
  available: boolean        // true | false（true表示可预约，false表示已预约）
}

// 推拿师某天的排班
export interface TherapistDayAvailability {
  date: string              // "2025-10-25"
  dayOfWeek: string         // "周六"
  workTime: string          // "9:00-21:00"
  slots: TherapistTimeSlot[]
}

// 推拿师 + 排班信息
export interface TherapistWithAvailability extends Therapist {
  availability: TherapistDayAvailability[]
}