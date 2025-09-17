# 用户相关API文档

## MVP版本说明

此文档为MVP（最小可行产品）版本，已简化以下内容：
- **无积分系统**：移除了所有积分相关功能
- **统一订单管理**：所有支付（服务、商品、充值）都通过统一的订单系统
- **简化支付方式**：仅支持微信或余额支付（不支持混合支付）
- **订单同步创建**：下单即创建订单记录，支付后更新状态

## 设计原则

1. **简化优先**：初期不做复杂的注册登录系统
2. **手机号识别**：通过手机号识别用户身份
3. **渐进增强**：后续可升级为完整的用户系统

## 1. 获取用户信息

### 接口地址
```
GET /api/v2/users/info
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 否 | 手机号 |
| openid | string | 否 | 微信openid |

注意：phone和openid至少提供一个

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "phone": "13800138000",
    "username": "张先生",
    "nickname": "微信昵称",
    "avatar": "/images/avatars/default.jpg",
    "openid": "wx_openid_123456",
    "membershipNumber": "M202401001",
    "memberLevel": "normal",      // MVP阶段默认normal
    "balance": 12500,             // 余额（分为单位，直接使用users.balance）
    "points": 0,                  // MVP阶段固定为0
    "discountRate": 1.0,          // MVP阶段固定为1.0（不打折）
    "totalSpent": 128000,         // 总消费（users.total_spent）
    "totalVisits": 15             // 总访问次数（users.total_visits）
  }
}
```

### 实现说明
- 如果用户不存在，返回404错误
- 直接从users表查询，不需要关联查询
- MVP阶段：points固定为0，memberLevel固定为'normal'，discountRate固定为1.0

## 2. 更新用户信息

### 接口地址
```
PUT /api/v2/users/info
```

### 请求参数
```json
{
  "userId": 123,                    // 用户ID（必填）
  "username": "张先生",             // 更新用户名
  "avatar": "base64...",            // 可选，base64图片数据
  "nickname": "新的微信昵称"        // 可选，更新微信昵称
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 123,
    "phone": "13800138000",
    "username": "张先生",
    "nickname": "新的微信昵称",
    "avatar": "/images/avatars/123.jpg"
  }
}
```

## 3. 获取用户统计

### 接口地址
```
GET /api/v2/users/statistics
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
    "totalAppointments": 12,      // 总预约次数（从appointments表统计）
    "completedAppointments": 10,  // 已完成次数（从appointments表统计）
    "totalAmount": 128000,        // 总消费金额（users.total_spent）
    "totalVisits": 15,            // 总访问次数（users.total_visits）
    "currentBalance": 12500,      // 当前余额（users.balance）
    "favoriteTherapist": {        // 最常预约的推拿师
      "id": "1",
      "name": "张师傅",
      "appointmentCount": 5
    },
    "favoriteStore": {            // 最常去的门店
      "id": "1",
      "name": "明医推拿（罗湖店）",
      "visitCount": 8
    }
  }
}
```

## 4. 微信登录与手机号绑定

### 4.1 微信登录接口
```
POST /api/v2/users/wechat-login
```

### 请求参数
```json
{
  "code": "微信授权code",
  "userInfo": {
    "nickName": "微信昵称",
    "avatarUrl": "微信头像",
    "gender": 1
  }
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "needBindPhone": true,  // 是否需要绑定手机号
    "openid": "wx_openid",
    "sessionKey": "session_key_for_phone_decrypt",
    "userInfo": {
      "phone": null,  // 未绑定时为null
      "nickName": "微信昵称",
      "avatarUrl": "微信头像"
    }
  }
}
```

### 4.2 绑定手机号
```
POST /api/v2/users/bind-phone
```

### 请求参数
```json
{
  "openid": "wx_openid",
  "encryptedData": "微信手机号加密数据",
  "iv": "加密向量",
  "sessionKey": "会话密钥"
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 123,                // 用户ID
    "phone": "13800138000",       // 解密得到的手机号
    "isNewUser": true,            // 是否新用户
    "membershipNumber": "M202401001"  // 会员号（新用户自动生成）
  }
}
```

### 实现说明
- 解密微信手机号后，查询users表中是否已存在该手机号
- 如果不存在，创建新用户记录：
  ```sql
  INSERT INTO users (phone, openid, nickname, avatar, membership_number, member_level, balance, points, discount_rate)
  VALUES ('13800138000', 'wx_openid', '微信昵称', '头像URL', 'M202401001', 'normal', 0, 0, 1.0);
  ```
- 如果已存在，更新openid关联：
  ```sql
  UPDATE users SET openid = 'wx_openid', nickname = '微信昵称', avatar = '头像URL' WHERE phone = '13800138000';
  ```

## 5. 手机号变更

### 接口地址
```
POST /api/v2/users/change-phone
```

### 请求参数
```json
{
  "oldPhone": "13800138000",
  "newPhone": "13900139000",
  "verifyCode": "123456"  // 新手机号验证码
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "phone": "13900139000",
    "updatedRecords": {
      "wallets": 1,       // 更新的钱包记录数
      "transactions": 15,  // 更新的交易记录数
      "appointments": 3    // 更新的预约记录数
    }
  }
}
```

### 实现说明
- 使用事务确保所有相关表同步更新
- 通过CASCADE外键约束自动更新关联数据
- 记录变更日志用于审计

## 数据库设计建议

### 最简方案

1. **依赖现有users表**
   - 通过phone字段关联用户
   - 其他信息从appointments表统计

