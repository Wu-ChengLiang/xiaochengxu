# 推拿预约小程序开发策略

## 核心开发理念

### 前端先行 + Mock 驱动开发
1. **独立开发** - 前端完全独立于后端，通过 Mock 数据层实现所有功能
2. **契约优先** - Mock 层定义完整的数据结构和 API 契约，作为前后端协作标准
3. **快速迭代** - UI 立即可运行和测试，加速产品验证
4. **风险前置** - 所有字段缺失和数据问题在 Mock 层暴露，避免后期数据库改动

## Mock 数据层架构

```
src/
├── mock/
│   ├── index.js           # Mock 服务入口
│   ├── data/              # 静态数据
│   │   ├── users.js       # 用户数据
│   │   ├── stores.js      # 门店数据
│   │   ├── therapists.js  # 推拿师数据
│   │   └── appointments.js # 预约数据
│   ├── models/            # 数据模型定义
│   │   ├── User.js        
│   │   ├── Store.js       
│   │   ├── Therapist.js   
│   │   └── Appointment.js 
│   └── services/          # Mock API 服务
│       ├── auth.js        # 认证相关
│       ├── store.js       # 门店相关
│       ├── therapist.js   # 推拿师相关
│       └── appointment.js # 预约相关
```

## 数据模型定义（接口契约）

### 用户模型
```typescript
interface User {
  id: string
  nickname: string
  avatar: string
  phone: string
  memberLevel: number  // 会员等级
  points: number       // 积分
  createdAt: string
  updatedAt: string
}
```

### 门店模型
```typescript
interface Store {
  id: string
  name: string
  images: string[]
  address: string
  phone: string
  businessHours: {
    start: string  // "10:00"
    end: string    // "22:00"
  }
  location: {
    latitude: number
    longitude: number
  }
  distance?: number  // 计算得出的距离
  status: 'normal' | 'busy' | 'full'  // 就近、繁忙、爆满
  services: string[] // 服务项目ID列表
}
```

### 推拿师模型
```typescript
interface Therapist {
  id: string
  storeId: string
  name: string
  avatar: string
  rating: number     // 评分
  ratingCount: number // 评价数
  expertise: string[] // 擅长项目，如 ["头颈肩痛", "足疗+踩背"]
  yearsOfExperience: number
  serviceCount: number // 服务次数
  status: 'available' | 'busy' | 'rest'
}
```

### 预约模型
```typescript
interface Appointment {
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
```

### 服务项目模型
```typescript
interface Service {
  id: string
  name: string
  description: string
  duration: number  // 分钟
  price: number
  category: string  // 分类
}
```

### 优惠活动模型
```typescript
interface Campaign {
  id: string
  title: string
  subtitle: string
  image: string
  type: 'discount' | 'coupon' | 'gift'
  startTime: string
  endTime: string
  rules: object  // 活动规则
}
```

## 执行计划

### 第一阶段：基础搭建（2天）
1. **初始化 Taro 项目**
   - 使用 Taro 3.x + React + TypeScript
   - 配置 ESLint、Prettier
   - 集成 Sass、CSS Modules

2. **搭建 Mock 数据层**
   - 创建数据模型定义
   - 实现 Mock 数据生成器
   - 封装 Mock API 服务

3. **封装基础设施**
   - 请求拦截器（连接 Mock 服务）
   - 全局状态管理（MobX/Zustand）
   - 工具函数（位置计算、格式化等）

### 第二阶段：核心页面开发（3天）
1. **TabBar 三个主页面**
   - 预约页：优惠轮播 + 门店列表 + 推拿师列表
   - 好礼页：会员权益 + 活动中心
   - 我的页：个人信息 + 功能入口

2. **预约流程页面**
   - 门店列表页（支持搜索、筛选）
   - 门店详情页（门店信息 + 推拿师列表）
   - 推拿师详情页（个人信息 + 排班表）
   - 服务选择页
   - 时间选择页
   - 预约确认页

### 第三阶段：组件开发（2天）
1. **基础组件**
   - Card 组件（门店卡片、推拿师卡片）
   - List 组件（支持下拉刷新、触底加载）
   - Empty 组件（空状态）
   - Loading 组件（加载状态）

2. **业务组件**
   - LocationAuth（位置授权）
   - BookingCalendar（预约日历）
   - TimeSlotPicker（时间选择器）
   - ServiceSelector（服务选择器）

### 第四阶段：交互优化（1天）
1. **用户体验优化**
   - 骨架屏加载
   - 页面转场动画
   - 手势交互优化
   - 错误处理和提示

2. **性能优化**
   - 图片懒加载
   - 列表虚拟滚动
   - 状态管理优化

## Mock 数据服务示例

```javascript
// mock/services/store.js
import { stores, therapists } from '../data'
import { calculateDistance } from '@/utils/location'

export const storeService = {
  // 获取附近门店
  async getNearbyStores(latitude, longitude, page = 1, pageSize = 10) {
    // 模拟网络延迟
    await sleep(300)
    
    // 计算距离并排序
    const storesWithDistance = stores.map(store => ({
      ...store,
      distance: calculateDistance(
        latitude, 
        longitude, 
        store.location.latitude, 
        store.location.longitude
      )
    })).sort((a, b) => a.distance - b.distance)
    
    // 分页返回
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      list: storesWithDistance.slice(start, end),
      total: storesWithDistance.length,
      page,
      pageSize
    }
  },
  
  // 获取门店详情
  async getStoreDetail(storeId) {
    await sleep(200)
    const store = stores.find(s => s.id === storeId)
    if (!store) {
      throw new Error('门店不存在')
    }
    
    // 获取该门店的推拿师
    const storeTherapists = therapists.filter(t => t.storeId === storeId)
    
    return {
      ...store,
      therapists: storeTherapists
    }
  }
}
```

## 开发规范

1. **组件命名**：PascalCase，如 `StoreCard.jsx`
2. **样式文件**：同名 `.scss` 文件，使用 CSS Modules
3. **Mock 数据**：必须包含所有字段，使用 TypeScript 类型检查
4. **状态管理**：页面级状态用 Hooks，全局状态用 MobX/Zustand
5. **错误处理**：所有异步操作都要有 loading 和 error 状态

## 注意事项

1. **Mock 数据完整性**
   - 每个数据模型必须定义所有字段
   - Mock 数据必须符合实际业务逻辑
   - 考虑边界情况和异常数据

2. **接口契约稳定性**
   - 一旦定义，尽量不要修改字段名
   - 新增字段使用可选类型
   - 废弃字段做标记但不删除

3. **开发顺序**
   - 先实现核心流程，再优化细节
   - 先实现静态页面，再加交互
   - 先实现功能，再做性能优化

## 项目指令

```bash
# 安装依赖
npm install

# 启动开发服务器（微信小程序）
npm run dev:weapp

# 构建生产版本
npm run build:weapp

# Mock 数据生成
npm run mock:generate

# 类型检查
npm run type-check
```