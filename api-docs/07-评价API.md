# 评价系统API文档

## 方案说明

**采用方案一：基于现有字段实现**
- 利用 `appointments` 表现有的 `rating` 和 `review` 字段
- 零数据库改动，立即可用
- 评价与预约强绑定，保证数据一致性

## 核心接口

### 1. 创建评价

#### 接口地址
```
POST /api/v2/reviews
```

#### 请求参数
```json
{
  "appointmentId": 123,           // 预约ID（必填）
  "rating": 5,                    // 评分1-5星（必填）
  "content": "服务很专业，效果显著" // 评价内容（必填，最少10字）
}
```

#### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "reviewId": 123,              // 使用appointmentId作为reviewId
    "appointmentId": 123,
    "rating": 5,
    "content": "服务很专业，效果显著",
    "updatedTherapistRating": 4.8,
    "updatedRatingCount": 129,
    "createdAt": "2025-09-23T15:30:00.000Z"
  }
}
```

#### 业务逻辑
1. **防重复评价**：检查appointment是否已有rating/review
2. **状态验证**：只有completed状态的预约才能评价
3. **权限验证**：只能评价自己的预约
4. **自动更新**：评价后更新therapist的rating统计

---

### 2. 获取推拿师评价列表

#### 接口地址
```
GET /api/v2/therapists/{therapistId}/reviews
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| therapistId | number | 是 | 推拿师ID |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| rating | number | 否 | 按星级筛选（1-5） |

#### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "reviewId": 123,
        "appointmentId": 123,
        "userId": 20,
        "userName": "张**",           // 脱敏用户名
        "userAvatar": null,          // 基于现有字段不支持
        "rating": 5,
        "content": "服务很专业，效果显著",
        "appointmentDate": "2025-09-23",
        "serviceType": "推拿按摩",
        "createdAt": "2025-09-23T15:30:00.000Z"
      }
    ],
    "total": 128,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  }
}
```

---

### 3. 获取用户评价历史

#### 接口地址
```
GET /api/v2/users/{userId}/reviews
```

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

#### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "reviewId": 123,
        "appointmentId": 123,
        "therapistId": 181,
        "therapistName": "宋老师",
        "storeId": 6,
        "storeName": "测试门店",
        "rating": 5,
        "content": "服务很专业，效果显著",
        "appointmentDate": "2025-09-23",
        "serviceType": "推拿按摩",
        "createdAt": "2025-09-23T15:30:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  }
}
```

---

### 4. 获取评价详情

#### 接口地址
```
GET /api/v2/reviews/{reviewId}
```

#### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "reviewId": 123,
    "appointmentId": 123,
    "userId": 20,
    "userName": "张**",
    "therapistId": 181,
    "therapistName": "宋老师",
    "storeId": 6,
    "storeName": "测试门店",
    "appointmentDate": "2025-09-23",
    "serviceType": "推拿按摩",
    "rating": 5,
    "content": "服务很专业，效果显著",
    "createdAt": "2025-09-23T15:30:00.000Z"
  }
}
```

---

### 5. 获取推拿师评价统计

#### 接口地址
```
GET /api/v2/therapists/{therapistId}/review-stats
```

#### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalCount": 128,
    "averageRating": 4.8,
    "ratingBreakdown": {
      "5": 85,    // 5星评价数量
      "4": 25,    // 4星评价数量
      "3": 12,    // 3星评价数量
      "2": 4,     // 2星评价数量
      "1": 2      // 1星评价数量
    }
  }
}
```

---

## 数据库结构

### 使用现有 appointments 表
```sql
-- 无需新建表，使用现有字段
appointments:
  - rating INTEGER (1-5评分)
  - review TEXT (评价内容)
  - user_id INTEGER (评价用户)
  - therapist_id INTEGER (被评价推拿师)
  - status TEXT (只有'completed'可评价)
  - created_at DATETIME (评价时间)
```

### 推拿师评分统计更新
```sql
-- 更新therapists表的rating字段（如果存在）
UPDATE therapists SET
  rating = (SELECT AVG(rating) FROM appointments WHERE therapist_id = ? AND rating IS NOT NULL),
  rating_count = (SELECT COUNT(*) FROM appointments WHERE therapist_id = ? AND rating IS NOT NULL)
WHERE id = ?
```

---

## 业务规则

### 评价权限
1. 只有 `completed` 状态的预约才能评价
2. 每个预约只能评价一次（rating/review不为空即已评价）
3. 只能评价自己的预约

### 评价内容限制
1. 评价内容最少10字，最多500字
2. 评分必须是1-5的整数

### 推拿师评分更新
1. 创建评价后自动重新计算推拿师的平均评分
2. 更新评价总数统计

---

## 实现限制（基于现有字段）

### 不支持的功能
- ❌ 评价标签
- ❌ 匿名评价
- ❌ 商家回复
- ❌ 用户头像显示
- ❌ 独立的reviewId（使用appointmentId代替）

### 支持的核心功能
- ✅ 评分和评价内容
- ✅ 防重复评价
- ✅ 权限控制
- ✅ 评价列表和统计
- ✅ 用户脱敏显示

### 初期数据说明
- 生产环境初期无用户评价数据（totalCount = 0）
- 评价统计接口返回空数据是正常状态
- 待用户积累评价后，相关统计会自动更新

---

## 测试用例

### 创建评价
```bash
curl -X POST http://localhost:3001/api/v2/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": 123,
    "rating": 5,
    "content": "宋老师手法很专业，颈椎调理效果显著"
  }'
```

### 获取推拿师评价列表
```bash
curl "http://localhost:3001/api/v2/therapists/181/reviews?page=1&pageSize=10"
```

### 获取评价统计
```bash
curl "http://localhost:3001/api/v2/therapists/181/review-stats"
```

---

## 实施计划

### Phase 1: TDD开发
1. 编写失败的测试用例
2. 实现最小功能让测试通过
3. 重构优化

### Phase 2: 核心API实现
1. POST /api/v2/reviews - 创建评价
2. GET /api/v2/therapists/{id}/reviews - 推拿师评价列表
3. GET /api/v2/users/{id}/reviews - 用户评价历史

### Phase 3: 统计API
1. GET /api/v2/reviews/{id} - 评价详情
2. GET /api/v2/therapists/{id}/review-stats - 评价统计

### Phase 4: 优化
1. 性能优化
2. 错误处理完善
3. 缓存策略

**预计开发时间**: 1-2天