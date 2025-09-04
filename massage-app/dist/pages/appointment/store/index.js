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
const StoreAppointmentPage = () => {
  const router = taro.taroExports.useRouter();
  const { id } = router.params;
  const [store, setStore] = taro.useState(null);
  const [selectedDate, setSelectedDate] = taro.useState("");
  const [selectedTime, setSelectedTime] = taro.useState("");
  const [timeSlots, setTimeSlots] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    loadStoreData();
    generateTimeSlots();
  }, [id]);
  const loadStoreData = () => __async(exports, null, function* () {
    try {
      const storeData = yield common.storeService.getStoreDetail(id);
      setStore(storeData);
    } catch (error) {
      taro.Taro.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const generateTimeSlots = () => {
    const slots = [];
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    for (let i = 0; i < 7; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + i);
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
      const weekday = weekdays[date.getDay()];
      const daySlots = [
        { time: "10:00", points: 8, duration: 0, available: i > 0 },
        { time: "11:00", points: 9, duration: 10, available: true },
        { time: "12:00", points: 10, duration: 20, available: true },
        { time: "14:00", points: 10, duration: 0, available: true },
        { time: "15:00", points: 9, duration: 10, available: true },
        { time: "16:00", points: 8, duration: 20, available: i !== 2 },
        { time: "17:00", points: 8, duration: 30, available: true },
        { time: "18:00", points: 9, duration: 0, available: true },
        { time: "19:00", points: 10, duration: 0, available: true },
        { time: "20:00", points: 10, duration: 10, available: true }
      ];
      slots.push({
        date: dateStr,
        weekday,
        slots: daySlots
      });
    }
    setTimeSlots(slots);
    if (slots.length > 1) {
      setSelectedDate(slots[1].date);
    }
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  const handleCallStore = () => {
    if (store == null ? void 0 : store.phone) {
      taro.Taro.makePhoneCall({
        phoneNumber: store.phone
      });
    }
  };
  const handleShowLocation = () => {
    if (store == null ? void 0 : store.location) {
      taro.Taro.openLocation({
        latitude: store.location.latitude,
        longitude: store.location.longitude,
        name: store.name,
        address: store.address
      });
    }
  };
  const handleSubmit = () => {
    if (!selectedTime) {
      taro.Taro.showToast({
        title: "请选择预约时间",
        icon: "none"
      });
      return;
    }
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=store&id=${id}&date=${selectedDate}&time=${selectedTime}`
    });
  };
  const getCurrentTimeSlot = () => {
    const current = timeSlots.find((slot) => slot.date === selectedDate);
    return (current == null ? void 0 : current.slots) || [];
  };
  if (!store)
    return null;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-appointment-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-header", children: [
      /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "store-image",
          src: store.images[0],
          mode: "aspectFill"
        }
      ),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-actions", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "action-text", children: "一客一换" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "action-text", children: "干净整洁" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "store-info", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
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
          /* @__PURE__ */ taro.jsxs(taro.View, { className: `status ${store.status}`, children: [
            store.status === "normal" && "就近",
            store.status === "busy" && "繁忙",
            store.status === "full" && "爆满"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "address", children: store.address })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "phone", size: "24", color: "#D9455F" }) }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "map-pin", size: "24", color: "#D9455F" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "appointment-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "预约时间" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-tips", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-item main", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount", children: "9.5折" }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-content", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "tip-title", children: "提前30分钟" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "tip-desc", children: "10:00开始" })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "tip-item", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount", children: "9.0折" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "tip-desc", children: [
            "错峰预约",
            /* @__PURE__ */ taro.jsx("br", {}),
            "点击前往"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollX: true, className: "date-selector", children: timeSlots.map(
        (slot) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `date-item ${selectedDate === slot.date ? "active" : ""}`,
            onClick: () => handleDateSelect(slot.date),
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "date", children: slot.date }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "weekday", children: slot.weekday })
            ]
          },
          slot.date
        )
      ) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "time-slots", children: getCurrentTimeSlot().map(
        (slot) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: `time-slot ${!slot.available ? "disabled" : ""} ${selectedTime === slot.time ? "active" : ""}`,
            onClick: () => slot.available && handleTimeSelect(slot.time),
            children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "time-info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "time", children: slot.time }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "points", children: [
                  slot.points,
                  "点"
                ] })
              ] }),
              slot.duration > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "duration", children: [
                slot.duration,
                "分"
              ] })
            ]
          },
          slot.time
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "selected-time", children: [
        "预约时间：",
        selectedDate,
        " ",
        selectedTime || "请选择时间"
      ] }),
      /* @__PURE__ */ taro.jsx(
        vendors.AtButton,
        {
          className: "submit-btn",
          type: "primary",
          onClick: handleSubmit,
          disabled: !selectedTime,
          children: "选症状"
        }
      )
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "门店预约"
};
Page(taro.createPageConfig(StoreAppointmentPage, "pages/appointment/store/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
