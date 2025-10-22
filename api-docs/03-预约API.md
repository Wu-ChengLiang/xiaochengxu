# 预约相关API文档

## 1. 创建预约+订单（一体化）

### 接口地址
```
POST /api/v2/appointments/create-with-order
```

### 说明
同时创建预约和关联订单，支持微信或余额支付。**这是推荐的预约创建方式**。

### 请求参数
```json
{
  "therapistId": 1,                    // 技师ID（必填）
  "storeId": 1,                        // 门店ID（必填）
  "userId": 123,                       // 用户ID（必填）
  "userPhone": "13800138000",          // 用户电话（必填）
  "userName": "张三",                  // 用户名称（可选）
  "appointmentDate": "2024-12-25",     // 预约日期（必填，YYYY-MM-DD）
  "startTime": "14:00",                // 开始时间（必填，HH:mm）
  "duration": 60,                      // 服务时长（分钟，可选，默认60）
  "price": 12800,                      // 价格（必填，单位：分）
  "serviceName": "颈部按摩",           // 服务名称（必填）
  "therapistName": "王师傅",           // 技师名称（必填）
  "paymentMethod": "wechat"            // 支付方式（可选，默认wechat，支持：wechat/balance）
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appointment": {
      "id": 123,
      "therapistId": 1,
      "storeId": 1,
      "appointmentDate": "2024-12-25",
      "startTime": "14:00",
      "endTime": "15:00",
      "price": 12800,
      "status": "pending",
      "orderNo": "ORDER202412251234567"
    },
    "order": {
      "orderNo": "ORDER202412251234567",
      "orderType": "service",
      "title": "预约王师傅-颈部按摩",
      "originalAmount": 12800,
      "amount": 12800,
      "paymentMethod": "wechat",
      "paymentStatus": "pending",
      "createdAt": "2024-12-25T06:00:00.000Z",
      "voucherUsed": null,
      "wxPayParams": {
        "prepay_id": "wx_prepay_id",
        "timeStamp": "1234567890",
        "nonceStr": "random_string",
        "package": "prepay_id=wx_prepay_id",
        "signType": "RSA",
        "paySign": "signature"
      }
    }
  }
}
```

### 关键说明
- 同时创建预约（appointments）和订单（orders）
- 支付后通过回调自动同步预约状态
- 支持优惠券自动应用
- 微信支付时返回签名后的支付参数

## 2. 获取预约详情

### 接口地址
```
GET /api/v2/appointments/:id
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 预约ID |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "202401201400001",
    "status": "confirmed",  // pending待确认/confirmed已确认/serving服务中/completed已完成/cancelled已取消
    "therapist": {
      "id": "1",
      "name": "张师傅",
      "avatar": "/images/therapists/1.jpg",
      "phone": "138****8888"  // 脱敏处理
    },
    "store": {
      "id": "1",
      "name": "明医推拿（罗湖店）",
      "address": "深圳市罗湖区东门南路1234号",
      "phone": "0755-12345678"
    },
    "service": {
      "type": "经络推拿",
      "duration": 60,
      "price": 12800
    },
    "appointment": {
      "date": "2024-01-20",
      "startTime": "14:00",
      "endTime": "15:00"
    },
    "user": {
      "name": "张先生",
      "phone": "138****8000"
    },
    "payment": {
      "amount": 12800,
      "status": "paid",  // unpaid未支付/paid已支付/refunded已退款
      "paidAt": "2024-01-19T10:35:00.000Z"
    },
    "createdAt": "2024-01-19T10:30:00.000Z",
    "updatedAt": "2024-01-19T10:35:00.000Z"
  }
}
```

## 3. 获取用户预约列表

