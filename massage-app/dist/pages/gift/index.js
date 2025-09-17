"use strict";
const taro = require("../../taro.js");
const common = require("../../common.js");
const index = "";
const Gift = () => {
  const giftCards = common.GiftService.getAllGiftCards();
  const products = common.GiftService.getAllProducts();
  const handleCardClick = (cardId) => {
    taro.Taro.navigateTo({
      url: `/pages/gift/card-detail/index?id=${cardId}`
    });
  };
  const handleProductClick = (productId) => {
    taro.Taro.navigateTo({
      url: `/pages/gift/product-detail/index?id=${productId}`
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "gift-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "常乐礼卡" }),
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
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "常乐周边" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "products", children: products.map(
        (product) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: "product-card",
            onClick: () => handleProductClick(product.id),
            children: [
              /* @__PURE__ */ taro.jsx(
                taro.Image,
                {
                  className: "product-image",
                  src: product.image,
                  mode: "aspectFill"
                }
              ),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: product.name }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-row", children: [
                  /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
                    "¥",
                    product.price.toFixed(2)
                  ] }),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "unit", children: "起" })
                ] })
              ] })
            ]
          },
          product.id
        )
      ) })
    ] })
  ] });
};
var config = {};
Page(taro.createPageConfig(Gift, "pages/gift/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
