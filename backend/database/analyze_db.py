#!/usr/bin/env python3
"""
分析 mingyi.db SQLite 数据库结构
"""
import sqlite3
import json
from typing import List, Dict, Tuple
from pathlib import Path


def get_table_names(conn: sqlite3.Connection) -> List[str]:
    """获取数据库中所有表名"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        AND name NOT LIKE 'sqlite_%'
        ORDER BY name
    """)
    return [row[0] for row in cursor.fetchall()]


def get_table_schema(conn: sqlite3.Connection, table_name: str) -> List[Dict]:
    """获取表的详细结构信息"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = []
    for row in cursor.fetchall():
        columns.append({
            'cid': row[0],
            'name': row[1],
            'type': row[2],
            'notnull': row[3],
            'default': row[4],
            'pk': row[5]
        })
    return columns


def get_table_indexes(conn: sqlite3.Connection, table_name: str) -> List[Dict]:
    """获取表的索引信息"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA index_list({table_name})")
    indexes = []
    for row in cursor.fetchall():
        index_name = row[1]
        cursor.execute(f"PRAGMA index_info({index_name})")
        columns = [col[2] for col in cursor.fetchall()]
        indexes.append({
            'name': index_name,
            'unique': bool(row[2]),
            'columns': columns
        })
    return indexes


