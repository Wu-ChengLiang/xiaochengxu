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
const taro = require("../../taro.js");
const vendors = require("../../vendors.js");
const common = require("../../common.js");
const mockStores = [{
  id: "store-001",
  name: "上海万象城店",
  images: [common.mockImages.stores[0]],
  address: "闵行区吴中路1599号万象城L4-401",
  phone: "021-54881234",
  businessHours: {
    start: "10:00",
    end: "22:00"
  },
  location: {
    latitude: 31.1809,
    longitude: 121.3831
  },
  status: "busy",
  services: ["service-001", "service-002", "service-003"]
}, {
  id: "store-002",
  name: "长宁来福士",
  images: [common.mockImages.stores[1]],
  address: "长宁区长宁路1191号来福士广场B2-15",
  phone: "021-62881234",
  businessHours: {
    start: "10:00",
    end: "22:00"
  },
  location: {
    latitude: 31.2211,
    longitude: 121.4249
  },
  status: "normal",
  services: ["service-001", "service-002", "service-003", "service-004"]
}, {
  id: "store-003",
  name: "静安大悦城店",
  images: [common.mockImages.stores[2]],
  address: "静安区西藏北路198号大悦城南座3F-12",
  phone: "021-63351234",
  businessHours: {
    start: "10:00",
    end: "22:00"
  },
  location: {
    latitude: 31.2341,
    longitude: 121.4701
  },
  status: "full",
  services: ["service-001", "service-002", "service-003"]
}, {
  id: "store-004",
  name: "浦东正大广场店",
  images: [common.mockImages.stores[3]],
  address: "浦东新区陆家嘴西路168号正大广场5F",
  phone: "021-50471234",
  businessHours: {
    start: "10:00",
    end: "22:00"
  },
  location: {
    latitude: 31.2384,
    longitude: 121.4987
  },
  status: "normal",
  services: ["service-001", "service-002", "service-003", "service-004", "service-005"]
}, {
  id: "store-005",
  name: "徐汇日月光店",
  images: [common.mockImages.stores[4]],
  address: "徐汇区漕宝路33号日月光中心B2-08",
  phone: "021-64381234",
  businessHours: {
    start: "10:00",
    end: "22:00"
  },
  location: {
    latitude: 31.1687,
    longitude: 121.4368
  },
  status: "normal",
  services: ["service-001", "service-002", "service-003", "service-004"]
}];
const sleep$1 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class StoreService {
  // 获取附近门店
  getNearbyStores(latitude, longitude, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep$1(300);
      const storesWithDistance = mockStores.map((store) => __spreadProps(__spreadValues({}, store), {
        distance: common.getLocationService.calculateDistance(latitude, longitude, store.location.latitude, store.location.longitude)
      })).sort((a, b) => a.distance - b.distance);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = storesWithDistance.slice(start, end);
      return {
        list,
        total: storesWithDistance.length,
        page,
        pageSize,
        hasMore: end < storesWithDistance.length
      };
    });
  }
  // 获取门店详情
  getStoreDetail(storeId) {
    return __async(this, null, function* () {
      yield sleep$1(200);
      const store = mockStores.find((s) => s.id === storeId);
      if (!store) {
        throw new Error("门店不存在");
      }
      return store;
    });
  }
  // 搜索门店
  searchStores(keyword, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep$1(300);
      const filteredStores = mockStores.filter((store) => store.name.includes(keyword) || store.address.includes(keyword));
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredStores.slice(start, end);
      return {
        list,
        total: filteredStores.length,
        page,
        pageSize,
        hasMore: end < filteredStores.length
      };
    });
  }
  // 根据状态筛选门店
  getStoresByStatus(status, page = 1, pageSize = 10) {
    return __async(this, null, function* () {
      yield sleep$1(200);
      const filteredStores = mockStores.filter((store) => store.status === status);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredStores.slice(start, end);
      return {
        list,
        total: filteredStores.length,
        page,
        pageSize,
        hasMore: end < filteredStores.length
      };
    });
  }
}
const storeService = new StoreService();
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
const index$2 = "";
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
    /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "store-image",
        src: store.images[0],
        mode: "aspectFill"
      }
    ),
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
const index$1 = "";
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
const index = "";
const Appointment = () => {
  const [loading, setLoading] = taro.useState(true);
  const [stores, setStores] = taro.useState([]);
  const [therapists, setTherapists] = taro.useState([]);
  const [userLocation, setUserLocation] = taro.useState({ latitude: 0, longitude: 0 });
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
      const nearbyStores = yield storeService.getNearbyStores(
        location.latitude,
        location.longitude,
        1,
        10
      );
      setStores(nearbyStores.list);
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
      url: `/pages/store/detail/index?id=${store.id}`
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
    taro.Taro.navigateTo({
      url: "/pages/store/list/index"
    });
  };
  const handleMoreSymptoms = () => {
    taro.Taro.showToast({
      title: "功能开发中",
      icon: "none"
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "appointment-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "header", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "title", children: "疲劳酸痛，到常乐对症推拿" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "location", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "icon", children: "📍" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "text", children: "正在获取位置..." })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "banner-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "优惠预约" }),
      /* @__PURE__ */ taro.jsx(
        taro.Swiper,
        {
          className: "banner-swiper",
          autoplay: true,
          interval: 3e3,
          indicatorDots: true,
          indicatorActiveColor: "#d4237a",
          children: banners.map(
            (banner) => /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "banner-item", children: [
              /* @__PURE__ */ taro.jsx(taro.Image, { className: "banner-image", src: banner.image, mode: "aspectFill" }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "banner-content", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "banner-title", children: banner.title }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "banner-subtitle", children: banner.subtitle }),
                /* @__PURE__ */ taro.jsx(vendors.AtButton, { className: "banner-btn", size: "small", children: "预约" })
              ] })
            ] }) }, banner.id)
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
      /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "store-list", children: stores.map(
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
      /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "therapist-list", children: therapists.map(
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
    ] })
  ] });
};
var config = {};
Page(taro.createPageConfig(Appointment, "pages/appointment/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
