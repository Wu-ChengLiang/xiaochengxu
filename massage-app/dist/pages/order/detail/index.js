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
