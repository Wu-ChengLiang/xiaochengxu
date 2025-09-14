# 用户相关API文档

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
| phone | string | 是 | 手机号 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "phone": "13800138000",
    "name": "张先生",
    "avatar": "/images/avatars/default.jpg",
    "memberLevel": 0,  // 0普通用户 1银卡 2金卡 3钻石卡
    "points": 0,  // 积分
    "appointmentCount": 5,  // 预约次数
    "lastVisit": "2024-01-15T14:00:00.000Z"
  }
}
```

### 实现说明
- 如果用户不存在，返回默认信息
- 通过预约记录统计用户数据

## 2. 更新用户信息

### 接口地址
```
PUT /api/v2/users/info
```

### 请求参数
```json
{
  "phone": "13800138000",
  "name": "张先生",
  "avatar": "base64..."  // 可选，base64图片数据
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "phone": "13800138000",
    "name": "张先生",
    "avatar": "/images/avatars/13800138000.jpg"
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
| phone | string | 是 | 手机号 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalAppointments": 12,  // 总预约次数
    "completedAppointments": 10,  // 已完成次数
    "totalAmount": 128000,  // 总消费金额（分）
    "favoriteTherapist": {  // 最常预约的推拿师
      "id": "1",
      "name": "张师傅",
      "appointmentCount": 5
    },
    "favoriteStore": {  // 最常去的门店
      "id": "1",
      "name": "明医推拿（罗湖店）",
      "visitCount": 8
    }
  }
}
```

## 4. 微信登录（可选）

### 接口地址
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
    "token": "jwt_token_here",  // 可选，用于后续请求验证
    "userInfo": {
      "openid": "wx_openid",
      "phone": "13800138000",  // 如果已绑定
      "nickName": "微信昵称",
      "avatarUrl": "微信头像"
    }
  }
}
```

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

### 扩展方案（后续）

1. **添加微信用户表**
```sql
CREATE TABLE wechat_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (phone) REFERENCES users(phone)
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