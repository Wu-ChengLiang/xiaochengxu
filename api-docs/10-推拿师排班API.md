# 推拿师排班查询API

> **文档更新时间**: 2025-10-23
> **用途**: 支持门店按预约流程中，症状选择页面的技师可用性判断
> **设计原则**: 单次API调用返回门店所有技师的多日排班数据

## 接口地址
```
GET /api/v2/stores/:storeId/therapists/availability
```

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| storeId | string | 是 | 门店ID |
| date | string | 否 | 起始日期（YYYY-MM-DD），默认当前日期 |
| days | number | 否 | 查询天数（1-7），默认3 |

## 请求示例

```bash
# 查询门店27从2025-10-25开始的3天排班（今明后）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3"
```

## 响应数据

### 成功响应 (200)

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "104",
      "name": "朴老师",
      "avatar": "https://mingyitang1024.com/static/therapists/朴老师.jpg",
      "title": "高级推拿师",
      "rating": 4.8,
      "ratingCount": 100,
      "availability": [
        {
          "date": "2025-10-25",
          "dayOfWeek": "周六",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": false },
            { "time": "11:00", "available": true },
            { "time": "12:00", "available": true },
            { "time": "13:00", "available": false },
            { "time": "14:00", "available": true }
          ]
        },
        {
          "date": "2025-10-26",
          "dayOfWeek": "周日",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true },
            { "time": "11:00", "available": true }
          ]
        },
        {
          "date": "2025-10-27",
          "dayOfWeek": "周一",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true }
          ]
        }
      ]
    },
    {
      "id": "105",
      "name": "张师傅",
      "avatar": "https://mingyitang1024.com/static/therapists/张师傅.jpg",
      "title": "推拿师",
      "rating": 4.6,
      "ratingCount": 85,
      "availability": [
        {
          "date": "2025-10-25",
          "dayOfWeek": "周六",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true },
            { "time": "11:00", "available": false }
          ]
        },
        {
          "date": "2025-10-26",
          "dayOfWeek": "周日",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": false },
            { "time": "10:00", "available": false },
            { "time": "11:00", "available": true }
          ]
        },
        {
          "date": "2025-10-27",
          "dayOfWeek": "周一",
          "workTime": "9:00-21:00",
          "slots": [
            { "time": "09:00", "available": true },
            { "time": "10:00", "available": true }
          ]
        }
      ]
    }
  ]
}
```

### 错误响应

#### 门店不存在 (404)
```json
{
  "code": 1001,
  "message": "门店不存在",
  "data": null
}
```

#### 无效的日期格式 (400)
```json
{
  "code": 1003,
  "message": "无效的日期格式，应为 YYYY-MM-DD",
  "data": null
}
```

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 推拿师ID |
| name | string | 推拿师姓名 |
| avatar | string | 推拿师头像URL |
| title | string | 职位等级 |
| rating | number | 评分（4.0-5.0） |
| ratingCount | number | 评价数 |
| availability | array | 排班信息数组 |
| availability[].date | string | 日期（YYYY-MM-DD） |
| availability[].dayOfWeek | string | 星期 |
| availability[].workTime | string | 工作时间（HH:MM-HH:MM） |
| availability[].slots | array | 时段数组 |
| availability[].slots[].time | string | 时刻（HH:MM） |
| availability[].slots[].available | boolean | 是否可预约 |

## 实现细节

### 排班生成逻辑

```sql
-- 查询特定日期技师的可用时段
-- available = true 当且仅当 该时段没有已确认的预约

SELECT
  time_slot,
  NOT EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.therapist_id = :therapistId
    AND a.appointment_date = :date
    AND a.start_time = time_slot
    AND a.status IN ('pending', 'confirmed')
  ) as available
FROM time_slots
WHERE therapist.work_time_start <= time_slot <= therapist.work_time_end
ORDER BY time_slot;
```

### 性能优化建议

1. **缓存策略**
   - 当天查询：缓存30分钟（可能有新预约）
   - 次日查询：缓存2小时
   - 3天后：缓存6小时

2. **数据库索引**
   ```sql
   CREATE INDEX idx_appointments_therapist_date_status
   ON appointments(therapist_id, appointment_date, status);
   ```

3. **查询优化**
   - 一次性获取所有技师的预约数据，避免N+1查询
   - 按日期分组，减少数据库扫描

## 使用场景

### 前端调用示例

```typescript
// 获取门店27从今天开始的3天排班
const response = await fetch(
  `/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3`
)
const data = await response.json()

// 判断技师在某时刻是否可用
const therapist = data.data[0]  // 第一个技师
const slot = therapist.availability[0].slots.find(s => s.time === "10:00")
const isAvailable = slot?.available  // true | false
```

## 兼容性说明

- ✅ 与 `/api/v2/stores/:storeId/therapists` 独立，互不影响
- ✅ 与 `/api/v2/therapists/:id` 的排班数据来源一致
- ✅ 支持未来7天的查询

## 测试用例

```bash
# 测试1：查询今明后三天（推荐场景）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=3"

# 测试2：仅查询指定日期
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability?date=2025-10-25&days=1"

# 测试3：使用默认参数（当前日期，3天）
curl "https://mingyitang1024.com/api/v2/stores/27/therapists/availability"

# 测试4：门店不存在
curl "https://mingyitang1024.com/api/v2/stores/99999/therapists/availability"
```
