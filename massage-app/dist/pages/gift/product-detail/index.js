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
const common = require("../../../common.js");
const index = "";
const ProductDetail = () => {
  const router = taro.taroExports.useRouter();
  const { id } = router.params;
  const [productInfo, setProductInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [quantity, setQuantity] = taro.useState(1);
  const [scrollTop, setScrollTop] = taro.useState(0);
  taro.useEffect(() => {
    if (id) {
      const product = common.GiftService.getProductById(id);
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
  const handleBuyNow = () => __async(exports, null, function* () {
    if (!productInfo)
      return;
    try {
      taro.Taro.showLoading({ title: "创建订单..." });
      const order = yield common.GiftService.createProductOrder({
        productId: productInfo.id,
        quantity,
        paymentMethod: "wechat"
      });
      taro.Taro.hideLoading();
      const paymentSuccess = yield common.paymentService.pay({
        orderNo: order.orderNo,
        amount: productInfo.price * 100 * quantity,
        paymentMethod: "wechat",
        title: productInfo.name,
        wxPayParams: order.wxPayParams
      });
      if (paymentSuccess) {
        taro.Taro.showToast({
          title: "购买成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          taro.Taro.navigateBack();
        }, 1500);
      }
    } catch (error) {
      taro.Taro.hideLoading();
      const errorMessage = error.message || error.errMsg || "购买失败";
      taro.Taro.showModal({
        title: "购买失败",
        content: errorMessage,
        showCancel: false,
        confirmText: "知道了"
      });
    }
  });
  const handleScroll = (e) => {
    setScrollTop(e.detail.scrollTop);
  };
  const totalPrice = ((productInfo == null ? void 0 : productInfo.price) || 0) * quantity;
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "product-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (!productInfo) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "product-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "empty", children: "商品不存在" }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-detail-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: `navbar ${scrollTop > 20 ? "shadow" : ""}`, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "navbar-content", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "navbar-back", onClick: () => taro.Taro.navigateBack(), children: /* @__PURE__ */ taro.jsx(taro.View, { className: "back-icon", children: "‹" }) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "navbar-title", children: "商品详情" })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "page-content", onScroll: handleScroll, scrollY: true, children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-image-container", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "product-image",
            src: productInfo.image,
            mode: "aspectFill"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "image-badge", children: productInfo.unit })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info-card", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-section", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "current-price", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "currency", children: "¥" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-value", children: (productInfo.price / 100).toFixed(0) })
          ] }),
          productInfo.originalPrice && productInfo.originalPrice > productInfo.price && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
            "¥",
            (productInfo.originalPrice / 100).toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-title-section", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: productInfo.name }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-description", children: productInfo.description })
        ] })
      ] }),
      productInfo.features && productInfo.features.length > 0 && /* @__PURE__ */ taro.jsxs(taro.View, { className: "features-card", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-title", children: "产品特色" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "features-list", children: productInfo.features.map(
          (feature, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "feature-item", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "feature-icon", children: "✓" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "feature-text", children: feature })
          ] }, index2)
        ) })
      ] }),
      productInfo.specifications && Object.keys(productInfo.specifications).length > 0 && /* @__PURE__ */ taro.jsxs(taro.View, { className: "specs-card", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-title", children: "规格参数" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "specs-list", children: Object.entries(productInfo.specifications).map(
          ([key, value], index2) => /* @__PURE__ */ taro.jsxs(
            taro.View,
            {
              className: `spec-item ${index2 !== Object.entries(productInfo.specifications).length - 1 ? "has-border" : ""}`,
              children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "spec-label", children: key }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "spec-value", children: value })
              ]
            },
            index2
          )
        ) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "bottom-spacer" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-container", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity-label", children: "数量" }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-selector", children: [
          /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: "quantity-btn",
              onClick: () => handleQuantityChange("decrease"),
              children: "−"
            }
          ),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity-value", children: quantity }),
          /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: "quantity-btn",
              onClick: () => handleQuantityChange("increase"),
              children: "+"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-buttons", children: /* @__PURE__ */ taro.jsx(
        taro.Button,
        {
          className: "buy-btn",
          onClick: handleBuyNow,
          children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "btn-content", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "btn-label", children: "立即购买" }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "btn-price", children: [
              "¥",
              (totalPrice / 100).toFixed(0)
            ] })
          ] })
        }
      ) })
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
