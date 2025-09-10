# mingyi.db 数据库结构分析报告

数据库路径: `/home/chengliang/workspace/xiaochengxu/backend/database/mingyi.db`

## 概览
- 表总数: 8
- 分析时间: 2025-09-10 09:17:45

## 表结构详情

### admins
- 记录数: 34

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| username | VARCHAR(50) | 是 | NULL | 否 | |
| password_hash | VARCHAR(255) | 是 | NULL | 否 | |
| store_id | INTEGER | 否 | NULL | 否 | |
| role | TEXT | 否 | 'admin' | 否 | |
| is_active | BOOLEAN | 否 | 1 | 否 | |
| last_login | DATETIME | 否 | NULL | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| store_ids | TEXT | 否 | NULL | 否 | |
| user_id | TEXT | 否 | NULL | 否 | |
| updated_at | DATETIME | 否 | NULL | 否 | |

#### 索引
- idx_admins_user_id (唯一): user_id
- sqlite_autoindex_admins_1 (唯一): username

#### 外键
- store_id -> stores.id

#### ⚠️ 可能的冗余字段
- 表 admins 有多个ID相关字段: store_id, store_ids, user_id，可能存在冗余
- 表 admins 有较多可空字段: store_id, last_login, store_ids, user_id, updated_at...，建议检查是否都在使用

### appointment_audit_logs
- 记录数: 20

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| appointment_id | INTEGER | 是 | NULL | 否 | |
| store_id | INTEGER | 是 | NULL | 否 | |
| action_type | VARCHAR(20) | 是 | NULL | 否 | |
| action_by | VARCHAR(50) | 是 | NULL | 否 | |
| action_by_role | VARCHAR(20) | 否 | NULL | 否 | |
| action_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| old_data | TEXT | 否 | NULL | 否 | |
| new_data | TEXT | 否 | NULL | 否 | |
| changed_fields | TEXT | 否 | NULL | 否 | |
| ip_address | VARCHAR(45) | 否 | NULL | 否 | |
| user_agent | TEXT | 否 | NULL | 否 | |
| notes | TEXT | 否 | NULL | 否 | |

#### 索引
- idx_audit_action_by (普通): action_by
- idx_audit_action_at (普通): action_at
- idx_audit_store_id (普通): store_id
- idx_audit_appointment_id (普通): appointment_id

#### 外键
- store_id -> stores.id
- appointment_id -> appointments.id

#### ⚠️ 可能的冗余字段
- 表 appointment_audit_logs 有较多可空字段: action_by_role, old_data, new_data, changed_fields, ip_address...，建议检查是否都在使用

### appointments
- 记录数: 45

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| user_id | INTEGER | 是 | NULL | 否 | |
| therapist_id | INTEGER | 是 | NULL | 否 | |
| store_id | INTEGER | 是 | NULL | 否 | |
| service_id | INTEGER | 否 | NULL | 否 | |
| service_type | VARCHAR(50) | 否 | NULL | 否 | |
| appointment_date | DATE | 是 | NULL | 否 | |
| start_time | TIME | 是 | NULL | 否 | |
| end_time | TIME | 是 | NULL | 否 | |
| duration | INTEGER | 否 | 60 | 否 | |
| status | TEXT | 否 | 'pending' | 否 | |
| notes | TEXT | 否 | NULL | 否 | |
| health_notes | TEXT | 否 | NULL | 否 | |
| price | DECIMAL(8,2) | 否 | NULL | 否 | |
| payment_status | TEXT | 否 | 'unpaid' | 否 | |
| rating | INTEGER | 否 | NULL | 否 | |
| review | TEXT | 否 | NULL | 否 | |
| therapist_notes | TEXT | 否 | NULL | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| updated_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| member_phone | VARCHAR(20) | 否 | NULL | 否 | |
| is_member_booking | BOOLEAN | 否 | 0 | 否 | |
| member_discount_applied | DECIMAL(3,2) | 否 | 1.00 | 否 | |
| points_earned | INTEGER | 否 | 0 | 否 | |
| card_amount | DECIMAL(8,2) | 否 | 0.00 | 否 | |
| original_service | VARCHAR(100) | 否 | NULL | 否 | |
| recharge_amount | DECIMAL(8,2) | 否 | 0.00 | 否 | |
| upgrade_service | VARCHAR(100) | 否 | NULL | 否 | |
| customer_source | VARCHAR(50) | 否 | NULL | 否 | |

