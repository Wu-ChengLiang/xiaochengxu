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
const TimePickerScroller = ({
  onTimeChange,
  defaultValue
}) => {
  const [dateList, setDateList] = taro.useState([]);
  const [hourList, setHourList] = taro.useState([]);
  const [minuteList, setMinuteList] = taro.useState([]);
  const [selectedIndices, setSelectedIndices] = taro.useState(() => {
    const now = /* @__PURE__ */ new Date();
    const currentHour = now.getHours();
    const nextHour = currentHour + 1;
    let hourIndex = 0;
    if (nextHour >= 9 && nextHour <= 21) {
      hourIndex = nextHour - 9;
    } else if (nextHour > 21) {
      hourIndex = 0;
    }
    return [2, hourIndex, 0];
  });
  taro.useEffect(() => {
    initializeLists();
  }, []);
  taro.useEffect(() => {
    if (dateList.length > 0 && hourList.length > 0 && minuteList.length > 0) {
      const selectedDate = dateList[selectedIndices[0]];
      const selectedHour = hourList[selectedIndices[1]];
      const selectedMinute = minuteList[selectedIndices[2]];
      onTimeChange(
        selectedDate.fullDate,
        selectedHour,
        selectedMinute
      );
    }
  }, [selectedIndices, dateList, hourList, minuteList]);
  const initializeLists = () => {
    const dates = [];
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    for (let i = -2; i <= 2; i++) {
      const date = vendors.dayjs().add(i, "day");
      const isToday = i === 0;
      dates.push({
        date: isToday ? "今天" : `${date.month() + 1}月${date.date()}日`,
        weekday: isToday ? "" : weekdays[date.day()],
        fullDate: date.format("YYYY-MM-DD"),
        dateObj: date.toDate()
      });
    }
    setDateList(dates);
    const hours = [];
    for (let i = 9; i <= 21; i++) {
      hours.push(`${i}点`);
    }
    setHourList(hours);
    const minutes = [];
    for (let i = 0; i < 60; i += 10) {
      minutes.push(`${i.toString().padStart(2, "0")}分`);
    }
    setMinuteList(minutes);
    const now = vendors.dayjs();
    const currentHour = now.hour();
    const nextHour = currentHour + 1;
    let defaultDateIndex = 2;
    let defaultHourIndex = 1;
    let defaultMinuteIndex = 0;
    if (nextHour >= 9 && nextHour <= 21) {
      defaultHourIndex = nextHour - 9;
    } else if (nextHour > 21) {
      defaultDateIndex = 3;
      defaultHourIndex = 0;
    } else {
      defaultHourIndex = 0;
    }
    const finalIndices = defaultValue ? [defaultValue.date, defaultValue.hour, defaultValue.minute] : [defaultDateIndex, defaultHourIndex, defaultMinuteIndex];
    setSelectedIndices(finalIndices);
  };
  const handleChange = (e) => {
    const { value } = e.detail;
    setSelectedIndices(value);
  };
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "time-picker-scroller", children: /* @__PURE__ */ taro.jsxs(
    taro.PickerView,
    {
      indicatorStyle: "height: 50px; background-color: rgba(0,0,0,0.05);",
      style: { width: "100%", height: "200px" },
      value: selectedIndices,
      onChange: handleChange,
      children: [
        /* @__PURE__ */ taro.jsx(taro.PickerViewColumn, { children: dateList.map(
          (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "picker-item date-item", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: `date-text ${item.date === "今天" ? "today" : ""}`, children: item.date }),
            item.weekday && /* @__PURE__ */ taro.jsx(taro.Text, { className: "weekday-text", children: item.weekday })
          ] }, index2)
        ) }),
        /* @__PURE__ */ taro.jsx(taro.PickerViewColumn, { children: hourList.map(
          (hour, index2) => /* @__PURE__ */ taro.jsx(taro.View, { className: "picker-item hour-item", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "hour-text", children: hour }) }, index2)
        ) }),
        /* @__PURE__ */ taro.jsx(taro.PickerViewColumn, { children: minuteList.map(
          (minute, index2) => /* @__PURE__ */ taro.jsx(taro.View, { className: "picker-item minute-item", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "minute-text", children: minute }) }, index2)
        ) })
      ]
    }
  ) });
};
const index = "";
const StoreAppointmentPage = () => {
  var _a;
  const router = taro.taroExports.useRouter();
  const { id } = router.params;
  const [store, setStore] = taro.useState(null);
  const [selectedDate, setSelectedDate] = taro.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [selectedHour, setSelectedHour] = taro.useState("10点");
  const [selectedMinute, setSelectedMinute] = taro.useState("00分");
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    loadStoreData();
  }, [id]);
  const loadStoreData = () => __async(exports, null, function* () {
    try {
      const [storeRes, userLocation] = yield Promise.all(
        [
          common.storeService.getStoreDetail(id),
          common.getLocationService.getCurrentLocation()
        ]
      );
      const storeDataRaw = storeRes.data;
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
      setStore(storeDataFinal);
    } catch (error) {
      taro.Taro.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleTimeChange = (date, hour, minute) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  };
  const handleCallStore = () => {
    if (store == null ? void 0 : store.phone) {
      taro.Taro.makePhoneCall({
        phoneNumber: store.phone
      });
    }
  };
  const handleShowLocation = () => {
    if ((store == null ? void 0 : store.latitude) && (store == null ? void 0 : store.longitude)) {
      taro.Taro.openLocation({
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.name,
        address: store.address
      });
    }
  };
  const handleSubmit = () => {
    if (!selectedHour || !selectedMinute) {
      taro.Taro.showToast({
        title: "请选择预约时间",
        icon: "none"
      });
      return;
    }
    const timeString = `${selectedHour.replace("点", "")}:${selectedMinute.replace("分", "")}`;
    const params = {
      storeId: id,
      storeName: (store == null ? void 0 : store.name) || "",
      selectedDate,
      selectedTime: timeString,
      from: "store"
    };
    taro.Taro.navigateTo({
      url: `/pages/appointment/symptom/index?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`
    });
  };
  const getFormattedDateTime = () => {
    if (!selectedDate || !selectedHour || !selectedMinute) {
      return "请选择时间";
    }
    const dateText = selectedDate === (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ? "今天" : selectedDate;
    const hourText = selectedHour.replace("点", "");
    const minuteText = selectedMinute.replace("分", "");
    return `${dateText} ${hourText}:${minuteText}`;
  };
  if (!store)
    return null;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-appointment-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "store-header", children: /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "store-image",
        src: common.normalizeImageUrl(((_a = store.images) == null ? void 0 : _a[0]) || store.image),
        mode: "aspectFill"
      }
    ) }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "store-info", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-details", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
          store.distance !== void 0 && store.distance !== null && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance", children: [
            store.distance,
            "km"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "hours-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "business-hours", children: store.businessHours }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: `status ${store.status}`, children: [
            store.status === "normal" && "就近",
            store.status === "busy" && "繁忙",
            store.status === "full" && "爆满"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "address", children: store.address })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-buttons", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: "📞" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: "📍" })
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "appointment-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "预约时间" }),
      /* @__PURE__ */ taro.jsx(TimePickerScroller, { onTimeChange: handleTimeChange })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "selected-time", children: [
        "预约时间: ",
        getFormattedDateTime()
      ] }),
      /* @__PURE__ */ taro.jsx(
        vendors.AtButton,
        {
          className: "submit-btn",
          type: "primary",
          onClick: handleSubmit,
          disabled: !selectedHour || !selectedMinute,
          children: "选症状"
        }
      )
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "门店预约",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(StoreAppointmentPage, "pages/appointment/store/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
