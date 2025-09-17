<<<<<<< HEAD
"use strict";
const taro = require("../../taro.js");
const common = require("../../common.js");
const index = "";
const Gift = () => {
  const giftCards = common.getAllGiftCards();
  const products = common.getAllProducts();
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
=======
"use strict";const e=require("../../taro.js"),s=require("../../common.js"),i="",t=()=>{const i=s.GiftService.getAllGiftCards(),t=s.GiftService.getAllProducts(),a=s=>{e.Taro.navigateTo({url:`/pages/gift/card-detail/index?id=${s}`})},r=s=>{e.Taro.navigateTo({url:`/pages/gift/product-detail/index?id=${s}`})};return e.jsxRuntimeExports.jsxs(e.View,{className:"gift-page",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u5e38\u4e50\u793c\u5361"}),e.jsxRuntimeExports.jsx(e.View,{className:"gift-cards",children:i.map(s=>e.jsxRuntimeExports.jsx(e.View,{className:"gift-card",onClick:()=>a(s.id),children:e.jsxRuntimeExports.jsx(e.Image,{className:"card-image",src:s.image,mode:"aspectFill"})},s.id))})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u5e38\u4e50\u5468\u8fb9"}),e.jsxRuntimeExports.jsx(e.View,{className:"products",children:t.map(s=>e.jsxRuntimeExports.jsxs(e.View,{className:"product-card",onClick:()=>r(s.id),children:[e.jsxRuntimeExports.jsx(e.Image,{className:"product-image",src:s.image,mode:"aspectFill"}),e.jsxRuntimeExports.jsxs(e.View,{className:"product-info",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"product-name",children:s.name}),e.jsxRuntimeExports.jsxs(e.View,{className:"price-row",children:[e.jsxRuntimeExports.jsxs(e.Text,{className:"price",children:["\xa5",s.price.toFixed(2)]}),e.jsxRuntimeExports.jsx(e.Text,{className:"unit",children:"\u8d77"})]})]})]},s.id))})]})]})};var a={};Page(e.createPageConfig(t,"pages/gift/index",{root:{cn:[]}},a||{}));
>>>>>>> recovery-branch
