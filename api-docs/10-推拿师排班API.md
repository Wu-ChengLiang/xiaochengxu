# 推拿师排班查询API

> **文档更新时间**: 2025-10-23
> **实现状态**: ✅ 已实现
> **用途**: 支持门店按预约流程中，症状选择页面的技师可用性判断
> **设计原则**: 单次API调用返回门店所有技师的多日排班数据

## 接口地址
```
GET /api/v2/stores/:storeId/therapists/availability
```

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| storeId | string | 是 | 门店ID |
| date | string | 否 | 起始日期（YYYY-MM-DD），默认当前日期 |
| days | number | 否 | 查询天数（1-7），默认3 |

## 请求示例

```bash
# 查询门店27从2025-10-25开始的3天排班（今明后）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3"
```

## 响应数据

### 成功响应 (200)

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "104",
      "name": "朴老师",
      "avatar": "https://mingyitang1024.com/static/therapists/朴老师.jpg",
      "title": "高级推拿师",
      "rating": 4.8,
      "ratingCount": 100,
      "availability": [
        {
          "date": "2025-10-25",
          "dayOfWeek": "周六",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": false },
            { "time": "11:00", "available": true },
            { "time": "12:00", "available": true },
            { "time": "13:00", "available": false },
            { "time": "14:00", "available": true }
          ]
        },
        {
          "date": "2025-10-26",
          "dayOfWeek": "周日",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true },
            { "time": "11:00", "available": true }
          ]
        },
        {
          "date": "2025-10-27",
          "dayOfWeek": "周一",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true }
          ]
        }
      ]
    },
    {
      "id": "105",
      "name": "张师傅",
      "avatar": "https://mingyitang1024.com/static/therapists/张师傅.jpg",
      "title": "推拿师",
      "rating": 4.6,
      "ratingCount": 85,
      "availability": [
        {
          "date": "2025-10-25",
          "dayOfWeek": "周六",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true },
            { "time": "11:00", "available": false }
          ]
        },
        {
          "date": "2025-10-26",
          "dayOfWeek": "周日",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": false },
            { "time": "10:00", "available": false },
            { "time": "11:00", "available": true }
          ]
        },
        {
          "date": "2025-10-27",
          "dayOfWeek": "周一",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true }
          ]
        }
      ]
    }
  ]
}
```

### 错误响应

#### 门店不存在 (404)
```json
{
  "code": 1001,
  "message": "门店不存在",
  "data": null
}
```

#### 无效的日期格式 (400)
```json
{
  "code": 1003,
  "message": "无效的日期格式，应为 YYYY-MM-DD",
  "data": null
}
```

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 推拿师ID |
| name | string | 推拿师姓名 |
| avatar | string | 推拿师头像URL |
| title | string | 职位等级 |
| rating | number | 评分（4.0-5.0） |
| ratingCount | number | 评价数 |
| availability | array | 排班信息数组 |
| availability[].date | string | 日期（YYYY-MM-DD） |
| availability[].dayOfWeek | string | 星期 |
| availability[].workTime | string | 工作时间（HH:MM-HH:MM） |
| availability[].slots | array | 时段数组 |
| availability[].slots[].time | string | 时刻（HH:MM） |
| availability[].slots[].available | boolean | 是否可预约 |

## 实现细节

### 后端实现位置

- **路由处理**: `src/routes/v2/client.js:53-102` - API路由定义和请求验证
- **核心逻辑**: `src/services/v2/therapistService.js:287-404` - 排班查询和数据转换
  - `getTherapistAvailability()` - 主方法
  - `getTherapistsAppointmentsInDateRange()` - 批量查询优化（避免N+1）
  - `generateTimeSlots()` - 时段生成
  - `getDayOfWeek()` - 星期转换

### 数据库优化

- **索引**: `migrations/add_appointment_indexes.sql`
  ```sql
  CREATE INDEX idx_appointments_therapist_date_status
  ON appointments(therapist_id, appointment_date, status);
  ```
  - 已在数据库中创建
  - 优化日期范围查询性能

### 排班生成逻辑

```javascript
// 实现原理
1. 检查门店是否存在 → getStoreDetail(storeId)
2. 获取门店所有活跃技师 → therapistService.searchTherapists(storeId)
3. 一次性查询所有技师在日期范围内的预约
   - SQL: WHERE therapist_id IN (...) AND appointment_date IN (...)
   - 仅查询 pending/confirmed 状态的预约
