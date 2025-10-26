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
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: vendors.classNames("symptom-service-card", className), children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "service-header", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "service-name", children: service.name }) }),
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
  selectedDate,
  selectedTime,
  onAddToCart,
  cartServiceIds,
  className
}) => {
  const isTherapistAvailable = (therapist) => {
    var _a;
    if (!therapist.availability || !selectedDate || !selectedTime) {
      return true;
    }
    const dayAvailability = therapist.availability.find((a) => a.date === selectedDate);
    if (!dayAvailability) {
      return true;
    }
    const slot = dayAvailability.slots.find((s) => s.time === selectedTime);
    return (_a = slot == null ? void 0 : slot.available) != null ? _a : true;
  };
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
          /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-options", children: item.availableTherapists.map((therapist) => {
            const available = isTherapistAvailable(therapist);
            return /* @__PURE__ */ taro.jsxs(
              taro.View,
              {
                className: `therapist-option ${available ? "available" : "booked"}`,
                onClick: () => available && onAddToCart(item.service, therapist.id),
                children: [
                  /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-avatar-wrapper", children: [
                    /* @__PURE__ */ taro.jsx(
                      taro.Image,
                      {
                        className: "therapist-mini-avatar",
                        src: therapist.avatar,
                        mode: "aspectFill"
                      }
                    ),
                    !available && /* @__PURE__ */ taro.jsx(taro.View, { className: "booked-badge", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "badge-text", children: "已预约" }) })
                  ] }),
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: therapist.name })
                ]
              },
              therapist.id
            );
          }) })
        ] }, item.service.id)
      ) })
    }
  );
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
    if (storeId && selectedDate) {
      const fetchTherapists = () => __async(exports, null, function* () {
        try {
          const [basicInfo, availabilityData] = yield Promise.all(
            [
              common.therapistService.getTherapistsByStore(storeId),
              common.therapistService.getTherapistsAvailability(
                storeId,
                selectedDate
              )
            ]
          );
          const merged = basicInfo.list.map((therapist) => {
            const availability = availabilityData.find((a) => a.id === therapist.id);
            return __spreadProps(__spreadValues({}, therapist), {
              availability: (availability == null ? void 0 : availability.availability) || []
            });
          });
          console.log("✅ 技师数据合并成功:", merged);
          setTherapists(merged);
        } catch (error) {
          console.error("❌ 获取技师信息失败:", error);
          common.therapistService.getTherapistsByStore(storeId).then((res) => {
            setTherapists(res.list);
          });
        }
      });
      fetchTherapists();
    }
  }, [storeId, selectedDate]);
  taro.useEffect(() => {
    common.symptomService.getCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setActiveCategoryId(res.data[0].id);
      }
    });
  }, []);
  taro.useEffect(() => {
    if (storeId) {
      setLoading(true);
      common.symptomService.getStoreSymptomServices(storeId).then((res) => {
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
    console.log("🎯 添加到购物车 - therapistId:", therapistId);
    const therapist = therapists.find((t) => t.id === therapistId);
    console.log("🎯 找到的技师:", therapist);
    if (!therapist) {
      console.error("❌ 未找到技师，therapistId:", therapistId);
      return;
    }
    const newItem = {
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      discountPrice: service.discountPrice,
      date: selectedDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      time: decodedTime || "10:00",
      // 使用解码后的时间，默认10:00
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistAvatar: therapist.avatar
    };
    console.log("🎯 新购物车项目:", newItem);
    console.log("🎯 新项目的therapistId:", newItem.therapistId);
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
    var _a;
    if (cartItems.length === 0) {
      taro.Taro.showToast({
        title: "请先选择服务项目",
        icon: "none"
      });
      return;
    }
    console.log("🔄 准备结算，购物车内容:", cartItems);
    console.log("🔄 第一个项目:", cartItems[0]);
    console.log("🔄 第一个项目的therapistId:", (_a = cartItems[0]) == null ? void 0 : _a.therapistId);
    const params = {
      items: JSON.stringify(cartItems),
      storeId,
      storeName,
      from: "symptom"
    };
    console.log("🔄 传递的参数:", params);
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
          selectedDate,
          selectedTime: decodedTime,
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
  "navigationBarBackgroundColor": "#ffffff",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(SymptomPage, "pages/appointment/symptom/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