### 接口地址
```
GET /api/v2/appointments/mine
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userPhone | string | 是 | 用户手机号 |
| status | string | 否 | 状态筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "202401201400001",
        "therapistName": "张师傅",
        "therapistAvatar": "/images/therapists/1.jpg",
        "storeName": "明医推拿（罗湖店）",
        "serviceType": "经络推拿",
        "appointmentDate": "2024-01-20",
        "startTime": "14:00",
        "duration": 60,
        "price": 12800,
        "status": "confirmed",
        "canCancel": true,  // 是否可取消
        "canReview": false  // 是否可评价
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  }
}
```

## 4. 取消预约

### 接口地址
```
PUT /api/v2/appointments/:id/cancel
```

### 请求参数
```json
{
  "reason": "临时有事"  // 取消原因，可选
}
```

### 响应数据
```json
{
  "code": 0,
  "message": "预约已取消",
  "data": {
    "id": "202401201400001",
    "status": "cancelled",
    "cancelledAt": "2024-01-19T12:00:00.000Z"
  }
}
```

### 取消规则
- 预约开始前2小时可免费取消
- 2小时内取消可能产生费用

## 5. 获取可预约时段

### 接口地址
```
GET /api/v2/appointments/available-slots
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| therapistId | string | 是 | 推拿师ID |
| date | string | 是 | 查询日期 |
| duration | number | 否 | 服务时长，默认60分钟 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "date": "2024-01-20",
    "slots": [
      {
        "time": "10:00",
        "available": true,
        "status": "available"  // available可预约/busy已预约/break休息时间
      },
      {
        "time": "11:00",
        "available": false,
        "status": "busy"
      },
      {
        "time": "12:00",
        "available": false,
        "status": "break"
      }
    ],
    "workTime": {
      "start": "10:00",
      "end": "18:00"
    }
  }
}
```

## 数据库改造建议

### 必要改动

1. **用户信息存储**
```sql
-- 添加用户手机号和姓名字段（如果没有）
ALTER TABLE appointments ADD COLUMN user_phone VARCHAR(20);
ALTER TABLE appointments ADD COLUMN user_name VARCHAR(50);
```

2. **预约单号**
```sql
-- 可以使用自增ID，在API层转换为格式化的单号
-- 或添加单独的order_no字段
ALTER TABLE appointments ADD COLUMN order_no VARCHAR(20) UNIQUE;
```

## 注意事项

1. **简化实现**
   - 初期可以不实现支付，默认为到店付款
   - 用户通过手机号识别，暂不需要注册登录
   - 取消二维码核销，使用预约单号+手机号后4位验证

2. **状态流转**
   ```
   创建 → pending（待确认）
     ├─→ confirmed（已确认）→ serving（服务中）→ completed（已完成）
     └─→ cancelled（已取消）
   ```

3. **并发控制**
   - 创建预约时要加锁，防止同一时段重复预约
   - 使用事务确保数据一致性

4. **通知机制**
   - 预约成功后发送短信通知（可选）
   - 预约前提醒（可选）

## 核心SQL示例

```sql
-- 创建预约
INSERT INTO appointments (
  user_phone, user_name, therapist_id, store_id,
  appointment_date, start_time, end_time, duration,
  service_type, price, status, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP);

-- 查询可用时段（示例）
SELECT 
  time_slot,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM appointments 
      WHERE therapist_id = ? 
      AND appointment_date = ?
      AND status IN ('pending', 'confirmed')
      AND time_slot BETWEEN start_time AND end_time
    ) THEN false
    ELSE true
  END as available
FROM time_slots
WHERE time_slot BETWEEN '10:00' AND '18:00'
ORDER BY time_slot;
```

## 测试用例

```bash
# 创建预约
curl -X POST http://localhost:3001/api/v2/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": "1",
    "storeId": "1",
    "serviceType": "经络推拿",
    "appointmentDate": "2024-01-20",
    "startTime": "14:00",
    "duration": 60,
    "userPhone": "13800138000",
    "userName": "张先生"
  }'

# 查询可用时段
curl "http://localhost:3001/api/v2/appointments/available-slots?therapistId=1&date=2024-01-20"
```