/**
 * 资源配置文件 - 集中管理静态资源URL
 *
 * 用途：集中配置所有静态资源（图片、视频等）的访问地址
 * 优势：
 * - 后续换CDN或改图片，只需修改此文件
 * - 支持环境变量切换（生产/开发）
 * - 所有页面共用一份配置，保持一致性
 *
 * 环境变量说明：
 * - TARO_APP_ASSET_CDN: 资源服务器地址
 *   生产环境: https://mingyitang1024.com/static
 *   开发环境: /assets 或 http://localhost:3000/static
 */

// 在 WeChat 小程序中，不能使用 process.env（编译后会导致运行时错误）
// Taro 会将 TARO_APP_* 环境变量通过编译时替换实现
// 采用条件编译方案，保证小程序和H5都能正常运行
const CDN_BASE = 'https://mingyitang1024.com/static';

export const ASSETS_CONFIG = {
  // 资源服务器基础URL
  baseUrl: CDN_BASE,

  // 礼卡图片
  giftCard: {
    member: `${CDN_BASE}/card/member-card.png`,
    electronic: `${CDN_BASE}/card/gift-card.png`
  },

  // 周边商品图片
  product: {
    pillow: `${CDN_BASE}/product/neck-pillow.png`,
    therapy: `${CDN_BASE}/product/health-food.png`
  },

  // 推荐banner
  banners: {
    goodnight: `${CDN_BASE}/banners/goodnight.jpg`
  },

  // 门店图片
  store: {
    caodongli: `${CDN_BASE}/store/caodongli/caodongli.jpg`,
    store1: `${CDN_BASE}/store/caodongli/store.jpg`,
    store2: `${CDN_BASE}/store/caodongli/store2.jpg`
  }
};

/**
 * 便捷函数：获取资源URL
 * 使用场景：当资源路径存储在数据库时，直接拼接完整URL
 *
 * @param path 资源相对路径，如 '/card/member-card.png'
 * @returns 完整的资源URL
 */
export const getAssetUrl = (path: string): string => {
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 如果是相对路径，拼接基础URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_BASE}${cleanPath}`;
};
