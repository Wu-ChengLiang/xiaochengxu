"use strict";
const taro = require("../../../taro.js");
const vendors = require("../../../vendors.js");
const common = require("../../../common.js");
const index = "";
const ProductDetail = () => {
  const router = taro.taroExports.useRouter();
  const { id } = router.params;
  const [productInfo, setProductInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [quantity, setQuantity] = taro.useState(1);
  taro.useEffect(() => {
    if (id) {
      const product = common.getProductById(id);
      if (product) {
        setProductInfo(product);
      }
      setLoading(false);
    }
  }, [id]);
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleAddToCart = () => {
    taro.Taro.showToast({
      title: "功能开发中",
      icon: "none"
    });
  };
  const handleBuyNow = () => {
    taro.Taro.showToast({
      title: "功能开发中",
      icon: "none"
    });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "product-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (!productInfo) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "product-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "empty", children: "商品不存在" }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-detail-page", children: [
    /* @__PURE__ */ taro.jsx(taro.Swiper, { className: "product-swiper", circular: true, autoplay: true, children: /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "product-image",
        src: productInfo.image,
        mode: "aspectFill"
      }
    ) }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-row", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
            "¥",
            productInfo.price.toFixed(2)
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
            "¥",
            productInfo.originalPrice.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "unit", children: [
          "/",
          productInfo.unit
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: productInfo.name }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-desc", children: productInfo.description })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "features-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "产品特色" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "features-list", children: productInfo.features.map(
        (feature, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "feature-item", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "feature-dot" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "feature-text", children: feature })
        ] }, index2)
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "specs-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "规格参数" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "specs-list", children: Object.entries(productInfo.specifications).map(
        ([key, value]) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "spec-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "spec-label", children: key }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "spec-value", children: value })
        ] }, key)
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "购买数量" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-selector", children: [
        /* @__PURE__ */ taro.jsx(
          taro.View,
          {
            className: "quantity-btn",
            onClick: () => handleQuantityChange("decrease"),
            children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "subtract", size: "20", color: quantity === 1 ? "#ccc" : "#333" })
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity-value", children: quantity }),
        /* @__PURE__ */ taro.jsx(
          taro.View,
          {
            className: "quantity-btn",
            onClick: () => handleQuantityChange("increase"),
            children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add", size: "20", color: "#333" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.Button, { className: "action-btn cart-btn", onClick: handleAddToCart, children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "shopping-cart", size: "20" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { children: "加入购物车" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "action-btn buy-btn", onClick: handleBuyNow, children: "立即购买" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "商品详情",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(ProductDetail, "pages/gift/product-detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
