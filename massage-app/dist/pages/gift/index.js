"use strict";
const taro = require("../../taro.js");
const common = require("../../common.js");
const index = "";
const Gift = () => {
  const giftCards = common.GiftService.getAllGiftCards();
  const handleCardClick = (cardId) => {
    taro.Taro.navigateTo({
      url: `/pages/gift/purchase/index?cardId=${cardId}`
    });
  };
  const handleNuantieClick = () => {
    taro.Taro.navigateTo({
      url: "/pages/gift/nuantie/index"
    });
  };
  const handleAijiuClick = () => {
    taro.Taro.navigateTo({
      url: "/pages/gift/aijiu/index"
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "gift-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "名医堂礼卡" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "gift-cards", children: giftCards.map(
        (card) => /* @__PURE__ */ taro.jsx(
          taro.View,
          {
            className: "gift-card",
            onClick: () => handleCardClick(card.id),
            children: /* @__PURE__ */ taro.jsx(
              taro.Image,
              {
                className: "card-image",
                src: card.image,
                mode: "aspectFill"
              }
            )
          },
          card.id
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "名医堂产品" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "products", children: [
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: "product-card",
            onClick: handleNuantieClick,
            children: [
              /* @__PURE__ */ taro.jsx(
                taro.Image,
                {
                  className: "product-image",
                  src: "https://mingyitang1024.com/static/gift/product/nuantie/yaofu.jpg",
                  mode: "aspectFill"
                }
              ),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: "暖贴" }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-row", children: [
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "price", children: "¥99" }),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "unit", children: "起" })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: "product-card",
            onClick: handleAijiuClick,
            children: [
              /* @__PURE__ */ taro.jsx(
                taro.Image,
                {
                  className: "product-image",
                  src: "https://mingyitang1024.com/static/gift/product/aijiu/xinaitiao.jpg",
                  mode: "aspectFill"
                }
              ),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: "艾条" }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-row", children: [
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "price", children: "¥99" }),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "unit", children: "起" })
                ] })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
};
var config = {
  "usingComponents": {
    "comp": "../../comp"
  }
};
Page(taro.createPageConfig(Gift, "pages/gift/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
