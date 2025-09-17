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
const taro = require("../../taro.js");
const common = require("../../common.js");
const vendors = require("../../vendors.js");
class LocationService {
  // 获取用户当前位置
  getCurrentLocation() {
    return __async(this, null, function* () {
      try {
        const settingRes = yield taro.Taro.getSetting();
        const authSetting = (settingRes == null ? void 0 : settingRes.authSetting) || {};
        if (!authSetting["scope.userLocation"]) {
          yield taro.Taro.authorize({
            scope: "scope.userLocation"
          });
        }
        let res;
        try {
          res = yield taro.Taro.getLocation({
            type: "gcj02",
            // 国内火星坐标系
            isHighAccuracy: true
          });
        } catch (gcj02Error) {
          console.warn("gcj02坐标系不支持，尝试wgs84:", gcj02Error);
          res = yield taro.Taro.getLocation({
            type: "wgs84"
            // GPS原始坐标系
          });
        }
        return {
          latitude: res.latitude,
          longitude: res.longitude
        };
      } catch (error) {
        console.error("获取位置失败:", error);
        const errorMsg = (error == null ? void 0 : error.errMsg) || "";
        if (errorMsg.includes("auth deny") || errorMsg.includes("authorize:fail")) {
          taro.Taro.showModal({
            title: "提示",
            content: "需要获取您的位置信息来推荐附近门店",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                taro.Taro.openSetting();
              }
            }
          });
        }
        console.log("使用默认位置：上海市中心");
        return {
          latitude: 31.2304,
          longitude: 121.4737
        };
      }
    });
  }
  // 计算两点之间的距离（单位：公里）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const rad = Math.PI / 180;
    const R = 6371;
    const dLat = (lat2 - lat1) * rad;
    const dLng = (lng2 - lng1) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }
  // 格式化距离显示
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1e3)}m`;
    }
    return `${distance}km`;
  }
}
const getLocationService = new LocationService();
const index$3 = "";
const StoreCard = ({ store, onClick }) => {
  var _a;
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
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "store-card", onClick, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "store-image-wrapper", children: /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "store-image",
        src: ((_a = store.images) == null ? void 0 : _a[0]) || store.image || "/static/images/default-store.jpg",
        mode: "aspectFill"
      }
    ) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-info", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "business-hours", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "hours-text", children: [
          store.businessHours.start,
          "-",
          store.businessHours.end
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: `status ${getStatusClass(store.status)}`, children: getStatusText(store.status) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "store-address", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "address-text", numberOfLines: 1, children: store.address }) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-footer", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "📍" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance-text", children: [
            store.distance,
            "km"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(
          common.BookingButton,
          {
            size: "small"
          }
        )
      ] })
    ] })
  ] }) });
};
const index$2 = "";
const TherapistCard = ({ therapist, onClick }) => {
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-card", onClick, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
    /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "therapist-avatar",
        src: therapist.avatar,
        mode: "aspectFill"
      }
    ),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: therapist.name }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "📍" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance-text", children: [
            therapist.distance,
            "km"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "expertise-tags", children: therapist.expertise.map(
        (tag, index2) => /* @__PURE__ */ taro.jsx(taro.Text, { className: "expertise-tag", children: tag }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-footer", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "rating", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "⭐" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "rating-text", children: [
            therapist.rating,
            "分"
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "service-count", children: [
            "服务",
            therapist.serviceCount,
            "次"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(
          common.BookingButton,
          {
            size: "small"
          }
        )
      ] })
    ] })
  ] }) });
};
const index$1 = "";
const BottomSheet = ({
  visible,
  title,
  onClose,
  children,
  height = "70%"
}) => {
  const [animating, setAnimating] = taro.useState(false);
  const [internalVisible, setInternalVisible] = taro.useState(false);
  taro.useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      setTimeout(() => setAnimating(true), 50);
    } else {
      setAnimating(false);
      setTimeout(() => setInternalVisible(false), 300);
    }
  }, [visible]);
  const handleMaskClick = () => {
    onClose();
  };
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  if (!internalVisible)
    return null;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-sheet", onClick: handleMaskClick, children: [
    /* @__PURE__ */ taro.jsx(
      taro.View,
      {
        className: `bottom-sheet-mask ${animating ? "active" : ""}`
      }
    ),
    /* @__PURE__ */ taro.jsxs(
      taro.View,
      {
        className: `bottom-sheet-content ${animating ? "active" : ""}`,
        style: { height },
        onClick: handleContentClick,
        children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "sheet-header", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "sheet-title", children: title }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "close-btn", onClick: onClose, children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "close", size: "20", color: "#999" }) })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "sheet-body", children })
        ]
      }
    )
  ] });
};
const index = "";
const Appointment = () => {
  const [loading, setLoading] = taro.useState(true);
  const [stores, setStores] = taro.useState([]);
  const [allStores, setAllStores] = taro.useState([]);
  const [therapists, setTherapists] = taro.useState([]);
  const [userLocation, setUserLocation] = taro.useState({ latitude: 0, longitude: 0 });
  const [locationStatus, setLocationStatus] = taro.useState("loading");
  const [locationText, setLocationText] = taro.useState("正在获取位置...");
  const [showStoreSheet, setShowStoreSheet] = taro.useState(false);
  const [searchValue, setSearchValue] = taro.useState("");
  const banners = [
    {
      id: 1,
      image: common.bannerGoodnight,
      title: "晚安好眠",
      subtitle: "深度放松助眠服务",
      link: ""
    }
  ];
  taro.useEffect(() => {
    loadData();
  }, []);
  const loadData = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      setLocationStatus("loading");
      setLocationText("正在获取位置...");
      const location = yield getLocationService.getCurrentLocation();
      setUserLocation(location);
      if (location.latitude === 31.2304 && location.longitude === 121.4737) {
        setLocationStatus("error");
        setLocationText("定位失败，使用默认位置");
      } else {
        setLocationStatus("success");
        setLocationText("定位成功");
        setTimeout(() => {
          setLocationText("上海市");
        }, 2e3);
      }
      const nearbyStores = yield common.storeService.getNearbyStores(
        location.latitude,
        location.longitude,
        1,
        2
      );
      setStores(nearbyStores.list);
      const allStoresData = yield common.storeService.getNearbyStores(
        location.latitude,
        location.longitude,
        1,
        20
        // 获取更多数据
      );
      setAllStores(allStoresData.list);
      const recommendedTherapists = yield common.therapistService.getRecommendedTherapists(
        1,
        10,
        location
      );
      setTherapists(recommendedTherapists.list);
    } catch (error) {
      console.error("加载数据失败:", error);
      setLocationStatus("error");
      setLocationText("定位失败");
      taro.Taro.showToast({
        title: "加载失败，请重试",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleStoreClick = (store) => {
    taro.Taro.navigateTo({
      url: `/pages/appointment/store/index?id=${store.id}`
    });
  };
  const handleTherapistClick = (therapist) => {
    taro.Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${therapist.id}&storeId=${therapist.storeId}`
    });
  };
  const handleMoreStores = () => {
    setShowStoreSheet(true);
  };
  const handleMoreSymptoms = () => {
    taro.Taro.showToast({
      title: "功能开发中",
      icon: "none"
    });
  };
  const handleBannerClick = (banner) => {
    taro.Taro.navigateTo({
      url: "/pages/promotion/index"
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "appointment-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "header", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "location", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: locationStatus === "loading" ? "📍" : locationStatus === "success" ? "📍" : "⚠️" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: `text ${locationStatus}`, children: locationText }),
      locationStatus === "error" && /* @__PURE__ */ taro.jsx(taro.Text, { className: "retry-btn", onClick: loadData, children: "重试" })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "banner-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "优惠预约" }),
      /* @__PURE__ */ taro.jsx(
        taro.Swiper,
        {
          className: "banner-swiper",
          autoplay: true,
          interval: 3e3,
          indicatorDots: true,
          indicatorActiveColor: "#D9455F",
          children: banners.map(
            (banner) => /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsx(taro.View, { className: "banner-item", onClick: () => handleBannerClick(), children: /* @__PURE__ */ taro.jsx(taro.Image, { className: "banner-image", src: banner.image, mode: "aspectFill" }) }) }, banner.id)
          )
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "stores-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "section-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "门店预约" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "more-link", onClick: handleMoreStores, children: [
          "更多门店 ",
          ">>"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "store-list", children: stores.map(
        (store) => /* @__PURE__ */ taro.jsx(
          StoreCard,
          {
            store,
            onClick: () => handleStoreClick(store)
          },
          store.id
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapists-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "section-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "推拿师预约" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "more-link", onClick: handleMoreSymptoms, children: [
          "更多症状 ",
          ">>"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-list", children: therapists.map(
        (therapist) => /* @__PURE__ */ taro.jsx(
          TherapistCard,
          {
            therapist,
            onClick: () => handleTherapistClick(therapist)
          },
          therapist.id
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(
      BottomSheet,
      {
        visible: showStoreSheet,
        title: "更多门店",
        onClose: () => setShowStoreSheet(false),
        height: "80%",
        children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-sheet-header", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-selector", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-name", children: "上海市" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-arrow", children: "▼" })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-box", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-icon", children: "🔍" }),
              /* @__PURE__ */ taro.jsx(
                taro.Input,
                {
                  className: "search-input",
                  placeholder: "搜索门店",
                  value: searchValue,
                  onInput: (e) => setSearchValue(e.detail.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "store-sheet-list", children: allStores.filter(
            (store) => searchValue === "" || store.name.includes(searchValue) || store.address.includes(searchValue)
          ).map(
            (store) => /* @__PURE__ */ taro.jsx(
              StoreCard,
              {
                store,
                onClick: () => {
                  handleStoreClick(store);
                  setShowStoreSheet(false);
                }
              },
              store.id
            )
          ) })
        ]
      }
    )
  ] });
};
var config = {};
Page(taro.createPageConfig(Appointment, "pages/appointment/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=(e,s,t)=>new Promise((i,r)=>{var a=e=>{try{o(t.next(e))}catch(s){r(s)}},n=e=>{try{o(t.throw(e))}catch(s){r(s)}},o=e=>e.done?i(e.value):Promise.resolve(e.value).then(a,n);o((t=t.apply(e,s)).next())});const s=require("../../taro.js"),t=require("../../common.js"),i=require("../../vendors.js");class r{getCurrentLocation(){return e(this,null,function*(){try{const t=yield s.Taro.getSetting(),i=(null==t?void 0:t.authSetting)||{};let r;i["scope.userLocation"]||(yield s.Taro.authorize({scope:"scope.userLocation"}));try{r=yield s.Taro.getLocation({type:"gcj02",isHighAccuracy:!0})}catch(e){console.warn("gcj02\u5750\u6807\u7cfb\u4e0d\u652f\u6301\uff0c\u5c1d\u8bd5wgs84:",e),r=yield s.Taro.getLocation({type:"wgs84"})}return{latitude:r.latitude,longitude:r.longitude}}catch(t){console.error("\u83b7\u53d6\u4f4d\u7f6e\u5931\u8d25:",t);const e=(null==t?void 0:t.errMsg)||"";return(e.includes("auth deny")||e.includes("authorize:fail"))&&s.Taro.showModal({title:"\u63d0\u793a",content:"\u9700\u8981\u83b7\u53d6\u60a8\u7684\u4f4d\u7f6e\u4fe1\u606f\u6765\u63a8\u8350\u9644\u8fd1\u95e8\u5e97",confirmText:"\u53bb\u8bbe\u7f6e",success:e=>{e.confirm&&s.Taro.openSetting()}}),console.log("\u4f7f\u7528\u9ed8\u8ba4\u4f4d\u7f6e\uff1a\u4e0a\u6d77\u5e02\u4e2d\u5fc3"),{latitude:31.2304,longitude:121.4737}}})}calculateDistance(e,s,t,i){const r=Math.PI/180,a=6371,n=(t-e)*r,o=(i-s)*r,c=Math.sin(n/2)*Math.sin(n/2)+Math.cos(e*r)*Math.cos(t*r)*Math.sin(o/2)*Math.sin(o/2),x=2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c));return Number((a*x).toFixed(1))}formatDistance(e){return e<1?`${Math.round(1e3*e)}m`:`${e}km`}}const a=new r,n="",o=({store:e,onClick:i})=>{var r;const a=e=>{switch(e){case"normal":return"\u5c31\u8fd1";case"busy":return"\u7e41\u5fd9";case"full":return"\u7206\u6ee1";default:return""}},n=e=>{switch(e){case"normal":return"status-normal";case"busy":return"status-busy";case"full":return"status-full";default:return""}};return s.jsxRuntimeExports.jsx(s.View,{className:"store-card",onClick:i,children:s.jsxRuntimeExports.jsxs(s.View,{className:"card-content",children:[s.jsxRuntimeExports.jsx(s.View,{className:"store-image-wrapper",children:s.jsxRuntimeExports.jsx(s.Image,{className:"store-image",src:(null==(r=e.images)?void 0:r[0])||e.image||"/static/images/default-store.jpg",mode:"aspectFill"})}),s.jsxRuntimeExports.jsxs(s.View,{className:"store-info",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"store-name",children:e.name}),s.jsxRuntimeExports.jsxs(s.View,{className:"business-hours",children:[s.jsxRuntimeExports.jsxs(s.Text,{className:"hours-text",children:[e.businessHours.start,"-",e.businessHours.end]}),s.jsxRuntimeExports.jsx(s.Text,{className:`status ${n(e.status)}`,children:a(e.status)})]}),s.jsxRuntimeExports.jsx(s.View,{className:"store-address",children:s.jsxRuntimeExports.jsx(s.Text,{className:"address-text",numberOfLines:1,children:e.address})}),s.jsxRuntimeExports.jsxs(s.View,{className:"store-footer",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"distance",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"icon",children:"\ud83d\udccd"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"distance-text",children:[e.distance,"km"]})]}),s.jsxRuntimeExports.jsx(t.BookingButton,{size:"small"})]})]})]})})},c="",x=({therapist:e,onClick:i})=>s.jsxRuntimeExports.jsx(s.View,{className:"therapist-card",onClick:i,children:s.jsxRuntimeExports.jsxs(s.View,{className:"card-content",children:[s.jsxRuntimeExports.jsx(s.Image,{className:"therapist-avatar",src:e.avatar,mode:"aspectFill"}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapist-info",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"info-header",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"therapist-name",children:e.name}),s.jsxRuntimeExports.jsxs(s.View,{className:"distance",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"icon",children:"\ud83d\udccd"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"distance-text",children:[e.distance,"km"]})]})]}),s.jsxRuntimeExports.jsx(s.View,{className:"expertise-tags",children:e.expertise.map((e,t)=>s.jsxRuntimeExports.jsx(s.Text,{className:"expertise-tag",children:e},t))}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapist-footer",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"rating",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"icon",children:"\u2b50"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"rating-text",children:[e.rating,"\u5206"]}),s.jsxRuntimeExports.jsxs(s.Text,{className:"service-count",children:["\u670d\u52a1",e.serviceCount,"\u6b21"]})]}),s.jsxRuntimeExports.jsx(t.BookingButton,{size:"small"})]})]})]})}),l="",m=({visible:e,title:t,onClose:r,children:a,height:n="70%"})=>{const[o,c]=s.reactExports.useState(!1),[x,l]=s.reactExports.useState(!1);s.reactExports.useEffect(()=>{e?(l(!0),setTimeout(()=>c(!0),50)):(c(!1),setTimeout(()=>l(!1),300))},[e]);const m=()=>{r()},u=e=>{e.stopPropagation()};return x?s.jsxRuntimeExports.jsxs(s.View,{className:"bottom-sheet",onClick:m,children:[s.jsxRuntimeExports.jsx(s.View,{className:"bottom-sheet-mask "+(o?"active":"")}),s.jsxRuntimeExports.jsxs(s.View,{className:"bottom-sheet-content "+(o?"active":""),style:{height:n},onClick:u,children:[s.jsxRuntimeExports.jsxs(s.View,{className:"sheet-header",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"sheet-title",children:t}),s.jsxRuntimeExports.jsx(s.View,{className:"close-btn",onClick:r,children:s.jsxRuntimeExports.jsx(i.AtIcon,{value:"close",size:"20",color:"#999"})})]}),s.jsxRuntimeExports.jsx(s.View,{className:"sheet-body",children:a})]})]}):null},u="",d=()=>{const[i,r]=s.reactExports.useState(!0),[n,c]=s.reactExports.useState([]),[l,u]=s.reactExports.useState([]),[d,j]=s.reactExports.useState([]),[p,h]=s.reactExports.useState({latitude:0,longitude:0}),[E,R]=s.reactExports.useState("loading"),[N,g]=s.reactExports.useState("\u6b63\u5728\u83b7\u53d6\u4f4d\u7f6e..."),[w,T]=s.reactExports.useState(!1),[V,y]=s.reactExports.useState(""),v=[{id:1,image:t.bannerGoodnight,title:"\u665a\u5b89\u597d\u7720",subtitle:"\u6df1\u5ea6\u653e\u677e\u52a9\u7720\u670d\u52a1",link:""}];s.reactExports.useEffect(()=>{b()},[]);const b=()=>e(exports,null,function*(){try{r(!0),R("loading"),g("\u6b63\u5728\u83b7\u53d6\u4f4d\u7f6e...");const e=yield a.getCurrentLocation();h(e),31.2304===e.latitude&&121.4737===e.longitude?(R("error"),g("\u5b9a\u4f4d\u5931\u8d25\uff0c\u4f7f\u7528\u9ed8\u8ba4\u4f4d\u7f6e")):(R("success"),g("\u5b9a\u4f4d\u6210\u529f"),setTimeout(()=>{g("\u4e0a\u6d77\u5e02")},2e3));const s=yield t.storeService.getNearbyStores(e.latitude,e.longitude,1,2);c(s.list);const i=yield t.storeService.getNearbyStores(e.latitude,e.longitude,1,20);u(i.list);const n=yield t.therapistService.getRecommendedTherapists(1,10,e);j(n.list)}catch(e){console.error("\u52a0\u8f7d\u6570\u636e\u5931\u8d25:",e),R("error"),g("\u5b9a\u4f4d\u5931\u8d25"),s.Taro.showToast({title:"\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5",icon:"none"})}finally{r(!1)}}),f=e=>{s.Taro.navigateTo({url:`/pages/appointment/store/index?id=${e.id}`})},k=e=>{s.Taro.navigateTo({url:`/pages/appointment/therapist/index?therapistId=${e.id}&storeId=${e.storeId}`})},C=()=>{T(!0)},S=()=>{s.Taro.showToast({title:"\u529f\u80fd\u5f00\u53d1\u4e2d",icon:"none"})},M=e=>{s.Taro.navigateTo({url:"/pages/promotion/index"})};return s.jsxRuntimeExports.jsxs(s.View,{className:"appointment-page",children:[s.jsxRuntimeExports.jsx(s.View,{className:"header",children:s.jsxRuntimeExports.jsxs(s.View,{className:"location",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"icon",children:"loading"===E||"success"===E?"\ud83d\udccd":"\u26a0\ufe0f"}),s.jsxRuntimeExports.jsx(s.Text,{className:`text ${E}`,children:N}),"error"===E&&s.jsxRuntimeExports.jsx(s.Text,{className:"retry-btn",onClick:b,children:"\u91cd\u8bd5"})]})}),s.jsxRuntimeExports.jsxs(s.View,{className:"banner-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u4f18\u60e0\u9884\u7ea6"}),s.jsxRuntimeExports.jsx(s.Swiper,{className:"banner-swiper",autoplay:!0,interval:3e3,indicatorDots:!0,indicatorActiveColor:"#D9455F",children:v.map(e=>s.jsxRuntimeExports.jsx(s.SwiperItem,{children:s.jsxRuntimeExports.jsx(s.View,{className:"banner-item",onClick:()=>M(),children:s.jsxRuntimeExports.jsx(s.Image,{className:"banner-image",src:e.image,mode:"aspectFill"})})},e.id))})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"stores-section",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"section-header",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u95e8\u5e97\u9884\u7ea6"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"more-link",onClick:C,children:["\u66f4\u591a\u95e8\u5e97 ",">>"]})]}),s.jsxRuntimeExports.jsx(s.View,{className:"store-list",children:n.map(e=>s.jsxRuntimeExports.jsx(o,{store:e,onClick:()=>f(e)},e.id))})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"therapists-section",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"section-header",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u63a8\u62ff\u5e08\u9884\u7ea6"}),s.jsxRuntimeExports.jsxs(s.Text,{className:"more-link",onClick:S,children:["\u66f4\u591a\u75c7\u72b6 ",">>"]})]}),s.jsxRuntimeExports.jsx(s.View,{className:"therapist-list",children:d.map(e=>s.jsxRuntimeExports.jsx(x,{therapist:e,onClick:()=>k(e)},e.id))})]}),s.jsxRuntimeExports.jsxs(m,{visible:w,title:"\u66f4\u591a\u95e8\u5e97",onClose:()=>T(!1),height:"80%",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"store-sheet-header",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"city-selector",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"city-name",children:"\u4e0a\u6d77\u5e02"}),s.jsxRuntimeExports.jsx(s.Text,{className:"city-arrow",children:"\u25bc"})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"search-box",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"search-icon",children:"\ud83d\udd0d"}),s.jsxRuntimeExports.jsx(s.Input,{className:"search-input",placeholder:"\u641c\u7d22\u95e8\u5e97",value:V,onInput:e=>y(e.detail.value)})]})]}),s.jsxRuntimeExports.jsx(s.View,{className:"store-sheet-list",children:l.filter(e=>""===V||e.name.includes(V)||e.address.includes(V)).map(e=>s.jsxRuntimeExports.jsx(o,{store:e,onClick:()=>{f(e),T(!1)}},e.id))})]})]})};var j={};Page(s.createPageConfig(d,"pages/appointment/index",{root:{cn:[]}},j||{}));
>>>>>>> recovery-branch
