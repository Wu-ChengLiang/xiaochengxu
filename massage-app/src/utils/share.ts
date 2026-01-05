/**
 * 小程序分享功能工具
 * 用于统一管理和配置各页面的分享信息
 */

export interface ShareConfig {
  title: string // 分享标题
  path: string // 分享路径（点击后跳转的页面）
  imageUrl?: string // 分享卡片的缩略图（可选）
}

/**
 * 预约页面分享配置
 */
export const getAppointmentShareConfig = (): ShareConfig => {
  return {
    title: '发现名医堂，预约专业按摩师',
    path: '/pages/appointment/index',
    imageUrl: '' // 可选：添加品牌宣传图
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
    path: `/pages/appointment/therapist/index?id=${therapistId}`
  }
}

/**
 * 礼品页面分享配置
 */
export const getGiftShareConfig = (): ShareConfig => {
  return {
    title: '名医堂礼卡 - 健康好礼送朋友',
    path: '/pages/gift/index'
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
    path: `/pages/order/detail/index?id=${orderId}`
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
    path: `/pages/store/detail/index?id=${storeId}`
  }
}

/**
 * 通用分享配置（默认分享）
 */
export const getDefaultShareConfig = (): ShareConfig => {
  return {
    title: '疲劳酸痛，到名医堂',
    path: '/pages/appointment/index'
  }
}
