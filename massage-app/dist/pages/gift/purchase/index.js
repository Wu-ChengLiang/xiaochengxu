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
  const router = taro.taroExports.useRouter();
  const { cardId } = router.params;
  const [cardInfo, setCardInfo] = taro.useState(null);
  const [selectedAmount, setSelectedAmount] = taro.useState(1e3);
  const [quantity, setQuantity] = taro.useState(1);
  taro.useEffect(() => {
    console.log("🎁 电子礼卡页面加载");
    console.log("📍 router.params:", { cardId });
    if (cardId) {
      const card = common.GiftService.getGiftCardById(cardId);
      console.log("🔍 查询礼卡结果:", {
        cardId,
        found: !!card,
        card: card ? {
          id: card.id,
          name: card.name,
          image: card.image,
          type: card.type
        } : null
      });
      if (card) {
        setCardInfo(card);
        console.log("✅ 礼卡信息已设置");
      } else {
        console.warn("⚠️ 礼卡未找到:", cardId);
      }
    } else {
      console.warn("⚠️ cardId 未获取到:", cardId);
    }
  }, [cardId]);
  const predefinedAmounts = [
    { value: 1e3, label: "¥1000", bonus: "送100" },
    { value: 3e3, label: "¥3000", bonus: "送500" }
  ];
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  const handlePurchase = () => __async(exports, null, function* () {
    const amount = selectedAmount;
    if (!amount) {
      taro.Taro.showToast({
        title: "请选择面额",
        icon: "none"
      });
      return;
    }
    try {
      const order = yield common.GiftService.createGiftCardOrder({
        cardId,
        amount: amount * 100,
        // 转换为分
        quantity,
        paymentMethod: "wechat",
        customMessage: "世界上最好的爸爸"
      });
      console.log("🎁 订单创建成功，准备支付:", {
        orderNo: order.orderNo,
        amount: amount * quantity,
        quantity
      });
      const paymentSuccess = yield common.paymentService.pay({
        orderNo: order.orderNo,
        amount: amount * quantity * 100,
        // 转换为分
        paymentMethod: "wechat",
        title: `电子礼卡 ¥${amount} × ${quantity}`,
        wxPayParams: order.wxPayParams
        // ✅ 传递微信支付参数
      });
      if (paymentSuccess) {
        taro.Taro.showToast({
          title: "支付成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          taro.Taro.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error("❌ 礼卡购买失败:", error);
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: error.message || "购买失败",
        icon: "none"
      });
    }
  });
  const getTotalPrice = () => {
    return selectedAmount * quantity;
  };
  if (!cardInfo) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "gift-card-purchase", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "gift-card-purchase", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-info-section", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "card-image", children: /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "card-pic",
          src: cardInfo.image,
          mode: "aspectFill"
        }
      ) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-name", children: cardInfo.name }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-desc", children: cardInfo.description })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "features-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "礼卡特色" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "features-list", children: cardInfo.features.map(
        (feature, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "feature-item", children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "check-circle", size: "18", color: "#a40035" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "feature-text", children: feature })
        ] }, index2)
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "请选择面额" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "amount-grid", children: predefinedAmounts.map(
        (item) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `amount-card ${selectedAmount === item.value ? "active" : ""}`,
            onClick: () => handleAmountSelect(item.value),
            children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "amount-header", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "amount", children: item.label }) }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "amount-details", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "bonus", children: item.bonus }) }),
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
              selectedAmount !== item.value && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "24", color: "#a40035" })
            ]
          },
          item.value
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "使用说明" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-content", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-item", children: cardInfo.terms }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-desc", style: { marginTop: "16px" }, children: "返金额说明：" }),
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
  "navigationBarTitleText": "电子礼卡",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(GiftCardPurchase, "pages/gift/purchase/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
