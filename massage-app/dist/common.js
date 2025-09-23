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
  baseURL: "http://emagen.323424.xyz/api/v2",
  timeout: 1e4,
  retry: 3
};
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
      if (result.code !== 0) {
        console.error(`API业务错误: ${url}`, result);
        throw new Error(result.message || "请求失败");
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
const getCurrentUserInfo = () => {
  try {
    const userInfo = taro.Taro.getStorageSync("userInfo");
    return userInfo || null;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};
const getCurrentUserId$1 = () => {
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
const bindPhone = (openid, phone) => __async(exports, null, function* () {
  try {
    const response = yield post("/users/bind-phone", {
      openid,
      phone
    });
    if (response.data) {
      const userInfo = yield fetchUserInfo(phone);
      if (userInfo) {
        setUserInfo(userInfo);
      }
      return response.data;
    }
    throw new Error("手机号绑定失败");
  } catch (error) {
    console.error("手机号绑定失败:", error);
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
        totalVisits: response.data.totalVisits
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
class WalletService {
  /**
   * 获取当前用户ID
   * @returns 用户ID
   */
  getCurrentUserId() {
    return getCurrentUserId$1();
  }
  /**
   * 获取钱包余额
   * @returns 余额信息
   */
  getBalance() {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const response = yield get("/users/wallet/balance", {
          userId
        });
        const balanceInCents = response.data.balance || 0;
        const balanceInYuan = balanceInCents / 100;
        console.log("💰 余额查询:", {
          分: balanceInCents,
          元: balanceInYuan.toFixed(2)
        });
        return balanceInYuan;
      } catch (error) {
        console.error("获取余额失败:", error);
        throw new Error("获取余额失败，请重试");
      }
    });
  }
  /**
   * 获取余额详情（包含统计信息）
   * @returns 余额详情
   */
  getBalanceDetails() {
    return __async(this, null, function* () {
      try {
        const userId = this.getCurrentUserId();
        const response = yield get("/users/wallet/balance", {
          userId
        });
        const data = response.data;
        return {
          balance: data.balance / 100,
          // 分转元
          totalSpent: data.totalSpent / 100,
          // 分转元
          totalVisits: data.totalVisits
        };
      } catch (error) {
        console.error("获取余额详情失败:", error);
        throw new Error("获取余额详情失败，请重试");
      }
    });
  }
  /**
   * 获取充值配置选项
   * @returns 充值配置列表
   */
  getRechargeOptions() {
    return __async(this, null, function* () {
      try {
        const response = yield get("/recharge/configs");
        return response.data.map((option) => __spreadProps(__spreadValues({}, option), {
          amount: option.amount / 100,
          // 转换为元
          bonus: option.bonus / 100
          // 转换为元
        }));
      } catch (error) {
        console.error("获取充值配置失败:", error);
        return this.getDefaultRechargeOptions();
      }
    });
  }
  /**
   * 获取默认充值配置（降级方案）
   * @private
   */
  getDefaultRechargeOptions() {
    return [{
      id: 1,
      amount: 100,
      bonus: 0,
      label: "100元",
      sortOrder: 1
    }, {
      id: 2,
      amount: 200,
      bonus: 0,
      label: "200元",
      sortOrder: 2
    }, {
      id: 3,
      amount: 500,
      bonus: 50,
      label: "500元",
      sortOrder: 3,
      promotionTag: "赠50元"
    }, {
      id: 4,
      amount: 1e3,
      bonus: 100,
      label: "1000元",
      sortOrder: 4,
      promotionTag: "赠100元"
    }, {
      id: 5,
      amount: 2e3,
      bonus: 300,
      label: "2000元",
      sortOrder: 5,
      promotionTag: "赠300元"
    }, {
      id: 6,
      amount: 5e3,
      bonus: 1e3,
      label: "5000元",
      sortOrder: 6,
      promotionTag: "赠1000元",
      isRecommended: true
    }];
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
        const orderData = {
          orderType: "recharge",
          userId,
          userPhone: getCurrentUserPhone(),
          title: bonus > 0 ? `充值${amount}元，赠送${bonus}元` : `充值${amount}元`,
          amount: amount * 100,
          // 转换为分
          paymentMethod: "wechat",
          extraData: {
            bonus: bonus * 100,
            // 转换为分
            actualRecharge: (amount + bonus) * 100
          }
        };
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        return response.data;
      } catch (error) {
        console.error("创建充值订单失败:", error);
        throw new Error(error.message || "创建充值订单失败");
      }
    });
  }
  /**
   * 获取交易记录
   * @param page 页码
   * @param pageSize 每页数量
   * @param type 交易类型（可选）
   * @returns 交易记录列表
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
        return response.data.list.map((item) => __spreadProps(__spreadValues({}, item), {
          amount: item.amount / 100,
          balance: item.balance / 100
        }));
      } catch (error) {
        console.error("获取交易记录失败:", error);
        return [];
      }
    });
  }
  /**
   * 使用余额支付
   * @param orderNo 订单号
   * @param amount 支付金额（元）
   * @returns 支付结果
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
          balance: response.data.balance / 100,
          // 转换为元
          message: "支付成功"
        };
      } catch (error) {
        console.error("余额支付失败:", error);
        throw new Error(error.message || "余额不足或支付失败");
      }
    });
  }
  /**
   * 处理微信支付
   * @param wxPayParams 微信支付参数
   * @returns Promise
   */
  handleWechatPay(wxPayParams) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        taro.Taro.requestPayment({
          timeStamp: wxPayParams.timeStamp,
          nonceStr: wxPayParams.nonceStr,
          package: wxPayParams.package,
          signType: wxPayParams.signType,
          paySign: wxPayParams.paySign,
          success: () => resolve(),
          fail: (err) => reject(new Error(err.errMsg || "支付失败"))
        });
      });
    });
  }
  /**
   * 退款到余额
   * @param orderNo 订单号
   * @param amount 退款金额（元）
   * @param reason 退款原因
   * @returns 退款结果
   */
  refundToBalance(orderNo, amount, reason = "订单退款") {
    return __async(this, null, function* () {
      try {
        const response = yield post("/users/wallet/refund", {
          phone: getCurrentUserPhone(),
          amount: amount * 100,
          // 转换为分
          orderNo,
          description: reason
        }, {
          showLoading: true,
          loadingTitle: "退款中..."
        });
        return {
          success: true,
          balance: response.data.balance / 100,
          // 转换为元
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
const GIFT_CARDS = [{
  id: "member-card",
  type: "member",
  name: "会员礼卡",
  image: "/assets/images/gift/card/member-card.png",
  description: "尊享会员专属优惠",
  features: ["全门店通用", "长期有效", "可累计积分", "享受会员价"],
  terms: "本卡为不记名卡片，请妥善保管"
}, {
  id: "electronic-card",
  type: "electronic",
  name: "电子礼卡",
  image: "/assets/images/gift/card/gift-card.png",
  description: "便捷的电子礼品卡",
  features: ["即买即用", "可转赠好友", "线上购买", "扫码使用"],
  terms: "电子卡有效期为购买之日起一年内"
}];
const PRODUCTS = [{
  id: "pillow",
  name: "护颈助眠小枕",
  image: "/assets/images/gift/product/neck-pillow.png",
  price: 299,
  originalPrice: 399,
  unit: "个",
  description: "人体工学设计，缓解颈部压力",
  features: ["记忆棉材质", "人体工学设计", "可拆洗枕套", "透气排汗"],
  specifications: {
    "材质": "记忆棉+天鹅绒",
    "尺寸": "50cm x 30cm x 10cm",
    "重量": "1.2kg",
    "颜色": "灰色/米色"
  }
}, {
  id: "therapy",
  name: "药食同源理疗包",
  image: "/assets/images/gift/product/health-food.png",
  price: 199,
  originalPrice: 299,
  unit: "套",
  description: "传统中药配方，祛寒除湿",
  features: ["纯中药配方", "热敷理疗", "可重复使用", "便携设计"],
  specifications: {
    "成分": "艾草、生姜、当归等",
    "规格": "单包200g，一套3包",
    "使用方法": "微波加热2-3分钟",
    "有效期": "生产日期起24个月"
  }
}];
const getCurrentUserId = () => {
  return 1;
};
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
   * 创建礼卡购买订单
   */
  static createGiftCardOrder(params) {
    return __async(this, null, function* () {
      try {
        const orderData = {
          orderType: "product",
          userId: getCurrentUserId(),
          title: `电子礼卡 ¥${(params.amount / 100).toFixed(0)}`,
          amount: params.amount * params.quantity,
          paymentMethod: params.paymentMethod,
          extraData: {
            productType: "gift_card",
            cardType: "electronic",
            faceValue: params.amount,
            quantity: params.quantity,
            customMessage: params.customMessage || "世界上最好的爸爸"
          }
        };
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        return response.data;
      } catch (error) {
        console.error("创建礼卡订单失败:", error);
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
          amount: product.price * 100 * params.quantity,
          // 转换为分
          paymentMethod: params.paymentMethod,
          extraData: {
            productType: "merchandise",
            productId: params.productId,
            quantity: params.quantity,
            specifications: product.specifications
          }
        };
        const response = yield post("/orders/create", orderData, {
          showLoading: true,
          loadingTitle: "创建订单中..."
        });
        return response.data;
      } catch (error) {
        console.error("创建商品订单失败:", error);
        throw new Error(error.message || "创建商品订单失败");
      }
    });
  }
  /**
   * 支付订单
   */
  static payOrder(params) {
    return __async(this, null, function* () {
      try {
        const response = yield post("/orders/pay", params, {
          showLoading: true,
          loadingTitle: "支付中..."
        });
        return response.data;
      } catch (error) {
        console.error("支付订单失败:", error);
        throw new Error(error.message || "支付失败");
      }
    });
  }
  /**
   * 处理微信支付
   */
  static handleWechatPay(wxPayParams) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        taro.Taro.requestPayment({
          timeStamp: wxPayParams.timeStamp,
          nonceStr: wxPayParams.nonceStr,
          package: wxPayParams.package,
          signType: wxPayParams.signType,
          paySign: wxPayParams.paySign,
          success: () => {
            resolve();
          },
          fail: (err) => {
            reject(new Error(err.errMsg || "支付失败"));
          }
        });
      });
    });
  }
}
class OrderService {
  /**
   * 获取当前用户信息
   */
  getUserInfo() {
    return {
      userId: getCurrentUserId$1(),
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
      if (order.appointmentDate && order.appointmentTime) {
        const appointmentDateTime = /* @__PURE__ */ new Date(`${order.appointmentDate} ${order.appointmentTime}`);
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
          appointmentTime: params.appointmentTime,
          totalAmount: params.discountPrice || params.price
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
        if (order.amount) {
          order.totalAmount = order.amount / 100;
        }
        if (order.extraData) {
          order.therapistId = order.extraData.therapistId;
          order.therapistName = order.extraData.therapistName;
          order.storeId = order.extraData.storeId;
          order.appointmentDate = order.extraData.appointmentDate;
          order.appointmentTime = order.extraData.startTime;
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
          if (order.amount) {
            order.totalAmount = order.amount / 100;
          }
          if (order.extraData) {
            order.therapistId = order.extraData.therapistId;
            order.therapistName = order.extraData.therapistName;
            order.storeId = order.extraData.storeId;
            order.storeName = order.extraData.storeName;
            order.storeAddress = order.extraData.storeAddress;
            order.appointmentDate = order.extraData.appointmentDate;
            order.appointmentTime = order.extraData.startTime;
            order.duration = order.extraData.duration;
            order.serviceName = order.extraData.serviceName || order.title;
            order.appointmentStatus = order.extraData.appointmentStatus;
          }
          if (!order.therapistAvatar) {
            order.therapistAvatar = "https://img.yzcdn.cn/vant/cat.jpeg";
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
          completed: orders.filter((o) => o.paymentStatus === "paid" && /* @__PURE__ */ new Date(o.appointmentDate + " " + o.appointmentTime) < /* @__PURE__ */ new Date()).length,
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
        pageSize: therapistArray.length
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
        console.log("⚠️ 获取可预约时段API调用失败，返回默认全部可用:", error);
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
          for (let minute = 0; minute < 60; minute += 10) {
            const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            slots.push({
              time,
              available: true,
              status: "available"
            });
          }
        }
        return {
          date,
          slots,
          workTime: {
            start: "09:00",
            end: "21:00"
          }
        };
      }
    });
  }
}
const therapistService = new TherapistService();
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
        if (data && data.data && data.data.list) {
          return data.data;
        } else {
          console.log("⚠️ API不存在，使用mock数据");
          return {
            list: [],
            total: 0,
            page: 1,
            pageSize: 10,
            hasMore: false
          };
        }
      } catch (error) {
        console.log("⚠️ 门店API调用失败，使用mock数据:", error);
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
  // 获取门店详情
  getStoreDetail(storeId) {
    return __async(this, null, function* () {
      try {
        const data = yield request(`/stores/${storeId}`);
        console.log("✅ 门店详情API调用成功:", data);
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
const index$1 = "";
const ShoppingCart = ({
  items,
  therapist,
  onCheckout,
  onMaskClick,
  onContinue,
  hasPendingAction = false,
  onRemoveItem,
  simpleClearMode = false
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
    if (simpleClearMode) {
      if (onMaskClick) {
        onMaskClick();
      }
    } else {
      if (onMaskClick && hasPendingAction) {
        onMaskClick();
      }
    }
    setIsExpanded(false);
  };
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
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
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "expanded-header", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "title", children: [
          "已选推拿师(",
          items.length,
          ")位"
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "action", onClick: handleContinue, children: "继续预约" })
      ] }),
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
const bannerGoodnight = "data:image/jpeg;base64,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";
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
exports.bannerGoodnight = bannerGoodnight;
exports.bindPhone = bindPhone;
exports.checkAndAutoLogin = checkAndAutoLogin;
exports.getCurrentUserInfo = getCurrentUserInfo;
exports.maskPhone = maskPhone;
exports.orderService = orderService;
exports.post = post;
exports.request = request;
exports.reviewService = reviewService;
exports.storeService = storeService;
exports.symptomCategories = symptomCategories;
exports.symptomServices = symptomServices;
exports.therapistService = therapistService;
exports.walletService = walletService;
exports.wechatLogin = wechatLogin;
//# sourceMappingURL=common.js.map
