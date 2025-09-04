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
const mockTherapists = [{
  id: "therapist-001",
  storeId: "store-001",
  storeName: "上海万象城店",
  name: "刘吉会",
  avatar: common.mockImages.therapists.male[0],
  rating: 5,
  ratingCount: 328,
  expertise: ["擅长", "头颈肩痛", "足疗+踩背"],
  yearsOfExperience: 8,
  serviceCount: 1523,
  status: "available",
  distance: 8.8
}, {
  id: "therapist-002",
  storeId: "store-001",
  storeName: "上海万象城店",
  name: "谢小清",
  avatar: common.mockImages.therapists.female[0],
  rating: 4.9,
  ratingCount: 267,
  expertise: ["擅长", "睡眠调理", "运动排酸"],
  yearsOfExperience: 6,
  serviceCount: 982,
  status: "available",
  distance: 8.8
}, {
  id: "therapist-003",
  storeId: "store-002",
  storeName: "长宁来福士",
  name: "张明华",
  avatar: common.mockImages.therapists.male[1],
  rating: 4.8,
  ratingCount: 195,
  expertise: ["擅长", "腰腿疼痛", "经络疏通"],
  yearsOfExperience: 10,
  serviceCount: 2156,
  status: "busy",
  distance: 12.3
}, {
  id: "therapist-004",
  storeId: "store-002",
  storeName: "长宁来福士",
  name: "王雅琴",
  avatar: common.mockImages.therapists.female[1],
  rating: 5,
  ratingCount: 412,
  expertise: ["擅长", "肩周炎", "产后恢复"],
  yearsOfExperience: 12,
  serviceCount: 3421,
  status: "available",
  distance: 14.2
}, {
  id: "therapist-005",
  storeId: "store-003",
  storeName: "静安大悦城店",
  name: "李建国",
  avatar: common.mockImages.therapists.male[2],
  rating: 4.7,
  ratingCount: 156,
  expertise: ["擅长", "关节调理", "脊柱矫正"],
  yearsOfExperience: 15,
  serviceCount: 4523,
  status: "available",
  distance: 15.6
}, {
  id: "therapist-006",
  storeId: "store-004",
  storeName: "浦东正大广场店",
  name: "陈秀英",
  avatar: common.mockImages.therapists.female[0],
  rating: 4.9,
  ratingCount: 289,
  expertise: ["擅长", "淋巴排毒", "面部护理"],
  yearsOfExperience: 9,
  serviceCount: 2134,
  status: "available",
  distance: 18.9
}, {
  id: "therapist-007",
  storeId: "store-005",
  storeName: "徐汇日月光店",
  name: "赵文斌",
  avatar: common.mockImages.therapists.male[0],
  rating: 4.8,
  ratingCount: 178,
  expertise: ["擅长", "运动损伤", "筋膜放松"],
  yearsOfExperience: 7,
  serviceCount: 1678,
  status: "busy",
  distance: 6.5
}, {
  id: "therapist-008",
  storeId: "store-005",
  storeName: "徐汇日月光店",
  name: "孙雪梅",
  avatar: common.mockImages.therapists.female[1],
  rating: 5,
  ratingCount: 523,
  expertise: ["擅长", "全身推拿", "艾灸理疗"],
  yearsOfExperience: 11,
  serviceCount: 3876,
  status: "available",
  distance: 6.5
}];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class TherapistService {
  // 获取推荐推拿师
  getRecommendedTherapists(page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep(300);
      const sortedTherapists = [...mockTherapists].sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.serviceCount - a.serviceCount;
      });
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = sortedTherapists.slice(start, end);
      return {
        list,
        total: sortedTherapists.length,
        page,
        pageSize,
        hasMore: end < sortedTherapists.length
      };
    });
  }
  // 根据门店获取推拿师
  getTherapistsByStore(storeId, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep(200);
      const storeTherapists = mockTherapists.filter((t) => t.storeId === storeId);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = storeTherapists.slice(start, end);
      return {
        list,
        total: storeTherapists.length,
        page,
        pageSize,
        hasMore: end < storeTherapists.length
      };
    });
  }
  // 获取推拿师详情
  getTherapistDetail(therapistId) {
    return __async(this, null, function* () {
      yield sleep(200);
      const therapist = mockTherapists.find((t) => t.id === therapistId);
      if (!therapist) {
        throw new Error("推拿师不存在");
      }
      return therapist;
    });
  }
  // 按擅长项目筛选推拿师
  getTherapistsByExpertise(expertise, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep(300);
      const filteredTherapists = mockTherapists.filter((therapist) => therapist.expertise.includes(expertise));
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredTherapists.slice(start, end);
      return {
        list,
        total: filteredTherapists.length,
        page,
        pageSize,
        hasMore: end < filteredTherapists.length
      };
    });
  }
  // 搜索推拿师
  searchTherapists(keyword, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep(300);
      const filteredTherapists = mockTherapists.filter((therapist) => {
        var _a;
        return therapist.name.includes(keyword) || therapist.expertise.some((e) => e.includes(keyword)) || ((_a = therapist.storeName) == null ? void 0 : _a.includes(keyword));
      });
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredTherapists.slice(start, end);
      return {
        list,
        total: filteredTherapists.length,
        page,
        pageSize,
        hasMore: end < filteredTherapists.length
      };
    });
  }
}
const therapistService = new TherapistService();
const index$3 = "";
const StoreCard = ({ store, onClick, onBooking }) => {
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
        src: store.images[0],
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
          vendors.AtButton,
          {
            className: "booking-btn",
            type: "primary",
            size: "small",
            onClick: onBooking,
            children: "预约"
          }
        )
      ] })
    ] })
  ] }) });
};
const index$2 = "";
const TherapistCard = ({ therapist, onClick, onBooking }) => {
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
          vendors.AtButton,
          {
            className: "booking-btn",
            type: "primary",
            size: "small",
            onClick: onBooking,
            children: "预约"
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
      const location = yield common.getLocationService.getCurrentLocation();
      setUserLocation(location);
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
      const recommendedTherapists = yield therapistService.getRecommendedTherapists();
      setTherapists(recommendedTherapists.list);
    } catch (error) {
      console.error("加载数据失败:", error);
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
      url: `/pages/therapist/detail/index?id=${therapist.id}`
    });
  };
  const handleBookingClick = (e, item) => {
    e.stopPropagation();
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=${item.hasOwnProperty("storeId") ? "therapist" : "store"}&id=${item.id}`
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
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "📍" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "text", children: "正在获取位置..." })
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
            onClick: () => handleStoreClick(store),
            onBooking: (e) => handleBookingClick(e, store)
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
            onClick: () => handleTherapistClick(therapist),
            onBooking: (e) => handleBookingClick(e, therapist)
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
                },
                onBooking: (e) => {
                  handleBookingClick(e, store);
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
