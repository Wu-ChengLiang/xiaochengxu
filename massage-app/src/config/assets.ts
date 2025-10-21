/**
 * 资源配置文件 - 集中管理静态资源URL
 *
 * 用途：集中配置所有静态资源（图片、视频等）的访问地址
 * 优势：
 * - 后续换CDN或改图片，只需修改此文件
 * - 支持环境变量切换（生产/开发）
 * - 所有页面共用一份配置，保持一致性
 *
 * 说明：
 * - 礼卡、商品图片：由后端提供的静态CDN路径
 * - 推拿师头像：由API返回的avatar_url字段，自动转换为HTTPS
 * - 门店图片：由API返回的images字段，自动转换为HTTPS
 * - 用户头像：由API返回的avatar字段，自动转换为HTTPS
 */

import { normalizeImageUrl } from '@/utils/image'

// 在 WeChat 小程序中，不能使用 process.env（编译后会导致运行时错误）
// Taro 会将 TARO_APP_* 环境变量通过编译时替换实现
// 采用硬编码方案，保证小程序和H5都能正常运行
const CDN_BASE = 'https://mingyitang1024.com/static';

export const ASSETS_CONFIG = {
  // 资源服务器基础URL
  baseUrl: CDN_BASE,

  // 礼卡图片 - ✅ 已在服务器上验证存在 (200 OK)
  giftCard: {
    member: `${CDN_BASE}/card/member-card.png`,
    electronic: `${CDN_BASE}/card/gift-card.png`
  },

  // 周边商品图片 - ✅ 已在服务器上验证存在
  // 暖贴类 (nuantie) - 保暖贴
  product: {
    // 原有占位符，可继续使用或由后端API返回
    pillow: `${CDN_BASE}/gift/product/nuantie/huxi.jpg`,     // 护息贴（原neck-pillow）
    therapy: `${CDN_BASE}/gift/product/nuantie/xinai.jpg`,    // 新爱贴（原health-food）

    // 暖贴类其他产品
    nuantie: {
      huxi: `${CDN_BASE}/gift/product/nuantie/huxi.jpg`,
      xinai: `${CDN_BASE}/gift/product/nuantie/xinai.jpg`,
      yaofu: `${CDN_BASE}/gift/product/nuantie/yaofu.jpg`
    },

    // 艾酒类产品
    aijiu: {
      xinaibing: `${CDN_BASE}/gift/product/aijiu/xinaibing.jpg`,
      xinaizhu: `${CDN_BASE}/gift/product/aijiu/xinaizhu.jpg`,
      xinaitiao: `${CDN_BASE}/gift/product/aijiu/xinaitiao.jpg`
    }
  },

  // 推荐banner - ⚠️ 暂无
  // 由后端通过API返回或由页面处理
  banners: {
    goodnight: ''
  },

  // 推拿师头像 - ✅ 已在服务器上验证存在
  // 路径: /static/therapists/老师收集中文原版/{门店名}/{老师名}.jpg
  therapists: {
    baseUrl: `${CDN_BASE}/therapists/老师收集中文原版`
  },

  // 默认图片 - 用于缺失的图片URL
  default: `${CDN_BASE}/default.png`
};

/**
 * 便捷函数：获取资源URL
 * 使用场景：当资源路径存储在数据库时，直接拼接完整URL
 *
 * @param path 资源相对路径，如 '/card/member-card.png'
 * @returns 完整的资源URL
 */
export const getAssetUrl = (path: string | null | undefined): string => {
  // 如果路径为空，返回默认图片
  if (!path) {
    return ASSETS_CONFIG.default;
  }

  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 如果是相对路径，拼接基础URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_BASE}${cleanPath}`;
};
