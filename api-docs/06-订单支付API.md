# 订单支付API文档

## MVP版本说明

此文档为订单支付系统的MVP（最小可行产品）版本，包含以下特性：
- **一体化预约订单**：预约和订单同时创建（`POST /api/v2/appointments/create-with-order`）
- **简化支付方式**：仅支持微信或余额支付（不支持混合支付）
- **订单同步创建**：下单即创建订单记录，支付后更新状态

### 注意：API端点变化
- ❌ **已删除** `POST /api/v2/orders/create` - 通用订单创建API
- ✅ **使用** `POST /api/v2/appointments/create-with-order` - 预约订单一体化创建（推荐）

## 重要：金额单位规范

**全系统统一规约**：
- 所有前端请求：**分**为单位（已经是分，不需要再转换）
- 所有数据库存储：**分**为单位
- 所有API返回：**分**为单位
- 微信API调用：**分**为单位

### 金额转换规则
```
前端发送价格（分）→ 直接使用 → 数据库存储（分）→ API返回（分）→ 微信API（分）
```

**注意**：前端请求的 price 字段**已经是分为单位**，后端应直接使用，**不需要乘以100**。

---

# 预约订单创建API

## 1. 创建预约并生成订单

### 接口地址
```
POST /api/v2/appointments/create-with-order
```

### 说明
这是**预约专用的一体化端点**，同时创建预约记录和关联的订单。与通用订单创建API不同，此端点：
- 自动创建预约记录（appointments表）
- 自动创建关联订单（orders表）
- 支持自动选择最优优惠券
- 对于微信支付，直接返回可用的支付参数

### 请求参数
```json
{
  "therapistId": 1,                    // 技师ID（必填）
  "storeId": 1,                        // 门店ID（必填）
  "userId": 123,                       // 用户ID（必填）
  "userPhone": "13800138000",          // 用户电话（必填）
  "userName": "张三",                  // 用户名称（可选）
  "appointmentDate": "2024-12-25",     // 预约日期（必填，格式YYYY-MM-DD）
  "startTime": "14:00",                // 开始时间（必填，格式HH:mm）
  "duration": 60,                      // 服务时长（分钟，可选，默认60）
  "price": 12800,                      // 价格（必填，单位：分）
  "serviceName": "颈部按摩",           // 服务名称（必填）
  "therapistName": "王师傅",           // 技师名称（必填）
  "paymentMethod": "wechat",           // 支付方式（可选，默认wechat，支持：wechat/balance）
  "serviceId": 1,                      // 服务ID（可选）
  "serviceType": "massage"             // 服务类型（可选）
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appointment": {
      "id": 123,                       // 预约ID
      "therapistId": 1,
      "storeId": 1,
      "appointmentDate": "2024-12-25",
      "startTime": "14:00",
      "endTime": "15:00",              // 自动计算
      "price": 12800,                  // 金额（分）
      "status": "pending",             // 预约状态
      "orderNo": "ORDER202412251234567" // 关联订单号
    },
    "order": {
      "orderNo": "ORDER202412251234567",  // 订单号
      "orderType": "service",
      "title": "预约王师傅-颈部按摩",
      "originalAmount": 12800,        // 原价（分）
      "amount": 12800,                // 实际金额（分），可能应用了优惠券或折扣
      "paymentMethod": "wechat",
      "paymentStatus": "pending",
      "createdAt": "2024-12-25T06:00:00.000Z",
      // 如果有优惠券，返回优惠信息
      "voucherUsed": {
        "voucherCode": "SAVE10",
        "discountAmount": 1200         // 优惠金额（分）
      },
      // 仅当支付方式为微信时返回
      "wxPayParams": {
        "prepay_id": "wx_prepay_id",
        "timeStamp": "1234567890",
        "nonceStr": "random_string",
        "package": "prepay_id=wx_prepay_id",
        "signType": "RSA",
        "paySign": "signature"
      }
    }
  }
}
```

