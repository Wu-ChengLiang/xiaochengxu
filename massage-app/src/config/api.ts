export const API_CONFIG = {
  baseURL: process.env.TARO_APP_API || 'http://emagen.323424.xyz/api/v2',
  useMock: false  // 直接使用真实API，不再支持Mock模式
};

export const getApiBaseUrl = () => {
  // 返回不带/api/v2的基础URL，用于特殊场景
  const baseURL = API_CONFIG.baseURL;
  if (baseURL.endsWith('/api/v2')) {
    return baseURL.slice(0, -7);
  }
  return baseURL;
};