#### 索引
- idx_appointments_status (普通): status
- idx_appointments_user_id (普通): user_id
- idx_appointments_therapist_date (普通): therapist_id, appointment_date
- idx_appointments_date (普通): appointment_date

#### 外键
- service_id -> services.id
- store_id -> stores.id
- therapist_id -> therapists.id
- user_id -> users.id

#### ⚠️ 可能的冗余字段
- 表 appointments 有多个时间相关字段: appointment_date, start_time, end_time, created_at, updated_at，可能存在冗余
- 表 appointments 有多个状态相关字段: status, payment_status, is_member_booking，可能存在冗余
- 表 appointments 有多个备注相关字段: notes, health_notes, therapist_notes，可能存在冗余
- 表 appointments 有多个ID相关字段: user_id, therapist_id, store_id, service_id，可能存在冗余
- 表 appointments 有较多可空字段: service_id, service_type, notes, health_notes, price...，建议检查是否都在使用

### services
- 记录数: 15

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| store_id | INTEGER | 否 | 0 | 否 | |
| name | VARCHAR(100) | 是 | NULL | 否 | |
| category | VARCHAR(50) | 是 | NULL | 否 | |
| duration | INTEGER | 否 | 60 | 否 | |
| price | DECIMAL(8,2) | 否 | NULL | 否 | |
| group_buy_price | DECIMAL(8,2) | 否 | NULL | 否 | |
| reservation_required | TEXT | 否 | 'NO' | 否 | |
| service_areas | TEXT | 否 | NULL | 否 | |
| service_process | TEXT | 否 | NULL | 否 | |
| free_gifts | TEXT | 否 | NULL | 否 | |
| description | TEXT | 否 | NULL | 否 | |
| status | TEXT | 否 | 'active' | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |

#### 外键
- store_id -> stores.id

#### ⚠️ 可能的冗余字段
- 表 services 有较多可空字段: price, group_buy_price, service_areas, service_process, free_gifts...，建议检查是否都在使用

### stores
- 记录数: 31

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| name | VARCHAR(100) | 是 | NULL | 否 | |
| address | VARCHAR(200) | 否 | NULL | 否 | |
| phone | VARCHAR(20) | 否 | NULL | 否 | |
| business_hours | VARCHAR(50) | 否 | '09:00-21:00' | 否 | |
| status | TEXT | 否 | 'active' | 否 | |
| manager_name | VARCHAR(50) | 否 | NULL | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| updated_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |

### therapists
- 记录数: 162

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| store_id | INTEGER | 是 | NULL | 否 | |
| name | VARCHAR(50) | 是 | NULL | 否 | |
| position | VARCHAR(50) | 是 | NULL | 否 | |
| title | VARCHAR(50) | 否 | NULL | 否 | |
| experience_years | INTEGER | 是 | NULL | 否 | |
| years_experience | INTEGER | 否 | NULL | 否 | |
| specialties | TEXT | 是 | NULL | 否 | |
| service_types | TEXT | 否 | NULL | 否 | |
| phone | VARCHAR(20) | 否 | NULL | 否 | |
| honors | VARCHAR(100) | 否 | NULL | 否 | |
| bio | TEXT | 否 | NULL | 否 | |
| avatar_url | VARCHAR(200) | 否 | NULL | 否 | |
| rating | DECIMAL(3,2) | 否 | 5.0 | 否 | |
| review_count | INTEGER | 否 | 0 | 否 | |
| status | TEXT | 否 | 'active' | 否 | |
| work_schedule | TEXT | 否 | NULL | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| updated_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |

#### 外键
- store_id -> stores.id

#### ⚠️ 可能的冗余字段
- 表 therapists 有较多可空字段: title, years_experience, service_types, phone, honors...，建议检查是否都在使用

