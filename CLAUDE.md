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

## 后端架构设计

### 技术栈
- **Node.js + TypeScript** - 与前端技术栈统一，便于类型共享
- **Express.js** - 成熟稳定的Web框架
- **SQLite + TypeORM** - 利用现有数据库，TypeORM提供类型安全的ORM
- **Zod** - 数据验证，可与前端共享验证规则
- **JWT** - 用户认证

### 后端项目结构（精简版）

```
xiaochengxu-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # 数据库配置
│   │   └── index.ts         # 所有配置汇总
│   │
│   ├── entities/            # 数据库实体（对应现有8个表）
│   │   ├── index.ts         # 导出所有实体
│   │   └── *.entity.ts      # 各实体文件
│   │
│   ├── modules/             # 业务模块（控制器+服务+DTO）
│   │   ├── store/
│   │   │   ├── store.controller.ts
│   │   │   ├── store.service.ts
│   │   │   └── store.dto.ts
│   │   ├── therapist/
│   │   │   ├── therapist.controller.ts
│   │   │   ├── therapist.service.ts
│   │   │   └── therapist.dto.ts
│   │   ├── appointment/
│   │   │   ├── appointment.controller.ts
│   │   │   ├── appointment.service.ts
│   │   │   └── appointment.dto.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.dto.ts
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       └── auth.dto.ts
│   │
│   ├── common/              # 公共资源
│   │   ├── middleware/
│   │   │   ├── auth.ts      # JWT认证
│   │   │   └── error.ts     # 错误处理
│   │   ├── utils/
│   │   │   ├── response.ts  # 统一响应格式
│   │   │   └── location.ts  # 距离计算
│   │   └── types/
│   │       └── index.ts     # 从前端复制的类型定义
│   │
│   ├── routes.ts            # 所有路由定义
│   └── app.ts               # 应用入口
│
├── database/
│   ├── mingyi.db           # 现有数据库
│   └── migrations/         # 数据库迁移脚本
│
├── test/                   # 测试文件
│   └── *.test.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### API设计规范

```typescript
// 统一响应格式（与前端ApiResponse接口一致）
{
  code: number,       // 200成功，400客户端错误，500服务端错误
  message: string,
  data: T,
  timestamp: number
}

// 分页响应格式（与前端PageData接口一致）
{
  list: T[],
  total: number,
  page: number,
  pageSize: number,
  hasMore: boolean
}
```

### 主要API端点

```
门店相关：
GET    /api/stores/nearby?lat=&lng=&page=&pageSize=  # 获取附近门店
GET    /api/stores/:id                               # 获取门店详情
GET    /api/stores/search?keyword=&page=&pageSize=   # 搜索门店

推拿师相关：
GET    /api/therapists/by-store/:storeId            # 获取门店推拿师
GET    /api/therapists/:id                          # 获取推拿师详情
GET    /api/therapists/:id/schedule?date=           # 获取排班信息

预约相关：
POST   /api/appointments                             # 创建预约
GET    /api/appointments/my?page=&pageSize=&status= # 我的预约列表
GET    /api/appointments/:id                        # 预约详情
PUT    /api/appointments/:id/status                 # 更新预约状态

用户相关：
POST   /api/auth/login                              # 微信登录
GET    /api/users/profile                           # 获取个人信息
PUT    /api/users/profile                           # 更新个人信息
```

### 与前端对接要点

1. **类型共享**：将前端的types/index.ts复制到后端项目，确保类型定义一致
2. **Mock迁移**：后端实现时可直接参考前端Mock服务的业务逻辑
3. **渐进式迁移**：前端可逐步从Mock切换到真实API
4. **环境配置**：前端添加API_BASE_URL环境变量，开发时指向Mock，生产时指向后端

### 数据模型差异处理

**主要差异：**
- **字段命名**：数据库snake_case vs 前端camelCase
- **数据类型**：数据库ID为INTEGER，前端为string
- **计算字段**：前端模型包含计算字段（如storeName、distance）
- **缺失模型**：症状服务在数据库中没有对应表

**转换策略示例：**
```typescript
// 后端实体转换
toDTO(): Therapist {
  return {
    id: this.id.toString(), // 数字转字符串
    storeId: this.store_id.toString(),
    storeName: this.store?.name, // 关联查询获取
    businessHours: {
      start: this.business_hours.split('-')[0],
      end: this.business_hours.split('-')[1]
    }
    // ... 其他字段转换
  };
}
```

### TDD开发流程

**核心理念：** 先写测试，再写实现，测试驱动设计

**开发流程：**
1. 编写API契约测试 → 2. 编写单元测试 → 3. 实现代码 → 4. 重构优化

**第一步开发：门店模块**

建议从「门店模块」开始，理由：
- **业务独立性高** - 不依赖用户认证，可独立测试
- **核心功能** - 获取附近门店是用户第一个接触的功能
- **数据结构清晰** - stores表结构简单，易于实现
- **可测试性强** - 距离计算、分页等逻辑适合TDD

**TDD示例：**
```typescript
// 第一步：编写测试用例 (store.test.ts)
describe('StoreService', () => {
  // 测试1：获取附近门店
  it('should return nearby stores sorted by distance', async () => {
    const result = await storeService.getNearbyStores(31.23, 121.47, 1, 10);
    expect(result.list[0].distance).toBeLessThan(result.list[1].distance);
  });
  
  // 测试2：分页功能
  it('should handle pagination correctly', async () => {
    const page1 = await storeService.getNearbyStores(31.23, 121.47, 1, 5);
    expect(page1.list.length).toBe(5);
    expect(page1.hasMore).toBe(true);
  });
  
  // 测试3：数据转换
  it('should convert snake_case to camelCase', async () => {
    const store = await storeService.getStoreDetail('1');
    expect(store.businessHours).toHaveProperty('start');
    expect(store.businessHours).toHaveProperty('end');
  });
});
```

**实现顺序：**
1. 门店列表 API → 2. 门店详情 API → 3. 推拿师列表 API → 4. 预约流程 API

### 后端架构调整

基于前端代码分析，需要调整的模块：
```
src/modules/
├── store/          # 门店模块
├── therapist/      # 推拿师模块
├── appointment/    # 预约模块
├── symptom/        # 新增：症状服务模块
├── order/          # 新增：订单模块（支付相关）
├── user/           # 用户模块
└── auth/           # 认证模块
```