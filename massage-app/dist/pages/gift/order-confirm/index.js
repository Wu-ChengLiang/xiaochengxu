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
const OrderConfirm = () => {
  const router = taro.taroExports.useRouter();
  const { orderNo, amount, quantity } = router.params;
  const [paymentMethod, setPaymentMethod] = taro.useState("wechat");
  const totalAmount = Number(amount) * Number(quantity);
  const handlePayment = () => __async(exports, null, function* () {
    if (!orderNo) {
      taro.Taro.showToast({
        title: "订单信息错误",
        icon: "none"
      });
      return;
    }
    try {
      taro.Taro.showLoading({ title: "支付中..." });
      const result = yield common.GiftService.payOrder({
        orderNo,
        paymentMethod
      });
      taro.Taro.hideLoading();
      if (result.paymentMethod === "wechat" && result.wxPayParams) {
        yield common.GiftService.handleWechatPay(result.wxPayParams);
      }
      taro.Taro.showToast({
        title: "支付成功",
        icon: "success",
        duration: 2e3
      });
      setTimeout(() => {
        taro.Taro.navigateBack({ delta: 2 });
      }, 2e3);
    } catch (error) {
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: error.message || "支付失败",
        icon: "none"
      });
    }
  });
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-confirm", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-info", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "电子礼卡" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-item", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-preview", children: [
          /* @__PURE__ */ taro.jsx(
            taro.Image,
            {
              className: "card-thumb",
              src: "/assets/images/gift/card/gift-card.png",
              mode: "aspectFill"
            }
          ),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-badge", children: [
            /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "tag", size: "12", color: "#fff" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { children: "世界上最好的爸爸" })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-details", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-name", children: "电子礼卡" }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-quantity", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
              "¥ ",
              amount
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "quantity", children: [
              "×",
              quantity
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "支付方式" }),
      /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: `payment-method ${paymentMethod === "wechat" ? "selected" : ""}`,
          onClick: () => setPaymentMethod("wechat"),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
              /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "sketch", size: "20", color: "#1AAD19" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "微信支付" })
            ] }),
            /* @__PURE__ */ taro.jsx(
              vendors.AtIcon,
              {
                value: paymentMethod === "wechat" ? "check-circle" : "circle",
                size: "20",
                color: paymentMethod === "wechat" ? "#a40035" : "#999"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "total-amount", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "amount-symbol", children: "¥" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "amount-value", children: totalAmount })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "pay-btn", onClick: handlePayment, children: "去支付" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "订单确认"
};
Page(taro.createPageConfig(OrderConfirm, "pages/gift/order-confirm/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
