<<<<<<< HEAD
"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
const OrderListPage = () => {
  const [current, setCurrent] = taro.useState(0);
  const [orders, setOrders] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  const tabList = [
    { title: "全部" },
    { title: "待支付" },
    { title: "待服务" },
    { title: "已完成" }
  ];
  const statusMap = {
    0: void 0,
    // 全部
    1: "pending_payment",
    // 待支付
    2: "paid",
    // 待服务
    3: "completed"
    // 已完成
  };
  taro.taroExports.useDidShow(() => {
    fetchOrders();
  });
  taro.useEffect(() => {
    fetchOrders();
  }, [current]);
  taro.taroExports.usePullDownRefresh(() => __async(exports, null, function* () {
    yield fetchOrders();
    taro.Taro.stopPullDownRefresh();
  }));
  const fetchOrders = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      const status = statusMap[current];
      const orderList = yield common.orderService.getOrderList(status);
      setOrders(orderList);
    } catch (error) {
      taro.Taro.showToast({
        title: "获取订单失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleTabClick = (index2) => {
    setCurrent(index2);
  };
  const handleOrderClick = (orderNo) => {
    taro.Taro.navigateTo({
      url: `/pages/order/detail/index?orderNo=${orderNo}`
    });
  };
  const handlePayOrder = (e, order) => __async(exports, null, function* () {
    e.stopPropagation();
    try {
      const paymentParams = yield common.orderService.getPaymentParams(order.orderNo);
      taro.Taro.requestPayment(__spreadProps(__spreadValues({}, paymentParams), {
        success: () => __async(exports, null, function* () {
          yield common.orderService.updateOrderStatus(order.orderNo, "paid");
          taro.Taro.showToast({
            title: "支付成功",
            icon: "success"
          });
          fetchOrders();
        }),
        fail: (err) => {
          if (err.errMsg !== "requestPayment:fail cancel") {
            taro.Taro.showToast({
              title: "支付失败",
              icon: "none"
            });
          }
        }
      }));
    } catch (error) {
      taro.Taro.showToast({
        title: "获取支付参数失败",
        icon: "none"
      });
    }
  });
  const handleCancelOrder = (e, order) => __async(exports, null, function* () {
    e.stopPropagation();
    taro.Taro.showModal({
      title: "取消订单",
      content: "确定要取消该订单吗？",
      success: (res) => __async(exports, null, function* () {
        if (res.confirm) {
          try {
            yield common.orderService.cancelOrder(order.orderNo);
            taro.Taro.showToast({
              title: "订单已取消",
              icon: "success"
            });
            fetchOrders();
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
  const handleRebookOrder = (e, order) => {
    e.stopPropagation();
    taro.Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${order.therapistId}&storeId=${order.storeId}`
    });
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
  const getStatusClass = (status) => {
    const statusClassMap = {
      "pending_payment": "status-pending",
      "paid": "status-paid",
      "serving": "status-serving",
      "completed": "status-completed",
      "cancelled": "status-cancelled",
      "refunded": "status-refunded"
    };
    return statusClassMap[status] || "";
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${month}月${day}日 ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };
  const renderOrderItem = (order) => /* @__PURE__ */ taro.jsxs(
    taro.View,
    {
      className: "order-item",
      onClick: () => handleOrderClick(order.orderNo),
      children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: order.storeName }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: `order-status ${getStatusClass(order.status)}`, children: getStatusText(order.status) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-content", children: [
          /* @__PURE__ */ taro.jsx(
            taro.Image,
            {
              className: "therapist-avatar",
              src: order.therapistAvatar || "https://img.yzcdn.cn/vant/cat.jpeg"
            }
          ),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-info", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-row", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: order.therapistName }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: order.serviceName })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-row", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "appointment-time", children: [
              "预约时间：",
              formatDate(`${order.appointmentDate} ${order.appointmentTime}`)
            ] }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-row", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "order-no", children: [
              "订单号：",
              order.orderNo
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-footer", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "实付：" }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
              "¥",
              order.totalAmount
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
            order.status === "pending_payment" && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "button cancel", onClick: (e) => handleCancelOrder(e, order), children: "取消订单" }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "button pay", onClick: (e) => handlePayOrder(e, order), children: "去支付" })
            ] }),
            order.status === "paid" && /* @__PURE__ */ taro.jsx(taro.View, { className: "button cancel", onClick: (e) => handleCancelOrder(e, order), children: "取消订单" }),
            (order.status === "completed" || order.status === "cancelled") && /* @__PURE__ */ taro.jsx(taro.View, { className: "button rebook", onClick: (e) => handleRebookOrder(e, order), children: "再次预约" })
          ] })
        ] })
      ]
    },
    order.orderNo
  );
  const renderEmpty = () => /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
    /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "file-generic", size: "60", color: "#ccc" }),
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-text", children: "暂无订单" })
  ] });
  const renderLoading = () => /* @__PURE__ */ taro.jsx(taro.View, { className: "loading-state", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "加载中..." }) });
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "order-list-page", children: /* @__PURE__ */ taro.jsx(
    vendors.AtTabs,
    {
      current,
      tabList,
      onClick: handleTabClick,
      className: "order-tabs",
      children: tabList.map(
        (tab, index2) => /* @__PURE__ */ taro.jsx(vendors.AtTabsPane, { current, index: index2, children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "order-list", children: loading ? renderLoading() : orders.length > 0 ? orders.map(renderOrderItem) : renderEmpty() }) }, index2)
      )
    }
  ) });
};
var config = {
  "navigationBarTitleText": "我的订单",
  "enablePullDownRefresh": true,
  "backgroundTextStyle": "dark"
};
Page(taro.createPageConfig(OrderListPage, "pages/order/list/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,a=(t,s,r)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[s]=r,i=(e,t)=>{for(var s in t||(t={}))n.call(t,s)&&a(e,s,t[s]);if(r)for(var s of r(t))o.call(t,s)&&a(e,s,t[s]);return e},c=(e,r)=>t(e,s(r)),l=(e,t,s)=>new Promise((r,n)=>{var o=e=>{try{i(s.next(e))}catch(t){n(t)}},a=e=>{try{i(s.throw(e))}catch(t){n(t)}},i=e=>e.done?r(e.value):Promise.resolve(e.value).then(o,a);i((s=s.apply(e,t)).next())});const x=require("../../../taro.js"),p=require("../../../vendors.js"),d=require("../../../common.js"),u="",m=()=>{const[e,t]=x.reactExports.useState(0),[s,r]=x.reactExports.useState([]),[n,o]=x.reactExports.useState(!0),a=[{title:"\u5168\u90e8"},{title:"\u5f85\u652f\u4ed8"},{title:"\u5f85\u670d\u52a1"},{title:"\u5df2\u5b8c\u6210"}],u={0:void 0,1:"pending_payment",2:"paid",3:"completed"};x.taroExports.useDidShow(()=>{m()}),x.reactExports.useEffect(()=>{m()},[e]),x.taroExports.usePullDownRefresh(()=>l(exports,null,function*(){yield m(),x.Taro.stopPullDownRefresh()}));const m=()=>l(exports,null,function*(){try{o(!0);const t=u[e],s=yield d.orderService.getOrderList(t);r(s)}catch(t){x.Taro.showToast({title:"\u83b7\u53d6\u8ba2\u5355\u5931\u8d25",icon:"none"})}finally{o(!1)}}),j=e=>{t(e)},h=e=>{x.Taro.navigateTo({url:`/pages/order/detail/index?orderNo=${e}`})},E=(e,t)=>l(exports,null,function*(){e.stopPropagation();try{const e=yield d.orderService.getPaymentParams(t.orderNo);x.Taro.requestPayment(c(i({},e),{success:()=>l(exports,null,function*(){yield d.orderService.updateOrderStatus(t.orderNo,"paid"),x.Taro.showToast({title:"\u652f\u4ed8\u6210\u529f",icon:"success"}),m()}),fail:e=>{"requestPayment:fail cancel"!==e.errMsg&&x.Taro.showToast({title:"\u652f\u4ed8\u5931\u8d25",icon:"none"})}}))}catch(s){x.Taro.showToast({title:"\u83b7\u53d6\u652f\u4ed8\u53c2\u6570\u5931\u8d25",icon:"none"})}}),g=(e,t)=>l(exports,null,function*(){e.stopPropagation(),x.Taro.showModal({title:"\u53d6\u6d88\u8ba2\u5355",content:"\u786e\u5b9a\u8981\u53d6\u6d88\u8be5\u8ba2\u5355\u5417\uff1f",success:e=>l(exports,null,function*(){if(e.confirm)try{yield d.orderService.cancelOrder(t.orderNo),x.Taro.showToast({title:"\u8ba2\u5355\u5df2\u53d6\u6d88",icon:"success"}),m()}catch(s){x.Taro.showToast({title:"\u53d6\u6d88\u5931\u8d25",icon:"none"})}})})}),w=(e,t)=>{e.stopPropagation(),x.Taro.switchTab({url:"/pages/appointment/index"})},N=e=>{const t={pending_payment:"\u5f85\u652f\u4ed8",paid:"\u5f85\u670d\u52a1",serving:"\u670d\u52a1\u4e2d",completed:"\u5df2\u5b8c\u6210",cancelled:"\u5df2\u53d6\u6d88",refunded:"\u5df2\u9000\u6b3e"};return t[e]||e},R=e=>{const t={pending_payment:"status-pending",paid:"status-paid",serving:"status-serving",completed:"status-completed",cancelled:"status-cancelled",refunded:"status-refunded"};return t[e]||""},T=e=>{const t=new Date(e),s=t.getMonth()+1,r=t.getDate(),n=t.getHours(),o=t.getMinutes();return`${s}\u6708${r}\u65e5 ${n.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`},f=e=>x.jsxRuntimeExports.jsxs(x.View,{className:"order-item",onClick:()=>h(e.orderNo),children:[x.jsxRuntimeExports.jsxs(x.View,{className:"order-header",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"store-name",children:e.storeName}),x.jsxRuntimeExports.jsx(x.Text,{className:`order-status ${R(e.status)}`,children:N(e.status)})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"order-content",children:[x.jsxRuntimeExports.jsx(x.Image,{className:"therapist-avatar",src:e.therapistAvatar||"https://img.yzcdn.cn/vant/cat.jpeg"}),x.jsxRuntimeExports.jsxs(x.View,{className:"order-info",children:[x.jsxRuntimeExports.jsxs(x.View,{className:"info-row",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"therapist-name",children:e.therapistName}),x.jsxRuntimeExports.jsx(x.Text,{className:"service-name",children:e.serviceName})]}),x.jsxRuntimeExports.jsx(x.View,{className:"info-row",children:x.jsxRuntimeExports.jsxs(x.Text,{className:"appointment-time",children:["\u9884\u7ea6\u65f6\u95f4\uff1a",T(`${e.appointmentDate} ${e.appointmentTime}`)]})}),x.jsxRuntimeExports.jsx(x.View,{className:"info-row",children:x.jsxRuntimeExports.jsxs(x.Text,{className:"order-no",children:["\u8ba2\u5355\u53f7\uff1a",e.orderNo]})})]})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"order-footer",children:[x.jsxRuntimeExports.jsxs(x.View,{className:"price-info",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"label",children:"\u5b9e\u4ed8\uff1a"}),x.jsxRuntimeExports.jsxs(x.Text,{className:"price",children:["\xa5",e.totalAmount]})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"action-buttons",children:["pending_payment"===e.status&&x.jsxRuntimeExports.jsxs(x.jsxRuntimeExports.Fragment,{children:[x.jsxRuntimeExports.jsx(x.View,{className:"button cancel",onClick:t=>g(t,e),children:"\u53d6\u6d88\u8ba2\u5355"}),x.jsxRuntimeExports.jsx(x.View,{className:"button pay",onClick:t=>E(t,e),children:"\u53bb\u652f\u4ed8"})]}),"paid"===e.status&&x.jsxRuntimeExports.jsx(x.View,{className:"button cancel",onClick:t=>g(t,e),children:"\u53d6\u6d88\u8ba2\u5355"}),("completed"===e.status||"cancelled"===e.status)&&x.jsxRuntimeExports.jsx(x.View,{className:"button rebook",onClick:e=>w(e),children:"\u518d\u6b21\u9884\u7ea6"})]})]})]},e.orderNo),y=()=>x.jsxRuntimeExports.jsxs(x.View,{className:"empty-state",children:[x.jsxRuntimeExports.jsx(p.AtIcon,{value:"file-generic",size:"60",color:"#ccc"}),x.jsxRuntimeExports.jsx(x.Text,{className:"empty-text",children:"\u6682\u65e0\u8ba2\u5355"})]}),v=()=>x.jsxRuntimeExports.jsx(x.View,{className:"loading-state",children:x.jsxRuntimeExports.jsx(x.Text,{children:"\u52a0\u8f7d\u4e2d..."})});return x.jsxRuntimeExports.jsx(x.View,{className:"order-list-page",children:x.jsxRuntimeExports.jsx(p.AtTabs,{current:e,tabList:a,onClick:j,className:"order-tabs",children:a.map((t,r)=>x.jsxRuntimeExports.jsx(p.AtTabsPane,{current:e,index:r,children:x.jsxRuntimeExports.jsx(x.ScrollView,{scrollY:!0,className:"order-list",children:n?v():s.length>0?s.map(f):y()})},r))})})};var j={navigationBarTitleText:"\u6211\u7684\u8ba2\u5355",enablePullDownRefresh:!0,backgroundTextStyle:"dark"};Page(x.createPageConfig(m,"pages/order/list/index",{root:{cn:[]}},j||{}));
>>>>>>> recovery-branch
