import type { Store } from '@/types'
import { mockImages } from './images'

export const mockStores: Store[] = [
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
    status: 'busy',
    services: ['service-001', 'service-002', 'service-003']
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
    services: ['service-001', 'service-002', 'service-003', 'service-004']
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
    status: 'full',
    services: ['service-001', 'service-002', 'service-003']
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
    services: ['service-001', 'service-002', 'service-003', 'service-004', 'service-005']
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
    services: ['service-001', 'service-002', 'service-003', 'service-004']
  }
]