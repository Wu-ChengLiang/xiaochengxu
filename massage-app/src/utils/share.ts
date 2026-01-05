/**
 * 小程序分享功能工具
 * 用于统一管理和配置各页面的分享信息
 */

export interface ShareConfig {
  title: string // 分享标题
  path: string // 分享路径（点击后跳转的页面）
  imageUrl?: string // 分享卡片的缩略图（可选）
}

export interface ShareTimelineConfig {
  title: string // 分享到朋友圈的标题
  imageUrl?: string // 分享到朋友圈的图片（可选）
}

/**
 * 预约页面分享配置
 */
export const getAppointmentShareConfig = (): ShareConfig => {
  return {
    title: '发现名医堂，预约专业按摩师',
    path: '/pages/appointment/index',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 技师详情页分享配置
 * @param therapistId 技师ID
 * @param therapistName 技师名称
 */
export const getTherapistShareConfig = (therapistId: string, therapistName: string): ShareConfig => {
  return {
    title: `这个技师超棒！推荐你预约 ${therapistName}`,
    path: `/pages/appointment/therapist/index?id=${therapistId}`,
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 礼品页面分享配置
 */
export const getGiftShareConfig = (): ShareConfig => {
  return {
    title: '名医堂礼卡 - 健康好礼送朋友',
    path: '/pages/gift/index',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 产品详情页分享配置
 * @param productId 产品ID
 * @param productName 产品名称
 * @param imageUrl 产品图片
 */
export const getProductDetailShareConfig = (
  productId: string,
  productName: string,
  imageUrl?: string
): ShareConfig => {
  return {
    title: `推荐你买这个：${productName}`,
    path: `/pages/gift/product-detail/index?id=${productId}`,
    imageUrl
  }
}

/**
 * 订单详情页分享配置
 * @param orderId 订单ID
 */
export const getOrderDetailShareConfig = (orderId: string): ShareConfig => {
  return {
    title: '我在名医堂预约了按摩，效果真的不错！',
    path: `/pages/order/detail/index?id=${orderId}`,
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 门店详情页分享配置
 * @param storeId 门店ID
 * @param storeName 门店名称
 */
export const getStoreDetailShareConfig = (storeId: string, storeName: string): ShareConfig => {
  return {
    title: `来名医堂${storeName}预约，专业技师等你`,
    path: `/pages/store/detail/index?id=${storeId}`,
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 通用分享配置（默认分享）
 */
export const getDefaultShareConfig = (): ShareConfig => {
  return {
    title: '疲劳酸痛，到名医堂',
    path: '/pages/appointment/index',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 朋友圈分享配置 - 预约页面
 */
export const getAppointmentShareTimelineConfig = (): ShareTimelineConfig => {
  return {
    title: '发现名医堂，预约专业按摩师',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 朋友圈分享配置 - 技师详情页
 * @param therapistName 技师名称
 */
export const getTherapistShareTimelineConfig = (therapistName: string): ShareTimelineConfig => {
  return {
    title: `这个技师超棒！推荐你预约 ${therapistName}`,
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 朋友圈分享配置 - 礼品页面
 */
export const getGiftShareTimelineConfig = (): ShareTimelineConfig => {
  return {
    title: '名医堂礼卡 - 健康好礼送朋友',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 朋友圈分享配置 - 产品详情页
 * @param productName 产品名称
 * @param imageUrl 产品图片
 */
export const getProductDetailShareTimelineConfig = (
  productName: string,
  imageUrl?: string
): ShareTimelineConfig => {
  return {
    title: `推荐你买这个：${productName}`,
    imageUrl
  }
}

/**
 * 朋友圈分享配置 - 订单详情页
 */
export const getOrderDetailShareTimelineConfig = (): ShareTimelineConfig => {
  return {
    title: '我在名医堂预约了按摩，效果真的不错！',
    imageUrl: require('@/assets/icons/logo.png')
  }
}

/**
 * 朋友圈分享配置 - 门店详情页
 * @param storeName 门店名称
 */
export const getStoreDetailShareTimelineConfig = (storeName: string): ShareTimelineConfig => {
  return {
    title: `来名医堂${storeName}预约，专业技师等你`,
    imageUrl: require('@/assets/icons/logo.png')
  }
}
