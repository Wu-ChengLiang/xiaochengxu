# 前端时区 Bug 分析报告

## 问题症状
- **现象**：用户在 10:29 日期选择器中选择 "10月29日"，前端显示正确
- **实际发送**：创建订单时发送的 `appointmentDate` 是 "10-28"
- **结果**：订单被创建成昨天的日期

---

## 根本原因分析

### 时区转换陷阱

使用 `new Date().toISOString().split('T')[0]` 的问题：

```javascript
// 北京时间 10月29日 07:20（UTC+8）
const today = new Date()  // Oct 29, 2025, 07:20:00 (local)

// toISOString() 会转换为 UTC 时区
today.toISOString()       // "2025-10-28T23:20:00Z"（UTC 时间）

// 分割只取日期部分
split('T')[0]             // "2025-10-28"  ❌ 错误！
```

### 核心问题

- **getDate()/getMonth()** 基于本地时区 → 显示正确（10月29日）
- **toISOString()** 转换为 UTC 时区 → 得到错误日期（10-28）
- **结果**：UI 显示正确，但数据发送错误

---

## 受影响的代码位置

### 1️⃣ **最严重**：BookingSelector（技师预约）

**文件**: `src/pages/appointment/therapist/components/BookingSelector/index.tsx:172`

```javascript
// ❌ 错误的实现
key: date.toISOString().split('T')[0],

// 📊 数据流
generateDateList()
  ↓ (key: "2025-10-28") ❌
setSelectedDate()
  ↓ (selectedDate: "2025-10-28") ❌
onTimeSelect(selectedDate, time)
  ↓ 传到 order.ts
orderService.createAppointmentOrder()
  ↓ (appointmentDate: "2025-10-28") ❌
订单创建成 10-28 ❌
```

---

### 2️⃣ **严重**：SymptomPage（症状调理）

**文件**: `src/pages/appointment/symptom/index.tsx:126`

```javascript
// ❌ 错误的实现（作为 fallback）
date: selectedDate as string || new Date().toISOString().split('T')[0],
```

当用户在症状页面手动添加购物车时（selectedDate 不存在），会使用错误的日期。

---

### 3️⃣ **严重**：StoreAppointmentPage

**文件**: `src/pages/appointment/store/index.tsx:18`

```javascript
// ❌ 错误的初始化
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

// ❌ 错误的比较（第 119 行）
const dateText = selectedDate === new Date().toISOString().split('T')[0] ? '今天' : selectedDate
```

初始化为错误日期，且"今天"的判断也会失效。

---

### 4️⃣ **低风险**：order.ts

**文件**: `src/services/order.ts:485`

```javascript
// ⚠️ 低风险（只在特殊情况）
paidAt: response.data.paidAt || new Date().toISOString()
```

这里用 `toISOString()` 没关系，因为存储时间戳，但不一致。

---

## 修改方案

### ✅ 推荐方案：创建工具函数

在 `src/utils/date.ts` 中添加本地时区日期函数：

```typescript
/**
 * 获取本地日期字符串（北京时间），格式：YYYY-MM-DD
 * 解决时区问题：new Date().toISOString() 会转换为 UTC
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取今天的本地日期字符串
 */
export const getTodayString = (): string => {
  return getLocalDateString()
}
```

### 修改位置及影响分析

| 文件 | 行号 | 现有代码 | 修改后 | 影响范围 | 风险 |
|------|------|---------|--------|---------|------|
| BookingSelector | 172 | `date.toISOString().split('T')[0]` | `getLocalDateString(date)` | 订单日期 | 🟢 低 |
| SymptomPage | 126 | `new Date().toISOString().split('T')[0]` | `getTodayString()` | 症状购物车 | 🟢 低 |
| StoreAppointmentPage | 18 | `new Date().toISOString().split('T')[0]` | `getTodayString()` | 初始日期 | 🟢 低 |
| StoreAppointmentPage | 119 | `new Date().toISOString().split('T')[0]` | `getTodayString()` | "今天"判断 | 🟢 低 |

---

## ✅ 为什么这个方案不会引入新 Bug

### 1. **不改变 API 契约**
- 后端期望的日期格式仍然是 `YYYY-MM-DD`
- 只改变了**如何生成**这个字符串，不改变**格式**

### 2. **保证一致性**
- 所有日期生成都用同一个函数
- 消除了 `toISOString()` vs `getDate()` 的不一致

### 3. **向后兼容**
- 现有的日期字符串格式不变
- 不需要修改后端任何代码
- 已有订单数据不受影响

### 4. **可预测性**
```javascript
// 修改前（有时区陷阱）
new Date().toISOString().split('T')[0]  // 不确定，取决于浏览器时区

// 修改后（明确意图）
getLocalDateString()  // 明确是北京本地时间
```

---

## 回归测试计划

### 📋 测试场景

#### **场景1：技师预约（BookingSelector）**

