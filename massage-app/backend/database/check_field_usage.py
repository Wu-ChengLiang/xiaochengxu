#!/usr/bin/env python3
"""
检查可能冗余字段的实际使用情况
"""
import sqlite3
from pathlib import Path

def check_field_usage(conn, table, field):
    """检查某个字段的使用情况"""
    cursor = conn.cursor()
    
    # 总记录数
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    total_count = cursor.fetchone()[0]
    
    # 非NULL值的记录数
    cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE {field} IS NOT NULL")
    not_null_count = cursor.fetchone()[0]
    
    # 非空字符串的记录数（对于TEXT类型）
    cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE {field} IS NOT NULL AND {field} != ''")
    not_empty_count = cursor.fetchone()[0]
    
    # 获取一些样例值
    cursor.execute(f"SELECT DISTINCT {field} FROM {table} WHERE {field} IS NOT NULL AND {field} != '' LIMIT 5")
    sample_values = [row[0] for row in cursor.fetchall()]
    
    return {
        'total_records': total_count,
        'not_null_records': not_null_count,
        'not_empty_records': not_empty_count,
        'usage_rate': f"{not_null_count/total_count*100:.1f}%" if total_count > 0 else "0%",
        'sample_values': sample_values
    }

def main():
    db_path = Path("/home/chengliang/workspace/xiaochengxu/backend/database/mingyi.db")
    conn = sqlite3.connect(db_path)
    
    print("# 可能冗余字段的使用情况分析\n")
    
    # 检查关键的可能冗余字段
    fields_to_check = [
        # therapists 表
        ('therapists', 'experience_years', '必填的经验年限'),
        ('therapists', 'years_experience', '可选的经验年限'),
        ('therapists', 'service_types', '服务类型'),
        
        # admins 表
        ('admins', 'store_id', '单个店铺ID'),
        ('admins', 'store_ids', '多个店铺ID（JSON）'),
        ('admins', 'user_id', '用户ID'),
        
        # appointments 表
        ('appointments', 'notes', '普通备注'),
        ('appointments', 'health_notes', '健康备注'),
        ('appointments', 'therapist_notes', '技师备注'),
        ('appointments', 'service_id', '服务ID'),
        ('appointments', 'service_type', '服务类型'),
        
        # users 表
        ('users', 'username', '用户名'),
        ('users', 'email', '邮箱'),
        ('users', 'phone', '电话'),
        
        # services 表
        ('services', 'price', '价格'),
        ('services', 'group_buy_price', '团购价'),
        ('services', 'service_areas', '服务区域'),
        ('services', 'service_process', '服务流程'),
    ]
    
    for table, field, description in fields_to_check:
        try:
            usage = check_field_usage(conn, table, field)
            print(f"## {table}.{field} ({description})")
            print(f"- 总记录数: {usage['total_records']}")
            print(f"- 非NULL记录数: {usage['not_null_records']}")
            print(f"- 使用率: {usage['usage_rate']}")
            if usage['sample_values']:
                print(f"- 样例值: {', '.join(str(v)[:50] for v in usage['sample_values'][:3])}")
            print()
        except Exception as e:
            print(f"## {table}.{field} - 检查失败: {e}\n")
    
    # 特殊检查：比较 experience_years 和 years_experience
    print("## 特殊分析：therapists 表的经验年限字段比较")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM therapists 
        WHERE experience_years IS NOT NULL 
        AND years_experience IS NOT NULL 
        AND experience_years != years_experience
    """)
    diff_count = cursor.fetchone()[0]
    print(f"- 两个字段值不同的记录数: {diff_count}")
    
    cursor.execute("""
        SELECT id, name, experience_years, years_experience 
        FROM therapists 
        WHERE years_experience IS NOT NULL
        LIMIT 5
    """)
    print("- years_experience 字段的使用样例:")
    for row in cursor.fetchall():
        print(f"  ID={row[0]}, {row[1]}: experience_years={row[2]}, years_experience={row[3]}")
    
    conn.close()

if __name__ == "__main__":
    main()