export const API_CONFIG = {
  baseURL: process.env.TARO_APP_API || 'http://emagen.323424.xyz/api/v2',
  useMock: false  // 直接使用真实API，不再支持Mock模式
};

// 导出获取API基础URL的函数
export const getApiBaseUrl = () => {
  // 移除/api/v2后缀，因为各服务会自己添加
  const baseURL = API_CONFIG.baseURL;
  if (baseURL.endsWith('/api/v2')) {
    return baseURL.slice(0, -7);
  }
  return baseURL;
};