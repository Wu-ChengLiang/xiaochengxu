# 微信手机号快速验证API文档

## 概述

本文档描述了使用微信手机号快速验证组件实现的手机号绑定和换绑功能。该功能利用微信官方提供的手机号授权能力，无需短信验证码，提供更好的用户体验。

> ✅ **这是推荐方案**：取代了 Doc 04 中的旧方案（encryptedData 方式）
>
> 原因：
> - 微信官方推荐方式
> - 后端直接调用微信 API，无需前端处理加密数据
> - 安全性更高，实现更简单

## 注意事项

1. **收费标准**：自2023年8月28日起，每次成功调用收费0.03元
2. **免费额度**：每个小程序账号有1000次免费测试额度
3. **权限要求**：需要小程序完成认证（企业认证）
4. **手机号来源**：只能获取用户微信绑定的手机号

## API接口定义

### 1. 微信手机号绑定接口

用于首次登录时绑定手机号。

#### 接口地址
```
POST /api/v2/users/bind-phone-wx
```

#### 请求参数
```json
{
  "openid": "wx_openid_123456",   // 微信openid（必填）
  "code": "phone_code_from_wx"    // 微信手机号授权码（必填）
}
```

#### 响应数据

##### 成功响应 (200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 123,
    "phone": "13800138000",
    "isNewUser": true,
    "membershipNumber": "M202401001"
  }
}
```

##### 错误响应 (400/500)
```json
{
  "code": 1001,
  "message": "授权码无效或已过期",
  "data": null
}
```

#### 错误码说明
| 错误码 | 说明 | 处理建议 |
|-------|------|---------|
| INVALID_CODE | 授权码无效 | 重新获取授权 |
| CODE_EXPIRED | 授权码过期（5分钟） | 重新获取授权 |
| PHONE_OCCUPIED | 手机号已被占用 | 提示用户该手机号已注册 |
| WX_API_ERROR | 微信接口调用失败 | 检查配置或重试 |
| QUOTA_EXCEEDED | 调用额度不足 | 充值或使用测试号 |

### 2. 微信手机号换绑接口

用于已登录用户更换绑定的手机号。

#### 接口地址
```
POST /api/v2/users/change-phone-wx
```

#### 请求参数
```json
{
  "userId": 123,                  // 用户ID（必填）
  "oldPhone": "13800138000",      // 当前手机号（必填，用于验证）
  "code": "phone_code_from_wx"    // 微信手机号授权码（必填）
}
```

#### 响应数据

##### 成功响应 (200)
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 123,
    "phone": "13900139000",        // 新手机号
    "oldPhone": "13800138000",     // 旧手机号
    "changedAt": "2024-01-15T10:30:00Z"
  }
}
```

##### 错误响应 (400/500)
```json
{
  "code": 1003,
  "message": "新手机号与原手机号相同",
  "data": null
}
```

#### 错误码说明
| 错误码 | 说明 | 处理建议 |
|-------|------|---------|
| USER_NOT_FOUND | 用户不存在 | 检查用户登录状态 |
| PHONE_MISMATCH | 当前手机号不匹配 | 验证用户身份 |
| PHONE_SAME | 新旧手机号相同 | 提示用户无需换绑 |
| PHONE_OCCUPIED | 新手机号已被占用 | 提示用户该手机号已注册 |
| INVALID_CODE | 授权码无效 | 重新获取授权 |

## 后端实现要点

### 1. 获取Access Token

