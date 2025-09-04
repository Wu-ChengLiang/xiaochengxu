"use strict";
var __defProp = Object.defineProperty;
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
const index$4 = "";
const TherapistInfo = ({ therapist }) => {
  const [isExpanded, setIsExpanded] = taro.useState(false);
  const therapistDetail = __spreadValues({
    level: "LV4",
    rating: therapist.rating || 5,
    salesCount: therapist.serviceCount || 10109,
    description: "毕业于成都中医药大学针灸推拿专业。高级康复师 从业18年，专研身体疼痛、运动康复、产后康复、体态调理、经络疏通、美容养生等"
  }, therapist);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "basic-info", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "name", children: therapist.name }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "level", children: therapistDetail.level })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "stats-row", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "rating", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "rating-score", children: [
            therapistDetail.rating,
            "分"
          ] }) }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "divider", children: "|" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "sales", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "sales-text", children: [
            "销量",
            therapistDetail.salesCount,
            "单"
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "description-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: `description ${isExpanded ? "expanded" : "collapsed"}`, children: therapistDetail.description }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "expand-toggle", onClick: toggleExpanded, children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "expand-text", children: isExpanded ? "收起" : "展开" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: `expand-icon ${isExpanded ? "up" : "down"}`, children: isExpanded ? "▲" : "▼" })
      ] })
    ] })
  ] });
};
const index$3 = "";
const StoreInfo = ({ store }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "normal":
        return "就近";
      case "busy":
        return "繁忙";
      case "full":
        return "爆满";
      default:
        return "";
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "normal":
        return "status-normal";
      case "busy":
        return "status-busy";
      case "full":
        return "status-full";
      default:
        return "";
    }
  };
  const handleCallStore = () => {
    if (store.phone) {
      taro.Taro.makePhoneCall({
        phoneNumber: store.phone
      });
    }
  };
  const handleShowLocation = () => {
    if (store.location) {
      taro.Taro.openLocation({
        latitude: store.location.latitude,
        longitude: store.location.longitude,
        name: store.name,
        address: store.address
      });
    }
  };
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "store-info", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-header", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-details", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-row", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance", children: [
          store.distance || 9,
          "km"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hours-row", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "business-hours", children: [
          store.businessHours.start,
          "-",
          store.businessHours.end
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: `status ${getStatusClass(store.status)}`, children: getStatusText(store.status) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "address", children: [
        store.address,
        " (电影院门口)"
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: "📞" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: "📍" })
    ] })
  ] }) });
};
const index$2 = "";
const BookingSelector = ({
  services,
  onServiceSelect,
  onTimeSelect
}) => {
  const [selectedServiceId, setSelectedServiceId] = taro.useState("");
  const [selectedService, setSelectedService] = taro.useState(null);
  const [selectedDate, setSelectedDate] = taro.useState("");
  const [selectedTime, setSelectedTime] = taro.useState("");
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
    const grid = [];
    for (let hour = 9; hour <= 21; hour++) {
      const hourSlots = [];
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const available = Math.random() > 0.3;
        hourSlots.push({
          time,
          available
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
      selectedDate && /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "time-grid-container", scrollY: true, children: /* @__PURE__ */ taro.jsx(taro.View, { className: "time-grid-wrapper", children: timeGrid.map(
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
};
const index$1 = "";
const ShoppingCart = ({ items, therapist, onCheckout }) => {
  const [isExpanded, setIsExpanded] = taro.useState(false);
  const [countdown, setCountdown] = taro.useState(180);
  const timerRef = taro.useRef(null);
  const totalOriginalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const totalDiscountPrice = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  const totalSavings = totalOriginalPrice - totalDiscountPrice;
  const hasItems = items.length > 0;
  taro.useEffect(() => {
    if (hasItems && isExpanded) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            taro.Taro.showToast({
              title: "预约已超时，请重新选择",
              icon: "none"
            });
            setIsExpanded(false);
            return 180;
          }
          return prev - 1;
        });
      }, 1e3);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasItems, isExpanded]);
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = /* @__PURE__ */ new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) {
      return "今天";
    }
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };
  const handleCheckoutClick = () => {
    if (!hasItems) {
      taro.Taro.showToast({
        title: "请先选择服务",
        icon: "none"
      });
      return;
    }
    setIsExpanded(true);
  };
  const handleMaskClick = () => {
    setIsExpanded(false);
  };
  const handleConfirmCheckout = () => {
    onCheckout();
  };
  return /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
    isExpanded && /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-mask", onClick: handleMaskClick }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "shopping-cart", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-bar", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-info", children: hasItems ? /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥",
          totalDiscountPrice
        ] }),
        totalSavings > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "savings", children: [
          "已优惠¥",
          totalSavings
        ] })
      ] }) : /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-text", children: "请选择服务项目" }) }),
      /* @__PURE__ */ taro.jsx(
        taro.View,
        {
          className: `checkout-btn ${!hasItems ? "disabled" : ""}`,
          onClick: handleCheckoutClick,
          children: "去结算"
        }
      )
    ] }) }),
    isExpanded && /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-expanded", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "expanded-header", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "title", children: [
          "已选推拿师(",
          items.length,
          ")位"
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "action", onClick: handleMaskClick, children: "继续预约" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "service-list", children: items.map(
        (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-item", children: [
          /* @__PURE__ */ taro.jsx(
            taro.Image,
            {
              className: "therapist-avatar",
              src: item.therapistAvatar || (therapist == null ? void 0 : therapist.avatar) || ""
            }
          ),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-info", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: item.therapistName }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "duration", children: [
                item.duration,
                "分钟"
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-detail", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: item.serviceName }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "info-time", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "time-text", children: [
              formatDate(item.date),
              " ",
              item.time,
              " 至 ",
              // 计算结束时间
              (() => {
                const [hour, minute] = item.time.split(":").map(Number);
                const endMinute = minute + item.duration;
                const endHour = hour + Math.floor(endMinute / 60);
                const finalMinute = endMinute % 60;
                return `${endHour}:${finalMinute.toString().padStart(2, "0")}`;
              })()
            ] }) })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "price-info", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price", children: [
            "¥",
            item.discountPrice || item.price
          ] }) })
        ] }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "可选增值项目" }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-list", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-item", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-name", children: "刮痧20分钟" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-price", children: "¥ 99" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "addon-action", children: "+" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-item", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "addon-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-name", children: "加钟20分钟" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "addon-price", children: "¥ 99" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "addon-action", children: "+" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "checkout-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-summary", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-icon", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "🛒" }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "badge", children: "1" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-detail", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "final-price", children: [
              "¥ ",
              totalDiscountPrice
            ] }),
            totalOriginalPrice > totalDiscountPrice && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
              "¥ ",
              totalOriginalPrice
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-tip", children: "已享受最大优惠减20元" })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "checkout-footer", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "countdown", children: [
            "支付倒计时: ",
            formatCountdown(countdown)
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "confirm-btn", onClick: handleConfirmCheckout, children: "去结算" })
        ] })
      ] })
    ] })
  ] });
};
const index = "";
const TherapistBookingPage = () => {
  const router = taro.taroExports.useRouter();
  const { therapistId, storeId } = router.params;
  const [therapist, setTherapist] = taro.useState(null);
  const [store, setStore] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [error, setError] = taro.useState("");
  const [cartItems, setCartItems] = taro.useState([]);
  const [selectedService, setSelectedService] = taro.useState(null);
  const mockServices = [
    { id: "1", name: "肩颈调理", duration: 60, price: 128, discountPrice: 98 },
    { id: "2", name: "全身推拿", duration: 90, price: 198, discountPrice: 158 },
    { id: "3", name: "足底按摩", duration: 45, price: 88 },
    { id: "4", name: "拔罐刮痧", duration: 30, price: 68, discountPrice: 58 },
    { id: "5", name: "中医理疗", duration: 120, price: 298, discountPrice: 238 }
  ];
  taro.useEffect(() => {
    loadData();
  }, [therapistId, storeId]);
  const loadData = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      setError("");
      const [therapistData, storeData] = yield Promise.all(
        [
          common.therapistService.getTherapistDetail(therapistId),
          common.storeService.getStoreDetail(storeId)
        ]
      );
      setTherapist(therapistData);
      setStore(storeData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("加载数据失败，请重试");
    } finally {
      setLoading(false);
    }
  });
  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };
  const handleTimeSelect = (date, time) => {
    if (!selectedService || !therapist)
      return;
    const newItem = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      discountPrice: selectedService.discountPrice,
      date,
      time,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    const existingIndex = cartItems.findIndex(
      (item) => item.date === date && item.time === time
    );
    if (existingIndex >= 0) {
      const newItems = [...cartItems];
      newItems[existingIndex] = newItem;
      setCartItems(newItems);
      taro.Taro.showToast({
        title: "已更新该时段预约",
        icon: "success"
      });
    } else {
      setCartItems([...cartItems, newItem]);
      taro.Taro.showToast({
        title: "已添加到购物车",
        icon: "success"
      });
    }
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
      /* @__PURE__ */ taro.jsx(TherapistInfo, { therapist }),
      /* @__PURE__ */ taro.jsx(StoreInfo, { store }),
      /* @__PURE__ */ taro.jsx(
        BookingSelector,
        {
          services: mockServices,
          onServiceSelect: handleServiceSelect,
          onTimeSelect: handleTimeSelect
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsx(
      ShoppingCart,
      {
        items: cartItems,
        therapist,
        onCheckout: handleCheckout
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