### 实现说明
1. **事务处理**：预约和订单创建在单个事务中，保证数据一致性
2. **优惠券应用**：
   - 自动检查用户可用优惠券
   - 选择最优的优惠券（优惠金额最大）
   - 若用户无优惠券，使用用户折扣率（discount_rate）
3. **金额计算**：
   - 前端发送价格已是分为单位：`price`（分）
   - 后端直接使用：`originalAmount = price`（无需转换）
   - 应用优惠后：`finalAmount = originalAmount - discountAmount`
4. **微信支付**：
   - 校验用户是否绑定openid
   - 调用微信支付API获取预支付订单
   - 返回签名后的支付参数供前端调用wx.requestPayment()
5. **订单状态**：
   - `payment_status`: pending（待支付）
   - 支付后通过支付回调更新为paid
6. **预约状态**：
   - `status`: pending（待确认）
   - `payment_status`: unpaid（待支付）
   - 支付成功后payment_status更新为paid

### 错误情况
| 错误码 | 说明 |
|--------|------|
| 1001 | 技师不存在或已停职 / 用户不存在 / 服务不存在 |
| 1003 | 该时间段已被预约 |
| 其他 | 微信支付初始化失败 |

### 特殊说明

#### 关于重复预约检查
系统会检查**该技师在同一时间段是否已被预约**（通过唯一索引约束）：
- 技师 + 预约日期 + 开始时间 必须唯一
- 若重复，返回1003错误

#### 关于订单与预约的关系
- 一个预约对应一个订单
- 订单号存储在 appointments.order_no 字段
- 订单的 extra_data 包含预约详情（用于订单列表查询）

#### 关于优惠券使用
- 优惠券绑定到订单的extra_data中
- 使用后优惠券被标记为已使用（vouchers表）
- 余额支付和微信支付都支持优惠券

---

# 钱包支付相关API

## 5. 获取钱包余额

### 接口地址
```
GET /api/v2/users/wallet/balance
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 12500,        // 可用余额（分为单位，直接从users.balance读取）
    "totalSpent": 128000,    // 总消费（users.total_spent）
    "totalVisits": 15        // 总访问次数（users.total_visits）
  }
}
```

### 实现说明
- 直接从users表的balance字段读取余额
- 不需要单独的user_wallets表

## 6. 创建订单（统一接口）

### 接口地址
```
POST /api/v2/orders/create
```

### 请求参数
```json
{
  "orderType": "service",     // service服务/product商品/recharge充值
  "userId": 123,              // 用户ID（必填）
  "title": "颈部按摩60分钟",   // 订单标题
  "amount": 12800,            // 金额（分为单位）
  "paymentMethod": "balance", // wechat微信支付/balance余额支付
  "extraData": {
    // 不同类型订单的额外信息
    // 服务类：
    "therapistId": "1",
    "storeId": "1",
    "appointmentDate": "2024-01-20",
    "startTime": "14:00",
    "duration": 60
    // 充值类：
    // "bonus": 1000  // 赠送金额
    // 商品类：
    // "productId": "1",
    // "quantity": 2
  }
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202401151234567",
    "orderType": "service",
    "title": "颈部按摩60分钟",
    "amount": 12800,
    "paymentMethod": "balance",
    "paymentStatus": "pending",  // pending待支付/paid已支付/failed失败/refunded已退款
    "createdAt": "2024-01-15T14:30:00.000Z",
    // 如果是微信支付，返回支付参数
    "wxPayParams": {
      "prepayId": "wx_prepay_id",
      "timeStamp": "1234567890",
      "nonceStr": "random_string",
      "package": "prepay_id=wx_prepay_id",
      "signType": "RSA",
      "paySign": "signature"
    }
  }
}
```

## 7. 支付订单

### 接口地址
```
POST /api/v2/orders/pay
```

