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
const index$3 = "";
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
const index$2 = "";
const SymptomServiceList = ({
  services,
  therapists,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  const groupedServices = therapists.map((therapist) => {
    const therapistServices = services.filter((service) => service.therapistId === therapist.id);
    return {
      therapist,
      services: therapistServices
    };
  }).filter((group) => group.services.length > 0);
  return /* @__PURE__ */ taro.jsx(
    taro.ScrollView,
    {
      className: `symptom-service-list ${className || ""}`,
      scrollY: true,
      showScrollbar: false,
      children: /* @__PURE__ */ taro.jsx(taro.View, { className: "service-list-content", children: groupedServices.map(
        (group) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-group", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-header", children: [
            /* @__PURE__ */ taro.jsx(
              taro.Image,
              {
                className: "therapist-avatar",
                src: group.therapist.avatar,
                mode: "aspectFill"
              }
            ),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: group.therapist.name }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "therapist-level", children: [
                "LV",
                group.therapist.level || 1
              ] })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-rating", children: [
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "rating-score", children: [
                group.therapist.rating,
                "分"
              ] }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "view-details", children: [
                "查看详情",
                ">"
              ] })
            ] })
          ] }),
          group.services.map(
            (service) => /* @__PURE__ */ taro.jsx(
              SymptomServiceCard,
              {
                service,
                onAdd: () => onAddToCart(service, group.therapist.id),
                isInCart: cartServiceIds.includes(service.id)
              },
              service.id
            )
          )
        ] }, group.therapist.id)
      ) })
    }
  );
};
const index$1 = "";
const ShoppingCart = ({ items, onCheckout }) => {
  const [expanded, setExpanded] = taro.useState(false);
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.discountPrice || item.price);
  }, 0);
  const totalOriginalPrice = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
  const savedAmount = totalOriginalPrice - totalPrice;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "shopping-cart", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-summary", onClick: () => setExpanded(!expanded), children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-icon", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "cart-badge", children: items.length }) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥",
          totalPrice
        ] }),
        savedAmount > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "saved-amount", children: [
          "已省¥",
          savedAmount
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(
        vendors.AtButton,
        {
          className: "checkout-btn",
          type: "primary",
          size: "small",
          onClick: (e) => {
            e.stopPropagation();
            onCheckout();
          },
          children: "去结算"
        }
      )
    ] }),
    expanded && /* @__PURE__ */ taro.jsx(taro.View, { className: "cart-details", children: items.map(
      (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "cart-item", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "item-info", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: item.serviceName }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "therapist-name", children: [
            item.therapistName,
            " | ",
            item.duration,
            "分钟"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "item-price", children: item.discountPrice ? /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "discount-price", children: [
            "¥",
            item.discountPrice
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
            "¥",
            item.price
          ] })
        ] }) : /* @__PURE__ */ taro.jsxs(taro.Text, { className: "discount-price", children: [
          "¥",
          item.price
        ] }) })
      ] }, index2)
    ) })
  ] });
};
const symptomCategories = [{
  id: "1",
  name: "颈肩腰腿痛调理",
  order: 1
}, {
  id: "2",
  name: "肝胆脾胃调理",
  order: 2
}, {
  id: "3",
  name: "失眠调理",
  order: 3
}, {
  id: "4",
  name: "宫寒痛经调理",
  order: 4
}, {
  id: "5",
  name: "腙筋根骶",
  order: 5
}, {
  id: "6",
  name: "运动拉伸",
  order: 6
}, {
  id: "7",
  name: "体态调理",
  order: 7
}];
const symptomServices = [
  // 颈肩腰腿痛调理
  {
    id: "s1",
    categoryId: "1",
    name: "颈椎调理",
    description: "缓解颈椎疼痛、落枕",
    duration: 60,
    price: 258,
    discountPrice: 229,
    availability: "available"
  },
  {
    id: "s2",
    categoryId: "1",
    name: "肩周炎调理",
    description: "改善肩部活动受限",
    duration: 60,
    price: 258,
    discountPrice: 229,
    availability: "available"
  },
  {
    id: "s3",
    categoryId: "1",
    name: "腰腿痛调理",
    description: "缓解腰部及腿部疼痛",
    duration: 70,
    price: 298,
    discountPrice: 268,
    availability: "available"
  },
  // 肝胆脾胃调理
  {
    id: "s4",
    categoryId: "2",
    name: "脾胃调理",
    description: "改善消化功能",
    duration: 60,
    price: 238,
    discountPrice: 218,
    availability: "available"
  },
  {
    id: "s5",
    categoryId: "2",
    name: "肝胆疏通",
    description: "疏肝理气、排毒养颜",
    duration: 60,
    price: 258,
    discountPrice: 238,
    availability: "busy"
  },
  {
    id: "s6",
    categoryId: "2",
    name: "消化系统调理",
    description: "调理肠胃、改善便秘",
    duration: 50,
    price: 218,
    discountPrice: 198,
    availability: "available"
  },
  // 失眠调理
  {
    id: "s7",
    categoryId: "3",
    name: "安神助眠",
    description: "改善睡眠质量",
    duration: 60,
    price: 268,
    discountPrice: 248,
    availability: "available"
  },
  {
    id: "s8",
    categoryId: "3",
    name: "头部放松",
    description: "缓解头痛、精神压力",
    duration: 45,
    price: 198,
    discountPrice: 178,
    availability: "available"
  },
  {
    id: "s9",
    categoryId: "3",
    name: "深度睡眠调理",
    description: "调节神经系统、深度放松",
    duration: 70,
    price: 318,
    discountPrice: 288,
    availability: "busy"
  },
  // 宫寒痛经调理
  {
    id: "s10",
    categoryId: "4",
    name: "温宫暖巢",
    description: "调理宫寒、改善手脚冰凉",
    duration: 60,
    price: 278,
    discountPrice: 258,
    availability: "available"
  },
  {
    id: "s11",
    categoryId: "4",
    name: "痛经调理",
    description: "缓解经期不适",
    duration: 50,
    price: 238,
    discountPrice: 218,
    availability: "available"
  },
  {
    id: "s12",
    categoryId: "4",
    name: "妇科保养",
    description: "调理月经不调、保养卵巢",
    duration: 70,
    price: 328,
    discountPrice: 298,
    availability: "available"
  },
  // 腙筋根骶
  {
    id: "s13",
    categoryId: "5",
    name: "筋膜松解",
    description: "深层筋膜放松",
    duration: 60,
    price: 298,
    discountPrice: 268,
    availability: "available"
  },
  {
    id: "s14",
    categoryId: "5",
    name: "根骶调理",
    description: "骶骨矫正、骨盆调整",
    duration: 70,
    price: 358,
    discountPrice: 328,
    availability: "busy"
  },
  // 运动拉伸
  {
    id: "s15",
    categoryId: "6",
    name: "运动后恢复",
    description: "缓解运动后肌肉酸痛",
    duration: 50,
    price: 198,
    discountPrice: 178,
    availability: "available"
  },
  {
    id: "s16",
    categoryId: "6",
    name: "筋膜拉伸",
    description: "提升身体柔韧性",
    duration: 60,
    price: 238,
    discountPrice: 218,
    availability: "available"
  },
  {
    id: "s17",
    categoryId: "6",
    name: "运动损伤调理",
    description: "运动损伤康复调理",
    duration: 70,
    price: 288,
    discountPrice: 258,
    availability: "available"
  },
  // 体态调理
  {
    id: "s18",
    categoryId: "7",
    name: "体态矫正",
    description: "改善不良体态",
    duration: 60,
    price: 278,
    discountPrice: 248,
    availability: "available"
  },
  {
    id: "s19",
    categoryId: "7",
    name: "驼背调理",
    description: "改善驼背、圆肩",
    duration: 60,
    price: 268,
    discountPrice: 238,
    availability: "available"
  },
  {
    id: "s20",
    categoryId: "7",
    name: "骨盆矫正",
    description: "调整骨盆前倾、后倾",
    duration: 70,
    price: 328,
    discountPrice: 298,
    availability: "full"
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
  // 获取门店所有推拿师的症状服务列表
  getStoreSymptomServices(storeId) {
    return __async(this, null, function* () {
      yield sleep(200);
      if (!storeId) {
        throw new Error("门店ID不能为空");
      }
      const storeTherapists = common.mockTherapists.filter((t) => t.storeId === storeId);
      const allServices = [];
      storeTherapists.forEach((therapist) => {
        const services = getTherapistSymptomServices(therapist.id);
        services.forEach((service) => {
          allServices.push(__spreadProps(__spreadValues({}, service), {
            therapistId: therapist.id,
            // 添加推拿师ID以便展示时分组
            therapistName: therapist.name,
            // 添加推拿师名称
            therapistAvatar: therapist.avatar
            // 添加推拿师头像
          }));
        });
      });
      return {
        code: 200,
        data: allServices,
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
  const { storeId, storeName, selectedDate, selectedTime } = router.params;
  const [therapists, setTherapists] = taro.useState([]);
  const [categories, setCategories] = taro.useState([]);
  const [services, setServices] = taro.useState([]);
  const [activeCategoryId, setActiveCategoryId] = taro.useState("");
  const [cartItems, setCartItems] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    if (storeId) {
      common.therapistService.getTherapistsByStore(storeId).then((res) => {
        setTherapists(res.list);
      });
    }
  }, [storeId]);
  taro.useEffect(() => {
    symptomService.getCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setActiveCategoryId(res.data[0].id);
      }
    });
  }, []);
  taro.useEffect(() => {
    if (storeId) {
      setLoading(true);
      symptomService.getStoreSymptomServices(storeId).then((res) => {
        setServices(res.data);
        setLoading(false);
      });
    }
  }, [storeId]);
  const filteredServices = taro.useMemo(() => {
    return services.filter((service) => service.categoryId === activeCategoryId);
  }, [services, activeCategoryId]);
  const cartServiceIds = taro.useMemo(() => {
    return cartItems.map((item) => item.serviceId);
  }, [cartItems]);
  const handleAddToCart = (service, therapistId) => {
    const therapist = therapists.find((t) => t.id === therapistId);
    if (!therapist)
      return;
    const newItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: selectedDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      time: selectedTime || "待选择",
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    setCartItems([...cartItems, newItem]);
    taro.Taro.showToast({
      title: "已添加到购物车",
      icon: "none"
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
      storeId,
      storeName,
      from: "symptom"
    };
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`
    });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "symptom-page loading", children: "加载中..." });
  }
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "symptom-page", children: [
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
          therapists,
          onAddToCart: handleAddToCart,
          cartServiceIds
        }
      )
    ] }),
    /* @__PURE__ */ taro.jsx(
      ShoppingCart,
      {
        items: cartItems,
        onCheckout: handleCheckout
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "推拿师预约",
  "navigationBarTextStyle": "black",
  "navigationBarBackgroundColor": "#ffffff"
};
Page(taro.createPageConfig(SymptomPage, "pages/appointment/symptom/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
