"use strict";
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
const taro = require("../../../taro.js");
const common = require("../../../common.js");
const index = "";
const OrderConfirmPage = () => {
  const router = taro.taroExports.useRouter();
  const params = router.params;
  const [cartItems, setCartItems] = taro.useState([]);
  const [therapistInfo, setTherapistInfo] = taro.useState(null);
  const [storeInfo, setStoreInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [countdown, setCountdown] = taro.useState(180);
  const [paymentMethod, setPaymentMethod] = taro.useState("wechat");
  const [userBalance, setUserBalance] = taro.useState(0);
  const [balanceLoading, setBalanceLoading] = taro.useState(false);
  const [userDiscountRate, setUserDiscountRate] = taro.useState(null);
  const [hasVoucher, setHasVoucher] = taro.useState(false);
  const timerRef = taro.useRef(null);
  taro.useEffect(() => {
    try {
      const items = JSON.parse(decodeURIComponent(params.items || "[]"));
      setCartItems(items);
      fetchTherapistAndStoreInfo();
      fetchUserBalance();
      fetchUserDiscount();
    } catch (error) {
      taro.Taro.showToast({
        title: "数据解析失败",
        icon: "none"
      });
      setTimeout(() => taro.Taro.navigateBack(), 1500);
    }
  }, [params]);
  taro.useEffect(() => {
    if (!loading && cartItems.length > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            taro.Taro.showModal({
              title: "支付超时了呦",
              content: "快快重新下单吧~",
              showCancel: false,
              success: () => {
                taro.Taro.navigateBack();
              }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, cartItems]);
  const fetchUserDiscount = () => __async(exports, null, function* () {
    try {
      const userInfo = common.getCurrentUserInfo();
      if (userInfo && userInfo.discountRate) {
        setUserDiscountRate(userInfo.discountRate);
        const vouchers = yield common.voucherService.getMyVouchers();
        setHasVoucher(vouchers.length > 0);
      }
    } catch (error) {
      console.error("获取用户折扣信息失败:", error);
    }
  });
  const fetchUserBalance = () => __async(exports, null, function* () {
    try {
      setBalanceLoading(true);
      const balance = yield common.walletService.getBalance();
      setUserBalance(balance);
      const totalPrice = getTotalPrice();
      if (balance >= totalPrice) {
        setPaymentMethod("balance");
      }
    } catch (error) {
      console.error("获取余额失败:", error);
      setUserBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  });
  const fetchTherapistAndStoreInfo = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      if (params.therapistId) {
        const therapistRes = yield common.therapistService.getTherapistDetail(params.therapistId);
        setTherapistInfo(therapistRes.data);
      }
      const storeRes = yield common.storeService.getStoreDetail(params.storeId);
      const storeData = storeRes.data;
      setStoreInfo(storeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      taro.Taro.showToast({
        title: "获取信息失败",
        icon: "none"
      });
    }
  });
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")}日`;
  };
  const calculateEndTime = (time, duration) => {
    const [hour, minute] = time.split(":").map(Number);
    const endMinute = minute + duration;
    const endHour = hour + Math.floor(endMinute / 60);
    const finalMinute = endMinute % 60;
    return `${endHour}:${finalMinute.toString().padStart(2, "0")}`;
  };
  const getTotalPrice = () => {
    const originalTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    if (userDiscountRate && userDiscountRate < 1) {
      const discountInfo = common.calculateDiscountPrice(originalTotal, userDiscountRate);
      return discountInfo.finalPrice;
    }
    return cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  };
  const getOriginalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };
  const getSavedAmount = () => {
    const originalTotal = getOriginalPrice();
    const finalTotal = getTotalPrice();
    return originalTotal - finalTotal;
  };
  const getDiscountDisplay = () => {
    if (userDiscountRate && userDiscountRate < 1) {
      const percentage = Math.round(userDiscountRate * 100);
      return `${percentage}折`;
    }
    return "";
  };
  const isBalanceSufficient = () => {
    const totalPrice = getTotalPrice();
    return userBalance >= totalPrice;
  };
  const handlePaymentMethodChange = (method) => {
    if (method === "balance" && !isBalanceSufficient()) {
      taro.Taro.showToast({
        title: "余额不足，请充值或使用其他支付方式",
        icon: "none",
        duration: 2e3
      });
      return;
    }
    setPaymentMethod(method);
  };
  const handlePayment = () => __async(exports, null, function* () {
    const isSymptomMode = params.from === "symptom";
    const needTherapistInfo = !isSymptomMode && !therapistInfo;
    if (cartItems.length === 0 || needTherapistInfo || !storeInfo) {
      taro.Taro.showToast({
        title: "订单信息不完整",
        icon: "none"
      });
      return;
    }
    if (paymentMethod === "balance" && !isBalanceSufficient()) {
      taro.Taro.showToast({
        title: "余额不足，请充值或使用其他支付方式",
        icon: "none",
        duration: 2e3
      });
      return;
    }
    try {
      taro.Taro.showLoading({
        title: "创建订单..."
      });
      const firstItem = cartItems[0];
      console.log("🛒 购物车第一个项目:", firstItem);
      console.log("🛒 firstItem.therapistId:", firstItem.therapistId);
      console.log("🛒 params.therapistId:", params.therapistId);
      console.log("🛒 params.from:", params.from);
      const orderParams = {
        therapistId: firstItem.therapistId || params.therapistId || "symptom-mode",
        // 优先使用购物车中的技师ID
        storeId: params.storeId,
        serviceId: firstItem.serviceId,
        serviceName: firstItem.serviceName,
        duration: firstItem.duration,
        price: firstItem.price,
        discountPrice: firstItem.discountPrice,
        appointmentDate: firstItem.date,
        appointmentTime: firstItem.time,
        therapistName: firstItem.therapistName,
        therapistAvatar: firstItem.therapistAvatar || (therapistInfo == null ? void 0 : therapistInfo.avatar)
      };
      console.log("📦 最终的订单参数:", orderParams);
      console.log("📦 therapistId将要传递的值:", orderParams.therapistId);
      const result = yield common.orderService.createAppointmentOrder(orderParams);
      const order = result.order;
      console.log("✅ 订单创建成功:", result);
      console.log("✅ 订单号:", order.orderNo);
      console.log("✅ 支付参数:", order.wxPayParams);
      taro.Taro.hideLoading();
      if (!order || !order.orderNo) {
        throw new Error("订单创建失败，未返回订单号");
      }
      if (paymentMethod === "wechat") {
        if (!order.wxPayParams) {
          throw new Error("微信支付参数缺失，请检查用户登录状态或尝试余额支付");
        }
        console.log("✅ 微信支付参数完整性检查:", {
          timeStamp: !!order.wxPayParams.timeStamp,
          nonceStr: !!order.wxPayParams.nonceStr,
          package: !!order.wxPayParams.package,
          signType: !!order.wxPayParams.signType,
          paySign: !!order.wxPayParams.paySign
        });
      }
      const paymentSuccess = yield common.paymentService.pay({
        orderNo: order.orderNo,
        amount: (order.totalAmount || getTotalPrice()) * 100,
        // ✅ getTotalPrice()返回元，需要乘以100转为分
        paymentMethod,
        title: `${firstItem.serviceName} - ${firstItem.therapistName}`,
        wxPayParams: order.wxPayParams
        // 传递后端返回的微信支付参数
      });
      if (paymentSuccess) {
        if (paymentMethod === "balance") {
          yield fetchUserBalance();
        }
        setTimeout(() => {
          taro.Taro.redirectTo({
            url: `/pages/booking/success/index?orderNo=${order.orderNo}`
          });
        }, 1500);
      }
    } catch (error) {
      console.error("❌ 支付流程错误:", error);
      taro.Taro.hideLoading();
      const errorMessage = error.message || error.errMsg || "订单创建失败";
      taro.Taro.showModal({
        title: "支付失败",
        content: errorMessage,
        showCancel: false,
        confirmText: "知道了"
      });
    }
  });
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "order-confirm-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "order-confirm-page", scrollY: true, children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: storeInfo == null ? void 0 : storeInfo.name }),
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "store-distance", children: [
        "📍 ",
        storeInfo == null ? void 0 : storeInfo.distance,
        "km"
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "booking-info", children: cartItems.map(
      (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "booking-item", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "therapist-avatar",
            src: item.therapistAvatar || (therapistInfo == null ? void 0 : therapistInfo.avatar)
          }
        ),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "booking-details", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-name", children: item.therapistName }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-time", children: [
            formatDate(item.date),
            " ",
            item.time,
            " 至 ",
            calculateEndTime(item.time, item.duration)
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "service-name", children: item.serviceName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-price", children: [
          "¥",
          item.discountPrice || item.price
        ] })
      ] }, index2)
    ) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "refund-policy", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "policy-title", children: "退单说明" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "policy-list", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 下单15分钟内或距订单开始时间>6小时退单，退100%" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 距订单开始前<6小时退单，退实付金额90%" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 订单时间开始后退单，退实付金额80%" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "customer-note", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "note-title", children: "客户备注" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "note-hint", children: "您对茶水、房间、按摩服等是否有特殊需求，我们将提前为您做好准备" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "支付方式" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-methods", children: [
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `payment-method ${paymentMethod === "balance" ? "active" : ""} ${!isBalanceSufficient() ? "disabled" : ""}`,
            onClick: () => handlePaymentMethodChange("balance"),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-icon", children: "💰" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "余额支付" }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "balance-amount", children: [
                  balanceLoading ? "加载中..." : `¥${userBalance.toFixed(2)}`,
                  !isBalanceSufficient() && !balanceLoading && /* @__PURE__ */ taro.jsx(taro.Text, { className: "insufficient", children: " (余额不足)" })
                ] })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: `check-icon ${paymentMethod === "balance" ? "checked" : ""}` })
            ]
          }
        ),
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `payment-method ${paymentMethod === "wechat" ? "active" : ""}`,
            onClick: () => handlePaymentMethodChange("wechat"),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-icon", children: "💚" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "微信支付" })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: `check-icon ${paymentMethod === "wechat" ? "checked" : ""}` })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
        userDiscountRate && userDiscountRate < 1 && getSavedAmount() > 0 ? /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-with-discount", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "discount-info", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-tag", children: getDiscountDisplay() }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "saved-amount", children: [
              "已优惠 ¥",
              getSavedAmount()
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-display", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
              "¥",
              getOriginalPrice()
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
              "¥",
              getTotalPrice()
            ] })
          ] })
        ] }) : /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥",
          getTotalPrice()
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "countdown", children: [
          "支付倒计时: ",
          formatCountdown(countdown)
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "pay-button", onClick: handlePayment, children: "去支付" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "订单确认",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(OrderConfirmPage, "pages/booking/confirm/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
