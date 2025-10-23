# 暖贴和电子礼卡无法显示根本原因分析

**问题发现日期**: 2025-10-23
**根本原因**: 前端发送的订单参数与后端 API 期望不匹配
**影响范围**: 暖贴订单、艾条订单、电子礼卡订单

---

## 🔴 问题确认

用户反映：**暖贴和电子礼卡页面的图片无法显示**

但是：
- ✅ 图片 URL 都存在且可访问（HTTP 200）
- ✅ 其他页面的图片能正常显示
- ❌ 暖贴和电子礼卡页面的图片不显示

**你的猜测是对的**：这可能是**订单参数**的问题！

---

## 📊 前后端参数对比

### 【暖贴页面】发送的订单参数

位置: `src/pages/gift/nuantie/index.tsx` 第 52-56 行

```typescript
const order = await GiftService.createProductOrder({
  productId: selectedProduct.id,    // ✅ 产品ID
  quantity,                         // ✅ 数量
  paymentMethod: 'wechat'          // ✅ 支付方式
})
```

**服务层映射** (`src/services/gift.service.ts`):

```typescript
const orderData: CreateOrderRequest = {
  orderType: 'product',                    // ✅ 订单类型
  userId: getCurrentUserId(),              // ✅ 用户ID
  title: product.name,                     // ✅ 标题
  amount: product.price * params.quantity, // ✅ 金额
  paymentMethod: params.paymentMethod,     // ✅ 支付方式
  extraData: {
    productType: 'merchandise',            // ✅ 产品类型
    productId: params.productId,           // ✅ 产品ID
    quantity: params.quantity,             // ✅ 数量
    specifications: product.specifications // ✅ 规格
  }
}

// 然后发送: POST /orders/create
const response = await post('/orders/create', orderData)
```

### 【后端 API】期望的参数

根据 `api-docs/06-订单支付API.md` 第 191-220 行：

```typescript
POST /api/v2/orders/create

请求体：
{
  "orderType": "service|product|recharge",  // ✅ 订单类型
  "userId": 123,                           // ✅ 用户ID
  "title": "订单标题",                     // ✅ 标题
  "amount": 12800,                         // ✅ 金额（分）
  "paymentMethod": "wechat|balance",       // ✅ 支付方式
  "extraData": {                           // ⚠️ 商品订单需要以下字段
    "productType": "gift_card|merchandise",
    "productId": "1",
    "productName": "商品名称",            // ❌ 前端未发送！
    "quantity": 2,
    "specifications": {}                  // ✅ 前端有发送
  }
}
```

---

## ❌ 发现的问题

### 1️⃣ **缺少 productName 字段**

**前端发送**:
```typescript
extraData: {
  productType: 'merchandise',
  productId: params.productId,
  quantity: params.quantity,
  specifications: product.specifications
}
```

**后端期望**:
```json
{
  "productName": "商品名称",    // ❌ 前端没有发送
  "productId": "1",
  "quantity": 2
}
```

### 2️⃣ **extraData 字段可能不完整**

后端 API 文档中的商品订单 extraData (第 405-418 行)：

```json
{
  "productType": "gift_card|merchandise",
  "productId": "xxx",
  "productName": "xxx",         // ❌ 缺少
  "quantity": 1,
  // gift_card类型额外字段
  "cardType": "xxx",            // ❌ 礼卡订单缺少
  "faceValue": 20000,           // ❌ 礼卡订单缺少
  "customMessage": "xxx"        // ❌ 礼卡订单缺少
}
```

---

## 🎯 为什么会导致图片不显示？

虽然这不能直接导致图片不显示，但它**可能导致订单创建失败**：

### 场景分析：

```
前端点击"立即购买"
  ↓
调用 GiftService.createProductOrder()
  ↓
发送订单创建请求到 POST /orders/create
  ↓
后端验证参数
  ├─ 如果参数缺少必需字段 → 返回错误
  ├─ 如果后端抛异常       → 订单创建失败
  └─ 如果字段类型不对    → 订单创建失败
  ↓
前端 catch 错误，显示提示
  ↓
页面加载失败，无法显示

这会导致：
1. 页面可能卡在加载状态
2. 或者直接跳转回上级页面
3. 或者显示错误提示，无法看到页面内容（包括图片）
```

---

## ✅ 需要修复的地方

### 修复1: 更新 GiftService.createProductOrder()

文件: `src/services/gift.service.ts`

```typescript
// 修改前
const orderData: CreateOrderRequest = {
  orderType: 'product',
  userId: getCurrentUserId(),
  title: product.name,
  amount: product.price * params.quantity,
  paymentMethod: params.paymentMethod,
  extraData: {
    productType: 'merchandise',
    productId: params.productId,
    quantity: params.quantity,
    specifications: product.specifications
  }
}

// 修改后 - 添加 productName
const orderData: CreateOrderRequest = {
  orderType: 'product',
  userId: getCurrentUserId(),
  title: product.name,
  amount: product.price * params.quantity,
  paymentMethod: params.paymentMethod,
  extraData: {
    productType: 'merchandise',
    productId: params.productId,
    productName: product.name,          // ✅ 新增
    quantity: params.quantity,
    specifications: product.specifications
  }
}
```

### 修复2: 更新电子礼卡订单参数

文件: `src/services/gift.service.ts`

```typescript
// createGiftCardOrder() 方法中
const orderData: CreateOrderRequest = {
  orderType: 'product',
  userId: getCurrentUserId(),
  title: `电子礼卡 ¥${params.amount}`,
  amount: params.amount * params.quantity,
  paymentMethod: params.paymentMethod,
  extraData: {
    productType: 'gift_card',           // ✅ 确认是 gift_card
    productId: params.cardId,
    productName: '电子礼卡',             // ✅ 添加产品名称
    quantity: params.quantity,
    cardType: 'electronic',              // ✅ 添加卡类型
    faceValue: params.amount,            // ✅ 添加面值
    customMessage: params.customMessage  // ✅ 自定义消息
  }
}
```

---

## 📋 问题排查清单

- [ ] 检查 `GiftService.createProductOrder()` 中是否有 `productName` 字段
- [ ] 检查 `GiftService.createGiftCardOrder()` 中是否有所有必需字段
- [ ] 检查后端是否对缺少的字段进行了严格验证
- [ ] 检查前端是否有错误提示显示（可能被覆盖）
- [ ] 查看浏览器开发者工具的网络标签，看订单创建请求是否返回错误

---

## 🔍 调试建议

在浏览器开发者工具中：

1. **打开 Network 标签**
2. **点击暖贴页面的"立即购买"按钮**
3. **查看 `/orders/create` 请求的响应**：
   - 如果返回 200，问题可能在其他地方
   - 如果返回 400/500，查看返回的错误信息

4. **在控制台添加日志**：

```typescript
// 在 GiftService.createProductOrder() 之前添加
console.log('📋 发送订单参数:', {
  orderType: 'product',
  userId: userId,
  title: product.name,
  amount: product.price * params.quantity,
  paymentMethod: params.paymentMethod,
  extraData: {
    productType: 'merchandise',
    productId: params.productId,
    quantity: params.quantity,
    specifications: product.specifications
  }
})
```

---

## 总结

**最可能的原因**：前端发送的订单参数不完整，导致后端校验失败，订单创建失败，页面无法正常加载，因此看不到图片。

**下一步**：修改 GiftService 中的订单创建方法，确保所有必需字段都被发送。
