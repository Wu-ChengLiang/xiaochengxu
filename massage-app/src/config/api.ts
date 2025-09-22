export const API_CONFIG = {
  // 生产环境配置
  baseURL: process.env.TARO_APP_API || 'http://localhost:3001/api/v2',
  timeout: 10000,
  retry: 3
};

/**
 * 获取API基础URL
 * @returns 完整的API基础URL
 */
export const getApiBaseUrl = () => {
  return API_CONFIG.baseURL;
};