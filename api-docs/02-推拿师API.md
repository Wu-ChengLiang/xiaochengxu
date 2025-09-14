# 推拿师相关API文档

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

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "name": "张师傅",
    "avatar": "/images/therapists/1.jpg",
    "storeId": "1",
    "storeName": "明医推拿（罗湖店）",
    "storeAddress": "深圳市罗湖区东门南路1234号",
    "title": "高级推拿师",
    "yearsOfExperience": 10,
    "expertise": ["颈椎调理", "腰椎康复", "肩周炎治疗"],
    "bio": "从事推拿行业10余年，擅长颈椎、腰椎调理...",  // 简介
    "certificates": ["高级推拿师证", "中医康复理疗师证"],  // 资质证书
    "rating": 4.8,
    "ratingCount": 128,
    "serviceCount": 1580,  // 服务次数
    "status": "available",
    "weekSchedule": [  // 一周排班
      {
        "date": "2024-01-20",
        "dayOfWeek": "周一",
        "workTime": "10:00-18:00",
        "slots": [
          { "time": "10:00", "available": true },
          { "time": "11:00", "available": false }
        ]
      }
    ]
  }
}
```

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

```bash
# 获取推荐推拿师
curl http://localhost:3001/api/v2/therapists/recommended

# 获取门店推拿师
curl http://localhost:3001/api/v2/stores/1/therapists

# 搜索推拿师
curl "http://localhost:3001/api/v2/therapists/search?expertise=颈椎调理"
```