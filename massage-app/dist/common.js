"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("./taro.js");
const API_CONFIG = {
  // 生产环境配置
  // 注：在 WeChat 小程序中不能使用 process.env，会导致运行时错误
  // 使用硬编码的默认值，结合 npm script 的 TARO_APP_API 环境变量完成编译时替换
  baseURL: "https://mingyitang1024.com/api/v2",
  timeout: 1e4,
  retry: 3
};
const ERROR_CODES = {
  // 成功
  SUCCESS: 0,
  // 1xxx - 客户端请求错误
  PARAM_ERROR: 1001,
  // 参数错误
  INVALID_INPUT: 1002,
  // 输入无效
  NOT_FOUND: 1003,
  // 资源不存在
  DUPLICATE: 1004,
  // 重复操作
  INVALID_STATE: 1005,
  // 无效的状态转换
  OPERATION_FAILED: 1006,
  // 操作失败
  INSUFFICIENT_BALANCE: 1007,
  // 余额不足
  QUOTA_EXCEEDED: 1008,
  // 配额超过
  INVALID_PHONE: 1009,
  // 无效的手机号
  USER_NOT_FOUND: 1010,
  // 用户不存在
  // 2xxx - 身份认证和授权错误
  UNAUTHORIZED: 2001,
  // 未登录/无有效令牌
  FORBIDDEN: 2002,
  // 无权限访问
  TOKEN_EXPIRED: 2003,
  // 令牌已过期
  INVALID_TOKEN: 2004,
  // 无效的令牌
  SESSION_EXPIRED: 2005,
  // 会话已过期
  // 3xxx - 服务器错误
  INTERNAL_ERROR: 3001,
  // 服务器内部错误
  SERVICE_UNAVAILABLE: 3002,
  // 服务不可用
  DATABASE_ERROR: 3003,
  // 数据库错误
  EXTERNAL_API_ERROR: 3004,
  // 外部API错误
  // 4xxx - 第三方服务错误
  PAYMENT_ERROR: 4001,
  // 支付失败
  PAYMENT_TIMEOUT: 4002,
  // 支付超时
  SMS_ERROR: 4003,
  // 短信发送失败
  WECHAT_ERROR: 4004
  // 微信接口错误
};
const ERROR_MESSAGE_MAP = {
  [ERROR_CODES.SUCCESS]: "操作成功",
  [ERROR_CODES.PARAM_ERROR]: "参数错误，请检查输入",
  [ERROR_CODES.INVALID_INPUT]: "输入格式不正确",
  [ERROR_CODES.NOT_FOUND]: "请求的资源不存在",
  [ERROR_CODES.DUPLICATE]: "操作重复，请勿重复提交",
  [ERROR_CODES.INVALID_STATE]: "当前状态不允许此操作",
  [ERROR_CODES.OPERATION_FAILED]: "操作失败，请重试",
  [ERROR_CODES.INSUFFICIENT_BALANCE]: "余额不足，请充值",
  [ERROR_CODES.QUOTA_EXCEEDED]: "超出配额限制",
  [ERROR_CODES.INVALID_PHONE]: "手机号格式不正确",
  [ERROR_CODES.USER_NOT_FOUND]: "用户不存在",
  [ERROR_CODES.UNAUTHORIZED]: "请先登录",
  [ERROR_CODES.FORBIDDEN]: "您无权执行此操作",
  [ERROR_CODES.TOKEN_EXPIRED]: "登录已过期，请重新登录",
  [ERROR_CODES.INVALID_TOKEN]: "无效的登录状态",
  [ERROR_CODES.SESSION_EXPIRED]: "会话已过期，请重新登录",
  [ERROR_CODES.INTERNAL_ERROR]: "服务器错误，请稍后重试",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "服务维护中，请稍后重试",
  [ERROR_CODES.DATABASE_ERROR]: "数据库错误，请稍后重试",
  [ERROR_CODES.EXTERNAL_API_ERROR]: "第三方服务异常，请稍后重试",
  [ERROR_CODES.PAYMENT_ERROR]: "支付失败，请重试",
  [ERROR_CODES.PAYMENT_TIMEOUT]: "支付超时，请重新支付",
  [ERROR_CODES.SMS_ERROR]: "短信发送失败，请稍后重试",
  [ERROR_CODES.WECHAT_ERROR]: "微信接口异常，请稍后重试"
};
function getErrorMessage(code, defaultMessage) {
  return ERROR_MESSAGE_MAP[code] || defaultMessage || "操作失败，请稍后重试";
}
function isAuthError(code) {
  return [ERROR_CODES.UNAUTHORIZED, ERROR_CODES.TOKEN_EXPIRED, ERROR_CODES.INVALID_TOKEN, ERROR_CODES.SESSION_EXPIRED].includes(code);
}
function request(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const {
      method = "GET",
      data,
      header = {},
      showLoading = false,
      loadingTitle = "加载中..."
    } = options;
    if (showLoading) {
      taro.Taro.showLoading({
        title: loadingTitle,
        mask: true
      });
    }
    try {
      const response = yield taro.Taro.request({
        url: `${API_CONFIG.baseURL}${url}`,
        method,
        data,
        header: __spreadValues({
          "Content-Type": "application/json"
        }, header),
        timeout: API_CONFIG.timeout
      });
      if (showLoading) {
        taro.Taro.hideLoading();
      }
      const result = response.data;
      if (result.code !== ERROR_CODES.SUCCESS) {
        console.error(`API业务错误: ${url}`, {
          code: result.code,
          message: result.message,
          data: result
        });
        if (isAuthError(result.code)) {
          console.warn("认证过期，跳转到登录页");
          taro.Taro.removeStorageSync("userInfo");
          taro.Taro.removeStorageSync("userToken");
        }
        const errorMessage = getErrorMessage(result.code, result.message);
        const error = new Error(errorMessage);
        error.code = result.code;
        error.response = {
          status: response.statusCode,
          data: result
        };
        throw error;
      }
      return result;
    } catch (error) {
      if (showLoading) {
        taro.Taro.hideLoading();
      }
      console.error(`API网络错误: ${url}`, error);
      throw error;
    }
  });
}
const get = (url, params, options) => {
  const queryString = params ? "?" + Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null).map((key) => `${key}=${encodeURIComponent(params[key])}`).join("&") : "";
  return request(url + queryString, __spreadProps(__spreadValues({}, options), {
    method: "GET"
  }));
};
const post = (url, data, options) => {
  return request(url, __spreadProps(__spreadValues({}, options), {
    method: "POST",
    data
  }));
};
const CDN_BASE = "https://mingyitang1024.com/static";
const ASSETS_CONFIG = {
  // 资源服务器基础URL
  baseUrl: CDN_BASE,
  // 礼卡图片 - ✅ 已在服务器上验证存在 (200 OK)
  giftCard: {
    member: `${CDN_BASE}/card/member-card.png`,
    electronic: `${CDN_BASE}/card/gift-card.png`
  },
  // 周边商品图片 - 已删除（暖贴和艾条页面已下线）
  product: {},
  // 推荐banner - ⚠️ 暂无
  // 由后端通过API返回或由页面处理
  banners: {
    goodnight: ""
  },
  // 推拿师头像 - ✅ 已在服务器上验证存在
  // 路径: /static/therapists/老师收集中文原版/{门店名}/{老师名}.jpg
  therapists: {
    baseUrl: `${CDN_BASE}/therapists/老师收集中文原版`
  },
  // 默认图片 - 用于缺失的图片URL
  default: `${CDN_BASE}/default.png`
};
const getCurrentUserInfo = () => {
  try {
    const userInfo = taro.Taro.getStorageSync("userInfo");
    return userInfo || null;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};
const getCurrentUserId = () => {
  const userInfo = getCurrentUserInfo();
  return (userInfo == null ? void 0 : userInfo.id) || 1;
};
const getCurrentUserPhone = () => {
  const userInfo = getCurrentUserInfo();
  return (userInfo == null ? void 0 : userInfo.phone) || "13800138000";
};
const setUserInfo = (userInfo) => {
  try {
    taro.Taro.setStorageSync("userInfo", userInfo);
  } catch (error) {
    console.error("设置用户信息失败:", error);
  }
};
const maskPhone = (phone) => {
  if (!phone)
    return "未设置";
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};
const wechatLogin = () => __async(exports, null, function* () {
  try {
    const {
      code
    } = yield taro.Taro.login();
    const response = yield post("/users/wechat-login", {
      code
    });
    if (response.data) {
      if (response.data.userInfo && !response.data.needBindPhone) {
        setUserInfo(response.data.userInfo);
      }
      return response.data;
    }
    throw new Error("微信登录失败：返回数据异常");
  } catch (error) {
    console.error("微信登录失败:", error);
    throw error;
  }
});
const fetchUserInfo = (phone) => __async(exports, null, function* () {
  try {
    if (!phone) {
      const localUserInfo = getCurrentUserInfo();
      phone = localUserInfo == null ? void 0 : localUserInfo.phone;
    }
    if (!phone) {
      console.warn("无法获取用户信息：缺少手机号");
      return null;
    }
    const response = yield get(`/users/info?phone=${phone}`);
    if (response.data) {
      const userInfo = {
        id: response.data.id,
        phone: response.data.phone,
        username: response.data.username,
        nickname: response.data.nickname,
        avatar: response.data.avatar,
        openid: response.data.openid,
        membershipNumber: response.data.membershipNumber,
        memberLevel: response.data.memberLevel,
        balance: response.data.balance,
        totalSpent: response.data.totalSpent,
        totalVisits: response.data.totalVisits,
        discountRate: response.data.discount_rate || response.data.discountRate
      };
      setUserInfo(userInfo);
      return userInfo;
    }
    return null;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
});
const checkAndAutoLogin = () => __async(exports, null, function* () {
  try {
    const localUserInfo = getCurrentUserInfo();
    if (localUserInfo && localUserInfo.phone) {
      const freshUserInfo = yield fetchUserInfo(localUserInfo.phone);
      return freshUserInfo || localUserInfo;
    }
    const loginResult = yield wechatLogin();
    if (!loginResult.needBindPhone && loginResult.userInfo) {
      return loginResult.userInfo;
    }
    return null;
  } catch (error) {
    console.error("自动登录失败:", error);
    return null;
  }
});
const GIFT_CARDS = [{
  id: "member-card",
  type: "member",
  name: "会员礼卡",
  image: ASSETS_CONFIG.giftCard.member,
  description: "尊享会员专属优惠",
  features: ["全门店通用", "长期有效", "可累计积分", "享受会员价"],
  terms: "本卡为不记名卡片，请妥善保管"
}, {
  id: "electronic-card",
  type: "electronic",
  name: "电子礼卡",
  image: ASSETS_CONFIG.giftCard.electronic,
  description: "便捷的电子礼品卡",
  features: ["即买即用", "可转赠好友", "线上购买", "扫码使用"],
  terms: "电子卡有效期为购买之日起一年内"
}];
const NUANTIE_PRODUCTS = [{
  id: "nuantie-waist",
  name: "蕲艾腰腹暖贴",
  image: "https://mingyitang1024.com/static/gift/product/nuantie/yaofu.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "贴",
  description: "自发热艾草暖护腰贴",
  features: [],
  specifications: {}
}, {
  id: "nuantie-knee",
  name: "蕲艾护膝暖贴",
  image: "https://mingyitang1024.com/static/gift/product/nuantie/huxi.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "贴",
  description: "自发热艾草护膝 驱寒保暖",
  features: [],
  specifications: {}
}, {
  id: "nuantie-moxa",
  name: "蕲艾灸贴",
  image: "https://mingyitang1024.com/static/gift/product/nuantie/xinai.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "贴",
  description: "自发热艾草精油穴位灸贴",
  features: [],
  specifications: {}
}];
const AIJIU_PRODUCTS = [{
  id: "aijiu-stick",
  name: "蕲艾条",
  image: "https://mingyitang1024.com/static/gift/product/aijiu/xinaitiao.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "条",
  description: "艾灸艾条 3年陈艾",
  features: [],
  specifications: {}
}, {
  id: "aijiu-moxa-ball",
  name: "蕲艾饼",
  image: "https://mingyitang1024.com/static/gift/product/aijiu/xinaibing.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "饼",
  description: "道地蕲艾泡脚泡澡艾草饼",
  features: [],
  specifications: {}
}, {
  id: "aijiu-column",
  name: "新艾柱",
  image: "https://mingyitang1024.com/static/gift/product/aijiu/xinaizhu.jpg",
  price: 9900,
  // ¥99
  originalPrice: 9900,
  unit: "柱",
  description: "李时珍故里特产新艾柱",
  features: [],
  specifications: {}
}];
const PRODUCTS = [...NUANTIE_PRODUCTS, ...AIJIU_PRODUCTS];
class GiftService {
  /**
   * 获取所有礼卡
   */
  static getAllGiftCards() {
    return GIFT_CARDS;
  }
  /**
   * 根据ID获取礼卡详情
   */
  static getGiftCardById(id) {
    return GIFT_CARDS.find((card) => card.id === id);
  }
  /**
   * 获取所有商品
   */
  static getAllProducts() {
    return PRODUCTS;
  }
  /**
   * 根据ID获取商品详情
   */
  static getProductById(id) {
    return PRODUCTS.find((product) => product.id === id);
  }
  /**
   * 获取暖贴产品列表
   */
  static getNuantieProducts() {
    return NUANTIE_PRODUCTS;
  }
  /**
   * 获取艾条产品列表
   */
  static getAijiuProducts() {
    return AIJIU_PRODUCTS;
  }
  /**
   * 创建礼卡购买订单
   * @param params.cardId 礼卡ID
   * @param params.amount 礼卡面值（分为单位）
   */
  static createGiftCardOrder(params) {
    return __async(this, null, function* () {
      try {
        const userId = getCurrentUserId();
        const orderData = {
          orderType: "product",
          userId,
          title: `电子礼卡 ¥${(params.amount / 100).toFixed(2)}`,
          amount: params.amount * params.quantity,
          // ✅ 直接相乘，结果是分
          paymentMethod: params.paymentMethod,
          extraData: {
            productType: "gift_card",
            productId: params.cardId,
            // ✅ 按API文档使用 productId
            productName: "电子礼卡",
            // ✅ 新增：商品名称（API文档必需）
            quantity: params.quantity,
            cardType: "electronic",
            faceValue: params.amount,
            // ✅ 保持分为单位
            customMessage: params.customMessage || "世界上最好的爸爸"
          }
        };
        console.log("🎁 创建礼卡订单");
        console.log("👤 当前用户ID:", userId);
        console.log("📦 订单数据:", {
          orderType: orderData.orderType,
          userId: orderData.userId,
          title: orderData.title,
          amount: `${orderData.amount}分 (¥${(orderData.amount / 100).toFixed(2)})`,
          paymentMethod: orderData.paymentMethod,
          extraData: orderData.extraData
        });
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        console.log("✅ 礼卡订单创建成功");
        console.log("📋 订单响应:", {
          orderNo: response.data.orderNo,
          amount: `${response.data.amount}分 (¥${(response.data.amount / 100).toFixed(2)})`,
          paymentStatus: response.data.paymentStatus,
          hasWxPayParams: !!response.data.wxPayParams
        });
        return response.data;
      } catch (error) {
        console.error("❌ 创建礼卡订单失败:", error);
        throw new Error(error.message || "创建礼卡订单失败");
      }
    });
  }
  /**
   * 创建商品购买订单
   */
  static createProductOrder(params) {
    return __async(this, null, function* () {
      try {
        const product = this.getProductById(params.productId);
        if (!product) {
          throw new Error("商品不存在");
        }
        const orderData = {
          orderType: "product",
          userId: getCurrentUserId(),
          title: product.name,
          amount: product.price * params.quantity,
          // ✅ 直接相乘，结果是分（product.price已是分为单位）
          paymentMethod: params.paymentMethod,
          extraData: {
            productType: "merchandise",
            productId: params.productId,
            productName: product.name,
            // ✅ 新增：商品名称（API文档必需）
            quantity: params.quantity,
            specifications: product.specifications
          }
        };
        console.log("📦 创建商品订单");
        console.log("👤 当前用户ID:", getCurrentUserId());
        console.log("📋 订单数据:", {
          orderType: orderData.orderType,
          userId: orderData.userId,
          title: orderData.title,
          amount: `${orderData.amount}分 (¥${(orderData.amount / 100).toFixed(2)})`,
          paymentMethod: orderData.paymentMethod,
          extraData: orderData.extraData
        });
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        console.log("✅ 商品订单创建成功");
        console.log("📋 订单响应:", {
          orderNo: response.data.orderNo,
          amount: `${response.data.amount}分 (¥${(response.data.amount / 100).toFixed(2)})`,
          paymentStatus: response.data.paymentStatus,
          hasWxPayParams: !!response.data.wxPayParams
        });
        return response.data;
      } catch (error) {
        console.error("❌ 创建商品订单失败:", error);
        throw new Error(error.message || "创建商品订单失败");
      }
    });
  }
}
const normalizeImageUrl = (url) => {
  if (!url) {
    return void 0;
  }
  if (url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  if (url.startsWith("/")) {
    return `https://mingyitang1024.com${url}`;
  }
  return `https://mingyitang1024.com/static${url.startsWith("/") ? url : "/" + url}`;
};
class StoreService {
  // 获取附近门店
  getNearbyStores(latitude, longitude, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      try {
        const data = yield request("/stores/nearby", {
          data: {
            latitude,
            longitude,
            page,
            pageSize
          }
        });
        console.log("✅ 门店列表API调用成功:", data);
        const normalizedStores = data.data.list.map((store) => {
          var _a;
          return __spreadProps(__spreadValues({}, store), {
            image: normalizeImageUrl(store.image),
            images: (_a = store.images) == null ? void 0 : _a.map((img) => normalizeImageUrl(img))
          });
        });
        return __spreadProps(__spreadValues({}, data.data), {
          list: normalizedStores
        });
      } catch (error) {
        console.error("❌ 门店列表API调用失败:", error);
        throw error;
      }
    });
  }
  // 获取门店详情
  getStoreDetail(storeId) {
    return __async(this, null, function* () {
      var _a;
      try {
        const data = yield request(`/stores/${storeId}`);
        console.log("✅ 门店详情API调用成功:", data);
        if (data == null ? void 0 : data.data) {
          return __spreadProps(__spreadValues({}, data), {
            data: __spreadProps(__spreadValues({}, data.data), {
              image: normalizeImageUrl(data.data.image),
              images: (_a = data.data.images) == null ? void 0 : _a.map((img) => normalizeImageUrl(img))
            })
          });
        }
        return data;
      } catch (error) {
        console.log("⚠️ 门店详情API调用失败:", error);
        return null;
      }
    });
  }
  // 搜索门店
  searchStores(keyword, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      try {
        const data = yield request("/stores/search", {
          data: {
            keyword,
            page,
            pageSize
          }
        });
        console.log("✅ 门店搜索API调用成功:", data);
        return data.data || {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      } catch (error) {
        console.log("⚠️ 门店搜索API调用失败:", error);
        return {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      }
    });
  }
  // 根据状态筛选门店
  getStoresByStatus(status, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      try {
        const data = yield request("/stores/filter", {
          data: {
            status,
            page,
            pageSize
          }
        });
        console.log("✅ 门店筛选API调用成功:", data);
        return data.data || {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      } catch (error) {
        console.log("⚠️ 门店筛选API调用失败:", error);
        return {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      }
    });
  }
}
const storeService = new StoreService();
class LocationService {
  // 获取用户当前位置
  getCurrentLocation() {
    return __async(this, null, function* () {
      try {
        const settingRes = yield taro.Taro.getSetting();
        const authSetting = (settingRes == null ? void 0 : settingRes.authSetting) || {};
        if (!authSetting["scope.userLocation"]) {
          yield taro.Taro.authorize({
            scope: "scope.userLocation"
          });
        }
        let res;
        try {
          res = yield taro.Taro.getLocation({
            type: "gcj02",
            // 国内火星坐标系
            isHighAccuracy: true
          });
        } catch (gcj02Error) {
          console.warn("gcj02坐标系不支持，尝试wgs84:", gcj02Error);
          res = yield taro.Taro.getLocation({
            type: "wgs84"
            // GPS原始坐标系
          });
        }
        return {
          latitude: res.latitude,
          longitude: res.longitude
        };
      } catch (error) {
        console.error("获取位置失败:", error);
        const errorMsg = (error == null ? void 0 : error.errMsg) || "";
        if (errorMsg.includes("auth deny") || errorMsg.includes("authorize:fail")) {
          taro.Taro.showModal({
            title: "提示",
            content: "需要获取您的位置信息来推荐附近门店",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                taro.Taro.openSetting();
              }
            }
          });
        }
        console.log("使用默认位置：上海市中心");
        return {
          latitude: 31.2304,
          longitude: 121.4737
        };
      }
    });
  }
  // 计算两点之间的距离（单位：公里）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const rad = Math.PI / 180;
    const R = 6371;
    const dLat = (lat2 - lat1) * rad;
    const dLng = (lng2 - lng1) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }
  // 格式化距离显示
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1e3)}m`;
    }
    return `${distance}km`;
  }
}
const getLocationService = new LocationService();
const index$1 = "";
const ShoppingCart = ({
  items,
  therapist,
  onCheckout,
  onMaskClick,
  onRemoveItem
}) => {
  const [isExpanded, setIsExpanded] = taro.useState(false);
  const [countdown, setCountdown] = taro.useState(180);
  const timerRef = taro.useRef(null);
  const totalOriginalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const totalDiscountPrice = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  const totalSavings = totalOriginalPrice - totalDiscountPrice;
  const hasItems = items.length > 0;
  taro.useEffect(() => {
    if (hasItems && isExpanded) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            taro.Taro.showToast({
              title: "支付超时了呦，快快重新下单吧~",
              icon: "none"
            });
            setIsExpanded(false);
            return 180;
          }
          return prev - 1;
        });
      }, 1e3);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasItems, isExpanded]);
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = /* @__PURE__ */ new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) {
      return "今天";
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };
  const handleCheckoutClick = () => {
    if (!hasItems) {
      taro.Taro.showToast({
        title: "请先选择服务",
        icon: "none"
      });
      return;
    }
    setIsExpanded(true);
  };
  const handleMaskClick = () => {
    if (onMaskClick) {
      onMaskClick();
    }
    setIsExpanded(false);
  };
  const handleConfirmCheckout = () => {
    onCheckout();
  };
  return /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
    isExpanded && /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-mask", onClick: handleMaskClick }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "shopping-cart", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-bar", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-info", children: hasItems ? /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥",
          totalDiscountPrice
        ] }),
        totalSavings > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "savings", children: [
          "已优惠¥",
          totalSavings
        ] })
      ] }) : /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-text", children: "请选择服务项目" }) }),
      /* @__PURE__ */ taro.jsx(
        taro.View,
        {
          className: `checkout-btn ${!hasItems ? "disabled" : ""}`,
          onClick: handleCheckoutClick,
          children: "去结算"
        }
      )
    ] }) }),
    isExpanded && /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-expanded", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "expanded-header", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "title", children: "预约详情" }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "service-list", children: items.map(
        (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-item", children: [
          /* @__PURE__ */ taro.jsx(
            taro.Image,
            {
              className: "therapist-avatar",
              src: item.therapistAvatar || (therapist == null ? void 0 : therapist.avatar) || ""
            }
          ),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-info", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: item.therapistName }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "duration", children: [
                item.duration,
                "分钟"
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-detail", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: item.serviceName }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-time", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "time-text", children: [
              formatDate(item.date),
              " ",
              item.time,
              " 至 ",
              // 计算结束时间
              (() => {
                const [hour, minute] = item.time.split(":").map(Number);
                const endMinute = minute + item.duration;
                const endHour = hour + Math.floor(endMinute / 60);
                const finalMinute = endMinute % 60;
                return `${endHour}:${finalMinute.toString().padStart(2, "0")}`;
              })()
            ] }) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "item-actions", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "price-info", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
              "¥",
              item.discountPrice || item.price
            ] }) }),
            onRemoveItem && /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: "remove-btn",
                onClick: () => onRemoveItem(index2),
                children: "✕"
              }
            )
          ] })
        ] }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "可选增值项目" }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-list", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-item", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-name", children: "刮痧20分钟" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-price", children: "¥ 99" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "addon-action", children: "+" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-item", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-name", children: "加钟20分钟" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-price", children: "¥ 99" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "addon-action", children: "+" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "checkout-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-summary", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-icon", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "🛒" }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "badge", children: "1" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-detail", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "final-price", children: [
              "¥ ",
              totalDiscountPrice
            ] }),
            totalOriginalPrice > totalDiscountPrice && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
              "¥ ",
              totalOriginalPrice
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-tip", children: "已享受最大优惠减20元" })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "checkout-footer", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "countdown", children: [
            "支付倒计时: ",
            formatCountdown(countdown)
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "confirm-btn", onClick: handleConfirmCheckout, children: "去结算" })
        ] })
      ] })
    ] })
  ] });
};
const symptomCategories = [{
  id: "1",
  name: "颈肩腰腿痛调理",
  order: 1
}, {
  id: "2",
  name: "肝胆脾胃调理",
  order: 2
}, {
  id: "3",
  name: "失眠调理",
  order: 3
}, {
  id: "4",
  name: "宫寒痛经调理",
  order: 4
}, {
  id: "5",
  name: "腙筋根骶",
  order: 5
}, {
  id: "6",
  name: "运动拉伸",
  order: 6
}, {
  id: "7",
  name: "体态调理",
  order: 7
}];
const symptomServices = [
  // 颈肩腰腿痛调理
  {
    id: "s1",
    categoryId: "1",
    name: "【不满意退】颈肩腰腿痛特色调理60分钟",
    description: "专业手法调理各类痛症",
    duration: 60,
    price: 298,
    discountPrice: 258,
    availability: "available",
    tag: "不满意退"
  },
  {
    id: "s2",
    categoryId: "1",
    name: "【冬季养生】肩颈腰背推拿+热疗60分钟",
    description: "温经通络，驱寒养生",
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: "available",
    tag: "冬季养生"
  },
  {
    id: "s3",
    categoryId: "1",
    name: "【初次专享】肩颈疏通+肌肉放松",
    description: "新客特惠，深度放松",
    duration: 60,
    price: 198,
    discountPrice: 98,
    availability: "available",
    tag: "初次专享"
  },
  // 肝胆脾胃调理
  {
    id: "s4",
    categoryId: "2",
    name: "【舒肝润肺】推拿+艾灸｜养身伴侣90分钟",
    description: "疏肝理气，润肺养阴",
    duration: 90,
    price: 398,
    discountPrice: 358,
    availability: "available",
    tag: "热销"
  },
  {
    id: "s5",
    categoryId: "2",
    name: "【专项调理】纤养瘦身·脾胃脏腑调理60分钟",
    description: "调理脾胃，健康瘦身",
    duration: 60,
    price: 318,
    discountPrice: 288,
    availability: "available",
    tag: "专项调理"
  },
  // 失眠调理
  {
    id: "s6",
    categoryId: "3",
    name: "【深度放松】全身推拿20年经典60分钟",
    description: "经典手法，深度助眠",
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: "available",
    tag: "经典"
  },
  // 宫寒痛经调理
  {
    id: "s7",
    categoryId: "4",
    name: "【特色养生】关元灸手工悬灸60分钟",
    description: "温补肾阳，调理宫寒",
    duration: 60,
    price: 288,
    discountPrice: 258,
    availability: "available",
    tag: "特色"
  },
  {
    id: "s8",
    categoryId: "4",
    name: "【本店热销】特色铺姜关元灸60分钟",
    description: "铺姜温灸，暖宫调经",
    duration: 60,
    price: 298,
    discountPrice: 268,
    availability: "busy",
    tag: "热销"
  },
  // 腙筋根骶
  {
    id: "s9",
    categoryId: "5",
    name: "【体态调整】大师手法中式整脊60分钟",
    description: "正骨整脊，调整体态",
    duration: 60,
    price: 398,
    discountPrice: 368,
    availability: "available",
    tag: "大师手法"
  },
  // 运动拉伸
  {
    id: "s10",
    categoryId: "6",
    name: "运动恢复拉伸",
    description: "专业运动后恢复",
    duration: 45,
    price: 198,
    discountPrice: 168,
    availability: "available"
  },
  // 体态调理
  {
    id: "s11",
    categoryId: "7",
    name: "【净排寒气】拔罐/刮痧二选一",
    description: "祛湿排寒，疏通经络",
    duration: 30,
    price: 128,
    discountPrice: 98,
    availability: "available",
    tag: "二选一"
  },
  {
    id: "s12",
    categoryId: "7",
    name: "【芳香滋养】沉浸式精油SPA",
    description: "精油护理，身心放松",
    duration: 90,
    price: 428,
    discountPrice: 398,
    availability: "available",
    tag: "精油SPA"
  }
];
class TherapistService {
  // 获取推荐推拿师
  getRecommendedTherapists(page = 1, pageSize = 10, userLocation) {
    return __async(this, null, function* () {
      try {
        const data = yield request("/therapists/recommended", {
          data: {
            page,
            pageSize,
            latitude: userLocation == null ? void 0 : userLocation.latitude,
            longitude: userLocation == null ? void 0 : userLocation.longitude
          }
        });
        console.log("✅ 推荐推拿师API调用成功:", data);
        return data.data || {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      } catch (error) {
        console.log("⚠️ 推荐推拿师API调用失败，使用mock数据:", error);
        return {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      }
    });
  }
  // 获取推荐推拿师并计算距离
  getRecommendedTherapistsWithDistance(page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      try {
        const userLocation = yield getLocationService.getCurrentLocation();
        const data = yield request("/therapists/recommended", {
          data: {
            page,
            pageSize,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }
        });
        console.log("✅ 推荐推拿师API调用成功:", data);
        const therapists = ((_a = data.data) == null ? void 0 : _a.list) || [];
        const normalizedTherapists = therapists.map((therapist) => __spreadProps(__spreadValues({}, therapist), {
          avatar: normalizeImageUrl(therapist.avatar)
        }));
        const therapistsWithDistance = yield Promise.all(normalizedTherapists.map((therapist) => __async(this, null, function* () {
          try {
            const storeData = yield storeService.getStoreDetail(therapist.storeId);
            const store = (storeData == null ? void 0 : storeData.data) || storeData;
            let distance = null;
            if ((store == null ? void 0 : store.latitude) && (store == null ? void 0 : store.longitude)) {
              distance = getLocationService.calculateDistance(userLocation.latitude, userLocation.longitude, store.latitude, store.longitude);
            }
            return __spreadProps(__spreadValues({}, therapist), {
              distance
            });
          } catch (error) {
            console.warn(`获取技师 ${therapist.id} 门店信息失败:`, error);
            return __spreadProps(__spreadValues({}, therapist), {
              distance: null
            });
          }
        })));
        therapistsWithDistance.sort((a, b) => {
          if (a.distance === null && b.distance === null)
            return 0;
          if (a.distance === null)
            return 1;
          if (b.distance === null)
            return -1;
          return a.distance - b.distance;
        });
        return {
          list: therapistsWithDistance,
          total: ((_b = data.data) == null ? void 0 : _b.total) || therapistsWithDistance.length,
          page: ((_c = data.data) == null ? void 0 : _c.page) || page,
          pageSize: ((_d = data.data) == null ? void 0 : _d.pageSize) || pageSize,
          hasMore: ((_e = data.data) == null ? void 0 : _e.hasMore) || false
        };
      } catch (error) {
        console.log("⚠️ 推荐推拿师距离计算API调用失败:", error);
        return {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          hasMore: false
        };
      }
    });
  }
  // 根据门店获取推拿师
  getTherapistsByStore(storeId, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      const data = yield request(`/stores/${storeId}/therapists`, {
        data: {
          page,
          pageSize
        }
      });
      console.log("✅ 门店推拿师API调用成功:", data);
      const therapistArray = Array.isArray(data.data) ? data.data : [];
      return {
        list: therapistArray,
        total: therapistArray.length,
        page: 1,
        pageSize: therapistArray.length,
        hasMore: false
      };
    });
  }
  // 获取推拿师详情
  getTherapistDetail(therapistId) {
    return __async(this, null, function* () {
      try {
        const data = yield request(`/therapists/${therapistId}`);
        console.log("✅ 推拿师详情API调用成功:", data);
        return data;
      } catch (error) {
        console.log("⚠️ 推拿师详情API调用失败:", error);
        throw error;
      }
    });
  }
  // 按擅长项目筛选推拿师
  getTherapistsByExpertise(expertise, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      const data = yield request("/therapists/search", {
        data: {
          expertise,
          page,
          pageSize
        }
      });
      console.log("✅ 专长筛选推拿师API调用成功:", data);
      return data.data;
    });
  }
  // 搜索推拿师
  searchTherapists(keyword, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      const data = yield request("/therapists/search", {
        data: {
          keyword,
          page,
          pageSize
        }
      });
      console.log("✅ 搜索推拿师API调用成功:", data);
      return data.data;
    });
  }
  // 获取技师可预约时段
  getAvailableSlots(therapistId, date, duration = 60) {
    return __async(this, null, function* () {
      try {
        const data = yield request("/appointments/available-slots", {
          data: {
            therapistId,
            date,
            duration
          }
        });
        console.log("✅ 获取可预约时段API调用成功:", data);
        return data.data;
      } catch (error) {
        console.error("❌ 获取可预约时段API调用失败:", error);
        throw error;
      }
    });
  }
}
const therapistService = new TherapistService();
class OrderService {
  /**
   * 获取当前用户信息
   */
  getUserInfo() {
    return {
      userId: getCurrentUserId(),
      userPhone: getCurrentUserPhone()
    };
  }
  /**
   * 获取综合显示状态
   * 结合支付状态和预约状态，返回最终的显示状态
   */
  getDisplayStatus(order) {
    if (order.paymentStatus === "pending") {
      return "pending";
    }
    if (order.paymentStatus === "cancelled" || order.paymentStatus === "refunded") {
      return order.paymentStatus;
    }
    if (order.paymentStatus === "paid" && order.orderType === "service") {
      if (order.appointmentStatus) {
        switch (order.appointmentStatus) {
          case "completed":
            return "completed";
          case "serving":
            return "serving";
          case "cancelled":
            return "cancelled";
          case "pending":
          case "confirmed":
          default:
            return "paid";
        }
      }
      if (order.appointmentDate && order.startTime) {
        const appointmentDateTime = /* @__PURE__ */ new Date(`${order.appointmentDate} ${order.startTime}`);
        const endDateTime = new Date(appointmentDateTime.getTime() + (order.duration || 60) * 6e4);
        const now = /* @__PURE__ */ new Date();
        if (endDateTime < now) {
          return "paid";
        }
      }
    }
    return order.paymentStatus;
  }
  /**
   * 补全订单的门店和技师信息
   * @param order 订单对象
   * @private
   */
  enrichOrderWithStoreAndTherapistInfo(order) {
    return __async(this, null, function* () {
      try {
        const promises = [];
        if (order.storeId && !order.storeName) {
          promises.push(get(`/stores/${order.storeId}`).then((storeResponse) => {
            const store = storeResponse.data;
            order.storeName = store.name;
            order.storeAddress = store.address;
          }).catch((error) => __async(this, null, function* () {
            console.error(`获取门店信息失败 (storeId: ${order.storeId}):`, error);
            const defaultStore = yield this.getDefaultStoreInfo();
            if (defaultStore) {
              order.storeName = `${defaultStore.name}（替代显示）`;
              order.storeAddress = defaultStore.address;
            } else {
              order.storeName = "门店信息暂时无法获取";
              order.storeAddress = "请联系客服获取详情";
            }
          })));
        }
        if (order.therapistId && !order.therapistAvatar) {
          promises.push(get(`/therapists/${order.therapistId}`).then((therapistResponse) => {
            const therapist = therapistResponse.data;
            order.therapistAvatar = therapist.avatar;
            if (!order.therapistName) {
              order.therapistName = therapist.name;
            }
          }).catch((error) => {
            console.error(`获取技师信息失败 (therapistId: ${order.therapistId}):`, error);
            if (!order.therapistAvatar) {
              order.therapistAvatar = "https://img.yzcdn.cn/vant/cat.jpeg";
            }
          }));
        }
        if (promises.length > 0) {
          yield Promise.allSettled(promises);
        }
      } catch (error) {
        console.error("补全订单信息失败:", error);
      }
    });
  }
  /**
   * 获取默认门店信息（当原门店不存在时使用）
   * @private
   */
  getDefaultStoreInfo() {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        const response = yield get("/stores/nearby", {
          page: 1,
          pageSize: 1
        });
        if ((_b = (_a = response.data) == null ? void 0 : _a.list) == null ? void 0 : _b[0]) {
          const store = response.data.list[0];
          return {
            name: store.name,
            address: store.address
          };
        }
      } catch (error) {
        console.error("获取默认门店信息失败:", error);
      }
      return null;
    });
  }
  /**
   * 批量补全订单列表的门店和技师信息，过滤无效订单
   * @param orders 订单列表
   * @returns 过滤后的有效订单列表
   * @private
   */
  enrichOrderListWithStoreAndTherapistInfo(orders) {
    return __async(this, null, function* () {
      try {
        const storeIds = /* @__PURE__ */ new Set();
        const therapistIds = /* @__PURE__ */ new Set();
        orders.forEach((order) => {
          if (order.storeId && !order.storeName) {
            storeIds.add(order.storeId.toString());
          }
          if (order.therapistId && !order.therapistAvatar) {
            therapistIds.add(order.therapistId.toString());
          }
        });
        const promises = [];
        const storeMap = /* @__PURE__ */ new Map();
        const therapistMap = /* @__PURE__ */ new Map();
        const invalidStoreIds = /* @__PURE__ */ new Set();
        Array.from(storeIds).forEach((storeId) => {
          promises.push(get(`/stores/${storeId}`).then((response) => {
            storeMap.set(storeId, response.data);
          }).catch((error) => {
            console.warn(`门店不存在，将过滤相关订单 (storeId: ${storeId}):`, error.message);
            invalidStoreIds.add(storeId);
          }));
        });
        Array.from(therapistIds).forEach((therapistId) => {
          promises.push(get(`/therapists/${therapistId}`).then((response) => {
            therapistMap.set(therapistId, response.data);
          }).catch((error) => {
            console.error(`批量获取技师信息失败 (therapistId: ${therapistId}):`, error);
          }));
        });
        if (promises.length > 0) {
          yield Promise.allSettled(promises);
        }
        const validOrders = orders.filter((order) => {
          if (order.storeId && invalidStoreIds.has(order.storeId.toString())) {
            console.warn(`过滤无效订单: ${order.orderNo}（门店 ${order.storeId} 不存在）`);
            return false;
          }
          return true;
        });
        validOrders.forEach((order) => {
          if (order.storeId && !order.storeName) {
            const store = storeMap.get(order.storeId.toString());
            if (store) {
              order.storeName = store.name;
              order.storeAddress = store.address;
            }
          }
          if (order.therapistId && !order.therapistAvatar) {
            const therapist = therapistMap.get(order.therapistId.toString());
            if (therapist) {
              order.therapistAvatar = therapist.avatar;
              if (!order.therapistName) {
                order.therapistName = therapist.name;
              }
            } else {
              order.therapistAvatar = "https://img.yzcdn.cn/vant/cat.jpeg";
            }
          }
        });
        return validOrders;
      } catch (error) {
        console.error("批量补全订单列表信息失败:", error);
        return orders;
      }
    });
  }
  /**
   * 创建预约订单（通过预约接口）
   * @param params 创建订单参数
   * @returns 订单和预约信息
   */
  createAppointmentOrder(params) {
    return __async(this, null, function* () {
      try {
        const {
          userId,
          userPhone
        } = this.getUserInfo();
        console.log("📝 创建订单原始参数:", params);
        console.log("📝 therapistId类型:", typeof params.therapistId, "值:", params.therapistId);
        const requestData = {
          therapistId: Number(params.therapistId),
          storeId: Number(params.storeId),
          userId,
          userPhone,
          appointmentDate: params.appointmentDate,
          startTime: params.appointmentTime,
          duration: params.duration || 60,
          serviceId: params.serviceId,
          serviceName: params.serviceName,
          price: params.discountPrice || params.price
        };
        console.log("📤 实际发送的请求数据:", requestData);
        console.log("📤 转换后的therapistId:", requestData.therapistId, "是否为NaN:", isNaN(requestData.therapistId));
        const response = yield post("/appointments/create-with-order", requestData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        const orderData = __spreadProps(__spreadValues({}, response.data.order), {
          therapistName: params.therapistName,
          therapistAvatar: params.therapistAvatar,
          serviceName: params.serviceName,
          duration: params.duration,
          appointmentDate: params.appointmentDate,
          startTime: params.appointmentTime
          // ✅ 映射到 startTime
          // ✅ amount 已经从API返回，单位为分
        });
        return {
          order: orderData,
          appointment: response.data.appointment
        };
      } catch (error) {
        console.error("创建订单失败:", error);
        throw new Error(error.message || "创建订单失败");
      }
    });
  }
  /**
   * 获取支付参数
   * @param orderNo 订单号
   * @returns 支付参数
   */
  getPaymentParams(orderNo) {
    return __async(this, null, function* () {
      try {
        const response = yield post("/orders/pay", {
          orderNo,
          paymentMethod: "wechat"
        });
        if (response.data.wxPayParams) {
          return response.data.wxPayParams;
        }
        return {
          timeStamp: String(Math.floor(Date.now() / 1e3)),
          nonceStr: Math.random().toString(36).substr(2, 15),
          package: `prepay_id=${Math.random().toString(36).substr(2, 15)}`,
          signType: "MD5",
          paySign: Math.random().toString(36).substr(2, 32)
        };
      } catch (error) {
        console.error("获取支付参数失败:", error);
        throw new Error("获取支付参数失败");
      }
    });
  }
  /**
   * 更新订单状态（余额支付）
   * @param orderNo 订单号
   * @param status 订单状态
   * @returns 更新后的订单
   */
  updateOrderStatus(orderNo, status) {
    return __async(this, null, function* () {
      try {
        const response = yield post("/orders/pay", {
          orderNo,
          paymentMethod: "balance"
        });
        return {
          orderNo,
          paymentStatus: "paid",
          paidAt: response.data.paidAt || (/* @__PURE__ */ new Date()).toISOString()
        };
      } catch (error) {
        console.error("更新订单状态失败:", error);
        throw new Error(error.message || "支付失败");
      }
    });
  }
  /**
   * 获取订单详情
   * @param orderNo 订单号
   * @returns 订单详情
   */
  getOrderDetail(orderNo) {
    return __async(this, null, function* () {
      try {
        const response = yield get(`/orders/${orderNo}`);
        const order = response.data;
        if (order.extraData) {
          order.appointmentId = order.extraData.appointmentId;
          order.therapistId = order.extraData.therapistId;
          order.therapistName = order.extraData.therapistName;
          order.therapistAvatar = normalizeImageUrl(order.extraData.therapistAvatar);
          order.storeId = order.extraData.storeId;
          order.appointmentDate = order.extraData.appointmentDate;
          order.startTime = order.extraData.startTime;
          order.duration = order.extraData.duration;
          order.serviceName = order.extraData.serviceName || order.title;
          order.appointmentStatus = order.extraData.appointmentStatus;
          yield this.enrichOrderWithStoreAndTherapistInfo(order);
        }
        order.displayStatus = this.getDisplayStatus(order);
        return order;
      } catch (error) {
        console.error("获取订单详情失败:", error);
        throw new Error("订单不存在或已删除");
      }
    });
  }
  /**
   * 获取订单列表
   * @param status 订单状态（可选）
   * @param orderType 订单类型（可选）
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 订单列表
   */
  getOrderList(status, orderType, page = 1, pageSize = 20) {
    return __async(this, null, function* () {
      try {
        const {
          userId
        } = this.getUserInfo();
        const params = {
          userId,
          page,
          pageSize
        };
        if (status)
          params.status = status;
        if (orderType)
          params.orderType = orderType;
        const response = yield get("/orders", params);
        const orders = response.data.list.map((order) => {
          if (order.extraData) {
            order.appointmentId = order.extraData.appointmentId;
            order.therapistId = order.extraData.therapistId;
            order.therapistName = order.extraData.therapistName;
            order.therapistAvatar = normalizeImageUrl(order.extraData.therapistAvatar);
            order.storeId = order.extraData.storeId;
            order.storeName = order.extraData.storeName;
            order.storeAddress = order.extraData.storeAddress;
            order.appointmentDate = order.extraData.appointmentDate;
            order.startTime = order.extraData.startTime;
            order.duration = order.extraData.duration;
            order.serviceName = order.extraData.serviceName || order.title;
            order.appointmentStatus = order.extraData.appointmentStatus;
          }
          order.displayStatus = this.getDisplayStatus(order);
          return order;
        });
        const validOrders = yield this.enrichOrderListWithStoreAndTherapistInfo(orders);
        return validOrders;
      } catch (error) {
        console.error("获取订单列表失败:", error);
        return [];
      }
    });
  }
  /**
   * 取消订单
   * @param orderNo 订单号
   * @param reason 取消原因
   * @returns 取消结果
   */
  cancelOrder(orderNo, reason = "用户取消") {
    return __async(this, null, function* () {
      try {
        const {
          userId
        } = this.getUserInfo();
        const response = yield post("/orders/cancel", {
          orderNo,
          userId,
          reason
        }, {
          showLoading: true,
          loadingTitle: "取消中..."
        });
        return response.data;
      } catch (error) {
        console.error("取消订单失败:", error);
        throw new Error(error.message || "取消订单失败");
      }
    });
  }
  /**
   * 申请退款（通过订单API）
   * @param orderNo 订单号
   * @param reason 退款原因（可选）
   * @returns 退款单信息
   */
  requestRefund(orderNo, reason) {
    return __async(this, null, function* () {
      try {
        const {
          userId
        } = this.getUserInfo();
        const response = yield post(`/orders/${orderNo}/refund`, {
          userId,
          reason: reason || "用户申请退款"
        }, {
          showLoading: true,
          loadingTitle: "申请退款中..."
        });
        return response.data;
      } catch (error) {
        console.error("申请退款失败:", error);
        throw new Error(error.message || "申请退款失败");
      }
    });
  }
  /**
   * 查询退款详情
   * @param refundId 退款单号
   * @returns 退款详情
   */
  getRefundDetail(refundId) {
    return __async(this, null, function* () {
      try {
        const response = yield get(`/refunds/${refundId}`);
        return response.data;
      } catch (error) {
        console.error("获取退款详情失败:", error);
        throw new Error("退款单不存在或已删除");
      }
    });
  }
  /**
   * 重新预约（基于已有订单）
   * @param orderNo 原订单号
   * @returns 是否成功
   */
  rebookOrder(orderNo) {
    return __async(this, null, function* () {
      try {
        const originalOrder = yield this.getOrderDetail(orderNo);
        taro.Taro.setStorageSync("rebookOrderInfo", {
          therapistId: originalOrder.therapistId,
          therapistName: originalOrder.therapistName,
          storeId: originalOrder.storeId,
          storeName: originalOrder.storeName,
          serviceId: originalOrder.serviceId,
          serviceName: originalOrder.serviceName,
          duration: originalOrder.duration
        });
        return true;
      } catch (error) {
        console.error("重新预约失败:", error);
        return false;
      }
    });
  }
  /**
   * 获取订单统计
   * @returns 订单统计信息
   */
  getOrderStatistics() {
    return __async(this, null, function* () {
      try {
        const {
          userId
        } = this.getUserInfo();
        const response = yield get("/orders", {
          userId,
          page: 1,
          pageSize: 100
        });
        const orders = response.data.list;
        return {
          total: orders.length,
          pendingPayment: orders.filter((o) => o.paymentStatus === "pending").length,
          paid: orders.filter((o) => o.paymentStatus === "paid").length,
          completed: orders.filter((o) => o.paymentStatus === "paid" && /* @__PURE__ */ new Date(o.appointmentDate + " " + o.startTime) < /* @__PURE__ */ new Date()).length,
          // ✅ 改为 startTime
          cancelled: orders.filter((o) => o.paymentStatus === "cancelled").length
        };
      } catch (error) {
        console.error("获取订单统计失败:", error);
        return {
          total: 0,
          pendingPayment: 0,
          paid: 0,
          completed: 0,
          cancelled: 0
        };
      }
    });
  }
}
const orderService = new OrderService();
function centsToYuan(amountInCents) {
  if (!amountInCents && amountInCents !== 0)
    return 0;
  return Math.round(amountInCents) / 100;
}
function formatAmount(amountInCents, options) {
  const {
    symbol = "￥",
    suffix = "元",
    precision = 2
  } = options || {};
  if (amountInCents === void 0 || amountInCents === null) {
    return `${symbol}0.00${suffix}`;
  }
  if (typeof amountInCents !== "number" || isNaN(amountInCents)) {
    console.warn("⚠️ formatAmount: 无效的金额输入", {
      amountInCents,
      type: typeof amountInCents
    });
    return `${symbol}0.00${suffix}`;
  }
  const yuan = centsToYuan(amountInCents);
  if (isNaN(yuan)) {
    console.error("❌ formatAmount: 金额转换结果为NaN", {
      amountInCents,
      yuan
    });
    return `${symbol}0.00${suffix}`;
  }
  return `${symbol}${yuan.toFixed(precision)}${suffix}`;
}
class PaymentService {
  constructor() {
    this.config = {
      // 企业小程序真实支付配置
      useMockPayment: false,
      // 关闭模拟支付
      enableBalancePayment: true,
      enableWechatPayment: true
      // 启用真实微信支付
    };
  }
  /**
   * 统一支付入口
   */
  pay(options) {
    return __async(this, null, function* () {
      const {
        paymentMethod
      } = options;
      if (this.config.useMockPayment && paymentMethod === "wechat") {
        return this.mockWechatPayment(options);
      }
      if (paymentMethod === "balance") {
        return this.payWithBalance(options);
      }
      if (paymentMethod === "wechat" && this.config.enableWechatPayment) {
        return this.payWithWechat(options);
      }
      throw new Error("不支持的支付方式");
    });
  }
  /**
   * 模拟微信支付（个人小程序测试用）
   * 使用真实的支付接口 /api/v2/orders/pay
   */
  mockWechatPayment(options) {
    return __async(this, null, function* () {
      try {
        const {
          confirm
        } = yield taro.Taro.showModal({
          title: "模拟支付",
          content: `订单金额：¥${(options.amount / 100).toFixed(2)}
