# 推拿师相关API文档

> **文档更新时间**: 2025-10-22
> **验证状态**: ✅ 所有API已验证并与后端实现对齐

## API 实现状态汇总

| API | HTTP 方法 | 端点 | 实现状态 | 备注 |
|-----|----------|------|--------|------|
| 获取推荐推拿师列表 | GET | `/api/v2/therapists/recommended` | ✅ 正确 | 支持分页、位置排序 |
| 根据门店获取推拿师 | GET | `/api/v2/stores/:storeId/therapists` | ✅ 正确 | 返回门店内推拿师列表 |
| 获取推拿师详情 | GET | `/api/v2/therapists/:id` | ✅ 正确 | 返回weekSchedule（7天排班）、serviceCount |
| 搜索推拿师 | GET | `/api/v2/therapists/search` | ✅ 正确 | 支持多条件搜索过滤 |

---

## 1. 获取推荐推拿师列表

### 接口地址
```
GET /api/v2/therapists/recommended
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| latitude | number | 否 | 用户纬度 |
| longitude | number | 否 | 用户经度 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "1",
        "name": "张师傅",
        "avatar": "/images/therapists/1.jpg",
        "storeId": "1",
        "storeName": "明医推拿（罗湖店）",
        "title": "高级推拿师",  // 对应数据库position字段
        "yearsOfExperience": 10,
        "expertise": ["颈椎调理", "腰椎康复"],  // 专长列表
        "rating": 4.8,
        "ratingCount": 128,
        "status": "available",  // available可约/busy忙碌/rest休息
        "distance": 1.2  // 继承自门店距离，可选
      }
    ],
    "total": 162,
    "page": 1,
    "pageSize": 10
  }
}
```

### 实现建议

1. **推荐逻辑**（按优先级排序）：
   - 距离近的优先（如果有位置信息）
   - 评分高的优先
   - 经验年限长的优先

2. **默认值处理**：
   ```javascript
   // 后端处理逻辑
   avatar: therapist.avatar_url || `/images/therapists/${therapist.id}.jpg`,
   rating: therapist.rating || 4.8,
   ratingCount: therapist.review_count || 100
   ```

## 2. 根据门店获取推拿师

### 接口地址
```
GET /api/v2/stores/:storeId/therapists
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| storeId | string | 是 | 门店ID |
| status | string | 否 | 状态筛选 |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "1",
      "name": "张师傅",
      "avatar": "/images/therapists/1.jpg",
      "title": "高级推拿师",
      "yearsOfExperience": 10,
      "expertise": ["颈椎调理", "腰椎康复"],
      "rating": 4.8,
      "status": "available",
      "todaySchedule": {  // 今日排班情况
        "date": "2024-01-20",
        "slots": [
          { "time": "10:00", "available": true },
          { "time": "11:00", "available": false },
          { "time": "14:00", "available": true }
        ]
      }
    }
  ]
}
```

## 3. 获取推拿师详情

### 接口地址
```
GET /api/v2/therapists/:id
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 推拿师ID |

### 响应数据（成功 200）
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "104",
    "name": "朴老师",
    "avatar": "https://mingyitang1024.com/static/therapists/老师收集中文原版/东方路店/朴老师.jpg",
    "storeId": "27",
    "storeName": "名医堂•颈肩腰腿特色调理（东方路店）",
    "storeAddress": "东方路800号宝安大厦3楼梦佳速B区308室（电梯左侧）",
    "title": "高级推拿师",
    "yearsOfExperience": 15,
    "expertise": ["脏腑", "脊柱", "疼痛", "艾灸"],
    "bio": "从事推拿行业15年，专业技术精湛",
    "certificates": ["高级推拿师证", "中医康复理疗师证"],
    "rating": 4.8,
    "ratingCount": 100,
    "serviceCount": 2500,
    "status": "available",
    "weekSchedule": [
      {
        "date": "2025-10-22",
        "dayOfWeek": "周三",
        "workTime": "9:00-21:00",
        "slots": [
          { "time": "09:00", "available": true },
          { "time": "10:00", "available": true },
          { "time": "11:00", "available": true },
          { "time": "12:00", "available": true },
          { "time": "13:00", "available": true },
          { "time": "14:00", "available": true },
          { "time": "15:00", "available": true },
          { "time": "16:00", "available": true },
          { "time": "17:00", "available": true },
          { "time": "18:00", "available": true },
          { "time": "19:00", "available": true },
          { "time": "20:00", "available": true }
        ]
      },
      {
        "date": "2025-10-23",
        "dayOfWeek": "周四",
        "workTime": "9:00-21:00",
        "slots": [
          { "time": "09:00", "available": true },
          { "time": "10:00", "available": true }
        ]
      }
    ]
  }
}
```

### 响应数据（推拿师不存在 404）
```json
{
  "code": 1002,
  "message": "技师不存在",
  "data": null
}
```

