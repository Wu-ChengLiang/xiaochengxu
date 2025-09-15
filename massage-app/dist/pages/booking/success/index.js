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
const vendors = require("../../../vendors.js");
const common = require("../../../common.js");
const index = "";
const BookingSuccessPage = () => {
  const router = taro.taroExports.useRouter();
  const { orderNo } = router.params;
  const [orderInfo, setOrderInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    fetchOrderDetail();
  }, [orderNo]);
  const fetchOrderDetail = () => __async(exports, null, function* () {
    if (!orderNo) {
      taro.Taro.showToast({
        title: "订单号缺失",
        icon: "none"
      });
      setTimeout(() => {
        taro.Taro.reLaunch({ url: "/pages/appointment/index" });
      }, 1500);
      return;
    }
    try {
      const order = yield common.orderService.getOrderDetail(orderNo);
      setOrderInfo(order);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      taro.Taro.showToast({
        title: "获取订单失败",
        icon: "none"
      });
    }
  });
  const handleViewOrders = () => {
    taro.Taro.redirectTo({
      url: "/pages/order/list/index"
    });
  };
  const handleBackHome = () => {
    taro.Taro.switchTab({
      url: "/pages/appointment/index"
    });
  };
  const generateQRCodeUrl = (orderNo2) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNo2}`;
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "success-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "success-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "success-header", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "success-icon-wrapper", children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "check-circle", size: "60", color: "#52c41a" }) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "success-title", children: "支付成功" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "success-subtitle", children: "您已成功预约，请准时到店" })
    ] }),
    orderInfo && /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-card", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "门店" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.storeName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "推拿师" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.therapistName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "服务项目" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.serviceName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "预约时间" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "value", children: [
            orderInfo.appointmentDate,
            " ",
            orderInfo.appointmentTime
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "订单金额" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "value price", children: [
            "¥",
            orderInfo.totalAmount
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "qrcode-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-title", children: "到店核销码" }),
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "qrcode-image",
            src: generateQRCodeUrl(orderInfo.orderNo),
            mode: "aspectFit"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-no", children: orderInfo.orderNo }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-tip", children: "请向门店工作人员出示此二维码" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "action-buttons", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "button-group", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "button secondary", onClick: handleBackHome, children: "返回首页" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "button primary", onClick: handleViewOrders, children: "查看订单" })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-title", children: "温馨提示" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips-list", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 请在预约时间前10分钟到店" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 如需取消订单，请在服务开始前6小时操作" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 到店后请向前台出示核销二维码" })
      ] })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "支付成功",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(BookingSuccessPage, "pages/booking/success/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