def get_foreign_keys(conn: sqlite3.Connection, table_name: str) -> List[Dict]:
    """获取表的外键信息"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA foreign_key_list({table_name})")
    fks = []
    for row in cursor.fetchall():
        fks.append({
            'id': row[0],
            'seq': row[1],
            'table': row[2],
            'from': row[3],
            'to': row[4],
            'on_update': row[5],
            'on_delete': row[6],
            'match': row[7]
        })
    return fks


def get_row_count(conn: sqlite3.Connection, table_name: str) -> int:
    """获取表的行数"""
    cursor = conn.cursor()
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    return cursor.fetchone()[0]


def analyze_redundant_fields(schema: List[Dict], table_name: str) -> List[str]:
    """分析可能冗余的字段"""
    redundant_hints = []
    
    # 检查可能的冗余字段
    field_names = [col['name'].lower() for col in schema]
    
    # 1. 检查可能重复的时间戳字段
    time_fields = [f for f in field_names if any(t in f for t in ['time', 'date', 'created', 'updated', 'modified'])]
    if len(time_fields) > 2:
        redundant_hints.append(f"表 {table_name} 有多个时间相关字段: {', '.join(time_fields)}，可能存在冗余")
    
    # 2. 检查可能重复的状态字段
    status_fields = [f for f in field_names if any(s in f for s in ['status', 'state', 'flag', 'is_', 'has_'])]
    if len(status_fields) > 2:
        redundant_hints.append(f"表 {table_name} 有多个状态相关字段: {', '.join(status_fields)}，可能存在冗余")
    
    # 3. 检查未使用的备注字段
    remark_fields = [f for f in field_names if any(r in f for r in ['remark', 'note', 'comment', 'memo', 'description'])]
    if len(remark_fields) > 1:
        redundant_hints.append(f"表 {table_name} 有多个备注相关字段: {', '.join(remark_fields)}，可能存在冗余")
    
    # 4. 检查可能重复的ID字段
    id_fields = [f for f in field_names if 'id' in f and f != 'id']
    if len(id_fields) > 2:
        redundant_hints.append(f"表 {table_name} 有多个ID相关字段: {', '.join(id_fields)}，可能存在冗余")
    
    # 5. 检查总是为NULL的默认值字段
    null_default_fields = [col['name'] for col in schema if col['default'] is None and not col['notnull'] and not col['pk']]
    if len(null_default_fields) > 3:
        redundant_hints.append(f"表 {table_name} 有较多可空字段: {', '.join(null_default_fields[:5])}...，建议检查是否都在使用")
    
    return redundant_hints


def main():
    db_path = Path("/home/chengliang/workspace/xiaochengxu/backend/database/mingyi.db")
    
    if not db_path.exists():
        print(f"数据库文件不存在: {db_path}")
        return
    
    try:
        # 连接数据库
        conn = sqlite3.connect(db_path)
        print(f"成功连接到数据库: {db_path}")
        
        # 获取所有表名
        tables = get_table_names(conn)
        print(f"\n数据库中共有 {len(tables)} 个表")
        
        # 分析结果
        analysis_result = {
            'database': str(db_path),
            'table_count': len(tables),
            'tables': {}
        }
        
        # 所有冗余提示
        all_redundant_hints = []
        
        # 遍历每个表
        for table in tables:
            print(f"\n分析表: {table}")
            
            # 获取表结构
            schema = get_table_schema(conn, table)
            indexes = get_table_indexes(conn, table)
            foreign_keys = get_foreign_keys(conn, table)
            row_count = get_row_count(conn, table)
            
            # 分析冗余字段
            redundant_hints = analyze_redundant_fields(schema, table)
            all_redundant_hints.extend(redundant_hints)
            
            # 保存结果
            analysis_result['tables'][table] = {
                'row_count': row_count,
                'columns': schema,
                'indexes': indexes,
                'foreign_keys': foreign_keys,
                'redundant_hints': redundant_hints
            }
            
            print(f"  - 字段数: {len(schema)}")
            print(f"  - 记录数: {row_count}")
            print(f"  - 索引数: {len(indexes)}")
            print(f"  - 外键数: {len(foreign_keys)}")
        
        # 生成分析报告
        report_lines = [
            "# mingyi.db 数据库结构分析报告",
            f"\n数据库路径: `{db_path}`",
            f"\n## 概览",
            f"- 表总数: {len(tables)}",
            f"- 分析时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "\n## 表结构详情\n"
        ]
        
        for table_name, table_info in analysis_result['tables'].items():
            report_lines.append(f"### {table_name}")
            report_lines.append(f"- 记录数: {table_info['row_count']:,}")
            report_lines.append("\n#### 字段结构")
            report_lines.append("| 字段名 | 类型 | 非空 | 默认值 | 主键 | 说明 |")
            report_lines.append("|--------|------|------|--------|------|------|")
            
            for col in table_info['columns']:
                notnull = '是' if col['notnull'] else '否'
                pk = '是' if col['pk'] else '否'
                default = col['default'] if col['default'] is not None else 'NULL'
                report_lines.append(f"| {col['name']} | {col['type']} | {notnull} | {default} | {pk} | |")
            
            # 索引信息
            if table_info['indexes']:
                report_lines.append("\n#### 索引")
                for idx in table_info['indexes']:
                    unique = '唯一' if idx['unique'] else '普通'
                    report_lines.append(f"- {idx['name']} ({unique}): {', '.join(idx['columns'])}")
            
            # 外键信息
            if table_info['foreign_keys']:
                report_lines.append("\n#### 外键")
                for fk in table_info['foreign_keys']:
                    report_lines.append(f"- {fk['from']} -> {fk['table']}.{fk['to']}")
            
            # 冗余提示
            if table_info['redundant_hints']:
                report_lines.append("\n#### ⚠️ 可能的冗余字段")
                for hint in table_info['redundant_hints']:
                    report_lines.append(f"- {hint}")
            
            report_lines.append("")
        
        # 汇总冗余分析
        if all_redundant_hints:
            report_lines.append("\n## 冗余字段汇总")
            report_lines.append("以下是在各表中发现的可能冗余的字段，建议进一步检查：")
            for hint in all_redundant_hints:
                report_lines.append(f"- {hint}")
        
        # 保存报告
        report_path = db_path.parent / "database_analysis_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(report_lines))
        
        print(f"\n分析报告已保存到: {report_path}")
        
        # 保存JSON格式的详细数据
        json_path = db_path.parent / "database_structure.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_result, f, ensure_ascii=False, indent=2)
        
        print(f"详细结构数据已保存到: {json_path}")
        
    except sqlite3.Error as e:
        print(f"数据库错误: {e}")
    except Exception as e:
        print(f"发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'conn' in locals():
            conn.close()


if __name__ == "__main__":
    main()