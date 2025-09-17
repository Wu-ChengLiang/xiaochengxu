<<<<<<< HEAD
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
  "navigationBarTitleText": "商品详情"
};
Page(taro.createPageConfig(ProductDetail, "pages/gift/product-detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=(e,s,t)=>new Promise((i,a)=>{var r=e=>{try{n(t.next(e))}catch(s){a(s)}},c=e=>{try{n(t.throw(e))}catch(s){a(s)}},n=e=>e.done?i(e.value):Promise.resolve(e.value).then(r,c);n((t=t.apply(e,s)).next())});const s=require("../../../taro.js"),t=require("../../../vendors.js"),i=require("../../../common.js"),a="",r=()=>{const a=s.taroExports.useRouter(),{id:r}=a.params,[c,n]=s.reactExports.useState(null),[x,o]=s.reactExports.useState(!0),[l,m]=s.reactExports.useState(1);s.reactExports.useEffect(()=>{if(r){const e=i.GiftService.getProductById(r);e&&n(e),o(!1)}},[r]);const u=e=>{"increase"===e?m(l+1):"decrease"===e&&l>1&&m(l-1)},p=()=>{s.Taro.showToast({title:"\u529f\u80fd\u5f00\u53d1\u4e2d",icon:"none"})},j=()=>e(exports,null,function*(){if(c)try{s.Taro.showLoading({title:"\u521b\u5efa\u8ba2\u5355..."});const e=yield i.GiftService.createProductOrder({productId:c.id,quantity:l,paymentMethod:"wechat"});s.Taro.hideLoading(),"wechat"===e.paymentMethod&&e.wxPayParams&&(yield i.GiftService.handleWechatPay(e.wxPayParams),s.Taro.showToast({title:"\u652f\u4ed8\u6210\u529f",icon:"success"}))}catch(e){s.Taro.hideLoading(),s.Taro.showToast({title:e.message||"\u8d2d\u4e70\u5931\u8d25",icon:"none"})}});return x?s.jsxRuntimeExports.jsx(s.View,{className:"product-detail-page",children:s.jsxRuntimeExports.jsx(s.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})}):c?s.jsxRuntimeExports.jsxs(s.View,{className:"product-detail-page",children:[s.jsxRuntimeExports.jsx(s.Swiper,{className:"product-swiper",circular:!0,autoplay:!0,children:s.jsxRuntimeExports.jsx(s.SwiperItem,{children:s.jsxRuntimeExports.jsx(s.Image,{className:"product-image",src:c.image,mode:"aspectFill"})})}),s.jsxRuntimeExports.jsxs(s.View,{className:"product-info",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"price-section",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"price-row",children:[s.jsxRuntimeExports.jsxs(s.Text,{className:"price",children:["\xa5",c.price.toFixed(2)]}),s.jsxRuntimeExports.jsxs(s.Text,{className:"original-price",children:["\xa5",c.originalPrice.toFixed(2)]})]}),s.jsxRuntimeExports.jsxs(s.Text,{className:"unit",children:["/",c.unit]})]}),s.jsxRuntimeExports.jsx(s.Text,{className:"product-name",children:c.name}),s.jsxRuntimeExports.jsx(s.Text,{className:"product-desc",children:c.description})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"features-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u4ea7\u54c1\u7279\u8272"}),s.jsxRuntimeExports.jsx(s.View,{className:"features-list",children:c.features.map((e,t)=>s.jsxRuntimeExports.jsxs(s.View,{className:"feature-item",children:[s.jsxRuntimeExports.jsx(s.View,{className:"feature-dot"}),s.jsxRuntimeExports.jsx(s.Text,{className:"feature-text",children:e})]},t))})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"specs-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u89c4\u683c\u53c2\u6570"}),s.jsxRuntimeExports.jsx(s.View,{className:"specs-list",children:Object.entries(c.specifications).map(([e,t])=>s.jsxRuntimeExports.jsxs(s.View,{className:"spec-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"spec-label",children:e}),s.jsxRuntimeExports.jsx(s.Text,{className:"spec-value",children:t})]},e))})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"quantity-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u8d2d\u4e70\u6570\u91cf"}),s.jsxRuntimeExports.jsxs(s.View,{className:"quantity-selector",children:[s.jsxRuntimeExports.jsx(s.View,{className:"quantity-btn",onClick:()=>u("decrease"),children:s.jsxRuntimeExports.jsx(t.AtIcon,{value:"subtract",size:"20",color:1===l?"#ccc":"#333"})}),s.jsxRuntimeExports.jsx(s.Text,{className:"quantity-value",children:l}),s.jsxRuntimeExports.jsx(s.View,{className:"quantity-btn",onClick:()=>u("increase"),children:s.jsxRuntimeExports.jsx(t.AtIcon,{value:"add",size:"20",color:"#333"})})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"action-bar",children:[s.jsxRuntimeExports.jsxs(s.Button,{className:"action-btn cart-btn",onClick:p,children:[s.jsxRuntimeExports.jsx(t.AtIcon,{value:"shopping-cart",size:"20"}),s.jsxRuntimeExports.jsx(s.Text,{children:"\u52a0\u5165\u8d2d\u7269\u8f66"})]}),s.jsxRuntimeExports.jsx(s.Button,{className:"action-btn buy-btn",onClick:j,children:"\u7acb\u5373\u8d2d\u4e70"})]})]}):s.jsxRuntimeExports.jsx(s.View,{className:"product-detail-page",children:s.jsxRuntimeExports.jsx(s.View,{className:"empty",children:"\u5546\u54c1\u4e0d\u5b58\u5728"})})};var c={navigationBarTitleText:"\u5546\u54c1\u8be6\u60c5"};Page(s.createPageConfig(r,"pages/gift/product-detail/index",{root:{cn:[]}},c||{}));
>>>>>>> recovery-branch
