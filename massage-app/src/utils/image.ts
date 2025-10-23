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
 * @param url 图片URL - 可能为 undefined/null
 * @returns HTTPS格式的URL，或 undefined 如果输入无效
 *
 * 🚀 改进：不对 undefined/null 返回默认值
 * 这样调用方可以区分"无值"和"有值"的情况
 */
export const normalizeImageUrl = (url: string | undefined | null): string | undefined => {
  // 🚀 改进：返回 undefined 而不是默认值
  // 这样后续逻辑可以通过 !url 来正确判断是否需要获取真实数据
  if (!url) {
    return undefined;
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
   * @returns HTTPS格式的URL，或 undefined 如果输入无效
   */
  static normalizeTherapistAvatar(avatarUrl: string | undefined): string | undefined {
    return normalizeImageUrl(avatarUrl);
  }

  /**
   * 处理门店图片
   * @param imageUrl API返回的门店图片URL
   * @returns HTTPS格式的URL，或 undefined 如果输入无效
   */
  static normalizeStoreImage(imageUrl: string | undefined): string | undefined {
    return normalizeImageUrl(imageUrl);
  }

  /**
   * 处理用户头像
   * @param avatarUrl API返回的用户头像
   * @returns HTTPS格式的URL，或 undefined 如果输入无效
   */
  static normalizeUserAvatar(avatarUrl: string | undefined): string | undefined {
    return normalizeImageUrl(avatarUrl);
  }
}
