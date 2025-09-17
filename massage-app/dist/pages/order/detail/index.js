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
const OrderDetailPage = () => {
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
        taro.Taro.navigateBack();
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
  const handleCall = () => {
    taro.Taro.makePhoneCall({
      phoneNumber: "4008888888"
    });
  };
  const handleCancel = () => __async(exports, null, function* () {
    taro.Taro.showModal({
      title: "取消订单",
      content: "确定要取消该订单吗？",
      success: (res) => __async(exports, null, function* () {
        if (res.confirm) {
          try {
            yield common.orderService.cancelOrder(orderNo);
            taro.Taro.showToast({
              title: "订单已取消",
              icon: "success"
            });
            setTimeout(() => {
              fetchOrderDetail();
            }, 1500);
          } catch (error) {
            taro.Taro.showToast({
              title: "取消失败",
              icon: "none"
            });
          }
        }
      })
    });
  });
  const handleRebook = () => {
    if (orderInfo) {
      taro.Taro.navigateTo({
        url: `/pages/appointment/therapist/index?therapistId=${orderInfo.therapistId}&storeId=${orderInfo.storeId}`
      });
    }
  };
  const handleNavigate = () => {
    if (orderInfo) {
      taro.Taro.openLocation({
        latitude: 31.189,
        // 示例坐标
        longitude: 121.43,
        name: orderInfo.storeName,
        address: orderInfo.storeAddress
      });
    }
  };
  const generateQRCodeUrl = (orderNo2) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderNo2}`;
  };
  const getStatusText = (status) => {
    const statusTextMap = {
      "pending_payment": "待支付",
      "paid": "待服务",
      "serving": "服务中",
      "completed": "已完成",
      "cancelled": "已取消",
      "refunded": "已退款"
    };
    return statusTextMap[status] || status;
  };
  const getOrderSteps = (status) => {
    const allSteps = ["下单", "支付", "到店服务", "完成"];
    let current2 = 0;
    switch (status) {
      case "pending_payment":
        current2 = 0;
        break;
      case "paid":
        current2 = 1;
        break;
      case "serving":
        current2 = 2;
        break;
      case "completed":
        current2 = 3;
        break;
      case "cancelled":
      case "refunded":
        return { steps: ["已取消"], current: 0 };
    }
    return { steps: allSteps, current: current2 };
  };
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "order-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (!orderInfo) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "order-detail-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "empty", children: "订单不存在" }) });
  }
  const { steps, current } = getOrderSteps(orderInfo.status);
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-detail-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-header", children: [
        /* @__PURE__ */ taro.jsx(
          vendors.AtIcon,
          {
            value: orderInfo.status === "paid" ? "check-circle" : "clock",
            size: "40",
            color: "#fff"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "status-text", children: getStatusText(orderInfo.status) })
      ] }),
      orderInfo.status !== "cancelled" && orderInfo.status !== "refunded" && /* @__PURE__ */ taro.jsx(taro.View, { className: "steps-container", children: /* @__PURE__ */ taro.jsx(
        vendors.AtSteps,
        {
          items: steps.map((step) => ({ title: step })),
          current,
          className: "order-steps"
        }
      ) })
    ] }),
    orderInfo.status === "paid" && /* @__PURE__ */ taro.jsxs(taro.View, { className: "qrcode-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "到店核销码" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "qrcode-card", children: [
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
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "订单信息" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-card", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "订单编号" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: orderInfo.orderNo })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "下单时间" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: formatDateTime(orderInfo.createdAt) })
        ] }),
        orderInfo.paidAt && /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "支付时间" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "value", children: formatDateTime(orderInfo.paidAt) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "预约时间" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "value highlight", children: [
            orderInfo.appointmentDate,
            " ",
            orderInfo.appointmentTime
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "门店信息" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-card", onClick: handleNavigate, children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-info", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: orderInfo.storeName }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-address", children: orderInfo.storeAddress })
        ] }),
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "map-pin", size: "20", color: "#a40035" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "推拿师信息" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-card", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "therapist-avatar",
            src: orderInfo.therapistAvatar || "https://img.yzcdn.cn/vant/cat.jpeg"
          }
        ),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: orderInfo.therapistName }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: orderInfo.serviceName }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "service-duration", children: [
            "服务时长：",
            orderInfo.duration,
            "分钟"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
          "¥",
          orderInfo.totalAmount
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-section", children: [
      orderInfo.status === "paid" && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "button secondary", onClick: handleCall, children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "phone", size: "18" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { children: "联系门店" })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "button danger", onClick: handleCancel, children: "取消订单" })
      ] }),
      (orderInfo.status === "completed" || orderInfo.status === "cancelled") && /* @__PURE__ */ taro.jsx(taro.View, { className: "button primary", onClick: handleRebook, children: "再次预约" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "订单详情"
};
Page(taro.createPageConfig(OrderDetailPage, "pages/order/detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=(e,s,t)=>new Promise((r,a)=>{var i=e=>{try{c(t.next(e))}catch(s){a(s)}},n=e=>{try{c(t.throw(e))}catch(s){a(s)}},c=e=>e.done?r(e.value):Promise.resolve(e.value).then(i,n);c((t=t.apply(e,s)).next())});const s=require("../../../taro.js"),t=require("../../../vendors.js"),r=require("../../../common.js"),a="",i=()=>{const a=s.taroExports.useRouter(),{orderNo:i}=a.params,[n,c]=s.reactExports.useState(null),[o,x]=s.reactExports.useState(!0);s.reactExports.useEffect(()=>{l()},[i]);const l=()=>e(exports,null,function*(){if(!i)return s.Taro.showToast({title:"\u8ba2\u5355\u53f7\u7f3a\u5931",icon:"none"}),void setTimeout(()=>{s.Taro.navigateBack()},1500);try{const e=yield r.orderService.getOrderDetail(i);c(e),x(!1)}catch(e){x(!1),s.Taro.showToast({title:"\u83b7\u53d6\u8ba2\u5355\u5931\u8d25",icon:"none"})}}),m=()=>{s.Taro.makePhoneCall({phoneNumber:"4008888888"})},d=()=>e(exports,null,function*(){s.Taro.showModal({title:"\u53d6\u6d88\u8ba2\u5355",content:"\u786e\u5b9a\u8981\u53d6\u6d88\u8be5\u8ba2\u5355\u5417\uff1f",success:t=>e(exports,null,function*(){if(t.confirm)try{yield r.orderService.cancelOrder(i),s.Taro.showToast({title:"\u8ba2\u5355\u5df2\u53d6\u6d88",icon:"success"}),setTimeout(()=>{l()},1500)}catch(e){s.Taro.showToast({title:"\u53d6\u6d88\u5931\u8d25",icon:"none"})}})})}),u=()=>{s.Taro.switchTab({url:"/pages/appointment/index"})},p=()=>{n&&s.Taro.openLocation({latitude:31.189,longitude:121.43,name:n.storeName,address:n.storeAddress})},j=e=>`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${e}`,h=e=>{const s={pending_payment:"\u5f85\u652f\u4ed8",paid:"\u5f85\u670d\u52a1",serving:"\u670d\u52a1\u4e2d",completed:"\u5df2\u5b8c\u6210",cancelled:"\u5df2\u53d6\u6d88",refunded:"\u5df2\u9000\u6b3e"};return s[e]||e},E=e=>{const s=["\u4e0b\u5355","\u652f\u4ed8","\u5230\u5e97\u670d\u52a1","\u5b8c\u6210"];let t=0;switch(e){case"pending_payment":t=0;break;case"paid":t=1;break;case"serving":t=2;break;case"completed":t=3;break;case"cancelled":case"refunded":return{steps:["\u5df2\u53d6\u6d88"],current:0}}return{steps:s,current:t}},N=e=>{const s=new Date(e),t=s.getFullYear(),r=s.getMonth()+1,a=s.getDate(),i=s.getHours(),n=s.getMinutes();return`${t}-${r.toString().padStart(2,"0")}-${a.toString().padStart(2,"0")} ${i.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`};if(o)return s.jsxRuntimeExports.jsx(s.View,{className:"order-detail-page",children:s.jsxRuntimeExports.jsx(s.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})});if(!n)return s.jsxRuntimeExports.jsx(s.View,{className:"order-detail-page",children:s.jsxRuntimeExports.jsx(s.View,{className:"empty",children:"\u8ba2\u5355\u4e0d\u5b58\u5728"})});const{steps:R,current:T}=E(n.status);return s.jsxRuntimeExports.jsxs(s.View,{className:"order-detail-page",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"status-section",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"status-header",children:[s.jsxRuntimeExports.jsx(t.AtIcon,{value:"paid"===n.status?"check-circle":"clock",size:"40",color:"#fff"}),s.jsxRuntimeExports.jsx(s.Text,{className:"status-text",children:h(n.status)})]}),"cancelled"!==n.status&&"refunded"!==n.status&&s.jsxRuntimeExports.jsx(s.View,{className:"steps-container",children:s.jsxRuntimeExports.jsx(t.AtSteps,{items:R.map(e=>({title:e})),current:T,className:"order-steps"})})]}),"paid"===n.status&&s.jsxRuntimeExports.jsxs(s.View,{className:"qrcode-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u5230\u5e97\u6838\u9500\u7801"}),s.jsxRuntimeExports.jsxs(s.View,{className:"qrcode-card",children:[s.jsxRuntimeExports.jsx(s.Image,{className:"qrcode-image",src:j(n.orderNo),mode:"aspectFit"}),s.jsxRuntimeExports.jsx(s.Text,{className:"qrcode-no",children:n.orderNo}),s.jsxRuntimeExports.jsx(s.Text,{className:"qrcode-tip",children:"\u8bf7\u5411\u95e8\u5e97\u5de5\u4f5c\u4eba\u5458\u51fa\u793a\u6b64\u4e8c\u7ef4\u7801"})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"info-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u8ba2\u5355\u4fe1\u606f"}),s.jsxRuntimeExports.jsxs(s.View,{className:"info-card",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"info-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"label",children:"\u8ba2\u5355\u7f16\u53f7"}),s.jsxRuntimeExports.jsx(s.Text,{className:"value",children:n.orderNo})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"info-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"label",children:"\u4e0b\u5355\u65f6\u95f4"}),s.jsxRuntimeExports.jsx(s.Text,{className:"value",children:N(n.createdAt)})]}),n.paidAt&&s.jsxRuntimeExports.jsxs(s.View,{className:"info-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"label",children:"\u652f\u4ed8\u65f6\u95f4"}),s.jsxRuntimeExports.jsx(s.Text,{className:"value",children:N(n.paidAt)})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"info-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"label",children:"\u9884\u7ea6\u65f6\u95f4"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"value highlight",children:[n.appointmentDate," ",n.appointmentTime]})]})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"store-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u95e8\u5e97\u4fe1\u606f"}),s.jsxRuntimeExports.jsxs(s.View,{className:"store-card",onClick:p,children:[s.jsxRuntimeExports.jsxs(s.View,{className:"store-info",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"store-name",children:n.storeName}),s.jsxRuntimeExports.jsx(s.Text,{className:"store-address",children:n.storeAddress})]}),s.jsxRuntimeExports.jsx(t.AtIcon,{value:"map-pin",size:"20",color:"#a40035"})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapist-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u63a8\u62ff\u5e08\u4fe1\u606f"}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapist-card",children:[s.jsxRuntimeExports.jsx(s.Image,{className:"therapist-avatar",src:n.therapistAvatar||"https://img.yzcdn.cn/vant/cat.jpeg"}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapist-info",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"therapist-name",children:n.therapistName}),s.jsxRuntimeExports.jsx(s.Text,{className:"service-name",children:n.serviceName}),s.jsxRuntimeExports.jsxs(s.Text,{className:"service-duration",children:["\u670d\u52a1\u65f6\u957f\uff1a",n.duration,"\u5206\u949f"]})]}),s.jsxRuntimeExports.jsxs(s.Text,{className:"price",children:["\xa5",n.totalAmount]})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"action-section",children:["paid"===n.status&&s.jsxRuntimeExports.jsxs(s.jsxRuntimeExports.Fragment,{children:[s.jsxRuntimeExports.jsxs(s.View,{className:"button secondary",onClick:m,children:[s.jsxRuntimeExports.jsx(t.AtIcon,{value:"phone",size:"18"}),s.jsxRuntimeExports.jsx(s.Text,{children:"\u8054\u7cfb\u95e8\u5e97"})]}),s.jsxRuntimeExports.jsx(s.View,{className:"button danger",onClick:d,children:"\u53d6\u6d88\u8ba2\u5355"})]}),("completed"===n.status||"cancelled"===n.status)&&s.jsxRuntimeExports.jsx(s.View,{className:"button primary",onClick:u,children:"\u518d\u6b21\u9884\u7ea6"})]})]})};var n={navigationBarTitleText:"\u8ba2\u5355\u8be6\u60c5"};Page(s.createPageConfig(i,"pages/order/detail/index",{root:{cn:[]}},n||{}));
>>>>>>> recovery-branch
