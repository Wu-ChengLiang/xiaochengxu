export const API_CONFIG = {
  // 生产环境配置
  // 注：在 WeChat 小程序中不能使用 process.env，会导致运行时错误
  // 使用硬编码的默认值，结合 npm script 的 TARO_APP_API 环境变量完成编译时替换
  baseURL: 'http://mingyitang1024.com/api/v2',
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