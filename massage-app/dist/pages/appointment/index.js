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
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "hours-text", children: store.businessHours }),
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
  const [reviewStats, setReviewStats] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    const loadReviewStats = () => __async(exports, null, function* () {
      try {
        const stats = yield common.reviewService.getReviewStats(therapist.id);
        setReviewStats(stats);
      } catch (error) {
        console.error("获取推拿师评价统计失败:", error);
        setReviewStats(null);
      } finally {
        setLoading(false);
      }
    });
    loadReviewStats();
  }, [therapist.id]);
  const getRatingDisplay = () => {
    if (loading)
      return "...";
    if (!reviewStats || reviewStats.totalCount === 0)
      return "待评价";
    return `${reviewStats.averageRating}分`;
  };
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
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-text", children: getRatingDisplay() })
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