### 请求参数
```json
{
  "orderNo": "ORDER202401151234567",
  "paymentMethod": "balance"  // wechat微信支付/balance余额支付
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202401151234567",
    "paymentStatus": "paid",
    "paidAt": "2024-01-15T14:35:00.000Z",
    // 余额支付返回
    "balance": 4500,  // 支付后余额
    // 微信支付返回支付参数
    "wxPayParams": {
      "prepayId": "wx_prepay_id",
      "timeStamp": "1234567890",
      "nonceStr": "random_string",
      "package": "prepay_id=wx_prepay_id",
      "signType": "RSA",
      "paySign": "signature"
    }
  }
}
```

## 8. 获取订单列表

### 接口地址
```
GET /api/v2/orders
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID |
| status | string | 否 | 订单状态：pending/paid/failed/refunded |
| orderType | string | 否 | 订单类型：service/product/recharge |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "orderNo": "ORDER202401151234567",
        "orderType": "service",
        "userId": 123,
        "userPhone": "13800138000",
        "title": "颈部按摩60分钟",
        "amount": 12800,
        "paymentMethod": "balance",
        "paymentStatus": "paid",
        "extraData": {
          "appointmentId": 123,              // 关联的预约ID（如果有）
          "appointmentStatus": "completed",  // 预约状态（自动查询添加）
          "therapistId": "1",
          "storeId": "1",
          "appointmentDate": "2024-01-20",
          "startTime": "14:00",
          "duration": 60
        },
        "paidAt": "2024-01-15T14:35:00.000Z",
        "createdAt": "2024-01-15T14:30:00.000Z"
      },
      {
        "orderNo": "ORDER202401151234568",
        "orderType": "product",
        "userId": 123,
        "userPhone": "13800138000",
        "title": "电子礼卡 ¥200",
        "amount": 20000,
        "paymentMethod": "wechat",
        "paymentStatus": "pending",
        "extraData": {
          "productType": "gift_card",
          "cardType": "electronic",
          "faceValue": 20000,
          "quantity": 1
        },
        "createdAt": "2024-01-15T15:00:00.000Z"
      },
      {
        "orderNo": "ORDER202401151234569",
        "orderType": "recharge",
        "userId": 123,
        "userPhone": "13800138000",
        "title": "充值100元",
        "amount": 10000,
        "paymentMethod": "wechat",
        "paymentStatus": "paid",
        "extraData": {
          "bonus": 1000
        },
        "paidAt": "2024-01-15T16:00:00.000Z",
        "createdAt": "2024-01-15T15:55:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

### 实现说明
- 根据userId查询用户的所有订单
- 支持按状态和类型筛选
- 按创建时间倒序排列
- **extraData字段现已自动解析为对象**（不再返回JSON字符串）
- **批量查询预约状态并自动添加appointmentStatus字段**（优化避免N+1查询）
- 分页查询，避免一次返回过多数据

### extraData字段说明
根据orderType不同，extraData应包含以下字段：

#### service类型（按摩预约）
```json
{
  "appointmentId": 123,            // 关联的预约ID（创建后自动生成）
  "appointmentStatus": "completed", // 预约状态（系统自动查询添加）：pending/confirmed/serving/completed/cancelled
  "therapistId": "1",              // 技师ID（必需）
  "therapistName": "张师傅",       // 技师姓名（必需）
  "therapistAvatar": "url",        // 技师头像URL（必需）
  "storeId": "1",                  // 门店ID（必需）
  "storeName": "上海万象城店",     // 门店名称（必需）
  "storeAddress": "闵行区吴中路1599号", // 门店地址（必需）
  "serviceId": "1",                // 服务ID（必需）
  "serviceName": "颈部按摩",       // 服务名称（必需）
  "appointmentDate": "2024-01-20", // 预约日期（必需）
  "startTime": "14:00",            // 开始时间（必需）
  "duration": 60,                  // 服务时长（分钟）（必需）
  "price": 15800,                  // 原价（分）（可选）
  "discountPrice": 12800           // 折扣价（分）（可选）
}
```

#### product类型（商品订单）
```json
{
  "productType": "gift_card",      // 商品类型：gift_card/merchandise（必需）
  "productId": "electronic-card",  // 商品ID（必需）
  "productName": "电子礼卡",       // 商品名称（必需）
  "quantity": 1,                   // 购买数量（必需）
  // gift_card类型额外字段
  "cardType": "electronic",        // 卡类型（gift_card必需）
  "faceValue": 20000,              // 面值（gift_card必需）
  "customMessage": "祝福语",       // 自定义祝福（可选）
  // merchandise类型额外字段
  "specifications": {}             // 商品规格（merchandise可选）
}
```

#### recharge类型（充值订单）
```json
{
  "rechargeAmount": 10000,         // 充值金额（分）（必需）
  "bonus": 1000,                   // 赠送金额（分）（必需）
  "actualAmount": 11000            // 实际到账金额（分）（必需）
}
```

## 9. 获取订单详情

### 接口地址
```
GET /api/v2/orders/{orderNo}
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderNo | string | 是 | 订单号（路径参数） |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202401151234567",
    "orderType": "service",
    "userId": 123,
    "userPhone": "13800138000",
    "title": "颈部按摩60分钟",
    "amount": 12800,
    "paymentMethod": "balance",
    "paymentStatus": "paid",
    "extraData": {
      "appointmentId": 123,              // 关联的预约ID（如果有）
      "appointmentStatus": "completed",  // 预约状态（自动查询添加）
      "therapistId": "1",
      "storeId": "1",
      "appointmentDate": "2024-01-20",
      "startTime": "14:00",
      "duration": 60
    },
    "wxPrepayId": null,
    "wxTransactionId": null,
    "paidAt": "2024-01-15T14:35:00.000Z",
    "refundedAt": null,
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:35:00.000Z"
  }
}
```

### 实现说明
- 通过订单号获取订单详情
- **extraData字段现已自动解析为对象**（不再返回JSON字符串）
- **如果订单关联了预约（存在appointmentId），会自动查询并添加appointmentStatus字段**
- appointmentStatus可能的值：pending/confirmed/serving/completed/cancelled
- 如果订单不存在，返回404错误

## 10. 取消订单

### 接口地址
```
POST /api/v2/orders/cancel
```

### 请求参数
```json
{
  "orderNo": "ORDER202401151234567",
  "userId": 123,
  "reason": "用户取消"
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderNo": "ORDER202401151234567",
    "paymentStatus": "cancelled",
    "refundAmount": 12800,
    "refundRate": 1,
    "cancelledAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### 实现说明
- 只能取消pending或paid状态的订单
- 已支付订单取消时需要退款到余额
- 退款金额可能根据取消时间计算手续费

## 11. 退款到余额

### 接口地址
```
POST /api/v2/users/wallet/refund
```

### 请求参数
```json
{
  "phone": "13800138000",
  "amount": 8000,  // 退款金额（分为单位）
  "orderNo": "ORD123456789",  // 原订单号
  "description": "订单退款"
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "transactionId": "TXN202401151234568",
    "balance": 12500,  // 退款后余额
    "amount": 8000,    // 退款金额
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
}
```

## 12. 获取交易记录

### 接口地址
```
GET /api/v2/users/wallet/transactions
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| type | string | 否 | 交易类型：recharge/consume/refund |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "TXN202401151234567",
        "type": "recharge",  // recharge充值/consume消费/refund退款
        "amount": 10000,     // 交易金额（分）
        "balance": 12500,    // 交易后余额
        "description": "充值100元，赠送10元",
        "orderNo": "RECHARGE202401151234567",  // 关联订单号
        "createdAt": "2024-01-15T14:30:00.000Z"
      },
      {
        "id": "TXN202401151234568",
        "type": "consume",
        "amount": -8000,     // 消费为负数
        "balance": 4500,
        "description": "支付订单-颈部按摩",
        "orderNo": "ORD123456789",
        "createdAt": "2024-01-15T15:00:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

## 13. 申请退款

### 接口地址
```
POST /api/v2/orders/:orderNo/refund
```

### 请求参数
```json
{
  "userId": 123,              // 用户ID（必填）
  "reason": "用户主动退款",    // 退款原因（可选）
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "refundId": "REF202401151234567",      // 退款单号
    "orderNo": "ORDER202401151234567",     // 原订单号
    "refundAmount": 12800,                 // 退款金额（分）
    "paymentMethod": "wechat",             // 支付方式（决定了退款渠道）
    "status": "pending",                   // pending处理中/success成功/failed失败
    "reason": "用户主动退款",
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### 实现说明
- 验证订单所有权（userId必须与订单的user_id一致）
- 只能退款已支付的订单（payment_status='paid'）
- 根据支付方式自动确定退款渠道：
  - 微信支付（payment_method='wechat'）：调用微信退款API，原路返回到微信钱包
  - 余额支付（payment_method='balance'）：直接退款到用户平台余额
- 创建退款记录（refunds表）
- 返回退款单号供后续查询

### 错误情况
| 错误码 | 说明 |
|--------|------|
| 1001 | 参数错误/订单不存在 |
| 1003 | 无权限/订单状态不符 |
| 3001 | 微信支付API调用失败 |

---

## 14. 查询退款

### 接口地址
```
GET /api/v2/refunds/:refundId
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refundId | string | 是 | 退款单号（路径参数） |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "refundId": "REF202401151234567",      // 退款单号
    "orderNo": "ORDER202401151234567",     // 原订单号
    "userId": 123,
    "userPhone": "13800138000",
    "originalAmount": 12800,               // 原订单金额
    "refundAmount": 12800,                 // 本次退款金额
    "paymentMethod": "wechat",             // 支付方式（wechat原路返回/balance余额退款）
    "status": "success",                   // pending/success/failed
    "reason": "用户主动退款",
    "failedReason": null,                  // 失败原因（如果失败）
    "wxRefundId": "50000000012345",        // 微信退款单号（仅微信支付时有值）
    "requestedAt": "2024-01-15T16:00:00.000Z",  // 申请时间
    "processedAt": "2024-01-15T16:05:00.000Z",  // 处理完成时间
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### 实现说明
- 通过退款单号查询退款详情
- 退款渠道由 paymentMethod 确定：
  - paymentMethod='wechat'：原路返回到微信钱包
  - paymentMethod='balance'：已退款到用户余额
- 如果退款ID不存在，返回404错误

---

## 15. 获取用户退款列表

### 接口地址
```
GET /api/v2/users/:userId/refunds
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID（路径参数） |
| status | string | 否 | 退款状态：pending/success/failed |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "refundId": "REF202401151234567",
        "orderNo": "ORDER202401151234567",
        "refundAmount": 12800,
        "paymentMethod": "wechat",
        "status": "success",
        "reason": "用户主动退款",
        "requestedAt": "2024-01-15T16:00:00.000Z",
        "processedAt": "2024-01-15T16:05:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "hasMore": false
  }
}
```

### 实现说明
- 获取用户的所有退款记录
- 按申请时间倒序排列
- 支持按状态筛选
- 分页查询

---

## 16. 微信支付回调

### 接口地址
```
POST /api/v2/payments/wechat/notify
```

### 说明
- 接收微信支付结果通知
- 验证支付成功后自动充值余额
- 更新充值订单状态
- 创建交易记录

### 重要：预约订单支付状态同步

当通过 `create-with-order` 创建的**预约订单**支付成功时（payment_status: pending → paid）：
1. 订单表 orders 会自动更新为 paid
2. **预约表 appointments 的 payment_status 也会自动更新为 paid**
3. 预约状态 appointments.status 保持为 pending（待确认）

这确保了前端可以正确查询到已支付的预约信息。

---

## 17. 微信退款回调

### 接口地址
```
POST /api/v2/payments/wechat/refund-notify
```

### 说明
- 接收微信退款结果通知
- 验证退款成功/失败
- 更新退款记录状态
- 更新订单payment_status为refunded

---

# 数据库表结构设计

## 重要说明：基于现有users表的扩展方案

### 现有users表结构（已存在，不可删除）
```sql
-- 现有users表包含以下核心字段：
-- id                    INTEGER PRIMARY KEY     -- 主键
-- phone                 VARCHAR(20) UNIQUE      -- 手机号（唯一）
-- username              VARCHAR(100) UNIQUE     -- 用户名
-- membership_number     VARCHAR(50)             -- 会员号
-- member_level          VARCHAR(20)             -- 会员等级
-- balance               INTEGER DEFAULT 0       -- 余额（分为单位）★MVP直接使用
-- points                INTEGER DEFAULT 0       -- 积分（MVP不用）
-- discount_rate         DECIMAL(3,2)            -- 折扣率（MVP设为1.0）
-- total_spent           INTEGER DEFAULT 0       -- 总消费
-- total_visits          INTEGER DEFAULT 0       -- 总访问次数
-- medical_record_number VARCHAR(50)             -- 病历号（MVP不用）
-- constitution_type     VARCHAR(50)             -- 体质类型（MVP不用）
-- allergies            TEXT                    -- 过敏信息（MVP不用）
-- tcm_diagnosis_history TEXT                    -- 中医诊断历史（MVP不用）
-- created_at           DATETIME
-- updated_at           DATETIME

