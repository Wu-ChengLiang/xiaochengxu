# 📊 订单页面问题诊断报告

## 执行日期
2025-10-23

## 诊断方法
1. **API 调用验证** - 通过真实 API 调用获取真实数据
2. **代码逻辑分析** - 追踪数据在代码中的流转路径
3. **诊断脚本** - 使用 Node.js 脚本模拟 API 调用和数据流

---

## 📌 问题1：订单详情页没有照片

### ✅ 问题确认
- **症状**: 订单详情页显示默认占位符图片而非真实技师头像
- **现象**: 所有服务订单都显示相同的占位符
- **用户体验**: 用户无法看到技师的真实照片

### 🔍 根本原因分析

#### 数据流链路
```
API 返回: { extraData: { therapistId: 104, therapistName: '朴老师' } }
                      ❌ 没有 therapistAvatar
                           ↓
getOrderDetail() 第318行:
order.therapistAvatar = normalizeImageUrl(order.extraData.therapistAvatar)
                        ↓
normalizeImageUrl(undefined) → getDefaultImage()
                        ↓
返回: "https://mingyitang1024.com/static/default.png"
                        ↓
order.therapistAvatar = "https://mingyitang1024.com/static/default.png"
                        ↓
enrichOrderWithStoreAndTherapistInfo() 第202行:
if (order.therapistId && !order.therapistAvatar) {
    ❌ 此条件为 FALSE (因为已有默认值)
    ❌ 不会调用 /therapists/{id} API
}
                        ↓
最终显示: 默认占位符而非真实头像 ❌
```

#### 关键问题点

1. **normalizeImageUrl() 的设计缺陷**
   - 函数: `src/utils/image.ts:15-37`
   - 问题: 对 `undefined` 返回默认值 `getDefaultImage()`
   - 后果: 导致后续逻辑无法区分"有值"vs"没有值"

2. **enrichOrderWithStoreAndTherapistInfo() 的逻辑缺陷**
   - 代码: `src/services/order.ts:202`
   - 条件: `if (order.therapistId && !order.therapistAvatar)`
   - 问题: 当 `therapistAvatar` 已有默认值时，条件为 `false`
   - 后果: 永远不会调用 API 获取真实头像

3. **API 设计问题**
   - API 文档说明应该返回 `therapistAvatar`（见 06-订单支付API.md:82）
   - 但实际 API 没有在 `extraData` 中返回此字段
   - 需要单独调用 `/therapists/{id}` API 获取

### 真实 API 数据示例
```json
{
  "orderNo": "ORDER202510226158563",
  "amount": 12160,
  "extraData": {
    "therapistId": 104,
    "therapistName": "朴老师",
    // ❌ 没有 therapistAvatar 字段
  }
}

// 需要调用:
// GET /therapists/104
// 返回: { avatar: "https://mingyitang1024.com/static/therapists/老师收集中文原版/东方路店/朴老师.jpg" }
```

### 修复方案

#### 方案 A：改进 normalizeImageUrl（推荐）
```typescript
// ❌ 当前实现
export const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) {  // 包括 undefined 和 null
    return getDefaultImage();  // 返回默认值
  }
  // ...
}

// ✅ 改进后
export const normalizeImageUrl = (url: string | undefined): string | undefined => {
  if (!url) {
    return undefined;  // 保持 undefined，让调用者处理
  }
  // 规范化逻辑...
  return normalizedUrl;
}
```

#### 方案 B：调整服务层逻辑
```typescript
// 在 getOrderDetail() 中
if (order.extraData) {
  // ❌ 不要立即规范化
  // order.therapistAvatar = normalizeImageUrl(order.extraData.therapistAvatar)

  // ✅ 先提取原始值（可能为 undefined）
  order.therapistAvatar = order.extraData.therapistAvatar;
}

// 然后在 enrichOrderWithStoreAndTherapistInfo() 中
if (order.therapistId && !order.therapistAvatar) {
  // 现在条件会正确触发，调用 API
  const therapist = await get(`/therapists/${order.therapistId}`)
  order.therapistAvatar = normalizeImageUrl(therapist.data.avatar)
}
```

---

## 📌 问题2：订单金额显示 NaN

### ✅ 问题状态
**根据诊断，此问题可能不是数据问题，而是 React state 或页面渲染问题**

