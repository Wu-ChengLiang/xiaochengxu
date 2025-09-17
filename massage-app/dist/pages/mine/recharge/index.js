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
  const [customAmount, setCustomAmount] = taro.useState("");
  const [loading, setLoading] = taro.useState(false);
  const rechargeOptions = common.walletService.getRechargeOptions();
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };
  const handleCustomAmountChange = (e) => {
    var _a, _b;
    const value = ((_a = e.detail) == null ? void 0 : _a.value) || ((_b = e.target) == null ? void 0 : _b.value) || "";
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(0);
    }
  };
  const handleRecharge = () => __async(exports, null, function* () {
    const amount = selectedAmount || Number(customAmount);
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
      taro.Taro.showLoading({ title: "正在支付..." });
      yield new Promise((resolve) => setTimeout(resolve, 1500));
      const option = rechargeOptions.find((opt) => opt.amount === amount);
      const bonus = (option == null ? void 0 : option.bonus) || 0;
      const totalAmount = amount + bonus;
      const result = yield common.walletService.recharge(
        totalAmount,
        bonus > 0 ? `充值${amount}元，赠送${bonus}元` : `充值${amount}元`
      );
      taro.Taro.hideLoading();
      if (result.success) {
        taro.Taro.showToast({
          title: "充值成功",
          icon: "success",
          duration: 2e3
        });
        setTimeout(() => {
          taro.Taro.navigateBack();
        }, 2e3);
      } else {
        taro.Taro.showToast({
          title: result.message || "充值失败",
          icon: "none"
        });
      }
    } catch (error) {
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: "充值失败，请重试",
        icon: "none"
      });
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
            onClick: () => handleAmountSelect(option.amount),
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
          option.amount
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
