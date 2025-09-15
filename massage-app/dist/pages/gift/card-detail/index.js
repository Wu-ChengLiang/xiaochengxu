"use strict";
const taro = require("../../../taro.js");
const vendors = require("../../../vendors.js");
const common = require("../../../common.js");
const index = "";
const CardDetail = () => {
  const router = taro.taroExports.useRouter();
  const { id } = router.params;
  const [cardInfo, setCardInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    if (id) {
      const card = common.getGiftCardById(id);
      if (card) {
        setCardInfo(card);
      }
      setLoading(false);
    }
  }, [id]);
  const handlePurchase = () => {
    taro.Taro.navigateTo({
      url: "/pages/gift/purchase/index"
    });
  };
  const handleGift = () => {
    taro.Taro.showToast({
      title: "功能开发中",
      icon: "none"
    });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "card-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (!cardInfo) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "card-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "empty", children: "礼卡不存在" }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-detail-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "card-display", children: /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "card-image",
        src: cardInfo.image,
        mode: "aspectFill"
      }
    ) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-info", children: [
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
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "terms-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "使用须知" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "terms-text", children: cardInfo.terms })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.Button, { className: "action-btn gift-btn", onClick: handleGift, children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "gift", size: "20" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { children: "赠送好友" })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.Button, { className: "action-btn purchase-btn", onClick: handlePurchase, children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "shopping-cart", size: "20" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { children: "立即购买" })
      ] })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "礼卡详情"
};
Page(taro.createPageConfig(CardDetail, "pages/gift/card-detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
