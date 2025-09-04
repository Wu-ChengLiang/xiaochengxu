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
const index$4 = "";
const TherapistHeader = ({
  therapist,
  onDetailClick,
  className
}) => {
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: vendors.classNames("therapist-header", className), children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
      /* @__PURE__ */ taro.jsx(
        taro.Image,
        {
          className: "therapist-avatar",
          src: therapist.avatar,
          mode: "aspectFill"
        }
      ),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-details", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-name-row", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: therapist.name }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "therapist-level", children: [
            "LV",
            therapist.level
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "therapist-rating", children: [
          therapist.rating,
          "分"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "detail-link", onClick: onDetailClick, children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { children: "查看详情" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "iconfont icon-right" })
    ] })
  ] });
};
const index$3 = "";
const SymptomCategoryTabs = ({
  categories,
  activeId,
  onChange,
  className
}) => {
  return /* @__PURE__ */ taro.jsx(
    taro.ScrollView,
    {
      className: vendors.classNames("symptom-category-tabs", className),
      scrollY: true,
      showScrollbar: false,
      children: categories.map(
        (category) => /* @__PURE__ */ taro.jsx(
          taro.View,
          {
            className: vendors.classNames("category-item", {
              "active": category.id === activeId
            }),
            onClick: () => onChange(category.id),
            children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "category-name", children: category.name })
          },
          category.id
        )
      )
    }
  );
};
const index$2 = "";
const SymptomServiceCard = ({
  service,
  onAdd,
  isInCart = false,
  className
}) => {
  const availabilityText = {
    available: "空闲",
    busy: "繁忙",
    full: "爆满"
  };
  const availabilityClass = {
    available: "status-available",
    busy: "status-busy",
    full: "status-full"
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: vendors.classNames("symptom-service-card", className), children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-header", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: service.name }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: vendors.classNames("service-status", availabilityClass[service.availability]), children: availabilityText[service.availability] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-description", children: service.description }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-footer", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-info", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "service-duration", children: [
          service.duration,
          "分钟"
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-price", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price-current", children: [
            "¥",
            service.discountPrice || service.price
          ] }),
          service.discountPrice && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price-original", children: [
            "¥",
            service.price
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(
        taro.View,
        {
          className: vendors.classNames("add-button", {
            "in-cart": isInCart,
            "disabled": service.availability === "full"
          }),
          onClick: service.availability !== "full" ? onAdd : void 0,
          children: service.availability === "full" ? /* @__PURE__ */ taro.jsx(taro.Text, { className: "button-text", children: "已满" }) : /* @__PURE__ */ taro.jsx(taro.Text, { className: "iconfont icon-add" })
        }
      )
    ] })
  ] });
};
const index$1 = "";
const SymptomServiceList = ({
  services,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  return /* @__PURE__ */ taro.jsx(
    taro.ScrollView,
    {
      className: `symptom-service-list ${className || ""}`,
      scrollY: true,
      showScrollbar: false,
      children: /* @__PURE__ */ taro.jsx(taro.View, { className: "service-list-content", children: services.map(
        (service) => /* @__PURE__ */ taro.jsx(
          SymptomServiceCard,
          {
            service,
            onAdd: () => onAddToCart(service),
            isInCart: cartServiceIds.includes(service.id)
          },
          service.id
        )
      ) })
    }
  );
};
const symptomCategories = [{
  id: "1",
  name: "头颈肩痛",
  order: 1
}, {
  id: "2",
  name: "对症推拿",
  order: 2
}, {
  id: "3",
  name: "运动排酸",
  order: 3
}, {
  id: "4",
  name: "睡眠调理",
  order: 4
}, {
  id: "5",
  name: "腰酸背痛",
  order: 5
}, {
  id: "6",
  name: "整脊踩背",
  order: 6
}, {
  id: "7",
  name: "肠胃调理",
  order: 7
}, {
  id: "8",
  name: "足疗+踩背",
  order: 8
}, {
  id: "9",
  name: "焦虑失眠",
  order: 9
}, {
  id: "10",
  name: "温宫暖巢",
  order: 10
}, {
  id: "11",
  name: "运动拉伸",
  order: 11
}];
const symptomServices = [
  // 头颈肩痛
  {
    id: "s1",
    categoryId: "1",
    name: "头颈肩痛",
    description: "落枕",
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: "available"
  },
  // 对症推拿
  {
    id: "s2",
    categoryId: "2",
    name: "整脊踩背",
    description: "运动臂腿酸痛",
    duration: 40,
    price: 169,
    discountPrice: 149,
    availability: "available"
  },
  // 运动排酸
  {
    id: "s3",
    categoryId: "3",
    name: "运动排酸",
    description: "",
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: "busy"
  },
  // 睡眠调理
  {
    id: "s4",
    categoryId: "4",
    name: "肠胃调理",
    description: "改善胃肠功能、足疗",
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: "available"
  },
  // 腰酸背痛
  {
    id: "s5",
    categoryId: "5",
    name: "腰酸背痛",
    description: "",
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: "available"
  },
  // 整脊踩背
  {
    id: "s6",
    categoryId: "6",
    name: "足疗+踩背",
    description: "运动小腿胀痛",
    duration: 70,
    price: 279,
    discountPrice: 259,
    availability: "available"
  },
  // 肠胃调理
  {
    id: "s7",
    categoryId: "7",
    name: "肠胃调理",
    description: "",
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: "full"
  },
  // 足疗+踩背
  {
    id: "s8",
    categoryId: "8",
    name: "足疗+踩背",
    description: "运动小腿胀痛",
    duration: 70,
    price: 279,
    discountPrice: 259,
    availability: "available"
  },
  // 焦虑失眠
  {
    id: "s9",
    categoryId: "9",
    name: "焦虑失眠",
    description: "提高睡眠质量",
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: "busy"
  },
  // 温宫暖巢
  {
    id: "s10",
    categoryId: "10",
    name: "头颈肩痛",
    description: "落枕",
    duration: 60,
    price: 249,
    discountPrice: 229,
    availability: "full"
  },
  // 运动拉伸
  {
    id: "s11",
    categoryId: "11",
    name: "运动拉伸",
    description: "",
    duration: 60,
    price: 229,
    discountPrice: 229,
    availability: "available"
  }
];
const getTherapistSymptomServices = (therapistId) => {
  return symptomServices.map((service) => __spreadProps(__spreadValues({}, service), {
    therapistId,
    // 模拟动态可用性
    availability: Math.random() > 0.7 ? "busy" : service.availability
  }));
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const symptomService = {
  // 获取症状分类
  getCategories() {
    return __async(this, null, function* () {
      yield sleep(100);
      return {
        code: 200,
        data: symptomCategories,
        message: "success"
      };
    });
  },
  // 获取推拿师的症状服务列表
  getTherapistSymptomServices(therapistId) {
    return __async(this, null, function* () {
      yield sleep(200);
      if (!therapistId) {
        throw new Error("推拿师ID不能为空");
      }
      const services = getTherapistSymptomServices(therapistId);
      return {
        code: 200,
        data: services,
        message: "success"
      };
    });
  },
  // 根据分类ID获取服务列表
  getServicesByCategory(therapistId, categoryId) {
    return __async(this, null, function* () {
      yield sleep(150);
      const allServices = getTherapistSymptomServices(therapistId);
      const filteredServices = allServices.filter((service) => service.categoryId === categoryId);
      return {
        code: 200,
        data: filteredServices,
        message: "success"
      };
    });
  }
};
const index = "";
const SymptomPage = () => {
  const router = taro.taroExports.useRouter();
  const { therapistId, therapistName, storeId, storeName } = router.params;
  const [therapist, setTherapist] = taro.useState(null);
  const [categories, setCategories] = taro.useState([]);
  const [services, setServices] = taro.useState([]);
  const [activeCategoryId, setActiveCategoryId] = taro.useState("");
  const [cartItems, setCartItems] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    if (therapistId) {
      common.therapistService.getTherapistDetail(therapistId).then((res) => {
        setTherapist(res.data);
      });
    }
  }, [therapistId]);
  taro.useEffect(() => {
    symptomService.getCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setActiveCategoryId(res.data[0].id);
      }
    });
  }, []);
  taro.useEffect(() => {
    if (therapistId) {
      setLoading(true);
      symptomService.getTherapistSymptomServices(therapistId).then((res) => {
        setServices(res.data);
        setLoading(false);
      });
    }
  }, [therapistId]);
  const filteredServices = taro.useMemo(() => {
    return services.filter((service) => service.categoryId === activeCategoryId);
  }, [services, activeCategoryId]);
  const cartServiceIds = taro.useMemo(() => {
    return cartItems.map((item) => item.serviceId);
  }, [cartItems]);
  const handleAddToCart = (service) => {
    if (!therapist)
      return;
    const newItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      time: "待选择",
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    setCartItems([...cartItems, newItem]);
    taro.Taro.showToast({
      title: "已添加到购物车",
      icon: "none"
    });
  };
  const handleViewDetail = () => {
    taro.Taro.navigateTo({
      url: `/pages/appointment/therapist/index?id=${therapistId}&storeId=${storeId}&storeName=${storeName}`
    });
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      taro.Taro.showToast({
        title: "请先选择服务项目",
        icon: "none"
      });
      return;
    }
    const params = {
      items: JSON.stringify(cartItems),
      therapistId,
      therapistName,
      storeId,
      storeName,
      from: "symptom"
    };
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`
    });
  };
  if (!therapist) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "symptom-page loading", children: "加载中..." });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "symptom-page", children: [
    /* @__PURE__ */ taro.jsx(
      TherapistHeader,
      {
        therapist: {
          id: therapist.id,
          name: therapist.name,
          avatar: therapist.avatar,
          level: therapist.level || 3,
          rating: therapist.rating
        },
        onDetailClick: handleViewDetail
      }
    ),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "symptom-content", children: [
      /* @__PURE__ */ taro.jsx(
        SymptomCategoryTabs,
        {
          categories,
          activeId: activeCategoryId,
          onChange: setActiveCategoryId
        }
      ),
      /* @__PURE__ */ taro.jsx(
        SymptomServiceList,
        {
          services: filteredServices,
          onAddToCart: handleAddToCart,
          cartServiceIds
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsx(
      common.ShoppingCart,
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
  "navigationBarTextStyle": "black",
  "navigationBarBackgroundColor": "#ffffff",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(SymptomPage, "pages/appointment/symptom/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