-- appointments表已有外键关联：
-- appointments.user_id → users.id
```

### 需要为users表新增的字段（支持微信登录）
```sql
-- 最小化改动：仅添加微信登录必需字段
ALTER TABLE users ADD COLUMN openid VARCHAR(100) UNIQUE;    -- 微信唯一标识
ALTER TABLE users ADD COLUMN avatar VARCHAR(500);            -- 用户头像URL
ALTER TABLE users ADD COLUMN nickname VARCHAR(100);          -- 微信昵称
ALTER TABLE users ADD COLUMN session_key VARCHAR(255);       -- 微信会话密钥（加密存储）

-- 添加索引
CREATE INDEX idx_users_openid ON users(openid);
```

## 1. 钱包交易记录表 (wallet_transactions) - 新建

```sql
CREATE TABLE wallet_transactions (
  id VARCHAR(50) PRIMARY KEY,          -- TXN开头的交易ID
  user_id INTEGER NOT NULL,            -- 关联users表的id（主要外键）
  phone VARCHAR(20) NOT NULL,          -- 冗余存储，方便查询
  type VARCHAR(20) NOT NULL,           -- recharge/consume/refund
  amount INTEGER NOT NULL,             -- 交易金额（分），正数为入账，负数为出账
  balance_after INTEGER NOT NULL,      -- 交易后余额（分）
  description VARCHAR(500) NOT NULL,   -- 交易描述
  order_no VARCHAR(50),                -- 关联订单号
  extra_data TEXT,                     -- 额外数据（JSON格式）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (phone) REFERENCES users(phone) ON UPDATE CASCADE
);