2. **用户信息查询**
```sql
-- 获取用户信息和统计
SELECT 
  u.phone,
  u.name,
  COUNT(a.id) as appointment_count,
  MAX(a.created_at) as last_visit
FROM users u
LEFT JOIN appointments a ON u.phone = a.user_phone
WHERE u.phone = ?
GROUP BY u.phone, u.name;
```

### 扩展方案

1. **微信用户关联表**
```sql
CREATE TABLE wechat_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  session_key VARCHAR(255),  -- 用于解密手机号
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (phone) REFERENCES users(phone) ON UPDATE CASCADE
);

-- 索引
CREATE INDEX idx_wechat_users_openid ON wechat_users(openid);
CREATE INDEX idx_wechat_users_phone ON wechat_users(phone);
```

2. **手机号变更日志表**
```sql
CREATE TABLE phone_change_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  old_phone VARCHAR(20) NOT NULL,
  new_phone VARCHAR(20) NOT NULL,
  openid VARCHAR(100),
  change_reason VARCHAR(200),
  operator VARCHAR(50),  -- 操作人
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 实现建议

1. **分阶段实施**
   - 第一阶段：仅通过手机号识别
   - 第二阶段：添加微信登录
   - 第三阶段：完整用户系统

2. **缓存策略**
   - 用户信息缓存30分钟
   - 统计数据缓存5分钟

3. **隐私保护**
   - 手机号脱敏显示
   - 敏感信息加密存储

## 注意事项

1. **向后兼容**
   - 设计时考虑未来扩展
   - 保持接口稳定性

2. **数据一致性**
   - 用户手机号变更时的处理
   - 历史数据的关联

3. **性能优化**
   - 统计查询可以定时计算
   - 避免实时复杂查询

## 测试用例

```bash
# 获取用户信息
curl "http://localhost:3001/api/v2/users/info?phone=13800138000"

# 更新用户信息
curl -X PUT http://localhost:3001/api/v2/users/info \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "name": "张先生"
  }'
```

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

## 8. 退款到余额

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

## 9. 获取交易记录

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

## 10. 微信支付回调

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
curl "http://localhost:3001/api/v2/users/wallet/balance?phone=13800138000"

# 创建充值订单（微信支付）
curl -X POST http://localhost:3001/api/v2/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "recharge",
    "userPhone": "13800138000",
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
    "userPhone": "13800138000",
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

# 获取交易记录
curl "http://localhost:3001/api/v2/users/wallet/transactions?userId=123&page=1&pageSize=10"
```

---

# 基于现有users表的完整实施方案

## 📋 实施清单

### ✅ 现有表结构利用
- **users表**：直接使用，无需删除任何字段
- **appointments表**：已有`user_id`外键，完美兼容
- **余额管理**：直接使用`users.balance`字段（分为单位）

### 🔧 最小化数据库改动
```sql
-- 1. 为users表添加微信登录支持（仅4个字段）
ALTER TABLE users ADD COLUMN openid VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
ALTER TABLE users ADD COLUMN nickname VARCHAR(100);
ALTER TABLE users ADD COLUMN session_key VARCHAR(255);
CREATE INDEX idx_users_openid ON users(openid);

-- 2. 创建钱包交易记录表
CREATE TABLE wallet_transactions (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  phone VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  order_no VARCHAR(50),
  extra_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. 创建统一订单表
CREATE TABLE orders (
  order_no VARCHAR(50) PRIMARY KEY,
  order_type VARCHAR(20) NOT NULL,
  user_id INTEGER NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount INTEGER NOT NULL,
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  extra_data TEXT,
  wx_prepay_id VARCHAR(100),
  wx_transaction_id VARCHAR(100),
  paid_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. 创建充值配置表
CREATE TABLE recharge_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  bonus INTEGER NOT NULL DEFAULT 0,
  label VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 🎯 MVP字段使用策略
| 字段 | MVP使用方式 | 说明 |
|-----|------------|------|
| `id` | ✅ 主键 | 所有外键关联使用 |
| `phone` | ✅ 用户标识 | 手机号登录 |
| `username` | ✅ 用户名 | 显示名称 |
| `openid` | ✅ 微信标识 | 新增，微信登录 |
| `balance` | ✅ 钱包余额 | 直接使用（分为单位） |
| `total_spent` | ✅ 消费统计 | 统计显示 |
| `total_visits` | ✅ 访问统计 | 统计显示 |
| `points` | 🔒 固定为0 | MVP不用积分 |
| `member_level` | 🔒 固定'normal' | MVP不分等级 |
| `discount_rate` | 🔒 固定1.0 | MVP不打折 |
| `medical_*` | 🔒 暂时NULL | 医疗功能后期用 |

### 🔄 API适配策略
- **用户识别**：支持`userId`和`phone`双重查询
- **余额操作**：直接更新`users.balance`字段
- **事务安全**：余额变动必须在事务中进行
- **数据一致性**：每次余额变动创建`wallet_transactions`记录

### ⚡ 性能优化
- 主要查询基于`users.id`（整数主键，最快）
- 保留`phone`冗余存储（便于模糊查询）
- 合理索引设计（openid、phone、created_at）

### 🚀 实施步骤
1. **备份现有数据库**
2. **执行ALTER TABLE添加微信字段**
3. **创建新的3个表**
4. **更新API代码**
5. **测试数据迁移和API功能**

### 💎 优势
- **零风险**：不删除任何现有字段
- **最小改动**：仅添加4个字段和3个新表
- **向后兼容**：现有appointments关联完全保持
- **易扩展**：预留了未来功能扩展空间

这套方案完全基于您现有的users表结构，确保了最小的改动风险和最大的兼容性。