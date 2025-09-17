<<<<<<< HEAD
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
const BookingSuccessPage = () => {
  const router = taro.taroExports.useRouter();
  const { orderNo } = router.params;
  const [orderInfo, setOrderInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    fetchOrderDetail();
  }, [orderNo]);
  const fetchOrderDetail = () => __async(exports, null, function* () {
    if (!orderNo) {
      taro.Taro.showToast({
        title: "订单号缺失",
        icon: "none"
      });
      setTimeout(() => {
        taro.Taro.reLaunch({ url: "/pages/appointment/index" });
      }, 1500);
      return;
    }
    try {
      const order = yield common.orderService.getOrderDetail(orderNo);
      setOrderInfo(order);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      taro.Taro.showToast({
        title: "获取订单失败",
        icon: "none"
      });
    }
  });
  const handleViewOrders = () => {
    taro.Taro.redirectTo({
      url: "/pages/order/list/index"
    });
  };
  const handleBackHome = () => {
    taro.Taro.switchTab({
      url: "/pages/appointment/index"
    });
  };
  const generateQRCodeUrl = (orderNo2) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNo2}`;
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "success-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "success-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "success-header", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "success-icon-wrapper", children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "check-circle", size: "60", color: "#52c41a" }) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "success-title", children: "支付成功" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "success-subtitle", children: "您已成功预约，请准时到店" })
    ] }),
    orderInfo && /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-card", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "门店" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.storeName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "推拿师" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.therapistName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "服务项目" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.serviceName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "预约时间" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "value", children: [
            orderInfo.appointmentDate,
            " ",
            orderInfo.appointmentTime
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "订单金额" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "value price", children: [
            "¥",
            orderInfo.totalAmount
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "qrcode-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-title", children: "到店核销码" }),
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "qrcode-image",
            src: generateQRCodeUrl(orderInfo.orderNo),
            mode: "aspectFit"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-no", children: orderInfo.orderNo }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "qrcode-tip", children: "请向门店工作人员出示此二维码" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "action-buttons", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "button-group", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "button secondary", onClick: handleBackHome, children: "返回首页" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "button primary", onClick: handleViewOrders, children: "查看订单" })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-title", children: "温馨提示" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "tips-list", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 请在预约时间前10分钟到店" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 如需取消订单，请在服务开始前6小时操作" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "tips-item", children: "• 到店后请向前台出示核销二维码" })
      ] })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "支付成功"
};
Page(taro.createPageConfig(BookingSuccessPage, "pages/booking/success/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var s=(s,e,t)=>new Promise((r,i)=>{var a=s=>{try{c(t.next(s))}catch(e){i(e)}},x=s=>{try{c(t.throw(s))}catch(e){i(e)}},c=s=>s.done?r(s.value):Promise.resolve(s.value).then(a,x);c((t=t.apply(s,e)).next())});const e=require("../../../taro.js"),t=require("../../../vendors.js"),r=require("../../../common.js"),i="",a=()=>{const i=e.taroExports.useRouter(),{orderNo:a}=i.params,[x,c]=e.reactExports.useState(null),[n,o]=e.reactExports.useState(!0);e.reactExports.useEffect(()=>{l()},[a]);const l=()=>s(exports,null,function*(){if(!a)return e.Taro.showToast({title:"\u8ba2\u5355\u53f7\u7f3a\u5931",icon:"none"}),void setTimeout(()=>{e.Taro.reLaunch({url:"/pages/appointment/index"})},1500);try{const s=yield r.orderService.getOrderDetail(a);c(s),o(!1)}catch(s){o(!1),e.Taro.showToast({title:"\u83b7\u53d6\u8ba2\u5355\u5931\u8d25",icon:"none"})}}),m=()=>{e.Taro.redirectTo({url:"/pages/order/list/index"})},j=()=>{e.Taro.switchTab({url:"/pages/appointment/index"})},u=s=>`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${s}`;return n?e.jsxRuntimeExports.jsx(e.View,{className:"success-page",children:e.jsxRuntimeExports.jsx(e.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})}):e.jsxRuntimeExports.jsxs(e.View,{className:"success-page",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"success-header",children:[e.jsxRuntimeExports.jsx(e.View,{className:"success-icon-wrapper",children:e.jsxRuntimeExports.jsx(t.AtIcon,{value:"check-circle",size:"60",color:"#52c41a"})}),e.jsxRuntimeExports.jsx(e.Text,{className:"success-title",children:"\u652f\u4ed8\u6210\u529f"}),e.jsxRuntimeExports.jsx(e.Text,{className:"success-subtitle",children:"\u60a8\u5df2\u6210\u529f\u9884\u7ea6\uff0c\u8bf7\u51c6\u65f6\u5230\u5e97"})]}),x&&e.jsxRuntimeExports.jsxs(e.View,{className:"order-info",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"info-card",children:[e.jsxRuntimeExports.jsxs(e.View,{className:"info-row",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"label",children:"\u95e8\u5e97"}),e.jsxRuntimeExports.jsx(e.Text,{className:"value",children:x.storeName})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"info-row",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"label",children:"\u63a8\u62ff\u5e08"}),e.jsxRuntimeExports.jsx(e.Text,{className:"value",children:x.therapistName})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"info-row",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"label",children:"\u670d\u52a1\u9879\u76ee"}),e.jsxRuntimeExports.jsx(e.Text,{className:"value",children:x.serviceName})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"info-row",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"label",children:"\u9884\u7ea6\u65f6\u95f4"}),e.jsxRuntimeExports.jsxs(e.Text,{className:"value",children:[x.appointmentDate," ",x.appointmentTime]})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"info-row",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"label",children:"\u8ba2\u5355\u91d1\u989d"}),e.jsxRuntimeExports.jsxs(e.Text,{className:"value price",children:["\xa5",x.totalAmount]})]})]}),e.jsxRuntimeExports.jsxs(e.View,{className:"qrcode-section",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"qrcode-title",children:"\u5230\u5e97\u6838\u9500\u7801"}),e.jsxRuntimeExports.jsx(e.Image,{className:"qrcode-image",src:u(x.orderNo),mode:"aspectFit"}),e.jsxRuntimeExports.jsx(e.Text,{className:"qrcode-no",children:x.orderNo}),e.jsxRuntimeExports.jsx(e.Text,{className:"qrcode-tip",children:"\u8bf7\u5411\u95e8\u5e97\u5de5\u4f5c\u4eba\u5458\u51fa\u793a\u6b64\u4e8c\u7ef4\u7801"})]})]}),e.jsxRuntimeExports.jsx(e.View,{className:"action-buttons",children:e.jsxRuntimeExports.jsxs(e.View,{className:"button-group",children:[e.jsxRuntimeExports.jsx(e.View,{className:"button secondary",onClick:j,children:"\u8fd4\u56de\u9996\u9875"}),e.jsxRuntimeExports.jsx(e.View,{className:"button primary",onClick:m,children:"\u67e5\u770b\u8ba2\u5355"})]})}),e.jsxRuntimeExports.jsxs(e.View,{className:"tips",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"tips-title",children:"\u6e29\u99a8\u63d0\u793a"}),e.jsxRuntimeExports.jsxs(e.View,{className:"tips-list",children:[e.jsxRuntimeExports.jsx(e.Text,{className:"tips-item",children:"\u2022 \u8bf7\u5728\u9884\u7ea6\u65f6\u95f4\u524d10\u5206\u949f\u5230\u5e97"}),e.jsxRuntimeExports.jsx(e.Text,{className:"tips-item",children:"\u2022 \u5982\u9700\u53d6\u6d88\u8ba2\u5355\uff0c\u8bf7\u5728\u670d\u52a1\u5f00\u59cb\u524d6\u5c0f\u65f6\u64cd\u4f5c"}),e.jsxRuntimeExports.jsx(e.Text,{className:"tips-item",children:"\u2022 \u5230\u5e97\u540e\u8bf7\u5411\u524d\u53f0\u51fa\u793a\u6838\u9500\u4e8c\u7ef4\u7801"})]})]})]})};var x={navigationBarTitleText:"\u652f\u4ed8\u6210\u529f"};Page(e.createPageConfig(a,"pages/booking/success/index",{root:{cn:[]}},x||{}));
>>>>>>> recovery-branch
