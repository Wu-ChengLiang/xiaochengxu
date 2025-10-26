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
  const [userBalance, setUserBalance] = taro.useState(0);
  const [balanceLoading, setBalanceLoading] = taro.useState(false);
  const totalAmount = Number(amount) * Number(quantity);
  taro.useEffect(() => {
    fetchUserBalance();
  }, []);
  const fetchUserBalance = () => __async(exports, null, function* () {
    try {
      setBalanceLoading(true);
      const balance = yield common.walletService.getBalance();
      setUserBalance(balance);
      if (balance >= totalAmount) {
        setPaymentMethod("balance");
      }
    } catch (error) {
      console.error("获取余额失败:", error);
      setUserBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  });
  const isBalanceSufficient = () => {
    return userBalance >= totalAmount;
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
    if (!orderNo) {
      taro.Taro.showToast({
        title: "订单信息错误",
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
      console.log("🎁 开始礼卡订单支付:", {
        orderNo,
        paymentMethod,
        totalAmount
      });
      const paymentSuccess = yield common.paymentService.pay({
        orderNo,
        amount: totalAmount * 100,
        // 转换为分
        paymentMethod,
        title: `电子礼卡 ¥${amount} × ${quantity}`
      });
      if (paymentSuccess) {
        if (paymentMethod === "balance") {
          yield fetchUserBalance();
        }
        setTimeout(() => {
          taro.Taro.navigateBack({ delta: 2 });
        }, 1500);
      }
    } catch (error) {
      console.error("❌ 礼卡支付流程错误:", error);
      taro.Taro.hideLoading();
      const errorMessage = error.message || error.errMsg || "支付失败";
      taro.Taro.showModal({
        title: "支付失败",
        content: errorMessage,
        showCancel: false,
        confirmText: "知道了"
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
              src: "https://mingyitang1024.com/static/card/gift-card.png",
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
          className: `payment-method ${paymentMethod === "balance" ? "selected" : ""} ${!isBalanceSufficient() ? "disabled" : ""}`,
          onClick: () => handlePaymentMethodChange("balance"),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
              /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "money", size: "20", color: "#FF6B00" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "余额支付" }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "balance-amount", children: [
                balanceLoading ? "加载中..." : `¥${userBalance.toFixed(2)}`,
                !isBalanceSufficient() && !balanceLoading && /* @__PURE__ */ taro.jsx(taro.Text, { className: "insufficient", children: " (余额不足)" })
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(
              vendors.AtIcon,
              {
                value: paymentMethod === "balance" ? "check-circle" : "circle",
                size: "20",
                color: paymentMethod === "balance" ? "#a40035" : "#999"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: `payment-method ${paymentMethod === "wechat" ? "selected" : ""}`,
          onClick: () => handlePaymentMethodChange("wechat"),
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
  "navigationBarTitleText": "订单确认",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(OrderConfirm, "pages/gift/order-confirm/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
