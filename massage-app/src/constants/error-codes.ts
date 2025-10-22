/**
 * 错误码常量定义
 * 统一管理系统中所有的错误码，便于前后端交互和错误处理
 */

// 错误码分类：
// 1xxx - 客户端请求错误（参数错误、业务逻辑错误等）
// 2xxx - 身份认证和授权错误
// 3xxx - 服务器错误
// 4xxx - 第三方服务错误（支付、短信等）

export const ERROR_CODES = {
  // 成功
  SUCCESS: 0,

  // 1xxx - 客户端请求错误
  PARAM_ERROR: 1001,           // 参数错误
  INVALID_INPUT: 1002,         // 输入无效
  NOT_FOUND: 1003,             // 资源不存在
  DUPLICATE: 1004,             // 重复操作
  INVALID_STATE: 1005,         // 无效的状态转换
  OPERATION_FAILED: 1006,      // 操作失败
  INSUFFICIENT_BALANCE: 1007,  // 余额不足
  QUOTA_EXCEEDED: 1008,        // 配额超过
  INVALID_PHONE: 1009,         // 无效的手机号
  USER_NOT_FOUND: 1010,        // 用户不存在

  // 2xxx - 身份认证和授权错误
  UNAUTHORIZED: 2001,          // 未登录/无有效令牌
  FORBIDDEN: 2002,             // 无权限访问
  TOKEN_EXPIRED: 2003,         // 令牌已过期
  INVALID_TOKEN: 2004,         // 无效的令牌
  SESSION_EXPIRED: 2005,       // 会话已过期

  // 3xxx - 服务器错误
  INTERNAL_ERROR: 3001,        // 服务器内部错误
  SERVICE_UNAVAILABLE: 3002,   // 服务不可用
  DATABASE_ERROR: 3003,        // 数据库错误
  EXTERNAL_API_ERROR: 3004,    // 外部API错误

  // 4xxx - 第三方服务错误
  PAYMENT_ERROR: 4001,         // 支付失败
  PAYMENT_TIMEOUT: 4002,       // 支付超时
  SMS_ERROR: 4003,             // 短信发送失败
  WECHAT_ERROR: 4004,          // 微信接口错误
} as const;

/**
 * 错误码与用户友好提示的映射
 * 用于在API请求失败时向用户展示合适的提示信息
 */
export const ERROR_MESSAGE_MAP: Record<number, string> = {
  [ERROR_CODES.SUCCESS]: '操作成功',
  [ERROR_CODES.PARAM_ERROR]: '参数错误，请检查输入',
  [ERROR_CODES.INVALID_INPUT]: '输入格式不正确',
  [ERROR_CODES.NOT_FOUND]: '请求的资源不存在',
  [ERROR_CODES.DUPLICATE]: '操作重复，请勿重复提交',
  [ERROR_CODES.INVALID_STATE]: '当前状态不允许此操作',
  [ERROR_CODES.OPERATION_FAILED]: '操作失败，请重试',
  [ERROR_CODES.INSUFFICIENT_BALANCE]: '余额不足，请充值',
  [ERROR_CODES.QUOTA_EXCEEDED]: '超出配额限制',
  [ERROR_CODES.INVALID_PHONE]: '手机号格式不正确',
  [ERROR_CODES.USER_NOT_FOUND]: '用户不存在',
  [ERROR_CODES.UNAUTHORIZED]: '请先登录',
  [ERROR_CODES.FORBIDDEN]: '您无权执行此操作',
  [ERROR_CODES.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODES.INVALID_TOKEN]: '无效的登录状态',
  [ERROR_CODES.SESSION_EXPIRED]: '会话已过期，请重新登录',
  [ERROR_CODES.INTERNAL_ERROR]: '服务器错误，请稍后重试',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '服务维护中，请稍后重试',
  [ERROR_CODES.DATABASE_ERROR]: '数据库错误，请稍后重试',
  [ERROR_CODES.EXTERNAL_API_ERROR]: '第三方服务异常，请稍后重试',
  [ERROR_CODES.PAYMENT_ERROR]: '支付失败，请重试',
  [ERROR_CODES.PAYMENT_TIMEOUT]: '支付超时，请重新支付',
  [ERROR_CODES.SMS_ERROR]: '短信发送失败，请稍后重试',
  [ERROR_CODES.WECHAT_ERROR]: '微信接口异常，请稍后重试',
};

/**
 * 获取用户友好的错误提示
 * @param code 错误码
 * @param defaultMessage 默认提示信息
 * @returns 用户友好的错误提示
 */
export function getErrorMessage(code: number, defaultMessage?: string): string {
  return ERROR_MESSAGE_MAP[code] || defaultMessage || '操作失败，请稍后重试';
}

/**
 * 判断是否为认证相关错误
 */
export function isAuthError(code: number): boolean {
  return [
    ERROR_CODES.UNAUTHORIZED,
    ERROR_CODES.TOKEN_EXPIRED,
    ERROR_CODES.INVALID_TOKEN,
    ERROR_CODES.SESSION_EXPIRED,
  ].includes(code);
}

/**
 * 判断是否为服务器错误
 */
export function isServerError(code: number): boolean {
  return code >= 3000 && code < 4000;
}

/**
 * 判断是否为第三方服务错误
 */
export function isExternalError(code: number): boolean {
  return code >= 4000 && code < 5000;
}