-- 索引
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_phone ON wallet_transactions(phone);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_wallet_transactions_order_no ON wallet_transactions(order_no);
```

## 2. 统一订单表 (orders) - 新建

```sql
CREATE TABLE orders (
  order_no VARCHAR(50) PRIMARY KEY,    -- ORDER开头的订单号
  order_type VARCHAR(20) NOT NULL,     -- service服务/product商品/recharge充值
  user_id INTEGER NOT NULL,            -- 关联users表的id（主要外键）
  user_phone VARCHAR(20) NOT NULL,     -- 冗余存储，方便查询
  title VARCHAR(200) NOT NULL,         -- 订单标题
  amount INTEGER NOT NULL,             -- 订单金额（分）
  payment_method VARCHAR(20),          -- wechat微信/balance余额
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending/paid/failed/refunded
  extra_data TEXT,                     -- 额外数据（JSON格式）
  wx_prepay_id VARCHAR(100),           -- 微信预支付ID
  wx_transaction_id VARCHAR(100),      -- 微信交易号
  paid_at DATETIME,                    -- 支付时间
  refunded_at DATETIME,                -- 退款时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_phone) REFERENCES users(phone) ON UPDATE CASCADE
);

-- 索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_user_phone ON orders(user_phone);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

## 3. 充值配置表 (recharge_configs) - 新建