### 字段说明
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 推拿师ID |
| name | string | 推拿师姓名 |
| avatar | string | 推拿师头像URL（HTTPS） |
| storeId | string | 所属门店ID |
| storeName | string | 所属门店名称 |
| storeAddress | string | 门店地址 |
| title | string | 职位/等级（如"高级推拿师"） |
| yearsOfExperience | number | 从业年限 |
| expertise | array | 专长列表 |
| bio | string | 个人简介 |
| certificates | array | 资格证书列表 |
| rating | number | 平均评分（4.0-5.0） |
| ratingCount | number | 评价数量 |
| serviceCount | number | 服务次数 |
| status | string | 状态：available(可约) / busy(忙碌) / rest(休息) |
| weekSchedule | array | 一周排班信息（7天） |
| weekSchedule[].date | string | 日期（YYYY-MM-DD） |
| weekSchedule[].dayOfWeek | string | 星期（周一-周日） |
| weekSchedule[].workTime | string | 工作时间（HH:MM-HH:MM） |
| weekSchedule[].slots | array | 可预约时段列表 |
| weekSchedule[].slots[].time | string | 时间（HH:MM） |
| weekSchedule[].slots[].available | boolean | 是否可预约 |

## 4. 搜索推拿师

### 接口地址
```
GET /api/v2/therapists/search
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词（姓名/专长） |
| expertise | string | 否 | 专长筛选 |
| storeId | string | 否 | 门店ID筛选 |
| minExperience | number | 否 | 最少经验年限 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 响应数据
同"获取推荐推拿师列表"

## 数据库改造建议

### 简单改造方案

1. **专长字段处理**
   - 现有specialties字段已经是TEXT类型
   - 建议存储为JSON数组格式：`["颈椎调理", "腰椎康复"]`

2. **新增统计字段**（可选）
```sql
-- 添加服务统计
ALTER TABLE therapists ADD COLUMN service_count INTEGER DEFAULT 0;
-- 可以通过触发器或定时任务更新
UPDATE therapists t SET service_count = (
  SELECT COUNT(*) FROM appointments WHERE therapist_id = t.id AND status = 'completed'
);
```

3. **头像处理**
   - 使用avatar_url字段（如果为空则使用默认规则）
   - 或统一使用 `/images/therapists/{id}.jpg`

4. **状态映射**
```sql
-- 查询时根据预约情况计算状态
CASE 
  WHEN t.status != 'active' THEN 'rest'
  WHEN (SELECT COUNT(*) FROM appointments 
        WHERE therapist_id = t.id 
        AND appointment_date = CURRENT_DATE 
        AND status IN ('pending', 'confirmed')) >= 8 THEN 'busy'
  ELSE 'available'
END as status
```

## 注意事项

1. **数据初始化**
   - rating默认4.8，review_count默认100
   - expertise需要整理现有specialties数据
   - 头像可以先用占位图

2. **性能考虑**
   - 推拿师列表建议缓存（10分钟）
   - 排班信息实时查询，不缓存

3. **排班实现**
   - 简单方案：基于已有预约计算可用时段
   - 复杂方案：新建排班表管理

4. **兼容处理**
   - position → title的映射
   - experience_years → yearsOfExperience
   - specialties的JSON解析

## 字段映射参考

```javascript
// 后端转换逻辑示例
function transformTherapist(dbTherapist) {
  return {
    id: String(dbTherapist.id),
    name: dbTherapist.name,
    avatar: dbTherapist.avatar_url || `/images/therapists/${dbTherapist.id}.jpg`,
    title: dbTherapist.position,
    yearsOfExperience: dbTherapist.experience_years || 0,
    expertise: JSON.parse(dbTherapist.specialties || '[]'),
    rating: dbTherapist.rating || 4.8,
    ratingCount: dbTherapist.review_count || 100,
    // ...其他字段
  };
}
```

## 测试用例

### 1. 获取推荐推拿师列表
```bash
# 请求
curl -s "https://mingyitang1024.com/api/v2/therapists/recommended" | head -c 200

# 预期响应：返回推拿师列表（code: 0）
```

### 2. 获取推拿师详情（成功）
```bash
# 请求（ID: 104，存在的推拿师）
curl -s "https://mingyitang1024.com/api/v2/therapists/104" | head -c 300

# 预期响应：HTTP 200, code: 0, 返回推拿师详细信息
```

### 3. 获取推拿师详情（不存在）
```bash
# 请求（ID: 1，不存在的推拿师）
curl -s "https://mingyitang1024.com/api/v2/therapists/1"

# 预期响应：HTTP 404, code: 1002, message: "技师不存在"
```

### 4. 搜索推拿师
```bash
# 请求（搜索关键词）
curl -s "https://mingyitang1024.com/api/v2/therapists/search?keyword=test"

# 预期响应：HTTP 200, code: 0, 返回空列表（匹配逻辑的结果）
```

### 5. 获取门店推拿师
```bash
# 请求（门店ID: 27）
curl -s "https://mingyitang1024.com/api/v2/stores/27/therapists"

# 预期响应：HTTP 200, code: 0, 返回该门店的推拿师列表
```