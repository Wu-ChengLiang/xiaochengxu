<<<<<<< HEAD
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
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "business-hours", children: store.businessHours ? `${store.businessHours.start}-${store.businessHours.end}` : "营业时间未知" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: `status ${getStatusClass(store.status)}`, children: getStatusText(store.status) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "address", children: store.address })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: "📞" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: "📍" })
    ] })
  ] }) });
};
const index$2 = "";
const BookingSelector = taro.forwardRef(({
  services,
  onServiceSelect,
  onTimeSelect
}, ref) => {
  const [selectedServiceId, setSelectedServiceId] = taro.useState("");
  const [selectedService, setSelectedService] = taro.useState(null);
  const [selectedDate, setSelectedDate] = taro.useState("");
  const [selectedTime, setSelectedTime] = taro.useState("");
  taro.useImperativeHandle(ref, () => ({
    clearSelectedTime: () => {
      setSelectedTime("");
    }
  }), []);
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
});
BookingSelector.displayName = "BookingSelector";
const index$1 = "";
const ShoppingCart = ({
  items,
  therapist,
  onCheckout,
  onMaskClick,
  onContinue,
  hasPendingAction = false
}) => {
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
              title: "支付超时了呦，快快重新下单吧~",
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
    if (onMaskClick && hasPendingAction) {
      onMaskClick();
    }
    setIsExpanded(false);
  };
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
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
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "action", onClick: handleContinue, children: "继续预约" })
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
  const [sessionStartIndex, setSessionStartIndex] = taro.useState(-1);
  const [isAutoExpanded, setIsAutoExpanded] = taro.useState(false);
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
      const [therapistRes, storeData] = yield Promise.all(
        [
          common.therapistService.getTherapistDetail(therapistId),
          common.storeService.getStoreDetail(storeId)
        ]
      );
      console.log("Store data response:", storeData);
      console.log("Store data.data:", storeData.data);
      setTherapist(therapistRes.data);
      setStore(storeData.data);
      console.log("Store state after setting:", storeData.data);
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
    if (sessionStartIndex === -1) {
      setSessionStartIndex(cartItems.length);
      setIsAutoExpanded(true);
    }
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
  const handleCartMaskClick = () => {
    var _a;
    if (isAutoExpanded && sessionStartIndex >= 0) {
      const newItems = cartItems.slice(0, sessionStartIndex);
      setCartItems(newItems);
      (_a = bookingSelectorRef.current) == null ? void 0 : _a.clearSelectedTime();
    }
    setSessionStartIndex(-1);
    setIsAutoExpanded(false);
  };
  const handleCartContinue = () => {
    setSessionStartIndex(-1);
    setIsAutoExpanded(false);
  };
  const handleCheckout = () => {
    if (cartItems.length === 0)
      return;
    setSessionStartIndex(-1);
    setIsAutoExpanded(false);
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
      store && /* @__PURE__ */ taro.jsx(StoreInfo, { store }),
      /* @__PURE__ */ taro.jsx(
        BookingSelector,
        {
          ref: bookingSelectorRef,
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
        onCheckout: handleCheckout,
        onMaskClick: handleCartMaskClick,
        onContinue: handleCartContinue,
        hasPendingAction: isAutoExpanded && sessionStartIndex >= 0
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "推拿师预约"
};
Page(taro.createPageConfig(TherapistBookingPage, "pages/appointment/therapist/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=Object.defineProperty,s=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,a=(s,t,r)=>t in s?e(s,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[t]=r,i=(e,i)=>{for(var n in i||(i={}))t.call(i,n)&&a(e,n,i[n]);if(s)for(var n of s(i))r.call(i,n)&&a(e,n,i[n]);return e},n=(e,s,t)=>new Promise((r,a)=>{var i=e=>{try{o(t.next(e))}catch(s){a(s)}},n=e=>{try{o(t.throw(e))}catch(s){a(s)}},o=e=>e.done?r(e.value):Promise.resolve(e.value).then(i,n);o((t=t.apply(e,s)).next())});const o=require("../../../taro.js"),c=require("../../../common.js"),l="",x=({therapist:e})=>{const[s,t]=o.reactExports.useState(!1),r=i({level:"LV4",rating:e.rating||5,salesCount:e.serviceCount||10109,description:"\u6bd5\u4e1a\u4e8e\u6210\u90fd\u4e2d\u533b\u836f\u5927\u5b66\u9488\u7078\u63a8\u62ff\u4e13\u4e1a\u3002\u9ad8\u7ea7\u5eb7\u590d\u5e08 \u4ece\u4e1a18\u5e74\uff0c\u4e13\u7814\u8eab\u4f53\u75bc\u75db\u3001\u8fd0\u52a8\u5eb7\u590d\u3001\u4ea7\u540e\u5eb7\u590d\u3001\u4f53\u6001\u8c03\u7406\u3001\u7ecf\u7edc\u758f\u901a\u3001\u7f8e\u5bb9\u517b\u751f\u7b49"},e),a=()=>{t(!s)};return o.jsxRuntimeExports.jsxs(o.View,{className:"therapist-info",children:[o.jsxRuntimeExports.jsxs(o.View,{className:"therapist-header",children:[o.jsxRuntimeExports.jsx(o.View,{className:"avatar-wrapper",children:o.jsxRuntimeExports.jsx(o.Image,{className:"avatar",src:e.avatar,mode:"aspectFill"})}),o.jsxRuntimeExports.jsxs(o.View,{className:"basic-info",children:[o.jsxRuntimeExports.jsxs(o.View,{className:"name-row",children:[o.jsxRuntimeExports.jsx(o.Text,{className:"name",children:e.name}),o.jsxRuntimeExports.jsx(o.View,{className:"level",children:r.level})]}),o.jsxRuntimeExports.jsxs(o.View,{className:"stats-row",children:[o.jsxRuntimeExports.jsx(o.View,{className:"rating",children:o.jsxRuntimeExports.jsxs(o.Text,{className:"rating-score",children:[r.rating,"\u5206"]})}),o.jsxRuntimeExports.jsx(o.View,{className:"divider",children:"|"}),o.jsxRuntimeExports.jsx(o.View,{className:"sales",children:o.jsxRuntimeExports.jsxs(o.Text,{className:"sales-text",children:["\u9500\u91cf",r.salesCount,"\u5355"]})})]})]})]}),o.jsxRuntimeExports.jsxs(o.View,{className:"description-section",children:[o.jsxRuntimeExports.jsx(o.Text,{className:"description "+(s?"expanded":"collapsed"),children:r.description}),o.jsxRuntimeExports.jsxs(o.View,{className:"expand-toggle",onClick:a,children:[o.jsxRuntimeExports.jsx(o.Text,{className:"expand-text",children:s?"\u6536\u8d77":"\u5c55\u5f00"}),o.jsxRuntimeExports.jsx(o.Text,{className:"expand-icon "+(s?"up":"down"),children:s?"\u25b2":"\u25bc"})]})]})]})},m="",u=({store:e})=>{const s=e=>{switch(e){case"normal":return"\u5c31\u8fd1";case"busy":return"\u7e41\u5fd9";case"full":return"\u7206\u6ee1";default:return""}},t=e=>{switch(e){case"normal":return"status-normal";case"busy":return"status-busy";case"full":return"status-full";default:return""}},r=()=>{e.phone&&o.Taro.makePhoneCall({phoneNumber:e.phone})},a=()=>{e.location&&o.Taro.openLocation({latitude:e.location.latitude,longitude:e.location.longitude,name:e.name,address:e.address})};return o.jsxRuntimeExports.jsx(o.View,{className:"store-info",children:o.jsxRuntimeExports.jsxs(o.View,{className:"store-header",children:[o.jsxRuntimeExports.jsxs(o.View,{className:"store-details",children:[o.jsxRuntimeExports.jsxs(o.View,{className:"name-row",children:[o.jsxRuntimeExports.jsx(o.Text,{className:"store-name",children:e.name}),o.jsxRuntimeExports.jsxs(o.Text,{className:"distance",children:[e.distance||9,"km"]})]}),o.jsxRuntimeExports.jsxs(o.View,{className:"hours-row",children:[o.jsxRuntimeExports.jsx(o.Text,{className:"business-hours",children:e.businessHours?`${e.businessHours.start}-${e.businessHours.end}`:"\u8425\u4e1a\u65f6\u95f4\u672a\u77e5"}),o.jsxRuntimeExports.jsx(o.View,{className:`status ${t(e.status)}`,children:s(e.status)})]}),o.jsxRuntimeExports.jsx(o.Text,{className:"address",children:e.address})]}),o.jsxRuntimeExports.jsxs(o.View,{className:"action-buttons",children:[o.jsxRuntimeExports.jsx(o.View,{className:"action-btn",onClick:r,children:"\ud83d\udcde"}),o.jsxRuntimeExports.jsx(o.View,{className:"action-btn",onClick:a,children:"\ud83d\udccd"})]})]})})},p="",d=o.reactExports.forwardRef(({services:e,onServiceSelect:s,onTimeSelect:t},r)=>{const[a,i]=o.reactExports.useState(""),[n,c]=o.reactExports.useState(null),[l,x]=o.reactExports.useState(""),[m,u]=o.reactExports.useState("");o.reactExports.useImperativeHandle(r,()=>({clearSelectedTime:()=>{u("")}}),[]);const p=()=>{const e=[],s=new Date;for(let t=0;t<5;t++){const r=new Date(s);r.setDate(s.getDate()+t);const a=r.getMonth()+1,i=r.getDate(),n=["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],o=n[r.getDay()];e.push({key:r.toISOString().split("T")[0],display:0===t?"\u4eca\u5929":`${a}\u6708${i}\u65e5`,weekDay:0===t?"":o})}return e},d=()=>{const e=[];for(let s=9;s<=21;s++){const t=[];for(let e=0;e<60;e+=10){const r=`${s.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`,a=Math.random()>.3;t.push({time:r,available:a})}e.push({hour:`${s}:00`,slots:t})}return e},j=e=>{if(!m||!n)return!1;const s=m,t=n.duration,r=e=>{const[s,t]=e.split(":").map(Number);return 60*s+t},a=r(s),i=r(e),o=a+t;return i>=a&&i<o},h=e=>{i(e.id),c(e),s(e),u("")},E=e=>{x(e),u("")},R=(e,s)=>{if(!s||!l||!n)return;const r=e=>{const[s,t]=e.split(":").map(Number);return 60*s+t},a=r(e),i=a+n.duration;i>1320||(u(e),t(l,e),setTimeout(()=>{const e=o.taroDocumentProvider.querySelector(".checkout-btn:not(.disabled)");e&&e.click()},300))},N=p(),w=d();return o.jsxRuntimeExports.jsxs(o.View,{className:"booking-selector",children:[o.jsxRuntimeExports.jsxs(o.View,{className:"service-section",children:[o.jsxRuntimeExports.jsx(o.View,{className:"section-title",children:"\u9009\u62e9\u670d\u52a1"}),o.jsxRuntimeExports.jsx(o.ScrollView,{className:"service-tabs",scrollX:!0,children:e.map(e=>o.jsxRuntimeExports.jsxs(o.View,{className:"service-tab "+(a===e.id?"active":""),onClick:()=>h(e),children:[o.jsxRuntimeExports.jsx(o.Text,{className:"service-name",children:e.name}),o.jsxRuntimeExports.jsxs(o.View,{className:"service-info",children:[o.jsxRuntimeExports.jsxs(o.Text,{className:"service-duration",children:[e.duration,"\u5206\u949f"]}),o.jsxRuntimeExports.jsxs(o.Text,{className:"price",children:["\xa5",e.discountPrice||e.price]})]})]},e.id))})]}),a&&o.jsxRuntimeExports.jsxs(o.View,{className:"datetime-section",children:[o.jsxRuntimeExports.jsx(o.ScrollView,{className:"date-tabs",scrollX:!0,children:N.map(e=>o.jsxRuntimeExports.jsxs(o.View,{className:"date-tab "+(l===e.key?"active":""),onClick:()=>E(e.key),children:[o.jsxRuntimeExports.jsx(o.Text,{className:"date-display",children:e.display}),e.weekDay&&o.jsxRuntimeExports.jsx(o.Text,{className:"week-day",children:e.weekDay})]},e.key))}),l&&o.jsxRuntimeExports.jsx(o.ScrollView,{className:"time-grid-container",scrollY:!0,children:o.jsxRuntimeExports.jsx(o.View,{className:"time-grid-wrapper",children:w.map((e,s)=>o.jsxRuntimeExports.jsxs(o.View,{className:"time-row",children:[o.jsxRuntimeExports.jsx(o.Text,{className:"hour-label",children:e.hour}),o.jsxRuntimeExports.jsx(o.View,{className:"time-slots",children:e.slots.map((e,s)=>o.jsxRuntimeExports.jsx(o.View,{className:"time-slot "+(e.available?j(e.time)?"selected":"available":"disabled"),onClick:()=>R(e.time,e.available),children:o.jsxRuntimeExports.jsxs(o.Text,{className:"time-text",children:[":",e.time.split(":")[1]]})},s))})]},s))})})]})]})});d.displayName="BookingSelector";const j="",h=()=>{const e=o.taroExports.useRouter(),{therapistId:s,storeId:t}=e.params,[r,a]=o.reactExports.useState(null),[i,l]=o.reactExports.useState(null),[m,p]=o.reactExports.useState(!0),[j,h]=o.reactExports.useState(""),[E,R]=o.reactExports.useState([]),[N,w]=o.reactExports.useState(null),[g,v]=o.reactExports.useState(-1),[S,V]=o.reactExports.useState(!1),b=o.reactExports.useRef(null),f=c.symptomServices.map(e=>({id:e.id,name:e.name,duration:e.duration,price:e.price,discountPrice:e.discountPrice,description:e.description,tag:e.tag}));o.reactExports.useEffect(()=>{T()},[s,t]);const T=()=>n(exports,null,function*(){try{if(p(!0),h(""),console.log("TherapistBookingPage params:",{therapistId:s,storeId:t}),!s||!t)return console.error("Missing required params:",{therapistId:s,storeId:t}),void h("\u53c2\u6570\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8fdb\u5165");const[e,r]=yield Promise.all([c.therapistService.getTherapistDetail(s),c.storeService.getStoreDetail(t)]);console.log("Store data response:",r),console.log("Store data.data:",r.data),a(e.data),l(r.data),console.log("Store state after setting:",r.data)}catch(e){console.error("Failed to load data:",e),h("\u52a0\u8f7d\u6570\u636e\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5")}finally{p(!1)}}),y=e=>{w(e)},k=(e,s)=>{if(!N||!r)return;-1===g&&(v(E.length),V(!0));const t={serviceId:N.id,serviceName:N.name,duration:N.duration,price:N.price,discountPrice:N.discountPrice,date:e,time:s,therapistName:r.name,therapistAvatar:r.avatar},a=E.findIndex(t=>t.date===e&&t.time===s);if(a>=0){const e=[...E];e[a]=t,R(e),o.Taro.showToast({title:"\u5df2\u66f4\u65b0\u8be5\u65f6\u6bb5\u9884\u7ea6",icon:"success"})}else R([...E,t]),o.Taro.showToast({title:"\u5df2\u6dfb\u52a0\u5230\u8d2d\u7269\u8f66",icon:"success"})},P=()=>{var e;if(S&&g>=0){const s=E.slice(0,g);R(s),null==(e=b.current)||e.clearSelectedTime()}v(-1),V(!1)},C=()=>{v(-1),V(!1)},I=()=>{if(0===E.length)return;v(-1),V(!1);const e={therapistId:s,storeId:t,items:JSON.stringify(E)};o.Taro.navigateTo({url:`/pages/booking/confirm/index?${Object.entries(e).map(([e,s])=>`${e}=${encodeURIComponent(s)}`).join("&")}`})};return m?o.jsxRuntimeExports.jsx(o.View,{className:"therapist-booking-page",children:o.jsxRuntimeExports.jsx(o.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})}):!j&&r&&i?o.jsxRuntimeExports.jsxs(o.View,{className:"therapist-booking-page",children:[o.jsxRuntimeExports.jsxs(o.ScrollView,{className:"main-content",scrollY:!0,children:[o.jsxRuntimeExports.jsx(x,{therapist:r}),i&&o.jsxRuntimeExports.jsx(u,{store:i}),o.jsxRuntimeExports.jsx(d,{ref:b,services:f,onServiceSelect:y,onTimeSelect:k})]}),o.jsxRuntimeExports.jsx(c.ShoppingCart,{items:E,therapist:r,onCheckout:I,onMaskClick:P,onContinue:C,hasPendingAction:S&&g>=0})]}):o.jsxRuntimeExports.jsx(o.View,{className:"therapist-booking-page",children:o.jsxRuntimeExports.jsx(o.View,{className:"error",children:j||"\u6570\u636e\u52a0\u8f7d\u5931\u8d25"})})};var E={navigationBarTitleText:"\u63a8\u62ff\u5e08\u9884\u7ea6"};Page(o.createPageConfig(h,"pages/appointment/therapist/index",{root:{cn:[]}},E||{}));
>>>>>>> recovery-branch
