# 门店相关API文档

## 1. 获取附近门店列表

### 接口地址
```
GET /api/v2/stores/nearby
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| latitude | number | 否 | 纬度（不传则返回所有门店） |
| longitude | number | 否 | 经度 |
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
        "name": "明医推拿（罗湖店）",
        "address": "深圳市罗湖区东门南路1234号",
        "phone": "0755-12345678",
        "businessHours": "10:00-22:00",  // 简化格式，前端自行解析
        "distance": 1.2,  // 公里，可选字段
        "status": "normal",  // normal正常/busy繁忙/full爆满
        "image": "/images/stores/1.jpg",  // 门店主图
        "therapistCount": 5  // 在岗推拿师数量
      }
    ],
    "total": 38,
    "page": 1,
    "pageSize": 10
  }
}
```

### 实现建议

1. **距离计算**：
   - 如果传入经纬度，后端计算距离并排序
   - 如果未传入，按ID或其他默认规则排序

2. **状态判断逻辑**：
   ```sql
   -- 基于推拿师数量判断
   CASE 
     WHEN therapist_count >= 10 THEN 'full'
     WHEN therapist_count >= 5 THEN 'busy'
     ELSE 'normal'
   END as status
   ```

3. **图片处理**：
   - 简单方案：使用静态路径规则 `/images/stores/{id}.jpg`
   - 后续可扩展为图片字段

## 2. 获取门店详情

### 接口地址
```
GET /api/v2/stores/:id
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 门店ID |

### 响应数据
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "name": "明医推拿（罗湖店）",
    "address": "深圳市罗湖区东门南路1234号",
    "phone": "0755-12345678",
    "businessHours": "10:00-22:00",
    "status": "normal",
    "images": [  // 详情页返回多张图片
      "/images/stores/1_1.jpg",
      "/images/stores/1_2.jpg"
    ],
    "latitude": 22.5431,  // 详情页返回经纬度
    "longitude": 114.0579,
    "services": [  // 门店提供的服务
      {
        "id": "1",
        "name": "经络推拿",
        "price": 12800,  // 分为单位
        "duration": 60   // 分钟
      }
    ],
    "therapists": [  // 门店的推拿师列表
      {
        "id": "1",
        "name": "张师傅",
        "avatar": "/images/therapists/1.jpg",
        "title": "高级推拿师",
        "rating": 4.8,
        "status": "available"
      }
    ]
  }
}
```

## 3. 搜索门店

### 接口地址
```
GET /api/v2/stores/search
```

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词（名称/地址） |
| district | string | 否 | 区域筛选 |
| status | string | 否 | 状态筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 响应数据
同"获取附近门店列表"

## 实际实现方案

### 扩展表模式实现

我们采用了扩展表模式来实现新增字段，避免修改现有表结构：

1. **创建门店扩展表**
```sql
CREATE TABLE IF NOT EXISTS store_extensions (
    store_id INTEGER PRIMARY KEY,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    images TEXT DEFAULT '[]',  -- JSON数组格式
    features TEXT DEFAULT '[]', -- JSON格式的特色服务
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

2. **查询实现**
```sql
-- 使用LEFT JOIN查询，确保即使扩展表没数据也能返回
SELECT 
    s.*,
    se.latitude,
    se.longitude,
    se.images,
    COUNT(DISTINCT t.id) as therapist_count
FROM stores s
LEFT JOIN store_extensions se ON s.id = se.store_id
LEFT JOIN therapists t ON s.id = t.store_id AND t.status = 'active'
WHERE s.status = 'active'
GROUP BY s.id
```

3. **API层处理**
- 当扩展表无数据时，使用默认值
- 图片：默认规则 `/images/stores/{id}.jpg`
- 位置：返回默认坐标或不返回distance字段
- 状态：根据therapist_count动态计算

## 实现要点

1. **扩展表优势**
   - ✅ 不修改现有stores表，v1 API完全不受影响
   - ✅ 新字段集中管理，便于维护
   - ✅ 可随时回滚，只需删除扩展表
   - ✅ 支持渐进式数据迁移

2. **兼容性保证**
   - v1接口：继续使用原表，返回原格式
   - v2接口：JOIN扩展表，转换响应格式
   - 中间件统一处理：ID转字符串、响应格式转换

3. **数据降级策略**
   ```javascript
   // 扩展表无数据时的默认值处理
   image: images[0] || `/images/stores/${store.id}.jpg`
   latitude: store.latitude || 31.2304  // 上海默认坐标
   status: calculateStatus(therapist_count)  // 动态计算
   ```

4. **原设计保留说明**
   - businessHours：保持原字段名business_hours的值
   - therapistCount：实时COUNT计算，非存储字段
   - distance：仅在有用户坐标时计算并返回

## 测试用例

```bash
# 获取附近门店（无位置）
curl http://localhost:3001/api/v2/stores/nearby

# 获取附近门店（有位置）
curl "http://localhost:3001/api/v2/stores/nearby?latitude=22.5431&longitude=114.0579"

# 获取门店详情
curl http://localhost:3001/api/v2/stores/1
```