### users
- 记录数: 88

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| name | VARCHAR(50) | 是 | NULL | 否 | |
| username | VARCHAR(50) | 否 | NULL | 否 | |
| email | VARCHAR(100) | 否 | NULL | 否 | |
| phone | VARCHAR(20) | 否 | NULL | 否 | |
| gender | TEXT | 否 | 'unknown' | 否 | |
| age | INTEGER | 否 | NULL | 否 | |
| health_condition | TEXT | 否 | NULL | 否 | |
| preferences | TEXT | 否 | NULL | 否 | |
| total_visits | INTEGER | 否 | 0 | 否 | |
| member_level | TEXT | 否 | 'normal' | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| updated_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| membership_number | VARCHAR(20) | 否 | NULL | 否 | |
| balance | DECIMAL(10,2) | 否 | 0.00 | 否 | |
| points | INTEGER | 否 | 0 | 否 | |
| total_spent | DECIMAL(10,2) | 否 | 0.00 | 否 | |
| discount_rate | DECIMAL(3,2) | 否 | 1.00 | 否 | |
| medical_record_number | VARCHAR(20) | 否 | NULL | 否 | |
| constitution_type | VARCHAR(50) | 否 | NULL | 否 | |
| allergies | TEXT | 否 | NULL | 否 | |
| tcm_diagnosis_history | TEXT | 否 | NULL | 否 | |
| emergency_contact_name | VARCHAR(50) | 否 | NULL | 否 | |
| emergency_contact_phone | VARCHAR(20) | 否 | NULL | 否 | |
| sms_notifications | BOOLEAN | 否 | 1 | 否 | |
| sms_marketing | BOOLEAN | 否 | 1 | 否 | |
| status | VARCHAR(20) | 否 | "ACTIVE" | 否 | |

#### 索引
- idx_users_medical_record (普通): medical_record_number
- idx_users_status (普通): status
- idx_users_member_level_new (普通): member_level
- idx_users_membership_number (普通): membership_number
- idx_users_phone (普通): phone
- sqlite_autoindex_users_2 (唯一): phone
- sqlite_autoindex_users_1 (唯一): username

#### ⚠️ 可能的冗余字段
- 表 users 有较多可空字段: username, email, phone, age, health_condition...，建议检查是否都在使用

### wechat_notification_tasks
- 记录数: 9

#### 字段结构
| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |
|--------|------|------|--------|------|------|
| id | INTEGER | 否 | NULL | 是 | |
| store_id | INTEGER | 是 | NULL | 否 | |
| target_store | VARCHAR(50) | 否 | NULL | 否 | |
| message | TEXT | 是 | NULL | 否 | |
| type | VARCHAR(20) | 否 | 'text' | 否 | |
| image_data | BLOB | 否 | NULL | 否 | |
| image_name | VARCHAR(255) | 否 | NULL | 否 | |
| status | VARCHAR(20) | 否 | 'pending' | 否 | |
| retry_count | INTEGER | 否 | 0 | 否 | |
| max_retries | INTEGER | 否 | 3 | 否 | |
| related_id | INTEGER | 否 | NULL | 否 | |
| related_type | VARCHAR(50) | 否 | NULL | 否 | |
| result_message | TEXT | 否 | NULL | 否 | |
| created_at | DATETIME | 否 | CURRENT_TIMESTAMP | 否 | |
| processed_at | DATETIME | 否 | NULL | 否 | |
| completed_at | DATETIME | 否 | NULL | 否 | |

#### 索引
- idx_wechat_tasks_created (普通): created_at
- idx_wechat_tasks_store (普通): store_id
- idx_wechat_tasks_status (普通): status

#### 外键
- store_id -> stores.id

#### ⚠️ 可能的冗余字段
- 表 wechat_notification_tasks 有较多可空字段: target_store, image_data, image_name, related_id, related_type...，建议检查是否都在使用


## 冗余字段汇总
以下是在各表中发现的可能冗余的字段，建议进一步检查：
- 表 admins 有多个ID相关字段: store_id, store_ids, user_id，可能存在冗余
- 表 admins 有较多可空字段: store_id, last_login, store_ids, user_id, updated_at...，建议检查是否都在使用
- 表 appointment_audit_logs 有较多可空字段: action_by_role, old_data, new_data, changed_fields, ip_address...，建议检查是否都在使用
- 表 appointments 有多个时间相关字段: appointment_date, start_time, end_time, created_at, updated_at，可能存在冗余
- 表 appointments 有多个状态相关字段: status, payment_status, is_member_booking，可能存在冗余
- 表 appointments 有多个备注相关字段: notes, health_notes, therapist_notes，可能存在冗余
- 表 appointments 有多个ID相关字段: user_id, therapist_id, store_id, service_id，可能存在冗余
- 表 appointments 有较多可空字段: service_id, service_type, notes, health_notes, price...，建议检查是否都在使用
- 表 services 有较多可空字段: price, group_buy_price, service_areas, service_process, free_gifts...，建议检查是否都在使用
- 表 therapists 有较多可空字段: title, years_experience, service_types, phone, honors...，建议检查是否都在使用
- 表 users 有较多可空字段: username, email, phone, age, health_condition...，建议检查是否都在使用
- 表 wechat_notification_tasks 有较多可空字段: target_store, image_data, image_name, related_id, related_type...，建议检查是否都在使用