```sql
CREATE TABLE recharge_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,           -- 充值金额（分）
  bonus INTEGER NOT NULL DEFAULT 0, -- 赠送金额（分）
  label VARCHAR(100) NOT NULL,       -- 显示标签
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始数据
INSERT INTO recharge_configs (amount, bonus, label, sort_order) VALUES
(10000, 0, '100元', 1),
(20000, 0, '200元', 2),
(50000, 5000, '500元（赠50元）', 3),
(100000, 10000, '1000元（赠100元）', 4),
(200000, 30000, '2000元（赠300元）', 5),
(500000, 100000, '5000元（赠1000元）', 6);
```

## 4. 退款记录表 (refunds) - 新建

```sql
CREATE TABLE refunds (
  id VARCHAR(50) PRIMARY KEY,              -- REF开头的退款单号
  order_no VARCHAR(50) NOT NULL,           -- 原订单号
  user_id INTEGER NOT NULL,                -- 用户ID
  user_phone VARCHAR(20) NOT NULL,         -- 用户电话（冗余存储）

  -- 金额信息
  original_amount INTEGER NOT NULL,        -- 原订单金额（分）
  refund_amount INTEGER NOT NULL,          -- 本次退款金额（分）

  -- 支付方式（决定退款渠道）
  payment_method VARCHAR(20) NOT NULL,     -- wechat微信/balance余额
  -- wechat: 原路返回到微信钱包
  -- balance: 退款到用户平台余额

  -- 微信退款信息（仅当payment_method='wechat'时有值）
  wx_refund_id VARCHAR(100),               -- 微信退款单号

  -- 退款原因
  reason VARCHAR(500),                     -- 退款原因
  failed_reason VARCHAR(500),              -- 失败原因（仅当退款失败时有值）

  -- 退款状态流转
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending/success/failed
  -- pending: 等待微信处理（仅微信支付）
  -- success: 退款成功
  -- failed: 退款失败（仅微信支付）

  -- 时间戳
  requested_at DATETIME NOT NULL,          -- 申请时间
  processed_at DATETIME,                   -- 处理完成时间（仅成功或失败时有值）

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_no) REFERENCES orders(order_no)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_refunds_order_no ON refunds(order_no);
CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_wx_refund_id ON refunds(wx_refund_id);
CREATE INDEX IF NOT EXISTS idx_refunds_requested_at ON refunds(requested_at);
```

