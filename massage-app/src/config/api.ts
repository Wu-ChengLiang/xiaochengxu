export const API_CONFIG = {
  baseURL: process.env.TARO_APP_API || 'http://localhost:3001/api/v2',
  useMock: false  // 直接使用真实API，不再支持Mock模式
};