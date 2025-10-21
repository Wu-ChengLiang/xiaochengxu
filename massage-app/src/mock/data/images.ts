import { ASSETS_CONFIG } from '@/config/assets'
import { normalizeImageUrl } from '@/utils/image'

/**
 * Mock图片数据 - 使用API返回的动态数据
 *
 * 重要说明：
 * - 推拿师头像：从API返回的avatar_url字段获取（自动转换HTTP→HTTPS）
 * - 门店图片：从API返回的images[]字段获取（自动转换HTTP→HTTPS）
 * - 礼卡/商品图片：从ASSETS_CONFIG获取（已是HTTPS）
 * - Banner图片：从ASSETS_CONFIG获取（已是HTTPS）
 *
 * 优势：
 * - 动态数据完全由API驱动，无需修改代码
 * - 自动处理HTTP→HTTPS转换（WeChat要求）
 * - 支持后端灵活配置
 */

export const mockImages = {
  // 注：实际使用时，这些应该从API返回的therapist对象中获取
  // 这里仅保留作为参考，页面应该使用 normalizeImageUrl(therapist.avatar)
  stores: [],

  therapists: {
    male: [],
    female: []
  },

  // 优惠活动banner - 已确认存在于服务器
  banners: [
    ASSETS_CONFIG.banners.goodnight
  ]
}

// 导出banner供页面使用
export const bannerGoodnight = ASSETS_CONFIG.banners.goodnight

// 导出URL规范化工具，供页面使用
export { normalizeImageUrl }