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
const Recharge = () => {
  const [customAmount, setCustomAmount] = taro.useState("");
  const [loading, setLoading] = taro.useState(false);
  const handleCustomAmountChange = (e) => {
    var _a, _b;
    const value = ((_a = e.detail) == null ? void 0 : _a.value) || ((_b = e.target) == null ? void 0 : _b.value) || "";
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };
  const handleRecharge = () => __async(exports, null, function* () {
    var _a, _b, _c;
    const amount = Number(customAmount);
    const bonus = 0;
    if (!amount || amount <= 0) {
      taro.Taro.showToast({
        title: "请输入有效的充值金额",
        icon: "none"
      });
      return;
    }
    if (amount > 5e4) {
      taro.Taro.showToast({
        title: "单次充值金额不能超过5万元",
        icon: "none"
      });
      return;
    }
    setLoading(true);
    try {
      const order = yield common.walletService.createRechargeOrder(amount, bonus);
      console.log("💰 充值订单创建成功:", order);
      console.log("💰 订单号:", order.orderNo);
      console.log("💰 订单金额:", {
        分: order.amount,
        元: (order.amount / 100).toFixed(2)
      });
      console.log("💰 支付参数:", order.wxPayParams);
      if ((_a = order.wxPayParams) == null ? void 0 : _a.package) {
        console.log("💰 微信支付 package 参数:", order.wxPayParams.package);
      }
      if (order.wxPayParams) {
        const finalAmount = order.amount || amount * 100;
        console.log("💰 最终支付金额:", {
          分: finalAmount,
          元: (finalAmount / 100).toFixed(2),
          源: order.amount ? "来自订单" : "来自前端转换"
        });
        const paymentSuccess = yield common.paymentService.pay({
          orderNo: order.orderNo,
          amount: finalAmount,
          // 使用订单中的金额（应该已是分）
          paymentMethod: "wechat",
          title: `充值${amount}元${bonus > 0 ? `(赠${bonus}元)` : ""}`,
          wxPayParams: order.wxPayParams
        });
        if (paymentSuccess) {
          taro.Taro.showToast({
            title: "充值成功",
            icon: "success",
            duration: 2e3
          });
          setTimeout(() => {
            taro.Taro.navigateBack();
          }, 2e3);
        }
      } else {
        throw new Error("获取支付参数失败");
      }
    } catch (error) {
      if (((_b = error.message) == null ? void 0 : _b.includes("用户取消")) || ((_c = error.errMsg) == null ? void 0 : _c.includes("cancel"))) {
        taro.Taro.showToast({
          title: "支付已取消",
          icon: "none"
        });
      } else {
        taro.Taro.showToast({
          title: error.message || "充值失败，请重试",
          icon: "none"
        });
      }
    } finally {
      setLoading(false);
    }
  });
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "recharge-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "amount-section", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "custom-amount", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "请输入充值金额" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "input-wrapper", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "prefix", children: "¥" }),
        /* @__PURE__ */ taro.jsx(
          "input",
          {
            className: "input",
            type: "number",
            placeholder: "请输入充值金额（单位：元）",
            value: customAmount,
            onInput: handleCustomAmountChange
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "充值说明" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips-list", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "dot", children: "•" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "text", children: "充值金额将实时到账，可用于支付推拿服务" })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "dot", children: "•" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "text", children: "余额不支持提现，请合理充值" })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "dot", children: "•" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "text", children: "充值赠送金额与本金同等使用" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "bottom-bar", children: /* @__PURE__ */ taro.jsxs(
      taro.Button,
      {
        className: "recharge-btn",
        onClick: handleRecharge,
        disabled: loading,
        children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "credit-card", size: "20" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { children: "立即充值" })
        ]
      }
    ) })
  ] });
};
var config = {
  "navigationBarTitleText": "余额充值",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(Recharge, "pages/mine/recharge/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
