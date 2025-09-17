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
  therapists,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  const servicesWithTherapists = services.map((service) => {
    return {
      service,
      availableTherapists: therapists
      // 所有推拿师都可以提供该服务
    };
  });
  return /* @__PURE__ */ taro.jsx(
    taro.ScrollView,
    {
      className: `symptom-service-list ${className || ""}`,
      scrollY: true,
      showScrollbar: false,
      children: /* @__PURE__ */ taro.jsx(taro.View, { className: "service-list-content", children: servicesWithTherapists.map(
        (item) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-item-container", children: [
          /* @__PURE__ */ taro.jsx(
            SymptomServiceCard,
            {
              service: item.service,
              onAdd: () => {
              },
              isInCart: cartServiceIds.includes(item.service.id)
            }
          ),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-options", children: item.availableTherapists.map(
            (therapist) => /* @__PURE__ */ taro.jsxs(
              taro.View,
              {
                className: "therapist-option",
                onClick: () => onAddToCart(item.service, therapist.id),
                children: [
                  /* @__PURE__ */ taro.jsx(
                    taro.Image,
                    {
                      className: "therapist-mini-avatar",
                      src: therapist.avatar,
                      mode: "aspectFill"
                    }
                  ),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: therapist.name })
                ]
              },
              therapist.id
            )
          ) })
        ] }, item.service.id)
      ) })
    }
  );
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const symptomService = {
  // 获取症状分类
  getCategories() {
    return __async(this, null, function* () {
      yield sleep(100);
      return {
        code: 200,
        data: common.symptomCategories,
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
      if (!storeId) {
        throw new Error("门店ID不能为空");
      }
      try {
        const storeData = yield common.request(`/stores/${storeId}`);
        const services = storeData.data.services || [];
        const categorizedServices = services.map((service) => {
          const name = service.name;
          let categoryId = "1";
          if (name.includes("颈肩") || name.includes("腰背") || name.includes("腰腿痛")) {
            categoryId = "1";
          } else if (name.includes("肝") || name.includes("肺") || name.includes("脾胃")) {
            categoryId = "2";
          } else if (name.includes("精油") || name.includes("SPA") || name.includes("芳香")) {
            categoryId = "3";
          } else if (name.includes("铺姜") || name.includes("宫寒")) {
            categoryId = "4";
          } else if (name.includes("拔罐") || name.includes("刮痧")) {
            categoryId = "5";
          } else if (name.includes("肌肉") || name.includes("放松") || name.includes("疏通")) {
            categoryId = "6";
          } else if (name.includes("整脊") || name.includes("体态")) {
            categoryId = "7";
          } else if (name.includes("关元灸") || name.includes("悬灸")) {
            categoryId = "2";
          } else if (name.includes("全身")) {
            categoryId = "6";
          }
          return __spreadProps(__spreadValues({}, service), {
            categoryId,
            availability: "available",
            description: service.name
          });
        });
        return {
          code: 200,
          data: categorizedServices,
          message: "success"
        };
      } catch (error) {
        console.error("获取门店服务失败:", error);
        return {
          code: 200,
          data: [],
          message: "success"
        };
      }
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
  const decodedTime = selectedTime ? decodeURIComponent(selectedTime) : "";
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
      time: decodedTime || "10:00",
      // 使用解码后的时间，默认10:00
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    setCartItems([...cartItems, newItem]);
    taro.Taro.showToast({
      title: "已添加到购物车",
      icon: "none"
    });
  };
  const handleClearCart = () => {
    setCartItems([]);
    taro.Taro.showToast({
      title: "购物车已清空",
      icon: "none"
    });
  };
  const handleRemoveItem = (index2) => {
    const newItems = cartItems.filter((_, i) => i !== index2);
    setCartItems(newItems);
    taro.Taro.showToast({
      title: "已移除商品",
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
      common.ShoppingCart,
      {
        items: cartItems,
        onCheckout: handleCheckout,
        onMaskClick: handleClearCart,
        onRemoveItem: handleRemoveItem,
        simpleClearMode: true
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
