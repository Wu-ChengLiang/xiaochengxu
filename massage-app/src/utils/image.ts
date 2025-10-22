/**
 * 图片URL处理工具
 *
 * 用途：
 * 1. 将HTTP URL转换为HTTPS（WeChat要求）
 * 2. 处理缺失或无效的图片URL
 * 3. 提供备用图片方案
 */

/**
 * 转换图片URL为HTTPS
 * @param url 图片URL
 * @returns HTTPS格式的URL
 */
export const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) {
    return getDefaultImage();
  }

  // 已经是HTTPS，直接返回
  if (url.startsWith('https://')) {
    return url;
  }

  // HTTP转HTTPS
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  // 相对路径，加上HTTPS前缀
  if (url.startsWith('/')) {
    return `https://mingyitang1024.com${url}`;
  }

  // 其他情况，当作相对路径处理
  return `https://mingyitang1024.com/static${url.startsWith('/') ? url : '/' + url}`;
};

/**
 * 获取默认图片
 */
export const getDefaultImage = (): string => {
  return 'https://mingyitang1024.com/static/default.png';
};

/**
 * 验证图片URL是否有效
 * 注：在小程序中，最好在服务层处理，而不是在渲染时
 */
export const isValidImageUrl = (url: string): boolean => {
  return !!(url && (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/')));
};

/**
 * 图片URL处理工具类
 * 适用于从API返回的动态图片URL
 */
export class ImageUrlHelper {
  /**
   * 处理推拿师头像
   * @param avatarUrl API返回的头像URL（可能是HTTP）
   * @returns HTTPS格式的URL
   */
  static normalizeTherapistAvatar(avatarUrl: string | undefined): string {
    return normalizeImageUrl(avatarUrl);
  }

  /**
   * 处理门店图片
   * @param imageUrl API返回的门店图片URL
   * @returns HTTPS格式的URL
   */
  static normalizeStoreImage(imageUrl: string | undefined): string {
    return normalizeImageUrl(imageUrl);
  }

  /**
   * 处理用户头像
   * @param avatarUrl API返回的用户头像
   * @returns HTTPS格式的URL
   */
  static normalizeUserAvatar(avatarUrl: string | undefined): string {
    return normalizeImageUrl(avatarUrl);
  }
}
