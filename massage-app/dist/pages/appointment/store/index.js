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
  const [selectedDate, setSelectedDate] = taro.useState("");
  const [selectedHour, setSelectedHour] = taro.useState("");
  const [selectedMinute, setSelectedMinute] = taro.useState("");
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    loadStoreData();
  }, [id]);
  const loadStoreData = () => __async(exports, null, function* () {
    try {
      const storeRes = yield common.storeService.getStoreDetail(id);
      setStore(storeRes.data);
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
        src: ((_a = store.images) == null ? void 0 : _a[0]) || store.image || "/static/images/default-store.jpg",
        mode: "aspectFill"
      }
    ) }),
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
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleCallStore, children: "📞" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "action-btn", onClick: handleShowLocation, children: "📍" })
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
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "tip-desc", children: "错峰预约" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "tip-desc", children: "点击前往" })
        ] })
      ] }),
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
  "navigationBarTitleText": "门店预约"
};
Page(taro.createPageConfig(StoreAppointmentPage, "pages/appointment/store/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=(e,s,t)=>new Promise((a,i)=>{var r=e=>{try{o(t.next(e))}catch(s){i(s)}},n=e=>{try{o(t.throw(e))}catch(s){i(s)}},o=e=>e.done?a(e.value):Promise.resolve(e.value).then(r,n);o((t=t.apply(e,s)).next())});const s=require("../../../taro.js"),t=require("../../../vendors.js"),a=require("../../../common.js"),i="",r=({onTimeChange:e,defaultValue:a})=>{const[i,r]=s.reactExports.useState([]),[n,o]=s.reactExports.useState([]),[x,c]=s.reactExports.useState([]),[l,m]=s.reactExports.useState(()=>{const e=new Date,s=e.getHours(),t=s+1;let a=0;return t>=9&&t<=21?a=t-9:t>21&&(a=0),[2,a,0]});s.reactExports.useEffect(()=>{u()},[]),s.reactExports.useEffect(()=>{if(i.length>0&&n.length>0&&x.length>0){const s=i[l[0]],t=n[l[1]],a=x[l[2]];e(s.fullDate,t,a)}},[l,i,n,x]);const u=()=>{const e=[],s=["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"];for(let a=-2;a<=2;a++){const i=t.dayjs().add(a,"day"),r=0===a;e.push({date:r?"\u4eca\u5929":`${i.month()+1}\u6708${i.date()}\u65e5`,weekday:r?"":s[i.day()],fullDate:i.format("YYYY-MM-DD"),dateObj:i.toDate()})}r(e);const i=[];for(let t=9;t<=21;t++)i.push(`${t}\u70b9`);o(i);const n=[];for(let t=0;t<60;t+=10)n.push(`${t.toString().padStart(2,"0")}\u5206`);c(n);const x=t.dayjs(),l=x.hour(),u=l+1;let d=2,p=1,j=0;u>=9&&u<=21?p=u-9:u>21?(d=3,p=0):p=0;const h=a?[a.date,a.hour,a.minute]:[d,p,j];m(h)},d=e=>{const{value:s}=e.detail;m(s)};return s.jsxRuntimeExports.jsx(s.View,{className:"time-picker-scroller",children:s.jsxRuntimeExports.jsxs(s.PickerView,{indicatorStyle:"height: 50px; background-color: rgba(0,0,0,0.05);",style:{width:"100%",height:"200px"},value:l,onChange:d,children:[s.jsxRuntimeExports.jsx(s.PickerViewColumn,{children:i.map((e,t)=>s.jsxRuntimeExports.jsxs(s.View,{className:"picker-item date-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"date-text "+("\u4eca\u5929"===e.date?"today":""),children:e.date}),e.weekday&&s.jsxRuntimeExports.jsx(s.Text,{className:"weekday-text",children:e.weekday})]},t))}),s.jsxRuntimeExports.jsx(s.PickerViewColumn,{children:n.map((e,t)=>s.jsxRuntimeExports.jsx(s.View,{className:"picker-item hour-item",children:s.jsxRuntimeExports.jsx(s.Text,{className:"hour-text",children:e})},t))}),s.jsxRuntimeExports.jsx(s.PickerViewColumn,{children:x.map((e,t)=>s.jsxRuntimeExports.jsx(s.View,{className:"picker-item minute-item",children:s.jsxRuntimeExports.jsx(s.Text,{className:"minute-text",children:e})},t))})]})})},n="",o=()=>{var i;const n=s.taroExports.useRouter(),{id:o}=n.params,[x,c]=s.reactExports.useState(null),[l,m]=s.reactExports.useState((new Date).toISOString().split("T")[0]),[u,d]=s.reactExports.useState("10\u70b9"),[p,j]=s.reactExports.useState("00\u5206"),[h,E]=s.reactExports.useState(!0);s.reactExports.useEffect(()=>{R()},[o]);const R=()=>e(exports,null,function*(){try{const e=yield a.storeService.getStoreDetail(o);c(e.data)}catch(e){s.Taro.showToast({title:"\u52a0\u8f7d\u5931\u8d25",icon:"none"})}finally{E(!1)}}),N=(e,s,t)=>{m(e),d(s),j(t)},w=()=>{(null==x?void 0:x.phone)&&s.Taro.makePhoneCall({phoneNumber:x.phone})},g=()=>{(null==x?void 0:x.location)&&s.Taro.openLocation({latitude:x.location.latitude,longitude:x.location.longitude,name:x.name,address:x.address})},T=()=>{if(!u||!p)return void s.Taro.showToast({title:"\u8bf7\u9009\u62e9\u9884\u7ea6\u65f6\u95f4",icon:"none"});const e=`${u.replace("\u70b9","")}:${p.replace("\u5206","")}`,t={storeId:o,storeName:(null==x?void 0:x.name)||"",selectedDate:l,selectedTime:e,from:"store"};s.Taro.navigateTo({url:`/pages/appointment/symptom/index?${Object.entries(t).map(([e,s])=>`${e}=${encodeURIComponent(s)}`).join("&")}`})},V=()=>{if(!l||!u||!p)return"\u8bf7\u9009\u62e9\u65f6\u95f4";const e=l===(new Date).toISOString().split("T")[0]?"\u4eca\u5929":l,s=u.replace("\u70b9",""),t=p.replace("\u5206","");return`${e} ${s}:${t}`};return x?s.jsxRuntimeExports.jsxs(s.View,{className:"store-appointment-page",children:[s.jsxRuntimeExports.jsx(s.View,{className:"store-header",children:s.jsxRuntimeExports.jsx(s.Image,{className:"store-image",src:(null==(i=x.images)?void 0:i[0])||x.image||"/static/images/default-store.jpg",mode:"aspectFill"})}),s.jsxRuntimeExports.jsx(s.View,{className:"store-info",children:s.jsxRuntimeExports.jsxs(s.View,{className:"info-header",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"store-details",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"name-row",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"store-name",children:x.name}),s.jsxRuntimeExports.jsxs(s.Text,{className:"distance",children:[x.distance||9,"km"]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"hours-row",children:[s.jsxRuntimeExports.jsxs(s.Text,{className:"business-hours",children:[x.businessHours.start,"-",x.businessHours.end]}),s.jsxRuntimeExports.jsxs(s.View,{className:`status ${x.status}`,children:["normal"===x.status&&"\u5c31\u8fd1","busy"===x.status&&"\u7e41\u5fd9","full"===x.status&&"\u7206\u6ee1"]})]}),s.jsxRuntimeExports.jsx(s.Text,{className:"address",children:x.address})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"action-buttons",children:[s.jsxRuntimeExports.jsx(s.View,{className:"action-btn",onClick:w,children:"\ud83d\udcde"}),s.jsxRuntimeExports.jsx(s.View,{className:"action-btn",onClick:g,children:"\ud83d\udccd"})]})]})}),s.jsxRuntimeExports.jsxs(s.View,{className:"appointment-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u9884\u7ea6\u65f6\u95f4"}),s.jsxRuntimeExports.jsxs(s.View,{className:"promotion-tips",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"tip-item main",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"discount",children:"9.5\u6298"}),s.jsxRuntimeExports.jsxs(s.View,{className:"tip-content",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"tip-title",children:"\u63d0\u524d30\u5206\u949f"}),s.jsxRuntimeExports.jsx(s.Text,{className:"tip-desc",children:"10:00\u5f00\u59cb"})]})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"tip-item",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"discount",children:"9.0\u6298"}),s.jsxRuntimeExports.jsx(s.Text,{className:"tip-desc",children:"\u9519\u5cf0\u9884\u7ea6"}),s.jsxRuntimeExports.jsx(s.Text,{className:"tip-desc",children:"\u70b9\u51fb\u524d\u5f80"})]})]}),s.jsxRuntimeExports.jsx(r,{onTimeChange:N})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"bottom-bar",children:[s.jsxRuntimeExports.jsxs(s.Text,{className:"selected-time",children:["\u9884\u7ea6\u65f6\u95f4: ",V()]}),s.jsxRuntimeExports.jsx(t.AtButton,{className:"submit-btn",type:"primary",onClick:T,disabled:!u||!p,children:"\u9009\u75c7\u72b6"})]})]}):null};var x={navigationBarTitleText:"\u95e8\u5e97\u9884\u7ea6"};Page(s.createPageConfig(o,"pages/appointment/store/index",{root:{cn:[]}},x||{}));
>>>>>>> recovery-branch
