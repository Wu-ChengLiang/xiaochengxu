#!/usr/bin/env python3
"""
更新门店数据脚本
将最新的门店地址和电话信息更新到数据库中
"""
import sqlite3
from datetime import datetime

# 门店数据（从提供的数据整理）
stores_data = [
    ("长江西路店", "长江西路1939号", "15000582630"),
    ("豫园店", "豫园街道人民路885号淮海中华大厦2403室(近淮海东路)", "17274881898"),
    ("斜土路店", "小木桥路251号天亿大厦1504", "18621728326"),
    ("仙霞路店", "仙霞路739号2层", "18221359745"),
    ("武宁南路店", "武宁南路397号二楼", "13127759662"),
    ("世纪公园店", "梅花路1099号219-B室", "13764743018"),
    ("莘庄店", "莘建路170号", "13370206298"),
    ("浦三路店", "浦三路21弄银亿滨江中心C号楼5号铺", "13032172858"),
    ("浦东大道店", "浦东大道2394号一楼", "15002159514"),
    ("隆昌路店", "隆昌路586号3楼a1", "15316502983"),
    ("龙华路店", "龙华路3200号", "18918003151"),
    ("兰溪路店", "兰溪路900弄13号102（二楼）", "13020216809"),
    ("康桥店", "康桥镇秀沿路1066弄10号（上海浦东绿地假日酒店大门旁）", "13681974389"),
    ("巨峰路店", "巨峰路445号1层", "18021073938"),
    ("静安寺店", "愚园路172号环球世界大厦A座2701室", "18116041595"),
    ("汇融天地店", "曹杨路535号汇融大厦A座4楼414室", "13761186114"),
    ("国顺店", "国顺路143号", "13120927019"),
    ("关山路店", "关山路52号", "15821510870"),
    ("高岛屋店", "虹桥路1438号高岛屋百货5楼5-13号", "13262525096"),
    ("广元西路店", "广元西路88号一层", "13166307768"),  # 特殊名称：名医堂成吉中医·推拿正骨·针灸·艾灸
    ("丰庄店", "金沙江路2890弄29号1层", "17317229881"),
    ("东方路店", "东方路800号宝安大厦3楼梦佳速B区308室（电梯左侧）", "13162351877"),
    ("春申路店", "畹町路99弄274号（交通银行旁边的蚂蚁工坊门进来直走到底,菜鸟驿站斜对面）", "17301645903"),
    ("漕东里店", "漕东支路1号2楼F2003,泸溪河旁边电梯上来二楼名医堂（弄堂咪道,星巴克旁边二楼名医堂）", "19921178410"),
    ("爱琴海店", "吴中路1588号爱琴海商场外圈二层F252、253A（肯德基楼上,近华为手机旁扶手电梯,近喇叭花电梯）", "18321595506"),
    ("政立路店", "政立路223号一层", "15821569689"),  # 特殊名称：名医堂妙康中医·推拿正骨·针灸·艾灸
    ("小木桥路店", "小木桥路251号天亿大厦15楼（近斜土路）", "18621728326"),  # 特殊名称：名医堂永康中医·推拿正骨·针灸·艾灸
    ("五角场店", "国宾路18号11层1101-36室", "18117269609"),
    ("聚丰园路店", "上海市宝山区聚丰园路156号1层-2", "17821862681"),
    ("南方商城店", "沪闵路7388号3层G04-01F03-01-0026", "15317313710"),
    ("联合大厦店", "长寿路街道中山北路2668号2楼288室", "13585827635"),
    ("国定路店", "国定路142号-11", "18101733813"),
    ("周浦万达店", "沪南路3468弄1支弄25号", "15821265720"),
]

# 特殊名称的门店
special_stores = {
    "广元西路店": "名医堂成吉中医·推拿正骨·针灸·艾灸",
    "政立路店": "名医堂妙康中医·推拿正骨·针灸·艾灸",
    "小木桥路店": "名医堂永康中医·推拿正骨·针灸·艾灸"
}

def update_stores():
    """更新门店数据"""
    conn = sqlite3.connect('mingyi.db')
    cursor = conn.cursor()
    
    try:
        # 先查看现有的门店数据
        cursor.execute("SELECT id, name FROM stores WHERE id > 0 ORDER BY id")
        existing_stores = cursor.fetchall()
        print("现有门店数据：")
        for store_id, name in existing_stores:
            print(f"  {store_id}: {name}")
        
        print("\n开始更新门店数据...")
        
        # 更新地址和电话信息
        update_count = 0
        for short_name, address, phone in stores_data:
            # 构建匹配的名称
            if short_name in special_stores:
                name_pattern = f"%{special_stores[short_name]}%"
            else:
                # 处理括号中的店名
                store_suffix = short_name.replace("店", "")
                name_pattern = f"%（{store_suffix}店）%"
            
            # 更新数据
            cursor.execute("""
                UPDATE stores 
                SET address = ?, phone = ?, updated_at = ?
                WHERE name LIKE ? AND id > 0
            """, (f"上海市{address}", phone, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), name_pattern))
            
            if cursor.rowcount > 0:
                update_count += cursor.rowcount
                print(f"✓ 更新 {short_name}: {cursor.rowcount} 条记录")
            else:
                print(f"✗ 未找到匹配的门店: {short_name} (尝试匹配: {name_pattern})")
        
        # 提交更改
        conn.commit()
        print(f"\n更新完成！共更新 {update_count} 条记录")
        
        # 验证更新结果
        print("\n验证更新后的数据（前10条）：")
        cursor.execute("""
            SELECT id, name, address, phone 
            FROM stores 
            WHERE id > 0 
            ORDER BY id 
            LIMIT 10
        """)
        for row in cursor.fetchall():
            print(f"ID: {row[0]}")
            print(f"名称: {row[1]}")
            print(f"地址: {row[2]}")
            print(f"电话: {row[3]}")
            print("-" * 50)
    
    except sqlite3.Error as e:
        print(f"数据库错误: {e}")
        conn.rollback()
    finally:
        conn.close()


def create_update_sql():
    """生成SQL更新脚本"""
    print("\n生成SQL更新脚本：")
    print("-- 更新门店地址和电话信息")
    print("BEGIN TRANSACTION;")
    
    for short_name, address, phone in stores_data:
        if short_name in special_stores:
            name_pattern = special_stores[short_name]
        else:
            store_suffix = short_name.replace("店", "")
            name_pattern = f"%（{store_suffix}店）%"
        
        sql = f"""
UPDATE stores 
SET address = '上海市{address}', 
    phone = '{phone}', 
    updated_at = datetime('now')
WHERE name LIKE '{name_pattern}' AND id > 0;
"""
        print(sql)
    
    print("COMMIT;")


if __name__ == "__main__":
    # 更新数据库
    update_stores()
    
    # 生成SQL脚本供备用
    print("\n" + "=" * 80)
    create_update_sql()