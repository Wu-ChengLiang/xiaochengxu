import Taro from '@tarojs/taro';
import { API_CONFIG } from '@/config/api';

export async function request(url: string, options: any = {}) {
  const { data } = await Taro.request({
    url: `${API_CONFIG.baseURL}${url}`,
    method: options.method || 'GET',
    data: options.data,
    timeout: 10000
  });
  
  return data;
}

// 模拟延迟（保持与Mock一致的体验）
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));