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

⚠️ **手机号绑定已迁移至 Doc 08** - 使用微信官方的快速验证组件

详见：[08-微信手机号API.md](./08-微信手机号API.md)

**推荐使用的端点：**
- 绑定手机号：`POST /api/v2/users/bind-phone-wx`
- 换绑手机号：`POST /api/v2/users/change-phone-wx`

---

# 钱包相关API

## 5. 获取交易记录

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

> **注**：钱包交易记录表、订单表、充值配置表等数据库设计详见 `06-订单支付API.md`

---

# 实现要点

## 核心业务流程

### 微信登录流程
1. 小程序调用 wx.login → 获取 code
2. 后端用 code 换取 openid 和 session_key
3. 检查 openid 是否已绑定手机号
4. 如未绑定：
   - 提示用户使用微信手机号快速验证组件（见 Doc 08）
   - 前端调用 `POST /api/v2/users/bind-phone-wx` 绑定
5. 如已绑定：
   - 直接使用手机号作为用户标识
   - 返回用户信息和余额

### 用户标识优先级
1. 优先使用 openid 查找对应的手机号
2. 如果提供了手机号，直接使用
3. 所有钱包操作都基于手机号

## 安全考虑

1. **手机号验证**：变更手机号需要短信验证
2. **会话管理**：session_key 应加密存储
3. **数据隐私**：用户敏感信息的保护

## 注意事项

1. **向后兼容**：设计时考虑未来扩展
2. **数据一致性**：用户手机号变更时的处理
3. **订单和支付**：详见 `06-订单支付API.md`

