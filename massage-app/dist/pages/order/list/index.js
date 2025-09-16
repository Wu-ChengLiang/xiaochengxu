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
  "backgroundTextStyle": "dark",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(OrderListPage, "pages/order/list/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
