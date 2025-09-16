// 用户模型
export interface User {
  id: string
  nickname: string
  avatar: string
  phone: string
  memberLevel: number  // 会员等级
  points: number       // 积分
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
  status: 'available' | 'busy' | 'rest'
  distance?: number     // 继承自门店的距离
}

// 预约模型
export interface Appointment {
  id: string
  userId: string
  storeId: string
  storeName: string
  therapistId: string
  therapistName: string
  serviceId: string
  serviceName: string
  appointmentTime: string
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

// API 响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页数据格式
export interface PageData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}