4. 为每个技师生成时段列表 9:00-21:00，每小时一个
5. 标记已预约时段 available=false，其余为 true
```

### 性能优化建议

1. **缓存策略**
   - 当天查询：缓存30分钟（可能有新预约）
   - 次日查询：缓存2小时
   - 3天后：缓存6小时

2. **数据库索引**
   ```sql
   CREATE INDEX idx_appointments_therapist_date_status
   ON appointments(therapist_id, appointment_date, status);
   ```

3. **查询优化**
   - 一次性获取所有技师的预约数据，避免N+1查询
   - 按日期分组，减少数据库扫描

## 使用场景

### 前端调用示例

```typescript
// 获取门店27从今天开始的3天排班
const response = await fetch(
  `/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3`
)
const data = await response.json()

// 判断技师在某时刻是否可用
const therapist = data.data[0]  // 第一个技师
const slot = therapist.availability[0].slots.find(s => s.time === "10:00")
const isAvailable = slot?.available  // true | false
```

## 兼容性说明

- ✅ 与 `/api/v2/stores/:storeId/therapists` 独立，互不影响
- ✅ 与 `/api/v2/therapists/:id` 的排班数据来源一致
- ✅ 支持未来7天的查询

## 测试用例

```bash
# 测试1：查询今明后三天（推荐场景）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3"

# 测试2：仅查询指定日期
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=1"

# 测试3：使用默认参数（当前日期，3天）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability"

# 测试4：门店不存在
curl "https://mingyitang1024.com/api/v2/stores/99999/therapists/availability"
```

---

# 11. 获取订单支付参数（已有订单）

> **文档更新时间**: 2025-10-23
> **实现状态**: ✅ 已实现
> **用途**: 支持订单列表页中的待支付订单调用确认页时获取微信支付参数
> **设计原理**: 仅获取支付参数，不改变订单状态，供前端在确认页调用 wx.requestPayment()

## 接口地址

```
GET /api/v2/orders/{orderNo}/payment-params
```

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号（路径参数） |

## 请求示例

```bash
# 获取订单 ORDER202501011234567 的支付参数
curl "https://mingyitang1024.com/api/v2/orders/ORDER202501011234567/payment-params"
```

## 响应数据

### 成功响应 (200) - 微信支付

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202501011234567",
    "amount": 12800,  // 订单金额（分）
    "paymentMethod": "wechat",
    "wxPayParams": {
      "timeStamp": "1234567890",
      "nonceStr": "random_string_abc123",
      "package": "prepay_id=wx20250101123456789abcdefg",
      "signType": "RSA",
      "paySign": "signature_after_signing"
    }
  }
}
```