---

# 实现要点

## 用户识别与登录流程

### 微信小程序登录流程
```
1. 小程序调用wx.login → 获取code
2. 后端用code换取openid和session_key
3. 检查openid是否已绑定手机号
4. 如未绑定：
   - 提示用户授权手机号
   - 解密手机号并绑定
5. 如已绑定：
   - 直接使用手机号作为用户标识
   - 返回用户信息和余额
```

### 用户标识优先级
```
1. 优先使用openid查找对应的手机号
2. 如果提供了手机号，直接使用
3. 所有钱包操作都基于手机号
```

## 安全考虑

1. **金额单位统一**：所有金额都用分为单位存储和传输
2. **事务处理**：余额变动必须在事务中进行
3. **幂等性**：支付回调需要防重复处理
4. **签名验证**：微信支付回调必须验证签名
5. **手机号验证**：变更手机号需要短信验证

## 核心业务逻辑

### 统一订单创建流程
```
1. 验证用户身份（phone）
2. 创建订单记录（orders表）
3. 根据支付方式处理：
   - 微信支付：调用微信统一下单，返回支付参数
   - 余额支付：检查余额，立即扣款并更新订单状态
4. 返回订单信息
```

### 充值流程（特殊的订单类型）
```
1. 创建充值类型订单（order_type='recharge'）
2. 调用微信支付
3. 支付成功后：
   - 更新订单状态为已支付
   - 增加用户余额（含赠送金额）
   - 创建充值交易记录
```

