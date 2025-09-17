<<<<<<< HEAD
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
=======
"use strict";const e=require("../../../taro.js"),s=require("../../../vendors.js"),t=require("../../../common.js"),i="",a=()=>{const i=e.taroExports.useRouter(),{id:a}=i.params,[r,x]=e.reactExports.useState(null),[c,n]=e.reactExports.useState(!0);e.reactExports.useEffect(()=>{if(a){const e=t.GiftService.getGiftCardById(a);e&&x(e),n(!1)}},[a]);const o=()=>{e.Taro.navigateTo({url:"/pages/gift/purchase/index"})},l=()=>{e.Taro.showToast({title:"\u529f\u80fd\u5f00\u53d1\u4e2d",icon:"none"})};return c?e.jsxRuntimeExports.jsx(e.View,{className:"card-detail-page",children:e.jsxRuntimeExports.jsx(e.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})}):r?e.jsxRuntimeExports.jsxs(e.View,{className:"card-detail-page",children:[e.jsxRuntimeExports.jsx(e.View,{className:"card-display",children:e.jsxRuntimeExports.jsx(e.Image,{className:"card-image",src:r.image,mode:"aspectFill"})}),e.jsxRuntimeExports.jsxs(e.View,{className:"card-info",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"card-name",children:r.name}),e.jsxRuntimeExports.jsx(e.Text,{className:"card-desc",children:r.description})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"features-section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u793c\u5361\u7279\u8272"}),e.jsxRuntimeExports.jsx(e.View,{className:"features-list",children:r.features.map((t,i)=>e.jsxRuntimeExports.jsxs(e.View,{className:"feature-item",children:[e.jsxRuntimeExports.jsx(s.AtIcon,{value:"check-circle",size:"18",color:"#a40035"}),e.jsxRuntimeExports.jsx(e.Text,{className:"feature-text",children:t})]},i))})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"terms-section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u4f7f\u7528\u987b\u77e5"}),e.jsxRuntimeExports.jsx(e.Text,{className:"terms-text",children:r.terms})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"action-bar",children:[e.jsxRuntimeExports.jsxs(e.Button,{className:"action-btn gift-btn",onClick:l,children:[e.jsxRuntimeExports.jsx(s.AtIcon,{value:"gift",size:"20"}),e.jsxRuntimeExports.jsx(e.Text,{children:"\u8d60\u9001\u597d\u53cb"})]}),e.jsxRuntimeExports.jsxs(e.Button,{className:"action-btn purchase-btn",onClick:o,children:[e.jsxRuntimeExports.jsx(s.AtIcon,{value:"shopping-cart",size:"20"}),e.jsxRuntimeExports.jsx(e.Text,{children:"\u7acb\u5373\u8d2d\u4e70"})]})]})]}):e.jsxRuntimeExports.jsx(e.View,{className:"card-detail-page",children:e.jsxRuntimeExports.jsx(e.View,{className:"empty",children:"\u793c\u5361\u4e0d\u5b58\u5728"})})};var r={navigationBarTitleText:"\u793c\u5361\u8be6\u60c5"};Page(e.createPageConfig(a,"pages/gift/card-detail/index",{root:{cn:[]}},r||{}));
>>>>>>> recovery-branch
