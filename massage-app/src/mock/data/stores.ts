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
  // 原有5个门店保留
  {
    id: 'store-001',
    name: '上海万象城店',
    images: [
      mockImages.stores[0]
    ],
    address: '闵行区吴中路1599号万象城L4-401',
    phone: '021-54881234',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.1809,
      longitude: 121.3831
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-002',
    name: '长宁来福士',
    images: [
      mockImages.stores[1]
    ],
    address: '长宁区长宁路1191号来福士广场B2-15',
    phone: '021-62881234',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.2211,
      longitude: 121.4249
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-003',
    name: '静安大悦城店',
    images: [
      mockImages.stores[2]
    ],
    address: '静安区西藏北路198号大悦城南座3F-12',
    phone: '021-63351234',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.2341,
      longitude: 121.4701
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-004',
    name: '浦东正大广场店',
    images: [
      mockImages.stores[3]
    ],
    address: '浦东新区陆家嘴西路168号正大广场5F',
    phone: '021-50471234',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.2384,
      longitude: 121.4987
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  {
    id: 'store-005',
    name: '徐汇日月光店',
    images: [
      mockImages.stores[4]
    ],
    address: '徐汇区漕宝路33号日月光中心B2-08',
    phone: '021-64381234',
    businessHours: {
      start: '10:00',
      end: '22:00'
    },
    location: {
      latitude: 31.1687,
      longitude: 121.4368
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  },
  
  // 新增34个真实门店数据
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
      latitude: 31.2692,  // 普陀区长江西路附近
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
      latitude: 31.2281,  // 黄浦区豫园附近
      longitude: 121.4923
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
      latitude: 31.1845,  // 徐汇区斜土路附近
      longitude: 121.4512
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
      latitude: 31.2135,  // 长宁区仙霞路附近
      longitude: 121.3892
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
      latitude: 31.2456,  // 普陀区武宁南路附近
      longitude: 121.4234
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
      latitude: 31.2134,  // 浦东新区世纪公园附近
      longitude: 121.5523
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
      latitude: 31.1123,  // 闵行区莘庄附近
      longitude: 121.3865
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
      latitude: 31.2085,  // 浦东新区浦三路附近
      longitude: 121.5012
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
      latitude: 31.2456,  // 浦东新区浦东大道附近
      longitude: 121.5234
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
      latitude: 31.2789,  // 杨浦区隆昌路附近
      longitude: 121.5478
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
      latitude: 31.1723,  // 徐汇区龙华路附近
      longitude: 121.4534
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
      latitude: 31.2567,  // 普陀区兰溪路附近
      longitude: 121.3967
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
      latitude: 31.1623,  // 浦东新区康桥附近
      longitude: 121.5678
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
      latitude: 31.2856,  // 浦东新区巨峰路附近
      longitude: 121.5912
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
      latitude: 31.2245,  // 静安区静安寺附近
      longitude: 121.4467
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
      latitude: 31.2389,  // 普陀区曹杨路附近
      longitude: 121.4178
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
      latitude: 31.2923,  // 杨浦区国顺路附近
      longitude: 121.5089
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
      latitude: 31.0234,  // 松江区关山路附近
      longitude: 121.2456
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
      latitude: 31.1923,  // 长宁区虹桥路附近
      longitude: 121.4156
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
      latitude: 31.2045,  // 徐汇区广元西路附近
      longitude: 121.4289
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
      latitude: 31.2389,  // 普陀区金沙江路附近
      longitude: 121.3567
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
      latitude: 31.2234,  // 浦东新区东方路附近
      longitude: 121.5223
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
      latitude: 31.0956,  // 闵行区春申路附近
      longitude: 121.3945
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
      latitude: 31.1723,  // 徐汇区漕东支路附近
      longitude: 121.4412
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
      latitude: 31.1789,  // 闵行区吴中路爱琴海附近
      longitude: 121.3834
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
      latitude: 31.3923,  // 宝山区政立路附近
      longitude: 121.4901
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
      latitude: 31.1845,  // 徐汇区小木桥路附近
      longitude: 121.4512
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
      latitude: 31.3012,  // 杨浦区五角场附近
      longitude: 121.5145
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
      latitude: 31.3756,  // 宝山区聚丰园路附近
      longitude: 121.4623
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
      latitude: 31.0245,  // 闵行区南方商城附近
      longitude: 121.3967
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
      latitude: 31.2467,  // 普陀区中山北路附近
      longitude: 121.4389
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
      latitude: 31.2867,  // 杨浦区国定路附近
      longitude: 121.5123
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
      latitude: 31.1167,  // 浦东新区周浦附近
      longitude: 121.5956
    },
    status: 'normal',
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005', 'service-006', 'service-007', 'service-008', 'service-009', 'service-010', 'service-011']
  }
]