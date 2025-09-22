import Taro from '@tarojs/taro';
import { API_CONFIG } from '@/config/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;
  loadingTitle?: string;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 统一请求封装
 * @param url - API路径
 * @param options - 请求选项
 * @returns Promise<ApiResponse>
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    data,
    header = {},
    showLoading = false,
    loadingTitle = '加载中...'
  } = options;

  // 显示加载提示
  if (showLoading) {
    Taro.showLoading({ title: loadingTitle, mask: true });
  }

  try {
    const response = await Taro.request({
      url: `${API_CONFIG.baseURL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout: API_CONFIG.timeout
    });

    // 隐藏加载提示
    if (showLoading) {
      Taro.hideLoading();
    }

    // 处理响应
    const result = response.data as ApiResponse<T>;

    // 业务错误处理
    if (result.code !== 0) {
      console.error(`API业务错误: ${url}`, result);
      throw new Error(result.message || '请求失败');
    }

    return result;
  } catch (error: any) {
    // 隐藏加载提示
    if (showLoading) {
      Taro.hideLoading();
    }

    // 网络错误处理
    console.error(`API网络错误: ${url}`, error);

    // 抛出错误供上层处理
    throw error;
  }
}

/**
 * GET请求
 */
export const get = <T = any>(url: string, params?: any, options?: RequestOptions) => {
  // 构建查询字符串
  const queryString = params ?
    '?' + Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&') : '';

  return request<T>(url + queryString, { ...options, method: 'GET' });
};

/**
 * POST请求
 */
export const post = <T = any>(url: string, data?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'POST', data });
};

/**
 * PUT请求
 */
export const put = <T = any>(url: string, data?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'PUT', data });
};

/**
 * DELETE请求
 */
export const del = <T = any>(url: string, data?: any, options?: RequestOptions) => {
  return request<T>(url, { ...options, method: 'DELETE', data });
};