<<<<<<< HEAD
"use strict";
const taro = require("../../../taro.js");
const vendors = require("../../../vendors.js");
const index = "";
const GiftCardPurchase = () => {
  const [selectedAmount, setSelectedAmount] = taro.useState(200);
  const [customAmount, setCustomAmount] = taro.useState(0);
  const [quantity, setQuantity] = taro.useState(1);
  const predefinedAmounts = [
    { value: 200, discount: null },
    { value: 500, discount: 50 },
    { value: 1e3, discount: 100 },
    { value: 2e3, discount: 200 }
  ];
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(0);
  };
  const handleCustomAmount = () => {
    setSelectedAmount(0);
  };
  const handleQuantityChange = (value) => {
    setQuantity(value);
  };
  const handlePurchase = () => {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      taro.Taro.showToast({
        title: "请选择或输入金额",
        icon: "none"
      });
      return;
    }
    taro.Taro.navigateTo({
      url: `/pages/gift/order-confirm/index?amount=${amount}&quantity=${quantity}`
    });
  };
  const getTotalPrice = () => {
    const amount = selectedAmount || customAmount || 0;
    return amount * quantity;
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "gift-card-purchase", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-preview", children: [
      /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "card-image",
          src: "/assets/images/gift/card/gift-card.png",
          mode: "aspectFit"
        }
      ),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-title", children: "世界上" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-subtitle", children: "最好的爸爸" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "card-label", children: "HEALTH CARD" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "panda-illustration" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "brand-tag", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "常乐" }) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "diy-button", children: "DIY自定义" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "请选择面额" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-grid", children: [
        predefinedAmounts.map(
          (item) => /* @__PURE__ */ taro.jsxs(
            taro.View,
            {
              className: `amount-card ${selectedAmount === item.value ? "active" : ""}`,
              onClick: () => handleAmountSelect(item.value),
              children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "amount", children: [
                  "¥",
                  item.value
                ] }),
                item.discount && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "discount", children: [
                  "返余额",
                  item.discount,
                  ".00元"
                ] }),
                selectedAmount === item.value && /* @__PURE__ */ taro.jsxs(taro.View, { className: "quantity-control", children: [
                  /* @__PURE__ */ taro.jsx(
                    vendors.AtIcon,
                    {
                      value: "subtract-circle",
                      size: "20",
                      color: "#999",
                      onClick: (e) => {
                        e.stopPropagation();
                        if (quantity > 1)
                          handleQuantityChange(quantity - 1);
                      }
                    }
                  ),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "quantity", children: quantity }),
                  /* @__PURE__ */ taro.jsx(
                    vendors.AtIcon,
                    {
                      value: "add-circle",
                      size: "20",
                      color: "#a40035",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleQuantityChange(quantity + 1);
                      }
                    }
                  )
                ] }),
                !item.discount && selectedAmount !== item.value && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "24", color: "#a40035" })
              ]
            },
            item.value
          )
        ),
        /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `amount-card custom ${selectedAmount === 0 && customAmount > 0 ? "active" : ""}`,
            onClick: handleCustomAmount,
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "custom-label", children: "自定义金额" }),
              selectedAmount === 0 && /* @__PURE__ */ taro.jsx(
                vendors.AtInputNumber,
                {
                  min: 1,
                  max: 1e4,
                  step: 1,
                  value: customAmount,
                  onChange: (value) => setCustomAmount(value)
                }
              ),
              selectedAmount !== 0 && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add-circle", size: "24", color: "#999" })
            ]
          }
        ),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-card bulk", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "bulk-label", children: "礼卡集采" }),
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "20", color: "#999" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "使用规则" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-content", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-desc", children: "返金额说明：" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "rule-item", children: "(1) 电子卡返余额在礼卡分享成功后，自动充值至购买人的常乐推拿会员余额中。" })
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
      /* @__PURE__ */ taro.jsx(taro.Button, { className: "purchase-btn", onClick: handlePurchase, children: "去结算" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "电子礼卡"
};
Page(taro.createPageConfig(GiftCardPurchase, "pages/gift/purchase/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var s=(s,e,t)=>new Promise((a,i)=>{var r=s=>{try{c(t.next(s))}catch(e){i(e)}},n=s=>{try{c(t.throw(s))}catch(e){i(e)}},c=s=>s.done?a(s.value):Promise.resolve(s.value).then(r,n);c((t=t.apply(s,e)).next())});const e=require("../../../taro.js"),t=require("../../../vendors.js"),a=require("../../../common.js"),i="",r=()=>{const[i,r]=e.reactExports.useState(200),[n,c]=e.reactExports.useState(0),[o,x]=e.reactExports.useState(1),l=[{value:200,discount:null},{value:500,discount:50},{value:1e3,discount:100},{value:2e3,discount:200}],u=s=>{r(s),c(0)},m=()=>{r(0)},j=s=>{x(s)},d=()=>s(exports,null,function*(){const s=i||n;if(s)try{e.Taro.showLoading({title:"\u521b\u5efa\u8ba2\u5355..."});const t=yield a.GiftService.createGiftCardOrder({amount:100*s,quantity:o,paymentMethod:"wechat",customMessage:"\u4e16\u754c\u4e0a\u6700\u597d\u7684\u7238\u7238"});e.Taro.hideLoading(),e.Taro.navigateTo({url:`/pages/gift/order-confirm/index?orderNo=${t.orderNo}&amount=${s}&quantity=${o}`})}catch(t){e.Taro.hideLoading(),e.Taro.showToast({title:t.message||"\u521b\u5efa\u8ba2\u5355\u5931\u8d25",icon:"none"})}else e.Taro.showToast({title:"\u8bf7\u9009\u62e9\u6216\u8f93\u5165\u91d1\u989d",icon:"none"})}),p=()=>{const s=i||n||0;return s*o};return e.jsxRuntimeExports.jsxs(e.View,{className:"gift-card-purchase",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"card-preview",children:[e.jsxRuntimeExports.jsx(e.Image,{className:"card-image",src:"/assets/images/gift/card/gift-card.png",mode:"aspectFit"}),e.jsxRuntimeExports.jsxs(e.View,{className:"card-content",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"card-title",children:"\u4e16\u754c\u4e0a"}),e.jsxRuntimeExports.jsx(e.Text,{className:"card-subtitle",children:"\u6700\u597d\u7684\u7238\u7238"}),e.jsxRuntimeExports.jsx(e.Text,{className:"card-label",children:"HEALTH CARD"}),e.jsxRuntimeExports.jsx(e.View,{className:"panda-illustration"}),e.jsxRuntimeExports.jsx(e.View,{className:"brand-tag",children:e.jsxRuntimeExports.jsx(e.Text,{children:"\u5e38\u4e50"})})]}),e.jsxRuntimeExports.jsx(e.Button,{className:"diy-button",children:"DIY\u81ea\u5b9a\u4e49"})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"amount-section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u8bf7\u9009\u62e9\u9762\u989d"}),e.jsxRuntimeExports.jsxs(e.View,{className:"amount-grid",children:[l.map(s=>e.jsxRuntimeExports.jsxs(e.View,{className:"amount-card "+(i===s.value?"active":""),onClick:()=>u(s.value),children:[e.jsxRuntimeExports.jsxs(e.Text,{className:"amount",children:["\xa5",s.value]}),s.discount&&e.jsxRuntimeExports.jsxs(e.Text,{className:"discount",children:["\u8fd4\u4f59\u989d",s.discount,".00\u5143"]}),i===s.value&&e.jsxRuntimeExports.jsxs(e.View,{className:"quantity-control",children:[e.jsxRuntimeExports.jsx(t.AtIcon,{value:"subtract-circle",size:"20",color:"#999",onClick:s=>{s.stopPropagation(),o>1&&j(o-1)}}),e.jsxRuntimeExports.jsx(e.Text,{className:"quantity",children:o}),e.jsxRuntimeExports.jsx(t.AtIcon,{value:"add-circle",size:"20",color:"#a40035",onClick:s=>{s.stopPropagation(),j(o+1)}})]}),!s.discount&&i!==s.value&&e.jsxRuntimeExports.jsx(t.AtIcon,{value:"add-circle",size:"24",color:"#a40035"})]},s.value)),e.jsxRuntimeExports.jsxs(e.View,{className:"amount-card custom "+(0===i&&n>0?"active":""),onClick:m,children:[e.jsxRuntimeExports.jsx(e.Text,{className:"custom-label",children:"\u81ea\u5b9a\u4e49\u91d1\u989d"}),0===i&&e.jsxRuntimeExports.jsx(t.AtInputNumber,{min:1,max:1e4,step:1,value:n,onChange:s=>c(s)}),0!==i&&e.jsxRuntimeExports.jsx(t.AtIcon,{value:"add-circle",size:"24",color:"#999"})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"amount-card bulk",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"bulk-label",children:"\u793c\u5361\u96c6\u91c7"}),e.jsxRuntimeExports.jsx(t.AtIcon,{value:"chevron-right",size:"20",color:"#999"})]})]})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"rules-section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"section-title",children:"\u4f7f\u7528\u89c4\u5219"}),e.jsxRuntimeExports.jsxs(e.View,{className:"rules-content",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"rule-desc",children:"\u8fd4\u91d1\u989d\u8bf4\u660e\uff1a"}),e.jsxRuntimeExports.jsx(e.Text,{className:"rule-item",children:"(1) \u7535\u5b50\u5361\u8fd4\u4f59\u989d\u5728\u793c\u5361\u5206\u4eab\u6210\u529f\u540e\uff0c\u81ea\u52a8\u5145\u503c\u81f3\u8d2d\u4e70\u4eba\u7684\u5e38\u4e50\u63a8\u62ff\u4f1a\u5458\u4f59\u989d\u4e2d\u3002"})]})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"purchase-bar",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"price-info",children:[e.jsxRuntimeExports.jsx(t.AtIcon,{value:"shopping-bag-2",size:"24",color:"#a40035"}),e.jsxRuntimeExports.jsxs(e.Text,{className:"total-price",children:["\xa5 ",p()]}),e.jsxRuntimeExports.jsx(e.View,{className:"quantity-badge",children:o})]}),e.jsxRuntimeExports.jsx(e.Button,{className:"purchase-btn",onClick:d,children:"\u53bb\u7ed3\u7b97"})]})]})};var n={navigationBarTitleText:"\u7535\u5b50\u793c\u5361"};Page(e.createPageConfig(r,"pages/gift/purchase/index",{root:{cn:[]}},n||{}));
>>>>>>> recovery-branch