### 服务/商品订单支付流程
```
1. 创建对应类型订单
2. 根据支付方式：
   - 微信支付：调用微信支付API
   - 余额支付：
     a. 检查余额是否充足
     b. 扣减余额
     c. 创建消费交易记录
     d. 更新订单状态为已支付
3. 支付成功后执行业务逻辑（如创建预约记录）
```

### 退款流程（方案A：严格的原路返回）
```
用户申请退款
  ↓
验证订单所有权和状态
  ├─ 只能退款已支付的订单（payment_status='paid'）
  ├─ 验证userId与order.user_id一致
  └─ 同一订单只能退款一次
  ↓
根据 payment_method 自动确定退款渠道
  ├─ payment_method='wechat' → 原路返回到微信钱包
  │  ├─ 调用微信退款API（POST /v3/refund/domestic/refunds）
  │  ├─ 创建refunds记录（status='pending'）
  │  └─ 等待微信回调处理结果
  │
  └─ payment_method='balance' → 直接退款到用户平台余额
     ├─ 增加users.balance（退款金额）
     ├─ 创建wallet_transactions记录（type='refund'）
     ├─ 更新orders.payment_status='refunded'
     └─ 创建refunds记录（status='success'）
  ↓
（仅微信支付）微信发送退款结果回调通知
  ↓
验证回调签名 → 解密回调数据
  ↓
更新refunds表状态（success/failed）和processed_at
  ↓
更新orders.payment_status='refunded'
  ↓
完成

说明：
- 余额支付：退款流程同步完成，用户立即看到余额恢复（status='success'）
- 微信支付：分两阶段
  1. 立即创建pending状态的退款记录给用户反馈
  2. 异步等待微信处理和回调，更新为success或failed（通常2-7天）
```

### 退款状态说明
| 状态 | 说明 | 适用场景 |
|------|------|---------|
| pending | 等待处理 | 微信支付，已申请但未收到回调 |
| success | 退款成功 | 所有场景，用户已获得退款 |
| failed | 退款失败 | 微信支付，微信侧退款失败（如订单超期等） |

## 测试用例

```bash
# 获取余额
curl "http://localhost:3001/api/v2/users/wallet/balance?userId=123"

# 创建充值订单（微信支付）
curl -X POST http://localhost:3001/api/v2/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "recharge",
    "userId": 123,
    "title": "充值100元",
    "amount": 10000,
    "paymentMethod": "wechat",
    "extraData": {
      "bonus": 1000
    }
  }'

# 创建服务订单（余额支付）
curl -X POST http://localhost:3001/api/v2/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "service",
    "userId": 123,
    "title": "颈部按摩60分钟",
    "amount": 12800,
    "paymentMethod": "balance",
    "extraData": {
      "therapistId": "1",
      "storeId": "1",
      "appointmentDate": "2024-01-20",
      "startTime": "14:00",
      "duration": 60
    }
  }'

# 支付订单（余额支付）
curl -X POST http://localhost:3001/api/v2/orders/pay \
  -H "Content-Type: application/json" \
  -d '{
    "orderNo": "ORDER202401151234567",
    "paymentMethod": "balance"
  }'

# 取消订单
curl -X POST http://localhost:3001/api/v2/orders/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "orderNo": "ORDER202401151234567",
    "userId": 123,
    "reason": "用户取消"
  }'

# 获取交易记录
curl "http://localhost:3001/api/v2/users/wallet/transactions?userId=123&page=1&pageSize=10"

# 申请退款（微信支付订单）
curl -X POST http://localhost:3001/api/v2/orders/ORDER202401151234569/refund \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "reason": "用户变卦，不想要了"
  }'

# 申请退款（余额支付订单）
curl -X POST http://localhost:3001/api/v2/orders/ORDER202401151234567/refund \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "reason": "订单取消"
  }'

# 查询退款详情
curl "http://localhost:3001/api/v2/refunds/REF202401151234567"

# 获取用户的退款列表
curl "http://localhost:3001/api/v2/users/123/refunds?status=success&page=1&pageSize=10"

# 获取用户的所有退款列表（包括处理中）
curl "http://localhost:3001/api/v2/users/123/refunds?page=1&pageSize=10"
```

