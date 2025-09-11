import type { User } from '@/types'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 'user-001',
    nickname: '张先生',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    phone: '138****1234',
    memberLevel: 1,
    points: 128,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'user-002', 
    nickname: '李女士',
    avatar: 'https://img.yzcdn.cn/vant/rabbit.jpeg',
    phone: '139****5678',
    memberLevel: 2,
    points: 268,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-11T00:00:00.000Z'
  },
  {
    id: 'user-003',
    nickname: '王先生', 
    avatar: 'https://img.yzcdn.cn/vant/dog.jpeg',
    phone: '186****9012',
    memberLevel: 0,
    points: 58,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-12T00:00:00.000Z'
  }
]

// 默认当前登录用户
export const currentUser = mockUsers[0]