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
const common = require("../../../common.js");
const vendors = require("../../../vendors.js");
const index$3 = "";
const TherapistInfo = ({ therapist, stats, reviews = [], reviewsLoading = false }) => {
  const [isExpanded, setIsExpanded] = taro.useState(false);
  const therapistDetail = __spreadValues({
    level: "LV4",
    // 暂时保持固定，后续可从API获取
    rating: (stats == null ? void 0 : stats.averageRating) || therapist.rating || 4.8,
    serviceCount: therapist.serviceCount || 0,
    // 使用API返回的真实服务次数
    reviewCount: (stats == null ? void 0 : stats.totalCount) || 0,
    description: therapist.bio || "专业推拿师，经验丰富，擅长各类疼痛调理和康复治疗"
  }, therapist);
  console.log("🔍 TherapistInfo Debug:", {
    therapistId: therapist.id,
    serviceCount: therapist.serviceCount,
    originalTherapist: therapist,
    therapistDetail
  });
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-header", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "avatar-wrapper", children: /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "avatar",
          src: therapist.avatar,
          mode: "aspectFill"
        }
      ) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "basic-info", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-row", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "name", children: therapist.name }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "level", children: therapistDetail.level })
      ] }) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "description-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: `description ${isExpanded ? "expanded" : "collapsed"}`, children: therapistDetail.description }),
      isExpanded && /* @__PURE__ */ taro.jsxs(taro.View, { className: "reviews-section", children: [
        stats && stats.totalCount > 0 && /* @__PURE__ */ taro.jsx(taro.View, { className: "review-stats-compact", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "stats-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "stats-title", children: "用户评价" }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "rating-info", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "score", children: stats.averageRating.toFixed(1) }),
            /* @__PURE__ */ taro.jsx(vendors.AtRate, { value: stats.averageRating, size: 12 }),
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "count", children: [
              "(",
              stats.totalCount,
              "条)"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "review-list-compact", children: [
          reviewsLoading ? /* @__PURE__ */ taro.jsx(taro.Text, { className: "loading-text", children: "加载评价中..." }) : reviews.length === 0 ? /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-text", children: "暂无评价" }) : reviews.slice(0, 3).map(
            (review) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "review-item-compact", children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "review-header-compact", children: [
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "user-info-compact", children: [
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "user-name", children: review.userName || "匿名用户" }),
                  /* @__PURE__ */ taro.jsx(vendors.AtRate, { value: review.rating, size: 10 })
                ] }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "review-date", children: formatDate(review.createdAt) })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "review-content-compact", children: review.content }),
              review.tags && review.tags.length > 0 && /* @__PURE__ */ taro.jsx(taro.View, { className: "review-tags-compact", children: review.tags.map(
                (tag, index2) => /* @__PURE__ */ taro.jsx(taro.Text, { className: "tag-compact", children: tag }, index2)
              ) })
            ] }, review.reviewId)
          ),
          reviews.length > 3 && /* @__PURE__ */ taro.jsx(taro.Text, { className: "more-reviews", children: "仅显示最近3条评价" })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "expand-toggle", onClick: toggleExpanded, children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "expand-text", children: isExpanded ? "收起" : "展开" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: `expand-icon ${isExpanded ? "up" : "down"}`, children: isExpanded ? "▲" : "▼" })
      ] })
    ] })
  ] });
};
const index$2 = "";
const StoreInfo = ({ store }) => {
  const handleCallStore = () => {
    if (store.phone) {
      taro.Taro.makePhoneCall({
        phoneNumber: store.phone
      });
    }
  };
  const handleShowLocation = () => {
    if (store.latitude && store.longitude) {
      taro.Taro.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.name,
        address: store.address
      });
    }
  };
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "store-info", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-header", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-details", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-row", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
        store.distance !== void 0 && store.distance !== null && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance", children: [
          store.distance,
          "km"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "hours-row", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "business-hours", children: store.businessHours }) }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "address", children: store.address })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: "📞" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: "📍" })
    ] })
  ] }) });
};
const index$1 = "";
const BookingSelector = taro.forwardRef(({
  services,
  therapistId,
  onServiceSelect,
  onTimeSelect
}, ref) => {
  const [selectedServiceId, setSelectedServiceId] = taro.useState("");
  const [selectedService, setSelectedService] = taro.useState(null);
  const [selectedDate, setSelectedDate] = taro.useState("");
  const [selectedTime, setSelectedTime] = taro.useState("");
  const [timeSlots, setTimeSlots] = taro.useState([]);
  const [loadingSlots, setLoadingSlots] = taro.useState(false);
  taro.useImperativeHandle(ref, () => ({
    clearSelectedTime: () => {
      setSelectedTime("");
    }
  }), []);
  taro.useEffect(() => {
    if (selectedDate && therapistId && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService, therapistId]);
  taro.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!taro.taroDocumentProvider.hidden && selectedDate && therapistId && selectedService) {
        console.log("页面重新可见，刷新时间段数据");
        fetchAvailableSlots();
      }
    };
    taro.taroDocumentProvider.addEventListener("visibilitychange", handleVisibilityChange);
    return () => taro.taroDocumentProvider.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [selectedDate, therapistId, selectedService]);
  const fetchAvailableSlots = () => __async(exports, null, function* () {
    if (!therapistId || !selectedDate || !selectedService)
      return;
    setLoadingSlots(true);
    try {
      const result = yield common.therapistService.getAvailableSlots(
        therapistId,
        selectedDate,
        selectedService.duration
      );
      console.log("获取到的可用时段数据：", result);
      if (result && result.slots && result.slots.length > 0) {
        const grid = [];
        const hourAvailability = /* @__PURE__ */ new Map();
        result.slots.forEach((slot) => {
          const hour = slot.time.split(":")[0];
          hourAvailability.set(hour, { available: slot.available, status: slot.status });
        });
        for (let hour = 9; hour <= 21; hour++) {
          const hourStr = hour.toString().padStart(2, "0");
          const hourSlots = [];
          const hourData = hourAvailability.get(hourStr) || { available: true, status: "available" };
          for (let minute = 0; minute < 60; minute += 10) {
            const time = `${hourStr}:${minute.toString().padStart(2, "0")}`;
            const slot = result.slots.find((s) => s.time === time);
            if (slot) {
              hourSlots.push({
                time,
                available: slot.available,
                status: slot.status
              });
            } else {
              hourSlots.push({
                time,
                available: hourData.available,
                status: hourData.status
              });
            }
          }
          grid.push(hourSlots);
        }
        setTimeSlots(grid);
      } else {
        console.log("API未返回有效时段数据，使用默认全部可用");
        const grid = [];
        for (let hour = 9; hour <= 21; hour++) {
          const hourSlots = [];
          for (let minute = 0; minute < 60; minute += 10) {
            const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            hourSlots.push({
              time,
              available: true,
              status: "available"
            });
          }
          grid.push(hourSlots);
        }
        setTimeSlots(grid);
      }
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
      const grid = [];
      for (let hour = 9; hour <= 21; hour++) {
        const hourSlots = [];
        for (let minute = 0; minute < 60; minute += 10) {
          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          hourSlots.push({
            time,
            available: true,
            status: "available"
          });
        }
        grid.push(hourSlots);
      }
      setTimeSlots(grid);
    } finally {
      setLoadingSlots(false);
    }
  });
  const generateDateList = () => {
    const dates = [];
    const today = /* @__PURE__ */ new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const weekDay = weekDays[date.getDay()];
      dates.push({
        key: date.toISOString().split("T")[0],
        display: i === 0 ? "今天" : `${month}月${day}日`,
        weekDay: i === 0 ? "" : weekDay
      });
    }
    return dates;
  };
  const generateTimeGrid = () => {
    if (timeSlots.length > 0) {
      const grid2 = timeSlots.map((hourSlots, index2) => {
        const hour = 9 + index2;
        return {
          hour: `${hour}:00`,
          slots: hourSlots
        };
      });
      return grid2;
    }
    const grid = [];
    for (let hour = 9; hour <= 21; hour++) {
      const hourSlots = [];
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        hourSlots.push({
          time,
          available: true
        });
      }
      grid.push({
        hour: `${hour}:00`,
        slots: hourSlots
      });
    }
    return grid;
  };
  const isTimeSlotSelected = (time) => {
    if (!selectedTime || !selectedService)
      return false;
    const startTime = selectedTime;
    const duration = selectedService.duration;
    const timeToMinutes = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      return hour * 60 + minute;
    };
    const startMinutes = timeToMinutes(startTime);
    const currentMinutes = timeToMinutes(time);
    const endMinutes = startMinutes + duration;
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };
  const handleServiceSelect = (service) => {
    setSelectedServiceId(service.id);
    setSelectedService(service);
    onServiceSelect(service);
    setSelectedTime("");
  };
  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
    setSelectedTime("");
    setTimeSlots([]);
  };
  const handleTimeSelect = (time, available) => {
    if (!available || !selectedDate || !selectedService)
      return;
    const timeToMinutes = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      return hour * 60 + minute;
    };
    const startMinutes = timeToMinutes(time);
    const endMinutes = startMinutes + selectedService.duration;
    if (endMinutes > 22 * 60) {
      return;
    }
    setSelectedTime(time);
    onTimeSelect(selectedDate, time);
    setTimeout(() => {
      const cartBtn = taro.taroDocumentProvider.querySelector(".checkout-btn:not(.disabled)");
      if (cartBtn) {
        cartBtn.click();
      }
    }, 300);
  };
  const dateList = generateDateList();
  const timeGrid = generateTimeGrid();
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "booking-selector", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-section", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "section-title", children: "选择服务" }),
      /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "service-tabs", scrollX: true, children: services.map(
        (service) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `service-tab ${selectedServiceId === service.id ? "active" : ""}`,
            onClick: () => handleServiceSelect(service),
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: service.name }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-info", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "service-duration", children: [
                  service.duration,
                  "分钟"
                ] }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
                  "¥",
                  service.discountPrice || service.price
                ] })
              ] })
            ]
          },
          service.id
        )
      ) })
    ] }),
    selectedServiceId && /* @__PURE__ */ taro.jsxs(taro.View, { className: "datetime-section", children: [
      /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "date-tabs", scrollX: true, children: dateList.map(
        (date) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `date-tab ${selectedDate === date.key ? "active" : ""}`,
            onClick: () => handleDateSelect(date.key),
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-display", children: date.display }),
              date.weekDay && /* @__PURE__ */ taro.jsx(taro.Text, { className: "week-day", children: date.weekDay })
            ]
          },
          date.key
        )
      ) }),
      selectedDate && /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "time-grid-container", scrollY: true, children: /* @__PURE__ */ taro.jsx(taro.View, { className: "time-grid-wrapper", children: loadingSlots ? /* @__PURE__ */ taro.jsx(taro.View, { className: "loading-slots", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "加载可用时段..." }) }) : timeGrid.map(
        (row, rowIndex) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "time-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "hour-label", children: row.hour }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "time-slots", children: row.slots.map(
            (slot, slotIndex) => /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: `time-slot ${slot.available ? isTimeSlotSelected(slot.time) ? "selected" : "available" : "disabled"}`,
                onClick: () => handleTimeSelect(slot.time, slot.available),
                children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "time-text", children: [
                  ":",
                  slot.time.split(":")[1]
                ] })
              },
              slotIndex
            )
          ) })
        ] }, rowIndex)
      ) }) })
    ] })
  ] });
});
BookingSelector.displayName = "BookingSelector";
const index = "";
const TherapistBookingPage = () => {
  const router = taro.taroExports.useRouter();
  const { therapistId, storeId } = router.params;
  const [therapist, setTherapist] = taro.useState(null);
  const [store, setStore] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [error, setError] = taro.useState("");
  const [reviews, setReviews] = taro.useState([]);
  const [reviewStats, setReviewStats] = taro.useState(null);
  const [reviewsLoading, setReviewsLoading] = taro.useState(false);
  const [cartItems, setCartItems] = taro.useState([]);
  const [selectedService, setSelectedService] = taro.useState(null);
  const bookingSelectorRef = taro.useRef(null);
  const mockServices = common.symptomServices.map((service) => ({
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    discountPrice: service.discountPrice,
    description: service.description,
    tag: service.tag
  }));
  taro.useEffect(() => {
    loadData();
  }, [therapistId, storeId]);
  taro.useEffect(() => {
    if (therapistId) {
      loadReviews();
    }
  }, [therapistId]);
  const loadData = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      setError("");
      console.log("TherapistBookingPage params:", { therapistId, storeId });
      if (!therapistId || !storeId) {
        console.error("Missing required params:", { therapistId, storeId });
        setError("参数错误，请重新进入");
        return;
      }
      const [therapistRes, storeData, userLocation] = yield Promise.all(
        [
          common.therapistService.getTherapistDetail(therapistId),
          common.storeService.getStoreDetail(storeId),
          common.getLocationService.getCurrentLocation()
        ]
      );
      console.log("Store data response:", storeData);
      console.log("Therapist data response:", therapistRes);
      const therapistData = therapistRes.data || therapistRes;
      const storeDataRaw = (storeData == null ? void 0 : storeData.data) || storeData;
      let storeDataFinal = __spreadValues({}, storeDataRaw);
      if ((storeDataRaw == null ? void 0 : storeDataRaw.latitude) && (storeDataRaw == null ? void 0 : storeDataRaw.longitude)) {
        const distance = common.getLocationService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          storeDataRaw.latitude,
          storeDataRaw.longitude
        );
        storeDataFinal = __spreadProps(__spreadValues({}, storeDataRaw), {
          distance
        });
      }
      setTherapist(therapistData);
      setStore(storeDataFinal);
      console.log("Store state after setting:", storeDataFinal);
      console.log("Therapist state after setting:", therapistData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("加载数据失败，请重试");
    } finally {
      setLoading(false);
    }
  });
  const loadReviews = () => __async(exports, null, function* () {
    if (!therapistId)
      return;
    try {
      setReviewsLoading(true);
      const [reviewsResponse, statsResponse] = yield Promise.all(
        [
          common.reviewService.getTherapistReviews(therapistId, 1, 10),
          common.reviewService.getReviewStats(therapistId)
        ]
      );
      setReviews(reviewsResponse.list || []);
      setReviewStats(statsResponse);
      if (statsResponse && therapist) {
        setTherapist(__spreadProps(__spreadValues({}, therapist), {
          rating: statsResponse.averageRating,
          ratingCount: statsResponse.totalCount
        }));
      }
    } catch (error2) {
      console.error("加载评价数据失败:", error2);
    } finally {
      setReviewsLoading(false);
    }
  });
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  const handleTimeSelect = (date, time) => {
    if (!selectedService || !therapist)
      return;
    const itemId = `${date}_${time}_${Date.now()}`;
    const newItem = {
      id: itemId,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      discountPrice: selectedService.discountPrice,
      date,
      time,
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    setCartItems([newItem]);
    taro.Taro.showToast({
      title: "已选择预约时间",
      icon: "success"
    });
  };
  const handleCartMaskClick = () => {
    var _a;
    setCartItems([]);
    (_a = bookingSelectorRef.current) == null ? void 0 : _a.clearSelectedTime();
  };
  const handleCheckout = () => {
    if (cartItems.length === 0)
      return;
    const params = {
      therapistId,
      storeId,
      items: JSON.stringify(cartItems)
    };
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`
    });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-booking-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (error || !therapist || !store) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-booking-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "error", children: error || "数据加载失败" }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-booking-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "main-content", scrollY: true, children: [
      /* @__PURE__ */ taro.jsx(
        TherapistInfo,
        {
          therapist,
          stats: reviewStats,
          reviews,
          reviewsLoading
        }
      ),
      store && /* @__PURE__ */ taro.jsx(StoreInfo, { store }),
      /* @__PURE__ */ taro.jsx(
        BookingSelector,
        {
          ref: bookingSelectorRef,
          services: mockServices,
          therapistId,
          onServiceSelect: handleServiceSelect,
          onTimeSelect: handleTimeSelect
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsx(
      common.ShoppingCart,
      {
        items: cartItems,
        therapist,
        onCheckout: handleCheckout,
        onMaskClick: handleCartMaskClick
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "推拿师预约",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(TherapistBookingPage, "pages/appointment/therapist/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
