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
const GiftCardPurchase = () => {
  const [selectedAmount, setSelectedAmount] = taro.useState(200);
  const [customAmount, setCustomAmount] = taro.useState(0);
  const [quantity, setQuantity] = taro.useState(1);
  const predefinedAmounts = [
    { value: 200, discount: null },
    { value: 500, discount: 50 },
    { value: 1e3, discount: 100 },
    { value: 2e3, discount: 200 }
  ];
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(0);
  };
  const handleCustomAmount = () => {
    setSelectedAmount(0);
  };
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  const handlePurchase = () => __async(exports, null, function* () {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      taro.Taro.showToast({
        title: "请选择或输入金额",
        icon: "none"
      });
      return;
    }
    try {
      taro.Taro.showLoading({ title: "创建订单..." });
      const order = yield common.GiftService.createGiftCardOrder({
        amount: amount * 100,
        // 转换为分
        quantity,
        paymentMethod: "wechat",
        customMessage: "世界上最好的爸爸"
      });
      taro.Taro.hideLoading();
      taro.Taro.navigateTo({
        url: `/pages/gift/order-confirm/index?orderNo=${order.orderNo}&amount=${amount}&quantity=${quantity}`
      });
    } catch (error) {
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: error.message || "创建订单失败",
        icon: "none"
      });
    }
  });
  const getTotalPrice = () => {
    const amount = selectedAmount || customAmount || 0;
    return amount * quantity;
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "gift-card-purchase", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-preview", children: [
      /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "card-image",
          src: "/assets/images/gift/card/gift-card.png",
          mode: "aspectFit"
        }
      ),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-title", children: "世界上" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-subtitle", children: "最好的爸爸" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-label", children: "HEALTH CARD" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "panda-illustration" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "brand-tag", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "常乐" }) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "diy-button", children: "DIY自定义" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "请选择面额" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-grid", children: [
        predefinedAmounts.map(
          (item) => /* @__PURE__ */ taro.jsxs(
            taro.View,
            {
              className: `amount-card ${selectedAmount === item.value ? "active" : ""}`,
              onClick: () => handleAmountSelect(item.value),
              children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "amount", children: [
                  "¥",
                  item.value
                ] }),
                item.discount && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "discount", children: [
                  "返余额",
                  item.discount,
                  ".00元"
                ] }),
                selectedAmount === item.value && /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-control", children: [
                  /* @__PURE__ */ taro.jsx(
                    vendors.AtIcon,
                    {
                      value: "subtract-circle",
                      size: "20",
                      color: "#999",
                      onClick: (e) => {
                        e.stopPropagation();
                        if (quantity > 1)
                          handleQuantityChange(quantity - 1);
                      }
                    }
                  ),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity", children: quantity }),
                  /* @__PURE__ */ taro.jsx(
                    vendors.AtIcon,
                    {
                      value: "add-circle",
                      size: "20",
                      color: "#a40035",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleQuantityChange(quantity + 1);
                      }
                    }
                  )
                ] }),
                !item.discount && selectedAmount !== item.value && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "24", color: "#a40035" })
              ]
            },
            item.value
          )
        ),
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `amount-card custom ${selectedAmount === 0 && customAmount > 0 ? "active" : ""}`,
            onClick: handleCustomAmount,
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "custom-label", children: "自定义金额" }),
              selectedAmount === 0 && /* @__PURE__ */ taro.jsx(
                vendors.AtInputNumber,
                {
                  min: 1,
                  max: 1e4,
                  step: 1,
                  value: customAmount,
                  onChange: (value) => setCustomAmount(value)
                }
              ),
              selectedAmount !== 0 && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "24", color: "#999" })
            ]
          }
        ),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-card bulk", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "bulk-label", children: "礼卡集采" }),
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "20", color: "#999" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "使用规则" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-content", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-desc", children: "返金额说明：" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-item", children: "(1) 电子卡返余额在礼卡分享成功后，自动充值至购买人的常乐推拿会员余额中。" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "purchase-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "shopping-bag-2", size: "24", color: "#a40035" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥ ",
          getTotalPrice()
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "quantity-badge", children: quantity })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "purchase-btn", onClick: handlePurchase, children: "去结算" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "电子礼卡"
};
Page(taro.createPageConfig(GiftCardPurchase, "pages/gift/purchase/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
