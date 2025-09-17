export const API_CONFIG = {
  baseURL: process.env.TARO_APP_API || 'http://emagen.323424.xyz',
  useMock: false  // 直接使用真实API，不再支持Mock模式
};

export const getApiBaseUrl = () => {
  return API_CONFIG.baseURL;
};