# 前端与API文档匹配度审核报告

## 📊 总体概览

| 模块 | 文档定义 | 前端实现 | 匹配度 | 严重性 |
|------|--------|--------|------|------|
| 04-用户API | 8个 | 2个 | 25% | 🔴 |
| 06-订单支付 | 8个 | 7个 | 88% | 🟡 |
| 01-门店API | 4个 | 4个 | 100% | ✅ |
| 02-推拿师API | 4个 | 2个 | 50% | 🟡 |
| 03-预约API | 5个 | 1个 | 20% | 🔴 |

---

## 🔴 严重问题

### 1. 创建订单端点混乱
**问题**: 前端使用 `/appointments/create-with-order`，文档定义 `/orders/create`

**现状**:
- ✅ `/appointments/create-with-order` 端点真实存在且可调用
- ❌ 此端点未在API文档中定义
- ❌ 响应结构与文档不符: `{ appointment, order }` vs `{ orderNo, orderType, ... }`

**测试结果**:
```bash
# 已验证创建成功
curl -X POST https://mingyitang1024.com/api/v2/appointments/create-with-order \
  -d '{"therapistId":104,"storeId":27,"appointmentDate":"2025-10-22","startTime":"18:30",...}'
# 返回: {"code":0,"data":{"appointment":{...},"order":{...}}}
```

**建议**: 在06-订单支付API.md中补充此端点定义

---

### 2. 04-用户API 大量未实现
**缺失实现**:
- ❌ 获取用户信息 (GET /api/v2/users/info)
- ❌ 更新用户信息 (PUT /api/v2/users/info)
- ❌ 获取用户统计 (GET /api/v2/users/statistics)
- ❌ 微信登录 (POST /api/v2/users/wechat-login)

**现有实现**:
- ✅ 获取余额 (wallet.service.ts)
- ✅ 创建充值订单 (wallet.service.ts)

---

### 3. 03-预约API 大量未实现
**缺失实现**:
- ❌ 创建预约 (POST /api/v2/appointments)
- ❌ 获取预约详情 (GET /api/v2/appointments/:id)
- ❌ 我的预约列表 (GET /api/v2/appointments/mine)
- ❌ 取消预约 (PUT /api/v2/appointments/:id/cancel)
- ❌ 可预约时段 (GET /api/v2/appointments/available-slots)

**现状**: 使用专用端点 `/appointments/create-with-order` 代替

---

## 🟡 中等问题

### 4. 金额单位混乱
**问题**: 金额字段返回值与预期单位不符

实际测试结果:
- 请求: `price: 12800` (分)
- 返回:
  - `/appointments/create-with-order`: `originalAmount: 1280000` (可能是元?)
  - `/orders/create`: `amount: 12160` (分)

**建议**: 后端统一文档说明金额单位

---

### 5. 返回格式不一致
**交易记录列表**:
- 文档: 返回 `{ list[], total, page, pageSize, hasMore }`
- 实现: 返回 `Transaction[]`

**订单列表**:
- 文档: 返回完整分页对象
- 实现: 返回 `OrderData[]`

---

### 6. 隐含端点未文档化
**隐含API**:
- `/recharge/configs` - 获取充值配置（wallet.service.ts使用）
- `/stores/filter` - 门店筛选（store.service.ts使用）

---

## ✅ 完全匹配

### 门店API (01)
- ✅ 获取附近门店 (GET /stores/nearby)
- ✅ 获取门店详情 (GET /stores/:id)
- ✅ 搜索门店 (GET /stores/search)
- ✅ 图片URL规范化已实现

### 订单支付核心功能 (06)
- ✅ 获取余额 (GET /users/wallet/balance)
- ✅ 支付订单 (POST /orders/pay)
- ✅ 取消订单 (POST /orders/cancel)
- ✅ 退款 (POST /users/wallet/refund)

---

## 📋 详细问题清单

### 04-用户API
| API | 文档 | 实现 | 问题 |
|-----|------|------|------|
| 获取用户信息 | ✅ | ❌ | 未实现 |
| 更新用户信息 | ✅ | ❌ | 未实现 |
| 用户统计 | ✅ | ❌ | 未实现 |
| 微信登录 | ✅ | ❌ | 未实现 |
| 获取交易记录 | ✅ | ✅ | 返回格式差异 |
| 获取余额 | ❌ | ✅ | 文档缺失 |

### 03-预约API
| API | 文档 | 实现 | 问题 |
|-----|------|------|------|
| 创建预约 | ✅ | ⚠️ | 用合并端点替代 |
| 获取详情 | ✅ | ❌ | 未实现 |
| 我的预约 | ✅ | ❌ | 未实现 |
| 取消预约 | ✅ | ❌ | 未实现 |
| 可预约时段 | ✅ | ❌ | 未实现 |

### 06-订单支付API
| API | 文档 | 实现 | 问题 |
|-----|------|------|------|
| 获取余额 | ✅ | ✅ | ✅ |
| 创建订单(通用) | ✅ | ✅ | ✅ |
| 创建订单(预约) | ❌ | ✅ | 文档缺失 |
| 支付订单 | ✅ | ✅ | ✅ |
| 获取订单列表 | ✅ | ✅ | 返回格式差异 |
| 获取订单详情 | ✅ | ✅ | ✅ |
| 取消订单 | ✅ | ✅ | ✅ |
| 退款 | ✅ | ✅ | ✅ |

---

## 🎯 优先级建议

### P0 (立即修复)
1. **文档补充**: 在06-订单支付API.md中补充 `/appointments/create-with-order` 端点定义
2. **用户登录**: 实现04的微信登录和用户信息获取接口

### P1 (本周完成)
1. **预约流程**: 完善03-预约API的所有端点实现
2. **返回格式**: 统一交易记录和订单列表的返回格式

### P2 (后续优化)
1. **文档补充**: 补充隐含端点文档
2. **金额单位**: 统一明确所有金额字段的单位

---

## 📝 建议行动

```markdown
### 短期 (本周)
- [ ] 补充 /appointments/create-with-order 文档
- [ ] 实现用户登录和信息管理
- [ ] 统一返回格式

### 中期 (2周内)
- [ ] 完整实现预约流程API
- [ ] 补充所有隐含端点文档
- [ ] 金额单位统一说明

### 长期
- [ ] 定期同步API文档和实现
- [ ] 建立API变更流程
```