```javascript
// 需要缓存access_token，有效期2小时
async function getAccessToken() {
  const APPID = process.env.WX_APPID
  const SECRET = process.env.WX_SECRET

  // 检查缓存
  if (cache.accessToken && cache.expires > Date.now()) {
    return cache.accessToken
  }

  // 调用微信API获取
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`
  const response = await fetch(url)
  const data = await response.json()

  // 缓存token
  cache.accessToken = data.access_token
  cache.expires = Date.now() + 7000 * 1000

  return data.access_token
}
```

### 2. 通过code获取手机号

```javascript
async function getPhoneNumber(code) {
  const accessToken = await getAccessToken()

  const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })

  const result = await response.json()

  if (result.errcode !== 0) {
    throw new Error(result.errmsg || '获取手机号失败')
  }

  return result.phone_info.phoneNumber
}
```

### 3. 数据库事务处理

换绑手机号时需要使用事务确保数据一致性：

```javascript
async function changePhone(userId, oldPhone, newPhone) {
  const db = await getDb()

  try {
    await db.run('BEGIN TRANSACTION')

    // 1. 验证旧手机号
    const user = await db.get(
      'SELECT * FROM users WHERE id = ? AND phone = ?',
      [userId, oldPhone]
    )

    if (!user) {
      throw new Error('用户验证失败')
    }

    // 2. 检查新手机号是否被占用
    const exists = await db.get(
      'SELECT id FROM users WHERE phone = ? AND id != ?',
      [newPhone, userId]
    )

    if (exists) {
      throw new Error('手机号已被占用')
    }

    // 3. 更新手机号
    await db.run(
      'UPDATE users SET phone = ?, updated_at = ? WHERE id = ?',
      [newPhone, new Date(), userId]
    )

    // 4. 记录变更日志
    await db.run(
      'INSERT INTO phone_change_logs (user_id, old_phone, new_phone) VALUES (?, ?, ?)',
      [userId, oldPhone, newPhone]
    )

    await db.run('COMMIT')

    return { success: true, phone: newPhone }

  } catch (error) {
    await db.run('ROLLBACK')
    throw error
  }
}
```

## 前端调用示例

### 1. 在Taro中使用

```tsx
import PhoneAuth from '@/components/PhoneAuth'

// 绑定手机号
<PhoneAuth
  type="bind"
  openid={openid}
  onSuccess={(phone) => {
    console.log('绑定成功:', phone)
  }}
/>

// 换绑手机号
<PhoneAuth
  type="change"
  buttonText="更换手机号"
  onSuccess={(phone) => {
    console.log('换绑成功:', phone)
  }}
/>
```

### 2. 原生小程序中使用

```html
<button open-type="getPhoneNumber" bindgetphonenumber="handleGetPhoneNumber">
  获取手机号
</button>
```

```javascript
Page({
  handleGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 发送code到后端
      wx.request({
        url: '/api/v2/users/bind-phone-wx',
        method: 'POST',
        data: {
          openid: this.data.openid,
          code: e.detail.code
        },
        success(res) {
          console.log('绑定成功', res.data)
        }
      })
    }
  }
})
```

## 测试建议

### 1. 功能测试

- [ ] 首次绑定手机号流程
- [ ] 已绑定用户换绑流程
- [ ] 用户拒绝授权处理
- [ ] 重复手机号处理
- [ ] code过期处理

### 2. 异常测试

- [ ] 网络异常处理
- [ ] 微信接口调用失败
- [ ] 并发请求处理
- [ ] 事务回滚测试

### 3. 性能测试

- [ ] access_token缓存有效性
- [ ] 数据库事务性能
- [ ] 并发换绑处理

## 费用预估

基于调用量的费用预估：

| 用户规模 | 月均调用次数 | 预估费用 |
|---------|-------------|---------|
| 100人 | 150次 | 4.5元 |
| 1000人 | 1500次 | 45元 |
| 10000人 | 15000次 | 450元 |

注：包含新用户绑定和老用户换绑

## 安全建议

1. **防重放攻击**：code只能使用一次，5分钟过期
2. **身份验证**：换绑时验证当前手机号
3. **日志记录**：记录所有手机号变更操作
4. **限流控制**：单用户每天换绑次数限制
5. **异常监控**：监控异常调用和失败率

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2024-01-15 | 初始版本，支持绑定和换绑 |

## 相关文档

- [微信官方文档 - 手机号快速验证组件](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html)
- [用户API文档](./04-用户API.md)
- [项目实施指南](./05-实施指南.md)