### 🔍 分析结果

#### API 数据验证 ✅
```
✅ 确认: API 在顶层返回 amount 字段
orderNo: ORDER202510226158563
amount: 12160
类型: number
extraData 中: 没有 amount 字段（符合设计）
```

#### formatAmount 函数验证 ✅
```
测试: formatAmount(12160)
结果: ¥121.60元
状态: ✅ 正确转换
```

#### 数据流链路 ✅
```
API 返回: { amount: 12160, ... }
                ↓
getOrderDetail(): const order = response.data
                ↓
order.amount = 12160 (保持不变)
                ↓
setOrderInfo(order)
                ↓
页面显示: formatAmount(orderInfo.amount)
```

### 🤔 可能的原因

1. **React state 更新问题**
   - `setOrderInfo()` 可能没有正确更新
   - 使用了错误的 state 变量

2. **页面接收数据问题**
   - `orderInfo.amount` 可能被意外设置为 `undefined`
   - 或者是某个中间步骤的数据转换错误

3. **formatAmount 函数边界情况**
   - 当传入 `undefined` 时，不应该返回 `NaN`
   - 应该有默认值处理

### 修复方案

#### 方案 A：增强 formatAmount 容错
```typescript
// src/utils/amount.ts
export function formatAmount(amountInCents: number | undefined | null, options?: {...}): string {
  // ✅ 改进：更清晰的容错处理
  if (amountInCents === undefined || amountInCents === null || isNaN(amountInCents)) {
    return `${symbol}0.00${suffix}`;
  }

  const yuan = centsToYuan(amountInCents);
  if (isNaN(yuan)) {
    return `${symbol}0.00${suffix}`;
  }
  return `${symbol}${yuan.toFixed(precision)}${suffix}`;
}
```

#### 方案 B：页面层数据验证
```typescript
// pages/order/detail/index.tsx
const handleNavigate = () => {
  if (orderInfo) {
    console.log('DEBUG: orderInfo.amount:', orderInfo.amount, typeof orderInfo.amount);

    // ✅ 检查数据完整性
    if (!orderInfo.amount || typeof orderInfo.amount !== 'number') {
      console.error('⚠️ Warning: orderInfo.amount 无效');
      return;
    }

    Taro.openLocation({
      // ...
    })
  }
}
```

---

## 📋 诊断脚本输出

### 执行命令
```bash
node diagnose-order-issues.js
```

### 执行结果
- **问题1**: ✅ 已确认 - `therapistAvatar` 被默认值覆盖
- **问题2**: ⚠️ 需要进一步调查 - 数据本身无问题，可能是 React 渲染问题

---

## 🎯 建议行动

### 优先级 1（高）：修复照片问题
1. 改进 `normalizeImageUrl()` 函数或调整服务层逻辑
2. 确保 `enrichOrderWithStoreAndTherapistInfo()` 能正确调用 API
3. 测试: 验证所有服务订单都能显示真实技师头像

### 优先级 2（中）：增强金额处理的容错能力
1. 改进 `formatAmount()` 的错误处理
2. 页面层添加数据验证日志
3. 测试: 在各种网络状态下验证金额正确显示

### 优先级 3（低）：长期优化
1. 统一 API 返回格式标准
2. 添加完整的类型检查
3. 提高数据映射的清晰度

---

## 📚 参考文件

- `src/services/order.ts` - 订单服务层
- `src/utils/image.ts` - 图片 URL 规范化
- `src/utils/amount.ts` - 金额格式化
- `src/pages/order/detail/index.tsx` - 订单详情页
- `api-docs/06-订单支付API.md` - API 文档
- `diagnose-order-issues.js` - 诊断脚本

---

## 📊 诊断统计

| 项目 | 状态 | 说明 |
|------|------|------|
| API 数据完整性 | ✅ | 数据字段正确 |
| 照片问题 | ❌ | normalizeImageUrl 导致 API 不被调用 |
| 金额数据 | ✅ | 数据正确，可能是显示层问题 |
| 总体诊断 | ⚠️ | 1 个确认问题，1 个需要进一步调查 |

---

**诊断完成日期**: 2025-10-23
**诊断人员**: Claude Code
**状态**: 已完成
