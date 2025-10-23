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
  const [currentIndex, setCurrentIndex] = taro.useState(0);
  const [showModal, setShowModal] = taro.useState(false);
  taro.useEffect(() => {
    const nuantieProducts = common.GiftService.getNuantieProducts();
    setProducts(nuantieProducts);
    if (nuantieProducts.length > 0) {
      setSelectedProduct(nuantieProducts[0]);
      setShowModal(true);
    }
  }, []);
  const handleProductSelect = (index2) => {
    setCurrentIndex(index2);
    setSelectedProduct(products[index2]);
    setQuantity(1);
  };
  const handleSwiperChange = (e) => {
    setCurrentIndex(e.detail.current);
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
        amount: selectedProduct.price * 100 * quantity,
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
  const handleCloseModal = () => {
    setShowModal(false);
    taro.Taro.navigateBack();
  };
  if (!selectedProduct) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "nuantie-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "nuantie-page", children: showModal && /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-overlay", onClick: handleCloseModal, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-top", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "carousel-container", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Swiper,
          {
            className: "product-swiper",
            circular: true,
            current: currentIndex,
            onChange: handleSwiperChange,
            children: products.map(
              (product, index2) => /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsx(
                taro.Image,
                {
                  className: "product-image",
                  src: product.image,
                  mode: "aspectFill"
                }
              ) }, product.id)
            )
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "pagination-dots", children: products.map(
          (_, index2) => /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: `dot ${currentIndex === index2 ? "active" : ""}`
            },
            index2
          )
        ) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "close-btn", onClick: handleCloseModal, children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "close", size: "24", color: "#fff" }) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-bottom", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "product-list", children: products.map(
        (product, index2) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `product-item ${selectedProduct.id === product.id ? "active" : ""}`,
            onClick: () => handleProductSelect(index2),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "product-header", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-name", children: product.name }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "product-price", children: [
                  "¥",
                  (product.price / 100).toFixed(0)
                ] })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "product-desc", children: product.description })
            ]
          },
          product.id
        )
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "购买数量" }),
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
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-bar", children: /* @__PURE__ */ taro.jsxs(taro.Button, { className: "buy-btn", onClick: handleBuyNow, children: [
        "立即购买 ¥",
        (selectedProduct.price / 100 * quantity).toFixed(0)
      ] }) })
    ] })
  ] }) }) });
};
var config = {
  "navigationBarTitleText": "暖贴",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(NuantieDetail, "pages/gift/nuantie/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
