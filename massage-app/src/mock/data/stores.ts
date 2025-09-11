import type { Store } from '@/types'
import { mockImages } from './images'

// 上海各区域的大致经纬度范围参考：
// 黄浦区: 31.23°N, 121.49°E
// 徐汇区: 31.18°N, 121.44°E
// 长宁区: 31.22°N, 121.42°E
// 静安区: 31.23°N, 121.45°E
// 普陀区: 31.25°N, 121.40°E
// 虹口区: 31.26°N, 121.49°E
// 杨浦区: 31.27°N, 121.53°E
// 闵行区: 31.11°N, 121.38°E
// 宝山区: 31.40°N, 121.49°E
// 嘉定区: 31.38°N, 121.27°E
// 浦东新区: 31.22°N, 121.54°E
// 松江区: 31.03°N, 121.23°E
// 青浦区: 31.15°N, 121.12°E
// 奉贤区: 30.92°N, 121.47°E
// 崇明区: 31.62°N, 121.40°E

export const mockStores: Store[] = [
  // 真实门店数据
  {
    id: 'store-006',
    name: '名医堂•颈肩腰腿特色调理（长江西路店）',
    images: [
      mockImages.stores[0]
    ],
    address: '长江西路1939号',
    phone: '15000582630',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.2692,  // 需要确认正确坐标，当前使用估算值
      longitude: 121.3785
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-007',
    name: '名医堂•颈肩腰腿特色调理（豫园店）',
    images: [
      mockImages.stores[1]
    ],
    address: '豫园街道人民路885号淮海中华大厦2403室(近淮海东路)',
    phone: '17274881898',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.225531,
      longitude: 121.483349
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-008',
    name: '名医堂•颈肩腰腿特色调理（斜土路店）',
    images: [
      mockImages.stores[2]
    ],
    address: '小木桥路251号天亿大厦1504',
    phone: '18621728326',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.197641,
      longitude: 121.458331
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-009',
    name: '名医堂•颈肩腰腿特色调理（仙霞路店）',
    images: [
      mockImages.stores[3]
    ],
    address: '仙霞路739号2层',
    phone: '18221359745',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.207708,
      longitude: 121.379271
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-010',
    name: '名医堂•颈肩腰腿特色调理（武宁南路店）',
    images: [
      mockImages.stores[4]
    ],
    address: '武宁南路397号二楼',
    phone: '13127759662',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.225611,
      longitude: 121.43797
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-011',
    name: '名医堂•颈肩腰腿特色调理（世纪公园店）',
    images: [
      mockImages.stores[0]
    ],
    address: '梅花路1099号219-B室',
    phone: '13764743018',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.209967,
      longitude: 121.538265
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-012',
    name: '名医堂•颈肩腰腿特色调理（莘庄店）',
    images: [
      mockImages.stores[1]
    ],
    address: '莘建路170号',
    phone: '13370206298',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.105884,
      longitude: 121.376028
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-013',
    name: '名医堂•颈肩腰腿特色调理（浦三路店）',
    images: [
      mockImages.stores[2]
    ],
    address: '浦三路21弄银亿滨江中心C号楼5号铺',
    phone: '13032172858',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.197651,
      longitude: 121.511918
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-014',
    name: '名医堂•颈肩腰腿特色调理（浦东大道店）',
    images: [
      mockImages.stores[3]
    ],
    address: '浦东大道2394号一楼',
    phone: '15002159514',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.240308,
      longitude: 121.519302
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-015',
    name: '名医堂•颈肩腰腿特色调理（隆昌路店）',
    images: [
      mockImages.stores[4]
    ],
    address: '隆昌路586号3楼a1',
    phone: '15316502983',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.274948,
      longitude: 121.54365
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-016',
    name: '名医堂•颈肩腰腿特色调理（龙华路店）',
    images: [
      mockImages.stores[0]
    ],
    address: '龙华路3200号',
    phone: '18918003151',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.17101,
      longitude: 121.447123
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-017',
    name: '名医堂•颈肩腰腿特色调理（兰溪路店）',
    images: [
      mockImages.stores[1]
    ],
    address: '兰溪路900弄13号102（二楼）',
    phone: '13020216809',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.256603,
      longitude: 121.402713
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-018',
    name: '名医堂•颈肩腰腿特色调理（康桥店）',
    images: [
      mockImages.stores[2]
    ],
    address: '康桥镇秀沿路1066弄10号（上海浦东绿地假日酒店大门旁）',
    phone: '13681974389',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.134335,
      longitude: 121.581084
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-019',
    name: '名医堂•颈肩腰腿特色调理（巨峰路店）',
    images: [
      mockImages.stores[3]
    ],
    address: '巨峰路445号1层',
    phone: '18021073938',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.279771,
      longitude: 121.619936
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-020',
    name: '名医堂•颈肩腰腿特色调理（静安寺店）',
    images: [
      mockImages.stores[4]
    ],
    address: '愚园路172号环球世界大厦A座2701室',
    phone: '18116041595',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.224122,
      longitude: 121.444493
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-021',
    name: '名医堂•颈肩腰腿特色调理（汇融天地店）',
    images: [
      mockImages.stores[0]
    ],
    address: '曹杨路535号汇融大厦A座4楼414室',
    phone: '13761186114',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.236622,
      longitude: 121.417976
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-022',
    name: '名医堂•颈肩腰腿特色调理（国顺店）',
    images: [
      mockImages.stores[1]
    ],
    address: '国顺路143号',
    phone: '13120927019',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.292069,
      longitude: 121.51097
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-023',
    name: '名医堂•颈肩腰腿特色调理（关山路店）',
    images: [
      mockImages.stores[2]
    ],
    address: '关山路52号',
    phone: '15821510870',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.290734,
      longitude: 121.521979
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-024',
    name: '名医堂•颈肩腰腿特色调理（高岛屋店）',
    images: [
      mockImages.stores[3]
    ],
    address: '虹桥路1438号高岛屋百货5楼5-13号',
    phone: '13262525096',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.197338,
      longitude: 121.40311
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-025',
    name: '名医堂成吉中医·推拿正骨·针灸·艾灸',
    images: [
      mockImages.stores[4]
    ],
    address: '广元西路88号一层',
    phone: '13166307768',
    businessHours: {
      start: '09:00',
      end: '21:00'
    },
    location: {
      latitude: 31.196264,
      longitude: 121.434905
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-026',
    name: '名医堂•颈肩腰腿特色调理（丰庄店）',
    images: [
      mockImages.stores[0]
    ],
    address: '金沙江路2890弄29号1层',
    phone: '17317229881',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.242084,
      longitude: 121.358959
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-027',
    name: '名医堂•颈肩腰腿特色调理（东方路店）',
    images: [
      mockImages.stores[1]
    ],
    address: '东方路800号宝安大厦3楼梦佳速B区308室（电梯左侧）',
    phone: '13162351877',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.22643,
      longitude: 121.523977
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-028',
    name: '名医堂•颈肩腰腿特色调理（春申路店）',
    images: [
      mockImages.stores[2]
    ],
    address: '畹町路99弄274号（交通银行旁边的蚂蚁工坊门进来直走到底,菜鸟驿站斜对面）',
    phone: '17301645903',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.157768,
      longitude: 121.451643
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-029',
    name: '名医堂•颈肩腰腿特色调理（漕东里店）',
    images: [
      mockImages.stores[3]
    ],
    address: '漕东支路1号2楼F2003,泸溪河旁边电梯上来二楼名医堂（弄堂咪道,星巴克旁边二楼名医堂）',
    phone: '19921178410',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.197591,
      longitude: 121.458389
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-030',
    name: '名医堂•颈肩腰腿特色调理（爱琴海店）',
    images: [
      mockImages.stores[4]
    ],
    address: '吴中路1588号爱琴海商场外圈二层F252、253A（肯德基楼上,近华为手机旁扶手电梯,近喇叭花电梯）',
    phone: '18321595506',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.174863,
      longitude: 121.373308
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-031',
    name: '名医堂妙康中医·推拿正骨·针灸·艾灸',
    images: [
      mockImages.stores[0]
    ],
    address: '政立路223号一层',
    phone: '15821569689',
    businessHours: {
      start: '09:00',
      end: '21:00'
    },
    location: {
      latitude: 31.309322,
      longitude: 121.501192
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-032',
    name: '名医堂永康中医·推拿正骨·针灸·艾灸',
    images: [
      mockImages.stores[1]
    ],
    address: '小木桥路251号天亿大厦15楼（近斜土路）',
    phone: '18621728326',
    businessHours: {
      start: '09:00',
      end: '21:00'
    },
    location: {
      latitude: 31.197641,
      longitude: 121.458331
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-033',
    name: '名医堂•颈肩腰腿特色调理（五角场店）',
    images: [
      mockImages.stores[2]
    ],
    address: '国宾路18号11层1101-36室',
    phone: '18117269609',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.300107,
      longitude: 121.513744
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-034',
    name: '名医堂•颈肩腰腿特色调理（聚丰园路店）',
    images: [
      mockImages.stores[3]
    ],
    address: '上海市宝山区聚丰园路156号1层-2',
    phone: '17821862681',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.314744,
      longitude: 121.384749
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-035',
    name: '名医堂•颈肩腰腿特色调理（南方商城店）',
    images: [
      mockImages.stores[4]
    ],
    address: '沪闵路7388号3层G04-01F03-01-0026',
    phone: '15317313710',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.131273,
      longitude: 121.399816
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-036',
    name: '名医堂•颈肩腰腿特色调理（联合大厦店）',
    images: [
      mockImages.stores[0]
    ],
    address: '长寿路街道中山北路2668号2楼288室',
    phone: '13585827635',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.24614,
      longitude: 121.432306
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-037',
    name: '名医堂•颈肩腰腿特色调理（国定路店）',
    images: [
      mockImages.stores[1]
    ],
    address: '国定路142号-11',
    phone: '18101733813',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.294037,
      longitude: 121.514783
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-038',
    name: '名医堂•颈肩腰腿特色调理（周浦万达店）',
    images: [
      mockImages.stores[2]
    ],
    address: '沪南路3468弄1支弄25号',
    phone: '15821265720',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.114446,
      longitude: 121.566609
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  }
]