```
时间：10月29日 上午7:30
操作：
1. 打开技师预约页面
2. 点击日期选择器中的"今天"（显示为 10月29日）
3. 选择时间 10:00
4. 点击"去结算"

验证点：
✅ 日期显示：10月29日
✅ 发送到后端的日期：2025-10-29
✅ 创建订单的日期：10月29日
✅ 订单详情显示：10月29日
```

#### **场景2：症状调理预约**

```
时间：10月29日 上午7:30
操作：
1. 从门店页面选择日期 10月29日，时间 10:00
2. 进入症状调理页面
3. 添加服务项目到购物车
4. 点击"去结算"

验证点：
✅ 传递的日期：2025-10-29
✅ 购物车中的日期：2025-10-29
✅ 创建订单的日期：10月29日
```

#### **场景3：门店预约初始化**

```
时间：10月29日 上午7:30
操作：
1. 进入门店预约页面
2. 观察初始日期显示

验证点：
✅ 初始日期显示：10月29日（不是 10月28日）
✅ 底部"预约时间"显示：10月29日 HH:MM
✅ 点击"选症状"，进入症状页面
✅ 验证传递的日期：2025-10-29
```

#### **场景4：边界测试**

```
场景4a：午夜前后
时间：10月29日 23:55 → 10月30日 00:05
操作：
1. 在两个时间点各创建一个订单
验证点：
✅ 23:55 的订单日期：2025-10-29
✅ 00:05 的订单日期：2025-10-30

场景4b：跨月边界
时间：9月30日 23:55 → 10月1日 00:05
操作：
1. 在两个时间点各创建一个订单
验证点：
✅ 9月30日 的订单日期：2025-09-30
✅ 10月1日 的订单日期：2025-10-01

场景4c：跨年边界
时间：12月31日 23:55 → 1月1日 00:05
操作：
1. 在两个时间点各创建一个订单
验证点：
✅ 12月31日 的订单日期：2025-12-31
✅ 1月1日 的订单日期：2026-01-01
```

#### **场景5：多日期选择**

```
时间：10月29日 早上 7:30
操作：
1. 打开技师预约
2. 依次选择"今天"、"明天"、"后天"、"第4天"、"第5天"
3. 每个日期下都创建一个订单

验证点：
✅ 10月29日订单：2025-10-29
✅ 10月30日订单：2025-10-30
✅ 10月31日订单：2025-10-31
✅ 11月1日订单：2025-11-01
✅ 11月2日订单：2025-11-02
```

---

## 测试验证检查清单

### 数据库验证

```sql
-- 查询订单的预约日期
SELECT orderNo, appointmentDate, createdAt FROM orders
WHERE orderNo LIKE 'ORDER202510%'
ORDER BY createdAt DESC
LIMIT 10;

-- 预期结果：appointmentDate 应该与用户选择的日期一致
-- 例如：2025-10-29 而不是 2025-10-28
```

### 浏览器控制台验证

在修改前后对比：

```javascript
// 修改前（错误）
console.log('toISOString:', new Date().toISOString().split('T')[0])
// 可能输出：2025-10-28

// 修改后（正确）
console.log('getLocalDateString:', getLocalDateString())
// 输出：2025-10-29
```

### 网络请求验证

在浏览器的 Network 标签中：

1. 打开开发者工具
2. 进入 XHR/Fetch 过滤
3. 创建订单
4. 查看 POST `/appointments/create-with-order` 的请求体
5. 验证 `appointmentDate` 字段值是否正确

---

## 修改后的影响评估

### ✅ 不会影响的模块

| 模块 | 原因 |
|------|------|
| 订单列表显示 | 使用后端返回的日期，不受影响 |
| 订单详情 | 显示后端存储的日期，不受影响 |
| 支付功能 | 不涉及日期修改，不受影响 |
| 退款功能 | 不涉及日期修改，不受影响 |
| 时间选择器 | 只处理时间部分，不受影响 |
| 订单评价 | 使用后端日期，不受影响 |

### ⚠️ 可能相关的模块

| 模块 | 检查项 |
|------|--------|
| 券/优惠 | 确保使用有效期验证不受影响 |
| 统计报表 | 确保日期统计正确 |
| 日期筛选 | 确保日期范围筛选正确 |

---

## 总结

### 修改方案安全性

| 维度 | 评估 | 理由 |
|------|------|------|
| **API兼容性** | ✅ 安全 | 日期格式不变，仅修改生成方式 |
| **后端兼容** | ✅ 安全 | 无需后端任何修改 |
| **数据迁移** | ✅ 安全 | 只影响新创建的订单 |
| **用户体验** | ✅ 改进 | 修复日期不匹配的 bug |
| **性能影响** | ✅ 无 | 函数调用零开销 |

### 风险等级：🟢 **低风险**

- 仅修改日期生成逻辑
- 日期格式保持不变
- 不涉及数据库结构变化
- 修改范围清晰明确