${options.title || ""}`,
          confirmText: "确认支付",
          cancelText: "取消支付",
          confirmColor: "#07c160"
        });
        if (confirm) {
          taro.Taro.showLoading({
            title: "支付中..."
          });
          yield this.delay(1500);
          console.log("💳 模拟微信支付请求参数:", {
            orderNo: options.orderNo,
            paymentMethod: "wechat"
          });
          const response = yield post("/orders/pay", {
            orderNo: options.orderNo,
            paymentMethod: "wechat"
          });
          console.log("💳 模拟微信支付响应:", response);
          taro.Taro.hideLoading();
          if (response.code === 0) {
            taro.Taro.showToast({
              title: "支付成功",
              icon: "success"
            });
            return true;
          } else {
            throw new Error(response.message || "支付失败");
          }
        } else {
          console.log("用户取消模拟支付");
          return false;
        }
      } catch (error) {
        console.error("💳 模拟微信支付失败:", error);
        taro.Taro.hideLoading();
        taro.Taro.showToast({
          title: error.message || "支付失败",
          icon: "none"
        });
        throw error;
      }
    });
  }
  /**
   * 余额支付
   */
  payWithBalance(options) {
    return __async(this, null, function* () {
      try {
        taro.Taro.showLoading({
          title: "支付中..."
        });
        console.log("💰 余额支付请求参数:", {
          orderNo: options.orderNo,
          paymentMethod: "balance"
        });
        const response = yield post("/orders/pay", {
          orderNo: options.orderNo,
          paymentMethod: "balance"
        });
        console.log("💰 余额支付响应:", response);
        taro.Taro.hideLoading();
        if (response.code === 0) {
          const balanceInYuan = (response.data.balance || 0) / 100;
          taro.Taro.showToast({
            title: `支付成功
