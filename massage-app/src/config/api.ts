export const API_CONFIG = {
  baseURL: process.env.TARO_APP_API || 'http://localhost:3001/api/v2',
  useMock: process.env.TARO_APP_USE_MOCK === 'true'
};