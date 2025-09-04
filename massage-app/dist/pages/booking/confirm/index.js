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
  const timerRef = taro.useRef(null);
  taro.useEffect(() => {
    try {
      const items = JSON.parse(decodeURIComponent(params.items || "[]"));
      setCartItems(items);
      fetchTherapistAndStoreInfo();
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
              title: "订单已超时",
              content: "请重新选择预约时间",
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
  const fetchTherapistAndStoreInfo = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      const therapistData = {
        id: params.therapistId,
        name: "王志香",
        avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
        rating: 4.8,
        serviceCount: 10109
      };
      const storeData = {
        id: params.storeId,
        name: "上海万象城店",
        address: "闵行区吴中路1599号万象城L501b（电影院门口）",
        distance: 8.8
      };
      setTherapistInfo(therapistData);
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
    return cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  };
  const handlePayment = () => __async(exports, null, function* () {
    const orderNo = `ORD${Date.now()}`;
    taro.Taro.showLoading({
      title: "正在支付..."
    });
    setTimeout(() => {
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: "支付成功",
        icon: "success",
        duration: 1500
      });
      setTimeout(() => {
        taro.Taro.redirectTo({
          url: `/pages/booking/success/index?orderNo=${orderNo}`
        });
      }, 1500);
    }, 2e3);
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
      /* @__PURE__ */ taro.jsx(taro.View, { className: "payment-methods", children: /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: `payment-method ${paymentMethod === "wechat" ? "active" : ""}`,
          onClick: () => setPaymentMethod("wechat"),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-icon", children: "✅" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "微信支付" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: `check-icon ${paymentMethod === "wechat" ? "checked" : ""}` })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥ ",
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
