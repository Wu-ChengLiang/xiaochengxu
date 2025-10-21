import { ASSETS_CONFIG } from '@/config/assets'

/**
 * Mock图片数据 - 使用动态URL加载
 *
 * 说明：
 * - 门店图片使用ASSETS_CONFIG中的配置
 * - 推拿师头像应该从API返回的avatar字段获取
 * - Banner图片使用ASSETS_CONFIG中的配置
 *
 * 后续改进：
 * - 推拿师头像可迁移到API /therapists/:id 返回的avatar字段
 * - 门店图片可迁移到API /stores/:id 返回的images字段
 */

export const mockImages = {
  // 门店图片 - 从配置获取
  stores: [
    ASSETS_CONFIG.store.caodongli,
    ASSETS_CONFIG.store.caodongli,
    ASSETS_CONFIG.store.caodongli,
    ASSETS_CONFIG.store.caodongli,
    ASSETS_CONFIG.store.caodongli
  ],

  // 推拿师头像 - 占位URL（应该从API返回）
  therapists: {
    male: [
      `${ASSETS_CONFIG.baseUrl}/therapists/therapist-male-1.jpg`,
      `${ASSETS_CONFIG.baseUrl}/therapists/therapist-male-2.jpg`,
      `${ASSETS_CONFIG.baseUrl}/therapists/therapist-male-3.jpg`
    ],
    female: [
      `${ASSETS_CONFIG.baseUrl}/therapists/therapist-female-1.jpg`,
      `${ASSETS_CONFIG.baseUrl}/therapists/therapist-female-2.jpg`
    ]
  },

  // 优惠活动banner
  banners: [
    ASSETS_CONFIG.banners.goodnight
  ]
}

// 导出banner供页面使用
export const bannerGoodnight = ASSETS_CONFIG.banners.goodnight