余额：¥${balanceInYuan.toFixed(2)}`,
            icon: "success",
            duration: 2e3
          });
          return true;
        } else {
          throw new Error(response.message || "余额不足");
        }
      } catch (error) {
        console.error("💰 余额支付失败:", error);
        console.error("💰 错误详情:", error.response || error.message);
        taro.Taro.hideLoading();
        taro.Taro.showToast({
          title: error.message || "支付失败",
          icon: "none"
        });
        return false;
      }
    });
  }
  /**
   * 真实微信支付（需要企业认证）
   * 注意：wxPayParams 已经在创建订单时由后端返回
   */
  payWithWechat(options) {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        console.log("💳 开始真实微信支付，订单号:", options.orderNo);
        const wxPayParams = options.wxPayParams;
        if (!wxPayParams) {
          throw new Error("缺少微信支付参数，请先创建订单");
        }
        const requiredFields = ["timeStamp", "nonceStr", "package", "signType", "paySign"];
        const missingFields = requiredFields.filter((field) => !wxPayParams[field]);
        if (missingFields.length > 0) {
          console.error("❌ 微信支付参数不完整，缺少字段:", missingFields);
          throw new Error(`微信支付参数缺失: ${missingFields.join(", ")}`);
        }
        console.log("💳 微信支付参数:", {
          timeStamp: wxPayParams.timeStamp,
          nonceStr: ((_a = wxPayParams.nonceStr) == null ? void 0 : _a.substring(0, 8)) + "...",
          package: wxPayParams.package,
          signType: wxPayParams.signType,
          paySign: ((_b = wxPayParams.paySign) == null ? void 0 : _b.substring(0, 16)) + "..."
        });
        yield taro.Taro.requestPayment({
          timeStamp: wxPayParams.timeStamp,
          nonceStr: wxPayParams.nonceStr,
          package: wxPayParams.package,
          signType: wxPayParams.signType,
          paySign: wxPayParams.paySign
        });
        console.log("💳 用户完成支付，等待微信回调后端更新订单状态");
        taro.Taro.showToast({
          title: "支付成功",
          icon: "success"
        });
        return true;
      } catch (error) {
        if (error.errMsg === "requestPayment:fail cancel") {
          console.log("💳 用户取消支付");
          return false;
        }
        console.error("💳 微信支付失败:", error);
        console.error("💳 错误详情:", {
          errMsg: error.errMsg,
          errCode: error.errCode,
          message: error.message
        });
        taro.Taro.showToast({
          title: error.errMsg || error.message || "支付失败",
          icon: "none",
          duration: 3e3
        });
        throw error;
      }
    });
  }
  /**
   * 检查支付环境
   */
  checkPaymentEnvironment() {
    return __async(this, null, function* () {
      taro.Taro.getAccountInfoSync();
      const isPersonalApp = !this.config.enableWechatPayment;
      return {
        canUseWechatPay: !isPersonalApp && this.config.enableWechatPayment,
        canUseBalance: this.config.enableBalancePayment,
        canUseMockPay: this.config.useMockPayment,
        message: isPersonalApp ? "当前为个人小程序，使用模拟支付和余额支付" : "企业小程序，支持完整支付功能"
      };
    });
  }
  /**
   * 生成充值码（线下充值）
   */
  generateRechargeCode(amount) {
    return __async(this, null, function* () {
      const response = yield post("/recharge/generate-code", {
        amount
      });
      return response.data;
    });
  }
  /**
   * 辅助方法：延迟
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
const paymentService = new PaymentService();
class WalletService {
  /**
   * 获取当前用户ID
   * @returns 用户ID
   */
  getCurrentUserId() {
    return getCurrentUserId();
  }
  /**
   * 获取钱包余额
   * ✅ 返回分为单位，由页面层使用 formatAmount() 转换为元显示
   * @returns 余额信息（分为单位）
   */
  getBalance() {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const response = yield get("/users/wallet/balance", {
          userId
        });
        const balanceInCents = response.data.balance || 0;
        console.log("💰 余额查询:", {
          分: balanceInCents,
          元: (balanceInCents / 100).toFixed(2)
        });
        return balanceInCents;
      } catch (error) {
        console.error("获取余额失败:", error);
        throw new Error("获取余额失败，请重试");
      }
    });
  }
  /**
   * 获取余额详情（包含统计信息）
   * ✅ 返回分为单位，由页面层负责转换为元显示
   * @returns 余额详情（分为单位）
   */
  getBalanceDetails() {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const response = yield get("/users/wallet/balance", {
          userId
        });
        return response.data;
      } catch (error) {
        console.error("获取余额详情失败:", error);
        throw new Error("获取余额详情失败，请重试");
      }
    });
  }
  /**
   * 获取充值配置选项
   * ✅ 返回分为单位，页面层用 formatAmount() 转换为元显示
   * @returns 充值配置列表（分为单位）
   */
  getRechargeOptions() {
    return __async(this, null, function* () {
      try {
        const response = yield get("/recharge/configs");
        return response.data;
      } catch (error) {
        console.error("获取充值配置失败:", error);
        return this.getDefaultRechargeOptions();
      }
    });
  }
  /**
   * 获取默认充值配置（降级方案）
   * ✅ 返回分为单位
   * @private
   */
  getDefaultRechargeOptions() {
    return [
      {
        id: 1,
        amount: 1e4,
        bonus: 0,
        label: "100元",
        sortOrder: 1
      },
      // 100元 = 10000分
      {
        id: 2,
        amount: 2e4,
        bonus: 0,
        label: "200元",
        sortOrder: 2
      },
      // 200元 = 20000分
      {
        id: 3,
        amount: 5e4,
        bonus: 5e3,
        label: "500元",
        sortOrder: 3,
        promotionTag: "赠50元"
      },
      // 500元 = 50000分
      {
        id: 4,
        amount: 1e5,
        bonus: 1e4,
        label: "1000元",
        sortOrder: 4,
        promotionTag: "赠100元"
      },
      // 1000元 = 100000分
      {
        id: 5,
        amount: 2e5,
        bonus: 3e4,
        label: "2000元",
        sortOrder: 5,
        promotionTag: "赠300元"
      },
      // 2000元 = 200000分
      {
        id: 6,
        amount: 5e5,
        bonus: 1e5,
        label: "5000元",
        sortOrder: 6,
        promotionTag: "赠1000元",
        isRecommended: true
      }
      // 5000元 = 500000分
    ];
  }
  /**
   * 创建充值订单
   * @param amount 充值金额（元）
   * @param bonus 赠送金额（元）
   * @returns 订单信息
   */
  createRechargeOrder(amount, bonus = 0) {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const userPhone = getCurrentUserPhone();
        const amountInCents = amount * 100;
        const orderData = {
          orderType: "recharge",
          userId,
          userPhone,
          title: bonus > 0 ? `充值${amount}元，赠送${bonus}元` : `充值${amount}元`,
          amount: amountInCents,
          // 分为单位（100 yuan = 10000 fen）
          paymentMethod: "wechat",
          extraData: {
            rechargeAmount: amountInCents,
            // 充值金额（分）
            bonus: bonus * 100,
            // 赠送金额（分）
            actualAmount: amountInCents + bonus * 100
            // 总金额（分）
          }
        };
        console.log("💰 创建充值订单");
        console.log("👤 当前用户ID:", userId);
        console.log("📞 用户手机号:", userPhone);
        console.log("📦 订单数据:", {
          orderType: orderData.orderType,
          userId: orderData.userId,
          title: orderData.title,
          amount: `${orderData.amount}分 (¥${(orderData.amount / 100).toFixed(2)})`,
          paymentMethod: orderData.paymentMethod,
          extraData: orderData.extraData
        });
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        console.log("✅ 充值订单创建成功");
        console.log("📋 订单响应:", {
          orderNo: response.data.orderNo,
          amount: `${response.data.amount}分 (¥${(response.data.amount / 100).toFixed(2)})`,
          paymentStatus: response.data.paymentStatus,
          hasWxPayParams: !!response.data.wxPayParams
        });
        return response.data;
      } catch (error) {
        console.error("❌ 创建充值订单失败:", error);
        throw new Error(error.message || "创建充值订单失败");
      }
    });
  }
  /**
   * 获取交易记录
   * ✅ 返回分为单位
   * @param page 页码
   * @param pageSize 每页数量
   * @param type 交易类型（可选）
   * @returns 交易记录列表（金额为分为单位）
   */
  getTransactions(page = 1, pageSize = 20, type) {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const params = {
          userId,
          page,
          pageSize
        };
        if (type)
          params.type = type;
        const response = yield get("/users/wallet/transactions", params);
        return response.data.list;
      } catch (error) {
        console.error("获取交易记录失败:", error);
        return [];
      }
    });
  }
  /**
   * 使用余额支付
   * @param orderNo 订单号
   * @param amount 支付金额（分）
   * @returns 支付结果（balance为分为单位）
   */
  payWithBalance(orderNo, amount) {
    return __async(this, null, function* () {
      try {
        const response = yield post("/orders/pay", {
          orderNo,
          paymentMethod: "balance"
        }, {
          showLoading: true,
          loadingTitle: "支付中..."
        });
        return {
          success: true,
          balance: response.data.balance,
          // ✅ 返回分为单位
          message: "支付成功"
        };
      } catch (error) {
        console.error("余额支付失败:", error);
        throw new Error(error.message || "余额不足或支付失败");
      }
    });
  }
  /**
   * 退款到余额
   * @param orderNo 订单号
   * @param amount 退款金额（分）
   * @param reason 退款原因
   * @returns 退款结果（balance为分为单位）
   */
  refundToBalance(orderNo, amount, reason = "订单退款") {
    return __async(this, null, function* () {
      try {
        const response = yield post("/users/wallet/refund", {
          phone: getCurrentUserPhone(),
          amount,
          // ✅ 已经是分为单位，直接发送
          orderNo,
          description: reason
        }, {
          showLoading: true,
          loadingTitle: "退款中..."
        });
        return {
          success: true,
          balance: response.data.balance,
          // ✅ 返回分为单位
          transactionId: response.data.transactionId,
          message: "退款成功"
        };
      } catch (error) {
        console.error("退款失败:", error);
        throw new Error(error.message || "退款失败");
      }
    });
  }
  /**
   * 清空本地缓存
   */
  clearCache() {
    try {
      taro.Taro.removeStorageSync("userInfo");
      taro.Taro.removeStorageSync("walletCache");
      console.log("钱包缓存已清空");
    } catch (error) {
      console.error("清空缓存失败:", error);
    }
  }
}
const walletService = new WalletService();
function generateVoucherFromDiscountRate(discountRate, userId) {
  if (!discountRate || discountRate >= 1) {
    return null;
  }
  const discountPercentage = Math.round((1 - discountRate) * 100);
  const now = /* @__PURE__ */ new Date();
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1e3);
  return {
    id: `virtual_${userId}_discount`,
    userId: userId.toString(),
    type: "discount",
    name: discountPercentage >= 30 ? "新人专享券" : "会员折扣券",
    description: `全场服务${Math.round(discountRate * 100)}折`,
    discountRate,
    discountPercentage,
    validFrom: now.toISOString(),
    validTo: oneYearLater.toISOString(),
    status: "unused",
    isAutoApply: true
  };
}
function calculateDiscountPrice(originalPrice, discountRate) {
  const finalPrice = Math.round(originalPrice * discountRate);
  const savedAmount = originalPrice - finalPrice;
  const discountPercentage = Math.round(discountRate * 100);
  return {
    originalPrice,
    finalPrice,
    savedAmount,
    discountDisplay: `${discountPercentage}折`
  };
}
class VoucherService {
  constructor() {
    this.vouchers = [];
    this.currentVoucher = null;
  }
  /**
   * 获取当前用户的礼券列表
   */
  getMyVouchers() {
    return __async(this, null, function* () {
      const userInfo = getCurrentUserInfo();
      if (!userInfo) {
        return [];
      }
      if (userInfo.discountRate && userInfo.discountRate < 1) {
        const voucher = generateVoucherFromDiscountRate(userInfo.discountRate, userInfo.id.toString());
        if (voucher) {
          this.vouchers = [voucher];
          return [voucher];
        }
      }
      return [];
    });
  }
  /**
   * 获取可用礼券列表
   */
  getAvailableVouchers(orderAmount) {
    return __async(this, null, function* () {
      const allVouchers = yield this.getMyVouchers();
      const now = /* @__PURE__ */ new Date();
      return allVouchers.filter((voucher) => {
        if (voucher.status !== "unused")
          return false;
        const validFrom = new Date(voucher.validFrom);
        const validTo = new Date(voucher.validTo);
        if (now < validFrom || now > validTo)
          return false;
        if (voucher.minAmount && orderAmount < voucher.minAmount)
          return false;
        return true;
      });
    });
  }
  /**
   * 设置当前选中的礼券
   */
  setCurrentVoucher(voucher) {
    this.currentVoucher = voucher;
    if (voucher) {
      taro.Taro.setStorageSync("selectedVoucher", voucher);
    } else {
      taro.Taro.removeStorageSync("selectedVoucher");
    }
  }
  /**
   * 获取当前选中的礼券
   */
  getCurrentVoucher() {
    if (!this.currentVoucher) {
      try {
        this.currentVoucher = taro.Taro.getStorageSync("selectedVoucher");
      } catch (e) {
        console.error("获取选中礼券失败:", e);
      }
    }
    return this.currentVoucher;
  }
  /**
   * 标记礼券为已使用
   */
  markVoucherAsUsed(voucherId, orderNo) {
    const voucher = this.vouchers.find((v) => v.id === voucherId);
    if (voucher) {
      voucher.status = "used";
      voucher.usedAt = (/* @__PURE__ */ new Date()).toISOString();
      voucher.orderNo = orderNo;
    }
    this.setCurrentVoucher(null);
  }
  /**
   * 检查是否为新用户（有新人券）
   */
  isNewUser() {
    const userInfo = getCurrentUserInfo();
    if (!userInfo || !userInfo.discountRate)
      return false;
    const discountPercentage = Math.round((1 - userInfo.discountRate) * 100);
    return discountPercentage >= 30;
  }
  /**
   * 获取新人礼券信息（用于弹窗展示）
   */
  getNewUserVoucherInfo() {
    const userInfo = getCurrentUserInfo();
    if (!userInfo || !userInfo.discountRate || userInfo.discountRate >= 1) {
      return {
        hasVoucher: false
      };
    }
    const discountPercentage = Math.round((1 - userInfo.discountRate) * 100);
    return {
      hasVoucher: true,
      discountPercentage,
      description: `恭喜获得新人专享${discountPercentage}%优惠券！`
    };
  }
}
const voucherService = new VoucherService();
class ReviewService {
  /**
   * 创建评价
   * @param params 评价参数
   * @returns 评价结果
   */
  createReview(params) {
    return __async(this, null, function* () {
      if (params.content.length < 1) {
        throw new Error("评价内容不能为空");
      }
      if (params.content.length > 500) {
        throw new Error("评价内容不能超过500字");
      }
      if (params.rating < 1 || params.rating > 5) {
        throw new Error("评分必须在1-5之间");
      }
      try {
        const response = yield post("/reviews", params, {
          showLoading: true,
          loadingTitle: "提交评价中..."
        });
        taro.Taro.eventCenter.trigger("review:created", response.data);
        return response.data;
      } catch (error) {
        console.error("创建评价失败:", error);
        throw new Error(error.message || "创建评价失败");
      }
    });
  }
  /**
   * 获取推拿师评价列表
   * @param therapistId 推拿师ID
   * @param page 页码
   * @param pageSize 每页数量
   * @param rating 评分筛选
   * @returns 评价列表
   */
  getTherapistReviews(therapistId, page = 1, pageSize = 10, rating) {
    return __async(this, null, function* () {
      try {
        const params = {
          page,
          pageSize
        };
        if (rating) {
          params.rating = rating;
        }
        const response = yield get(`/therapists/${therapistId}/reviews`, params);
        return response.data;
      } catch (error) {
        console.error("获取推拿师评价失败:", error);
        return {
          list: [],
          total: 0,
          page,
          pageSize,
          hasMore: false
        };
      }
    });
  }
  /**
   * 获取用户评价历史
   * @param userId 用户ID
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 评价列表
   */
  getUserReviews(userId, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      try {
        const response = yield get(`/users/${userId}/reviews`, {
          page,
          pageSize
        });
        return response.data;
      } catch (error) {
        console.error("获取用户评价失败:", error);
        return {
          list: [],
          total: 0,
          page,
          pageSize,
          hasMore: false
        };
      }
    });
  }
  /**
   * 获取评价详情
   * @param reviewId 评价ID
   * @returns 评价详情
   */
  getReviewDetail(reviewId) {
    return __async(this, null, function* () {
      try {
        const response = yield get(`/reviews/${reviewId}`);
        return response.data;
      } catch (error) {
        console.error("获取评价详情失败:", error);
        throw new Error(error.message || "评价不存在");
      }
    });
  }
  /**
   * 获取推拿师评价统计
   * @param therapistId 推拿师ID
   * @returns 评价统计
   */
  getReviewStats(therapistId) {
    return __async(this, null, function* () {
      try {
        const response = yield get(`/therapists/${therapistId}/review-stats`);
        return response.data;
      } catch (error) {
        console.error("获取评价统计失败:", error);
        return {
          totalCount: 0,
          averageRating: 0,
          ratingBreakdown: {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0
          }
        };
      }
    });
  }
  /**
   * 检查是否可以评价
   * @param appointmentId 预约ID
   * @returns 是否可以评价
   */
  checkCanReview(appointmentId) {
    return __async(this, null, function* () {
      var _a;
      try {
        const response = yield taro.Taro.request({
          url: `${API_CONFIG.baseURL}/reviews/${appointmentId}`,
          method: "GET",
          header: {
            "Content-Type": "application/json"
          },
          timeout: API_CONFIG.timeout
        });
        const result = response.data;
        if (result.code === 1002) {
          console.log("评价不存在，可以创建评价");
          return true;
        }
        if (result.code === 0 && ((_a = result.data) == null ? void 0 : _a.reviewId)) {
          console.log("评价已存在，不能再评价");
          return false;
        }
        return true;
      } catch (error) {
        console.warn("检查评价状态时发生错误，默认允许评价");
        return true;
      }
    });
  }
  /**
   * 批量获取评价状态
   * @param appointmentIds 预约ID列表
   * @returns 评价状态映射
   */
  batchCheckReviewStatus(appointmentIds) {
    return __async(this, null, function* () {
      const result = {};
      const promises = appointmentIds.map((id) => __async(this, null, function* () {
        const canReview = yield this.checkCanReview(id);
        result[id] = canReview;
      }));
      yield Promise.allSettled(promises);
      return result;
    });
  }
  /**
   * 清除缓存
   */
  clearCache() {
    try {
      const keys = taro.Taro.getStorageInfoSync().keys;
      keys.forEach((key) => {
        if (key.startsWith("review_cache_")) {
          taro.Taro.removeStorageSync(key);
        }
      });
    } catch (error) {
      console.error("清除评价缓存失败:", error);
    }
  }
}
const reviewService = new ReviewService();
const index = "";
const BookingButton = ({
  size = "medium",
  text = "预约"
}) => {
  return /* @__PURE__ */ taro.jsx(
    taro.View,
    {
      className: `booking-button booking-button-${size}`,
      children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "button-text", children: text })
    }
  );
};
exports.BookingButton = BookingButton;
exports.GiftService = GiftService;
exports.ShoppingCart = ShoppingCart;
exports.calculateDiscountPrice = calculateDiscountPrice;
exports.checkAndAutoLogin = checkAndAutoLogin;
exports.fetchUserInfo = fetchUserInfo;
exports.formatAmount = formatAmount;
exports.getCurrentUserInfo = getCurrentUserInfo;
exports.getLocationService = getLocationService;
exports.maskPhone = maskPhone;
exports.normalizeImageUrl = normalizeImageUrl;
exports.orderService = orderService;
exports.paymentService = paymentService;
exports.post = post;
exports.request = request;
exports.reviewService = reviewService;
exports.setUserInfo = setUserInfo;
exports.storeService = storeService;
exports.symptomCategories = symptomCategories;
exports.symptomServices = symptomServices;
exports.therapistService = therapistService;
exports.voucherService = voucherService;
exports.walletService = walletService;
exports.wechatLogin = wechatLogin;
//# sourceMappingURL=common.js.map
