<<<<<<< HEAD
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
=======
"use strict";var e=Object.defineProperty,s=Object.defineProperties,t=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,c=(s,t,i)=>t in s?e(s,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[t]=i,n=(e,s)=>{for(var t in s||(s={}))r.call(s,t)&&c(e,t,s[t]);if(i)for(var t of i(s))a.call(s,t)&&c(e,t,s[t]);return e},o=(e,i)=>s(e,t(i)),l=(e,s,t)=>new Promise((i,r)=>{var a=e=>{try{n(t.next(e))}catch(s){r(s)}},c=e=>{try{n(t.throw(e))}catch(s){r(s)}},n=e=>e.done?i(e.value):Promise.resolve(e.value).then(a,c);n((t=t.apply(e,s)).next())});const m=require("../../../taro.js"),u=require("../../../vendors.js"),d=require("../../../common.js"),x="",p=({categories:e,activeId:s,onChange:t,className:i})=>m.jsxRuntimeExports.jsx(m.ScrollView,{className:u.classNames("symptom-category-tabs",i),scrollY:!0,showScrollbar:!1,children:e.map(e=>m.jsxRuntimeExports.jsx(m.View,{className:u.classNames("category-item",{active:e.id===s}),onClick:()=>t(e.id),children:m.jsxRuntimeExports.jsx(m.Text,{className:"category-name",children:e.name})},e.id))}),j="",v=({service:e,onAdd:s,isInCart:t=!1,className:i})=>{const r={available:"\u7a7a\u95f2",busy:"\u7e41\u5fd9",full:"\u7206\u6ee1"},a={available:"status-available",busy:"status-busy",full:"status-full"};return m.jsxRuntimeExports.jsxs(m.View,{className:u.classNames("symptom-service-card",i),children:[m.jsxRuntimeExports.jsxs(m.View,{className:"service-header",children:[m.jsxRuntimeExports.jsx(m.Text,{className:"service-name",children:e.name}),m.jsxRuntimeExports.jsx(m.Text,{className:u.classNames("service-status",a[e.availability]),children:r[e.availability]})]}),m.jsxRuntimeExports.jsx(m.Text,{className:"service-description",children:e.description}),m.jsxRuntimeExports.jsxs(m.View,{className:"service-footer",children:[m.jsxRuntimeExports.jsxs(m.View,{className:"service-info",children:[m.jsxRuntimeExports.jsxs(m.Text,{className:"service-duration",children:[e.duration,"\u5206\u949f"]}),m.jsxRuntimeExports.jsxs(m.View,{className:"service-price",children:[m.jsxRuntimeExports.jsxs(m.Text,{className:"price-current",children:["\xa5",e.discountPrice||e.price]}),e.discountPrice&&m.jsxRuntimeExports.jsxs(m.Text,{className:"price-original",children:["\xa5",e.price]})]})]}),m.jsxRuntimeExports.jsx(m.View,{className:u.classNames("add-button",{"in-cart":t,disabled:"full"===e.availability}),onClick:"full"!==e.availability?s:void 0,children:"full"===e.availability?m.jsxRuntimeExports.jsx(m.Text,{className:"button-text",children:"\u5df2\u6ee1"}):m.jsxRuntimeExports.jsx(m.Text,{className:"iconfont icon-add"})})]})]})},h="",g=({services:e,therapists:s,onAddToCart:t,cartServiceIds:i,className:r})=>{const a=e.map(e=>({service:e,availableTherapists:s}));return m.jsxRuntimeExports.jsx(m.ScrollView,{className:`symptom-service-list ${r||""}`,scrollY:!0,showScrollbar:!1,children:m.jsxRuntimeExports.jsx(m.View,{className:"service-list-content",children:a.map(e=>m.jsxRuntimeExports.jsxs(m.View,{className:"service-item-container",children:[m.jsxRuntimeExports.jsx(v,{service:e.service,onAdd:()=>{},isInCart:i.includes(e.service.id)}),m.jsxRuntimeExports.jsx(m.View,{className:"therapist-options",children:e.availableTherapists.map(s=>m.jsxRuntimeExports.jsxs(m.View,{className:"therapist-option",onClick:()=>t(e.service,s.id),children:[m.jsxRuntimeExports.jsx(m.Image,{className:"therapist-mini-avatar",src:s.avatar,mode:"aspectFill"}),m.jsxRuntimeExports.jsx(m.Text,{className:"therapist-name",children:s.name})]},s.id))})]},e.service.id))})})},y=e=>new Promise(s=>setTimeout(s,e)),E={getCategories(){return l(this,null,function*(){return yield y(100),{code:200,data:d.symptomCategories,message:"success"}})},getTherapistSymptomServices(e){return l(this,null,function*(){if(yield y(200),!e)throw new Error("\u63a8\u62ff\u5e08ID\u4e0d\u80fd\u4e3a\u7a7a");const s=getTherapistSymptomServices(e);return{code:200,data:s,message:"success"}})},getStoreSymptomServices(e){return l(this,null,function*(){if(!e)throw new Error("\u95e8\u5e97ID\u4e0d\u80fd\u4e3a\u7a7a");try{const s=yield d.request(`/stores/${e}`),t=s.data.services||[],i=t.map(e=>{const s=e.name;let t="1";return s.includes("\u9888\u80a9")||s.includes("\u8170\u80cc")||s.includes("\u8170\u817f\u75db")?t="1":s.includes("\u809d")||s.includes("\u80ba")||s.includes("\u813e\u80c3")?t="2":s.includes("\u7cbe\u6cb9")||s.includes("SPA")||s.includes("\u82b3\u9999")?t="3":s.includes("\u94fa\u59dc")||s.includes("\u5bab\u5bd2")?t="4":s.includes("\u62d4\u7f50")||s.includes("\u522e\u75e7")?t="5":s.includes("\u808c\u8089")||s.includes("\u653e\u677e")||s.includes("\u758f\u901a")?t="6":s.includes("\u6574\u810a")||s.includes("\u4f53\u6001")?t="7":s.includes("\u5173\u5143\u7078")||s.includes("\u60ac\u7078")?t="2":s.includes("\u5168\u8eab")&&(t="6"),o(n({},e),{categoryId:t,availability:"available",description:e.name})});return{code:200,data:i,message:"success"}}catch(s){return console.error("\u83b7\u53d6\u95e8\u5e97\u670d\u52a1\u5931\u8d25:",s),{code:200,data:[],message:"success"}}})},getServicesByCategory(e,s){return l(this,null,function*(){yield y(150);const t=getTherapistSymptomServices(e),i=t.filter(e=>e.categoryId===s);return{code:200,data:i,message:"success"}})}},f="",N=()=>{const e=m.taroExports.useRouter(),{storeId:s,storeName:t,selectedDate:i,selectedTime:r}=e.params,a=r?decodeURIComponent(r):"",[c,n]=m.reactExports.useState([]),[o,l]=m.reactExports.useState([]),[u,x]=m.reactExports.useState([]),[j,v]=m.reactExports.useState(""),[h,y]=m.reactExports.useState([]),[f,N]=m.reactExports.useState(!0);m.reactExports.useEffect(()=>{s&&d.therapistService.getTherapistsByStore(s).then(e=>{n(e.list)})},[s]),m.reactExports.useEffect(()=>{E.getCategories().then(e=>{l(e.data),e.data.length>0&&v(e.data[0].id)})},[]),m.reactExports.useEffect(()=>{s&&(N(!0),E.getStoreSymptomServices(s).then(e=>{x(e.data),N(!1)}))},[s]);const b=m.reactExports.useMemo(()=>u.filter(e=>e.categoryId===j),[u,j]),R=m.reactExports.useMemo(()=>h.map(e=>e.serviceId),[h]),w=(e,s)=>{const t=c.find(e=>e.id===s);if(!t)return;const r={serviceId:e.id,serviceName:e.name,duration:e.duration,price:e.price,discountPrice:e.discountPrice,date:i||(new Date).toISOString().split("T")[0],time:a||"10:00",therapistName:t.name,therapistAvatar:t.avatar};y([...h,r]),m.Taro.showToast({title:"\u5df2\u6dfb\u52a0\u5230\u8d2d\u7269\u8f66",icon:"none"})},S=()=>{y([]),m.Taro.showToast({title:"\u8d2d\u7269\u8f66\u5df2\u6e05\u7a7a",icon:"none"})},T=e=>{const s=h.filter((s,t)=>t!==e);y(s),m.Taro.showToast({title:"\u5df2\u79fb\u9664\u5546\u54c1",icon:"none"})},C=()=>{if(0===h.length)return void m.Taro.showToast({title:"\u8bf7\u5148\u9009\u62e9\u670d\u52a1\u9879\u76ee",icon:"none"});const e={items:JSON.stringify(h),storeId:s,storeName:t,from:"symptom"};m.Taro.navigateTo({url:`/pages/booking/confirm/index?${Object.entries(e).map(([e,s])=>`${e}=${encodeURIComponent(s)}`).join("&")}`})};return f?m.jsxRuntimeExports.jsx(m.View,{className:"symptom-page loading",children:"\u52a0\u8f7d\u4e2d..."}):m.jsxRuntimeExports.jsxs(m.View,{className:"symptom-page",children:[m.jsxRuntimeExports.jsxs(m.View,{className:"symptom-content",children:[m.jsxRuntimeExports.jsx(p,{categories:o,activeId:j,onChange:v}),m.jsxRuntimeExports.jsx(g,{services:b,therapists:c,onAddToCart:w,cartServiceIds:R})]}),m.jsxRuntimeExports.jsx(d.ShoppingCart,{items:h,onCheckout:C,onMaskClick:S,onRemoveItem:T,simpleClearMode:!0})]})};var b={navigationBarTitleText:"\u63a8\u62ff\u5e08\u9884\u7ea6",navigationBarTextStyle:"black",navigationBarBackgroundColor:"#ffffff"};Page(m.createPageConfig(N,"pages/appointment/symptom/index",{root:{cn:[]}},b||{}));
>>>>>>> recovery-branch
