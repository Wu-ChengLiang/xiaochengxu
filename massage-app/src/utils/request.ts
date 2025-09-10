import Taro from '@tarojs/taro'
import { config } from '@/config'
import type { ApiResponse } from '@/types'

// 请求方法类型
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 请求参数接口
interface RequestOptions {
  url: string
  method?: Method
  data?: any
  params?: Record<string, string | number>
  header?: Record<string, string>
}

// HTTP 请求类
class HttpClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = config.apiBaseUrl
    this.timeout = config.timeout
  }

  /**
   * 构建完整的 URL
   */
  private buildUrl(url: string, params?: Record<string, string | number>): string {
    let fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
      
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
    }
    
    return fullUrl
  }

  /**
   * 通用请求方法
   */
  private async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    const { url, method = 'GET', data, params, header = {} } = options
    
    try {
      const fullUrl = this.buildUrl(url, params)
      
      console.log(`🚀 ${method} ${fullUrl}`, data ? { data } : '')
      
      const response = await Taro.request({
        url: fullUrl,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header
        },
        timeout: this.timeout
      })

      console.log(`✅ ${method} ${fullUrl}`, response.data)

      // 检查 HTTP 状态码
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.data as ApiResponse<T>
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '请求失败'}`)
      }
    } catch (error: any) {
      console.error(`❌ ${method} ${url}`, error)
      
      // 网络错误或其他错误
      if (error.errMsg) {
        throw new Error(`网络请求失败: ${error.errMsg}`)
      }
      
      throw error
    }
  }

  /**
   * GET 请求
   */
  async get<T>(url: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'GET', params })
  }

  /**
   * POST 请求
   */
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'POST', data })
  }

  /**
   * PUT 请求
   */
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PUT', data })
  }

  /**
   * DELETE 请求
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'DELETE' })
  }
}

// 导出单例
export const http = new HttpClient()

// 导出类型
export type { ApiResponse }