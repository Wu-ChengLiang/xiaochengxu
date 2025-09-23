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
  const [selectedAmount, setSelectedAmount] = taro.useState(0);
  const [selectedBonus, setSelectedBonus] = taro.useState(0);
  const [customAmount, setCustomAmount] = taro.useState("");
  const [loading, setLoading] = taro.useState(false);
  const [rechargeOptions, setRechargeOptions] = taro.useState([]);
  taro.useEffect(() => {
    loadRechargeOptions();
  }, []);
  const loadRechargeOptions = () => __async(exports, null, function* () {
    try {
      const options = yield common.walletService.getRechargeOptions();
      setRechargeOptions(options);
    } catch (error) {
      console.error("获取充值配置失败:", error);
      setRechargeOptions(
        [
          { id: 1, amount: 100, bonus: 0, label: "100元", sortOrder: 1 },
          { id: 2, amount: 200, bonus: 0, label: "200元", sortOrder: 2 },
          { id: 3, amount: 500, bonus: 50, label: "500元", sortOrder: 3 },
          { id: 4, amount: 1e3, bonus: 100, label: "1000元", sortOrder: 4 },
          { id: 5, amount: 2e3, bonus: 300, label: "2000元", sortOrder: 5 },
          { id: 6, amount: 5e3, bonus: 1e3, label: "5000元", sortOrder: 6 }
        ]
      );
    }
  });
  const handleAmountSelect = (amount, bonus = 0) => {
    setSelectedAmount(amount);
    setSelectedBonus(bonus);
    setCustomAmount("");
  };
  const handleCustomAmountChange = (e) => {
    var _a, _b;
    const value = ((_a = e.detail) == null ? void 0 : _a.value) || ((_b = e.target) == null ? void 0 : _b.value) || "";
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(0);
      setSelectedBonus(0);
    }
  };
  const handleRecharge = () => __async(exports, null, function* () {
    var _a;
    const amount = selectedAmount || Number(customAmount);
    const bonus = selectedBonus || 0;
    if (!amount || amount <= 0) {
      taro.Taro.showToast({
        title: "请选择或输入充值金额",
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
      if (order.wxPayParams) {
        yield common.walletService.handleWechatPay(order.wxPayParams);
        taro.Taro.showToast({
          title: "充值成功",
          icon: "success",
          duration: 2e3
        });
        setTimeout(() => {
          taro.Taro.navigateBack();
        }, 2e3);
      } else {
        throw new Error("获取支付参数失败");
      }
    } catch (error) {
      if ((_a = error.message) == null ? void 0 : _a.includes("用户取消")) {
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
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "选择充值金额" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "amount-grid", children: rechargeOptions.map(
        (option) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `amount-card ${selectedAmount === option.amount ? "active" : ""}`,
            onClick: () => handleAmountSelect(option.amount, option.bonus),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "amount", children: [
                "¥",
                option.amount
              ] }),
              option.bonus > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "bonus", children: [
                "赠送",
                option.bonus,
                "元"
              ] })
            ]
          },
          option.id || option.amount
        )
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "custom-amount", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "其他金额" }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "input-wrapper", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "prefix", children: "¥" }),
          /* @__PURE__ */ taro.jsx(
            "input",
            {
              className: "input",
              type: "number",
              placeholder: "请输入充值金额",
              value: customAmount,
              onInput: handleCustomAmountChange
            }
          )
        ] })
      ] })
    ] }),
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
  "navigationBarTitleText": "余额充值"
};
Page(taro.createPageConfig(Recharge, "pages/mine/recharge/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