### 成功响应 (200) - 余额支付

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202501011234567",
    "amount": 12800,  // 订单金额（分）
    "paymentMethod": "balance"
  }
}
```

### 错误响应

#### 订单不存在 (404)
```json
{
  "code": 1001,
  "message": "订单不存在",
  "data": null
}
```

#### 订单已支付 (400)
```json
{
  "code": 1003,
  "message": "订单已支付，无需重复支付",
  "data": null
}
```

#### 微信支付参数生成失败 (500)
```json
{
  "code": 3001,
  "message": "微信支付参数生成失败，请稍后重试",
  "data": null
}
```

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| orderNo | string | 订单号 |
| amount | number | 订单金额（分） |
| paymentMethod | string | 支付方式：wechat / balance |
| wxPayParams | object | 微信支付参数（仅当 paymentMethod='wechat' 时返回） |
| wxPayParams.timeStamp | string | 时间戳 |
| wxPayParams.nonceStr | string | 随机字符串 |
| wxPayParams.package | string | 统一下单返回的 prepay_id |
| wxPayParams.signType | string | 签名算法：RSA |
| wxPayParams.paySign | string | 签名值 |

## 实现说明

### 后端实现位置

- **路由处理**: `src/routes/v2/orders.js:10-45` - 新API路由定义和错误处理
- **核心逻辑**: `src/services/v2/orderService.js:407-478` - 支付参数获取方法
  - `getPaymentParams()` - 主方法

### 核心逻辑

1. **验证订单**
   - 检查订单是否存在
   - 检查订单是否为 pending 状态（未支付）
   - 如果已支付，返回错误提示

2. **微信支付处理**
   - 调用微信支付API获取预支付订单（`POST /v3/pay/transactions/jsapi`）
   - 使用商户私钥对返回的 prepay_id 进行签名
   - 返回前端需要的 5 个参数：timeStamp、nonceStr、package、signType、paySign

3. **余额支付处理**
   - 仅返回订单号和金额
   - 不生成微信支付参数

### 重要约束

- ✅ 仅返回支付参数，不改变订单状态
- ✅ 不扣款、不更新订单支付状态
- ✅ 支持多次调用（重新获取支付参数）
- ✅ 超过 10 分钟未支付的订单，前端刷新时重新调用此接口获取新参数

### 前端使用流程

```typescript
// 1. 获取支付参数
const paymentParams = await api.get(`/orders/${orderNo}/payment-params`)

// 2. 调用微信支付
if (paymentParams.data.paymentMethod === 'wechat') {
  wx.requestPayment({
    timeStamp: paymentParams.data.wxPayParams.timeStamp,
    nonceStr: paymentParams.data.wxPayParams.nonceStr,
    package: paymentParams.data.wxPayParams.package,
    signType: paymentParams.data.wxPayParams.signType,
    paySign: paymentParams.data.wxPayParams.paySign,
    success: () => {
      // 支付成功（前端感知）
      // 实际是否真正支付成功，应由服务器回调判断
    }
  })
}
```

## 使用场景

### 场景：订单列表待支付订单点击"去支付"

```
订单列表页面
  ↓
点击"去支付"按钮
  ↓
跳转到确认页 (orderNo 参数)
  ↓
确认页加载订单详情
  ↓
用户选择支付方式（微信/余额）
  ↓
点击"去支付"按钮
  ↓
调用此 API 获取支付参数
  ↓
微信支付：调用 wx.requestPayment()
余额支付：直接调用 /orders/pay 端点
  ↓
完成
```

## 与其他API的关系

| API | 用途 | 时机 |
|-----|------|------|
| POST /appointments/create-with-order | 创建新预约并同时生成订单 + 支付参数 | 预约确认页 |
| GET /orders/{orderNo}/payment-params | 获取已有订单的支付参数（不创建订单） | 订单列表 → 确认页 |
| POST /orders/pay | 确认支付（扣款、更新订单状态） | 支付完成后 |

## 测试用例

```bash
# 测试1：获取待支付订单的微信支付参数
curl "https://mingyitang1024.com/api/v2/orders/ORDER202501011234567/payment-params"

# 测试2：获取已支付订单（应返回错误）
curl "https://mingyitang1024.com/api/v2/orders/ORDER202501011234568/payment-params"

# 测试3：获取不存在的订单（应返回错误）
curl "https://mingyitang1024.com/api/v2/orders/ORDER999999999/payment-params"

# 完整测试流程：获取参数 → 支付 → 查询订单状态
curl "https://mingyitang1024.com/api/v2/orders/ORDER202501011234567/payment-params" \
  && echo "获取支付参数成功，可调用 wx.requestPayment()" \
  && curl -X POST "https://mingyitang1024.com/api/v2/orders/pay" \
    -H "Content-Type: application/json" \
    -d '{"orderNo": "ORDER202501011234567", "paymentMethod": "wechat"}' \
  && curl "https://mingyitang1024.com/api/v2/orders/ORDER202501011234567"
```
