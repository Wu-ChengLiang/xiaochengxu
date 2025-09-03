import type { Store } from '@/types'

export const mockStores: Store[] = [
  {
    id: 'store-001',
    name: '上海万象城店',
    images: [
      'https://img12.360buyimg.com/imagetools/jfs/t1/196436/38/33977/207376/64b1f4d6F0b8f8a52/2e7394a14dc985c5.jpg'
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
    status: 'busy',
    services: ['service-001', 'service-002', 'service-003']
  },
  {
    id: 'store-002',
    name: '长宁来福士',
    images: [
      'https://img11.360buyimg.com/imagetools/jfs/t1/228270/14/11265/186451/64b1f577F7b0e8f15/7c1af0d7c2d1a4f1.jpg'
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
    services: ['service-001', 'service-002', 'service-003', 'service-004']
  },
  {
    id: 'store-003',
    name: '静安大悦城店',
    images: [
      'https://img14.360buyimg.com/imagetools/jfs/t1/209334/25/36644/162859/64b1f621F3a8b5e14/e5e5b4c1f4e8a2d1.jpg'
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
    status: 'full',
    services: ['service-001', 'service-002', 'service-003']
  },
  {
    id: 'store-004',
    name: '浦东正大广场店',
    images: [
      'https://img10.360buyimg.com/imagetools/jfs/t1/218641/4/35644/195268/64b1f6c4F1f9d2a3e/4c5e6a9f2b3d1e8f.jpg'
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
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005']
  },
  {
    id: 'store-005',
    name: '徐汇日月光店',
    images: [
      'https://img13.360buyimg.com/imagetools/jfs/t1/134781/7/36789/178945/64b1f766F8e5a2f4d/3b6c4d7e1f2a8c9e.jpg'
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
    services: ['service-001', 'service-002', 'service-003', 'service-004']
  }
]