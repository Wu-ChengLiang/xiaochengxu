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
const NuantieDetail = () => {
  const [products, setProducts] = taro.useState([]);
  const [selectedProduct, setSelectedProduct] = taro.useState(null);
  const [quantity, setQuantity] = taro.useState(1);
  taro.useEffect(() => {
    const nuantieProducts = common.GiftService.getNuantieProducts();
    setProducts(nuantieProducts);
    if (nuantieProducts.length > 0) {
      setSelectedProduct(nuantieProducts[0]);
    }
  }, []);
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleBuyNow = () => __async(exports, null, function* () {
    if (!selectedProduct)
      return;
    try {
      taro.Taro.showLoading({ title: "创建订单..." });
      const order = yield common.GiftService.createProductOrder({
        productId: selectedProduct.id,
        quantity,
        paymentMethod: "wechat"
      });
      taro.Taro.hideLoading();
      const paymentSuccess = yield common.paymentService.pay({
        orderNo: order.orderNo,
        amount: selectedProduct.price * quantity,
        paymentMethod: "wechat",
        title: selectedProduct.name,
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
  const getTotalPrice = () => {
    return selectedProduct ? (selectedProduct.price / 100 * quantity).toFixed(0) : "0";
  };
  if (!selectedProduct) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "nuantie-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "nuantie-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-info-section", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "product-image", children: /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "product-pic",
          src: selectedProduct.image,
          mode: "aspectFill"
        }
      ) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: selectedProduct.name }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-desc", children: selectedProduct.description })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "选择产品" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "product-grid", children: products.map(
        (item) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `product-card ${selectedProduct.id === item.id ? "active" : ""}`,
            onClick: () => handleProductSelect(item),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-header", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "name", children: item.name }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
                  "¥",
                  (item.price / 100).toFixed(0)
                ] })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "desc", children: item.description }),
              selectedProduct.id === item.id && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "check-circle", size: "24", color: "#a40035" })
            ]
          },
          item.id
        )
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
            children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "subtract-circle", size: "20", color: quantity === 1 ? "#ccc" : "#a40035" })
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity-value", children: quantity }),
        /* @__PURE__ */ taro.jsx(
          taro.View,
          {
            className: "quantity-btn",
            onClick: () => handleQuantityChange("increase"),
            children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "20", color: "#a40035" })
          }
        )
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
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "purchase-btn", onClick: handleBuyNow, children: "去结算" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "暖贴",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(NuantieDetail, "pages/gift/nuantie/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
