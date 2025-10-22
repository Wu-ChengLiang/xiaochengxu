# 订单支付API文档

## MVP版本说明

此文档为订单支付系统的MVP（最小可行产品）版本，包含以下特性：
- **统一订单管理**：所有支付（服务、商品、充值）都通过统一的订单系统
- **简化支付方式**：仅支持微信或余额支付（不支持混合支付）
- **订单同步创建**：下单即创建订单记录，支付后更新状态

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

## 13. 微信支付回调

### 接口地址
```
POST /api/v2/payments/wechat/notify
```

### 说明
- 接收微信支付结果通知
- 验证支付成功后自动充值余额
- 更新充值订单状态
- 创建交易记录

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
```

