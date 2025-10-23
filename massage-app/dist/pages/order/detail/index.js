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
const index$1 = "";
const ReviewModal = ({
  visible,
  orderInfo,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = taro.useState(5);
  const [content, setContent] = taro.useState("");
  const [selectedTags, setSelectedTags] = taro.useState([]);
  const [isSubmitting, setIsSubmitting] = taro.useState(false);
  const quickTags = [
    "手法专业",
    "服务态度好",
    "效果显著",
    "环境舒适",
    "准时守约",
    "物超所值"
  ];
  const getRatingText = (score) => {
    const textMap = {
      1: "很不满意",
      2: "不满意",
      3: "一般",
      4: "满意",
      5: "非常满意"
    };
    return textMap[score] || "";
  };
  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  const canSubmit = content.length >= 10 && !isSubmitting;
  const handleSubmit = () => __async(exports, null, function* () {
    var _a;
    if (!canSubmit)
      return;
    setIsSubmitting(true);
    try {
      const appointmentId = orderInfo.appointmentId || ((_a = orderInfo.extraData) == null ? void 0 : _a.appointmentId);
      if (!appointmentId) {
        throw new Error("无法获取预约信息，无法提交评价。请稍后重试。");
      }
      yield onSubmit({
        appointmentId,
        rating,
        content,
        tags: selectedTags
      });
      setRating(5);
      setContent("");
      setSelectedTags([]);
      taro.Taro.showToast({
        title: "评价成功",
        icon: "success",
        duration: 2e3
      });
      setTimeout(() => {
        onClose();
      }, 2e3);
    } catch (error) {
      taro.Taro.showToast({
        title: error.message || "评价失败",
        icon: "none",
        duration: 2e3
      });
    } finally {
      setIsSubmitting(false);
    }
  });
  const handleCancel = () => {
    if (content.length > 0 || selectedTags.length > 0) {
      taro.Taro.showModal({
        title: "确认取消",
        content: "已填写的内容将不会保存，确定取消吗？",
        success: (res) => {
          if (res.confirm) {
            setRating(5);
            setContent("");
            setSelectedTags([]);
            onClose();
          }
        }
      });
    } else {
      onClose();
    }
  };
  return /* @__PURE__ */ taro.jsx(
    vendors.AtFloatLayout,
    {
      isOpened: visible,
      title: "评价服务",
      onClose: handleCancel,
      children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "review-modal", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-header", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
          /* @__PURE__ */ taro.jsx(
            taro.Image,
            {
              className: "avatar",
              src: orderInfo.therapistAvatar || "https://img.yzcdn.cn/vant/cat.jpeg",
              mode: "aspectFill"
            }
          ),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "info", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "name", children: orderInfo.therapistName }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "service", children: orderInfo.serviceName })
          ] })
        ] }) }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "rating-section", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-label", children: "服务评分" }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "star-container", children: [
            /* @__PURE__ */ taro.jsx(
              vendors.AtRate,
              {
                value: rating,
                onChange: (value) => setRating(value),
                size: 28,
                max: 5
              }
            ),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-text", children: getRatingText(rating) })
          ] })
        ] }),
        rating >= 4 && /* @__PURE__ */ taro.jsxs(taro.View, { className: "quick-tags", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "tags-label", children: "快速评价" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "tags-container", children: quickTags.map(
            (tag) => /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: `tag ${selectedTags.includes(tag) ? "active" : ""}`,
                onClick: () => toggleTag(tag),
                children: tag
              },
              tag
            )
          ) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "content-section", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "content-label", children: "详细评价" }),
          /* @__PURE__ */ taro.jsx(
            vendors.AtTextarea,
            {
              value: content,
              onChange: (value) => setContent(value),
              placeholder: "分享您的服务体验，帮助其他顾客（1-500字）",
              maxLength: 500,
              height: 120,
              count: true,
              className: "content-textarea"
            }
          )
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-footer", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "buttons", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "btn-cancel", onClick: handleCancel, children: "取消" }),
          /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: `btn-submit ${canSubmit ? "" : "disabled"}`,
              onClick: handleSubmit,
              children: isSubmitting ? "提交中..." : "提交评价"
            }
          )
        ] }) })
      ] })
    }
  );
};
const index = "";
const OrderDetailPage = () => {
  const router = taro.taroExports.useRouter();
  const { orderNo } = router.params;
  const [orderInfo, setOrderInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [showReviewModal, setShowReviewModal] = taro.useState(false);
  const [hasReviewed, setHasReviewed] = taro.useState(false);
  taro.useEffect(() => {
    fetchOrderDetail();
  }, [orderNo]);
  const fetchOrderDetail = () => __async(exports, null, function* () {
    var _a;
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
      console.log("📋 订单详情获取成功:", {
        orderNo: order.orderNo,
        amount: order.amount,
        amountType: typeof order.amount,
        therapistAvatar: order.therapistAvatar,
        therapistName: order.therapistName,
        displayStatus: order.displayStatus
      });
      if (!order.amount && order.amount !== 0) {
        console.warn("⚠️ 警告：订单金额为空", { orderNo, amount: order.amount });
      }
      if (typeof order.amount !== "number") {
        console.error("❌ 错误：订单金额类型不正确", { orderNo, amount: order.amount, type: typeof order.amount });
      }
      setOrderInfo(order);
      if ((_a = order.extraData) == null ? void 0 : _a.appointmentId) {
        const canReview = yield common.reviewService.checkCanReview(order.extraData.appointmentId);
        setHasReviewed(!canReview);
      } else {
        setHasReviewed(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("❌ 获取订单详情失败:", error);
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
    taro.Taro.switchTab({
      url: "/pages/appointment/index"
    });
  };
  const handleCreateReview = () => {
    setShowReviewModal(true);
  };
  const handleViewReview = () => __async(exports, null, function* () {
    var _a;
    if (!((_a = orderInfo == null ? void 0 : orderInfo.extraData) == null ? void 0 : _a.appointmentId)) {
      taro.Taro.showToast({
        title: "暂无评价",
        icon: "none"
      });
      return;
    }
    try {
      const reviewDetail = yield common.reviewService.getReviewDetail(orderInfo.extraData.appointmentId);
      taro.Taro.showModal({
        title: "我的评价",
        content: `评分：${reviewDetail.rating}星
${reviewDetail.content}`,
        showCancel: false
      });
    } catch (error) {
      taro.Taro.showToast({
        title: "评价信息获取失败",
        icon: "none"
      });
    }
  });
  const handleSubmitReview = (reviewData) => __async(exports, null, function* () {
    try {
      const fullReviewData = __spreadProps(__spreadValues({}, reviewData), {
        therapistId: orderInfo == null ? void 0 : orderInfo.therapistId
      });
      yield common.reviewService.createReview(fullReviewData);
      setHasReviewed(true);
      setShowReviewModal(false);
      fetchOrderDetail();
    } catch (error) {
      throw error;
    }
  });
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
  const getStatusText = (order) => {
    const status = order.displayStatus || order.paymentStatus;
    const statusTextMap = {
      "pending": "待支付",
      "paid": "待服务",
      "serving": "服务中",
      "completed": "已完成",
      // 🚀 管理员标记的完成状态
      "cancelled": "已取消",
      "refunded": "已退款"
    };
    return statusTextMap[status] || status;
  };
  const getOrderSteps = (order) => {
    const status = order.displayStatus || order.paymentStatus;
    const allSteps = ["下单", "支付", "到店服务", "完成"];
    let current2 = 0;
    switch (status) {
      case "pending":
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
  const { steps, current } = getOrderSteps(orderInfo);
  const currentStatus = orderInfo.displayStatus || orderInfo.paymentStatus;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "order-detail-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-header", children: [
        /* @__PURE__ */ taro.jsx(
          vendors.AtIcon,
          {
            value: currentStatus === "paid" ? "check-circle" : "clock",
            size: "40",
            color: "#fff"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "status-text", children: getStatusText(orderInfo) })
      ] }),
      currentStatus !== "cancelled" && currentStatus !== "refunded" && /* @__PURE__ */ taro.jsx(taro.View, { className: "steps-container", children: /* @__PURE__ */ taro.jsx(
        vendors.AtSteps,
        {
          items: steps.map((step) => ({ title: step })),
          current,
          className: "order-steps"
        }
      ) })
    ] }),
    currentStatus === "paid" && /* @__PURE__ */ taro.jsxs(taro.View, { className: "qrcode-section", children: [
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
            orderInfo.startTime,
            "  "
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
        orderInfo.therapistAvatar && /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "therapist-avatar",
            src: orderInfo.therapistAvatar
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
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price", children: common.formatAmount(orderInfo.amount) }),
        "  "
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-section", children: [
      currentStatus === "paid" && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "button secondary", onClick: handleCall, children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "phone", size: "18" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { children: "联系门店" })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "button danger", onClick: handleCancel, children: "取消订单" })
      ] }),
      currentStatus === "serving" && /* @__PURE__ */ taro.jsxs(taro.View, { className: "button secondary", onClick: handleCall, children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "phone", size: "18" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { children: "联系门店" })
      ] }),
      (currentStatus === "completed" || currentStatus === "paid") && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
        !hasReviewed ? /* @__PURE__ */ taro.jsxs(taro.View, { className: "button primary", onClick: handleCreateReview, children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "star", size: "16" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { children: " 评价服务" })
        ] }) : /* @__PURE__ */ taro.jsx(taro.View, { className: "button secondary", onClick: handleViewReview, children: "查看评价" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "button primary", onClick: handleRebook, children: "再次预约" })
      ] }),
      ["cancelled", "refunded"].includes(currentStatus) && /* @__PURE__ */ taro.jsx(taro.View, { className: "button primary", onClick: handleRebook, children: "再次预约" })
    ] }),
    orderInfo && /* @__PURE__ */ taro.jsx(
      ReviewModal,
      {
        visible: showReviewModal,
        orderInfo,
        onClose: () => setShowReviewModal(false),
        onSubmit: handleSubmitReview
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "订单详情",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(OrderDetailPage, "pages/order/detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
