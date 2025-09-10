// API 配置
const isDevelopment = process.env.NODE_ENV === 'development'

export const config = {
  // API 基础路径
  apiBaseUrl: isDevelopment 
    ? 'http://localhost:3000'  // 开发环境
    : 'https://your-api-domain.com',  // 生产环境
    
  // 是否使用 Mock 数据
  useMock: false, // 改为 false 使用真实 API
  
  // 请求超时时间
  timeout: 10000,
}