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

---

# 核心API

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
    "totalAppointments": 12,      // 总预约次数
    "completedAppointments": 10,  // 已完成次数
    "totalAmount": 128000,        // 总消费金额
    "totalVisits": 15,            // 总访问次数
    "currentBalance": 12500,      // 当前余额
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

---

# 钱包与订单API

## 5. 获取钱包余额

### 接口地址
```
GET /api/v2/users/wallet/balance
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID（主键） |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 12500,        // 可用余额（分为单位）
    "totalSpent": 128000,    // 总消费
    "totalVisits": 15        // 总访问次数
  }
}
```

## 6. 创建订单（统一接口）

### 接口地址
```
POST /api/v2/orders/create
```

### 请求参数
```json
{
  "orderType": "service",     // service服务/product商品/recharge充值
  "userId": 123,              // 用户ID（主键），必填
  "title": "颈部按摩60分钟",   // 订单标题
  "amount": 12800,            // 金额（分为单位）
  "paymentMethod": "balance", // wechat微信/balance余额支付
  "extraData": {}             // 附加数据（可选）
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
    "paymentStatus": "pending",
    "createdAt": "2024-01-15T14:30:00.000Z"
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
  "paymentMethod": "balance"  // wechat或balance
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
    "balance": 4500
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
| userId | number | 是 | 用户ID（主键） |
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
        "extraData": {},
        "paidAt": "2024-01-15T14:35:00.000Z",
        "createdAt": "2024-01-15T14:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
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
    "extraData": {},
    "paidAt": "2024-01-15T14:35:00.000Z",
    "refundedAt": null,
    "createdAt": "2024-01-15T14:30:00.000Z",
    "updatedAt": "2024-01-15T14:35:00.000Z"
  }
}
```

## 10. 获取交易记录

### 接口地址
```
GET /api/v2/users/wallet/transactions
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | number | 是 | 用户ID（主键） |
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
        "type": "recharge",
        "amount": 10000,
        "balance": 12500,
        "description": "充值100元",
        "orderNo": "RECHARGE202401151234567",
        "createdAt": "2024-01-15T14:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

---

# 测试用例

```bash
# 获取用户信息
curl "http://localhost:3001/api/v2/users/info?phone=13800138000"

# 更新用户信息
curl -X PUT http://localhost:3001/api/v2/users/info \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "username": "张先生"
  }'

# 获取用户统计
curl "http://localhost:3001/api/v2/users/statistics?userId=123"

# 获取钱包余额
curl "http://localhost:3001/api/v2/users/wallet/balance?userId=123"

# 获取订单列表
curl "http://localhost:3001/api/v2/orders?userId=123&page=1&pageSize=20"

# 创建订单
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

# 支付订单
curl -X POST http://localhost:3001/api/v2/orders/pay \
  -H "Content-Type: application/json" \
  -d '{
    "orderNo": "ORDER202401151234567",
    "paymentMethod": "balance"
  }'

# 获取交易记录
curl "http://localhost:3001/api/v2/users/wallet/transactions?userId=123&page=1&pageSize=20"
```

---

# 数据库设计

## 需要为users表新增的字段
```sql
ALTER TABLE users ADD COLUMN openid VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
ALTER TABLE users ADD COLUMN nickname VARCHAR(100);
ALTER TABLE users ADD COLUMN session_key VARCHAR(255);
CREATE INDEX idx_users_openid ON users(openid);
```

## 钱包交易记录表
```sql
CREATE TABLE wallet_transactions (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  phone VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,       // recharge/consume/refund
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  order_no VARCHAR(50),
  extra_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 统一订单表
```sql
CREATE TABLE orders (
  order_no VARCHAR(50) PRIMARY KEY,
  order_type VARCHAR(20) NOT NULL,    // service/product/recharge
  user_id INTEGER NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount INTEGER NOT NULL,
  payment_method VARCHAR(20),         // wechat/balance
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
```

## 充值配置表
```sql
CREATE TABLE recharge_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  bonus INTEGER NOT NULL DEFAULT 0,
  label VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

## 核心业务流程

### 统一订单创建
1. 验证用户身份（userId）
2. 创建订单记录
3. 根据支付方式处理：
   - 微信支付：调用微信统一下单
   - 余额支付：检查余额，立即扣款

### 充值流程
1. 创建充值类型订单
2. 调用微信支付
3. 支付成功后：
   - 更新订单状态为已支付
   - 增加用户余额（含赠送金额）
   - 创建交易记录

### 服务/商品订单支付流程
1. 创建对应类型订单
2. 根据支付方式处理
3. 支付成功后执行业务逻辑

## 安全考虑

1. **金额单位统一**：所有金额都用分为单位
2. **事务处理**：余额变动必须在事务中进行
3. **幂等性**：支付回调需要防重复处理
4. **签名验证**：微信支付回调必须验证签名

## 注意事项

1. **向后兼容**：设计时考虑未来扩展
2. **数据一致性**：用户手机号变更时的处理
3. **性能优化**：统计查询可以定时计算，避免实时复杂查询

