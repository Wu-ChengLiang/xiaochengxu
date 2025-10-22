# GET /api/v2/stores/filter - 按状态筛选门店

## 接口地址
```
GET /api/v2/stores/filter
```

## 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 是 | 门店状态：normal(正常)/busy(繁忙)/full(爆满) |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

## 响应数据
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
        "businessHours": "10:00-22:00",
        "distance": 1.2,
        "status": "normal",
        "image": "/images/stores/1.jpg",
        "therapistCount": 5
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "hasMore": false
  }
}
```

## 实现说明
- 根据 `status` 参数过滤门店
- status 映射规则见 01-门店API.md 的状态判断逻辑
- 返回格式与 `/stores/nearby` 相同
- 支持分页查询

## 前端调用
```typescript
// store.ts - getStoresByStatus() 方法
async getStoresByStatus(
  status: Store['status'],
  page: number = 1,
  pageSize: number = 10
): Promise<PageData<Store>>
```

## 数据库查询
```sql
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
HAVING (
  CASE
    WHEN COUNT(DISTINCT t.id) >= 10 THEN 'full'
    WHEN COUNT(DISTINCT t.id) >= 5 THEN 'busy'
    ELSE 'normal'
  END
) = ?
LIMIT ? OFFSET ?
```
