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
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const expertisePool = [["擅长", "头颈肩痛", "足疗+踩背"], ["擅长", "睡眠调理", "运动排酸"], ["擅长", "腰腿疼痛", "经络疏通"], ["擅长", "脊柱矫正", "淋巴排毒"], ["擅长", "关节调理", "肌肉放松"], ["擅长", "产后修复", "体态矫正"], ["擅长", "偏头痛调理", "肩周炎"], ["擅长", "腰椎调理", "膝关节痛"], ["擅长", "颈椎病", "富贵包调理"], ["擅长", "失眠调理", "疲劳恢复"]];
const mockTherapists = [
  // 世纪公园店 (store-011) - 3位
  {
    id: "therapist-101",
    storeId: "store-011",
    storeName: "名医堂•颈肩腰腿特色调理（世纪公园店）",
    name: "宋老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/世纪公园/宋老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "整骨", "辩证", "颈肩腰腿痛"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-102",
    storeId: "store-011",
    storeName: "名医堂•颈肩腰腿特色调理（世纪公园店）",
    name: "钟老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/世纪公园/钟老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-103",
    storeId: "store-011",
    storeName: "名医堂•颈肩腰腿特色调理（世纪公园店）",
    name: "马老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/世纪公园/马老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["艾灸", "脏腑调理", "推拿", "经络调理"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 东方路店 (store-027) - 6位
  {
    id: "therapist-104",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "朴老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/朴老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["脏腑", "脊柱", "疼痛", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-105",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/杨老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-106",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "王老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/王老师（女）.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-107",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "王老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/王老师 (男).jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["脏腑", "体态", "宗筋根骶", "升阳罐", "全息刮痧"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-108",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "胡老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/胡老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["关节复位", "软组织损伤", "脏腑", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-109",
    storeId: "store-027",
    storeName: "名医堂•颈肩腰腿特色调理（东方路店）",
    name: "隋老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/东方路店/隋老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 丰庄店 (store-026) - 3位
  {
    id: "therapist-110",
    storeId: "store-026",
    storeName: "名医堂•颈肩腰腿特色调理（丰庄店）",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/丰庄店/杨老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "脏腑"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-111",
    storeId: "store-026",
    storeName: "名医堂•颈肩腰腿特色调理（丰庄店）",
    name: "袁老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/丰庄店/袁老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-112",
    storeId: "store-026",
    storeName: "名医堂•颈肩腰腿特色调理（丰庄店）",
    name: "赵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/丰庄店/赵老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 五角场店 (store-033) - 2位
  {
    id: "therapist-113",
    storeId: "store-033",
    storeName: "名医堂•颈肩腰腿特色调理（五角场店）",
    name: "米老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/五角场万达店/米老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-114",
    storeId: "store-033",
    storeName: "名医堂•颈肩腰腿特色调理（五角场店）",
    name: "莫老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/五角场万达店/莫老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 仙霞路店 (store-009) - 4位
  {
    id: "therapist-115",
    storeId: "store-009",
    storeName: "名医堂•颈肩腰腿特色调理（仙霞路店）",
    name: "吴老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/仙霞路店/吴老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-116",
    storeId: "store-009",
    storeName: "名医堂•颈肩腰腿特色调理（仙霞路店）",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/仙霞路店/杨老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-117",
    storeId: "store-009",
    storeName: "名医堂•颈肩腰腿特色调理（仙霞路店）",
    name: "赵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/仙霞路店/赵老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-118",
    storeId: "store-009",
    storeName: "名医堂•颈肩腰腿特色调理（仙霞路店）",
    name: "高老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/仙霞路店/高老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[7],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 兰溪路店 (store-017) - 2位
  {
    id: "therapist-119",
    storeId: "store-017",
    storeName: "名医堂•颈肩腰腿特色调理（兰溪路店）",
    name: "宗老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/兰溪路/宗老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-120",
    storeId: "store-017",
    storeName: "名医堂•颈肩腰腿特色调理（兰溪路店）",
    name: "梁老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/兰溪路/梁老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 关山路店 (store-023) - 3位
  {
    id: "therapist-121",
    storeId: "store-023",
    storeName: "名医堂•颈肩腰腿特色调理（关山路店）",
    name: "陈老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/关山店/陈老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-122",
    storeId: "store-023",
    storeName: "名医堂•颈肩腰腿特色调理（关山路店）",
    name: "韩老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/关山店/韩老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-123",
    storeId: "store-023",
    storeName: "名医堂•颈肩腰腿特色调理（关山路店）",
    name: "顾老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/关山店/顾老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 南方商城店 (store-035) - 3位
  {
    id: "therapist-124",
    storeId: "store-035",
    storeName: "名医堂•颈肩腰腿特色调理（南方商城店）",
    name: "林老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/南方商城店/林老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-125",
    storeId: "store-035",
    storeName: "名医堂•颈肩腰腿特色调理（南方商城店）",
    name: "赵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/南方商城店/赵老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-126",
    storeId: "store-035",
    storeName: "名医堂•颈肩腰腿特色调理（南方商城店）",
    name: "邱老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/南方商城店/邱老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 周浦万达店 (store-038) - 3位
  {
    id: "therapist-127",
    storeId: "store-038",
    storeName: "名医堂•颈肩腰腿特色调理（周浦万达店）",
    name: "刘老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/周浦万达/刘老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-128",
    storeId: "store-038",
    storeName: "名医堂•颈肩腰腿特色调理（周浦万达店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/周浦万达/张老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[7],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-129",
    storeId: "store-038",
    storeName: "名医堂•颈肩腰腿特色调理（周浦万达店）",
    name: "萌老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/周浦万达/萌老师 (2).jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 国定路店 (store-037) - 3位
  {
    id: "therapist-130",
    storeId: "store-037",
    storeName: "名医堂•颈肩腰腿特色调理（国定路店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国定路店/张老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-131",
    storeId: "store-037",
    storeName: "名医堂•颈肩腰腿特色调理（国定路店）",
    name: "袁老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国定路店/袁老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-132",
    storeId: "store-037",
    storeName: "名医堂•颈肩腰腿特色调理（国定路店）",
    name: "邵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国定路店/邵老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 国顺店 (store-022) - 3位
  {
    id: "therapist-133",
    storeId: "store-022",
    storeName: "名医堂•颈肩腰腿特色调理（国顺店）",
    name: "崔老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国顺店/崔老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "经络", "肩颈腰腿痛调理"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-134",
    storeId: "store-022",
    storeName: "名医堂•颈肩腰腿特色调理（国顺店）",
    name: "翟老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国顺店/翟老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "经络", "肩颈腰腿痛调理", "脏腑"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-135",
    storeId: "store-022",
    storeName: "名医堂•颈肩腰腿特色调理（国顺店）",
    name: "蔡老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/国顺店/蔡老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "经络", "肩颈腰腿痛调理", "脏腑"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 巨峰路店 (store-019) - 3位
  {
    id: "therapist-136",
    storeId: "store-019",
    storeName: "名医堂•颈肩腰腿特色调理（巨峰路店）",
    name: "付老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/巨峰路店/付老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-137",
    storeId: "store-019",
    storeName: "名医堂•颈肩腰腿特色调理（巨峰路店）",
    name: "刘老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/巨峰路店/刘老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-138",
    storeId: "store-019",
    storeName: "名医堂•颈肩腰腿特色调理（巨峰路店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/巨峰路店/张老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "妇科", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 康桥店 (store-018) - 4位
  {
    id: "therapist-139",
    storeId: "store-018",
    storeName: "名医堂•颈肩腰腿特色调理（康桥店）",
    name: "何老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/康桥店/何老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["五大基础项目", "精油", "疼痛处理"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-140",
    storeId: "store-018",
    storeName: "名医堂•颈肩腰腿特色调理（康桥店）",
    name: "孙老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/康桥店/孙老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["五大基础项目", "精油", "疼痛处理"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-141",
    storeId: "store-018",
    storeName: "名医堂•颈肩腰腿特色调理（康桥店）",
    name: "易老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/康桥店/易老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-142",
    storeId: "store-018",
    storeName: "名医堂•颈肩腰腿特色调理（康桥店）",
    name: "晟垚老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/康桥店/晟垚老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["五大基础项目", "正骨", "疼痛处理"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 成吉中医 (store-025) - 3位
  {
    id: "therapist-143",
    storeId: "store-025",
    storeName: "名医堂成吉中医·推拿正骨·针灸·艾灸",
    name: "任老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/成吉中医/任老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-144",
    storeId: "store-025",
    storeName: "名医堂成吉中医·推拿正骨·针灸·艾灸",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/成吉中医/张老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-145",
    storeId: "store-025",
    storeName: "名医堂成吉中医·推拿正骨·针灸·艾灸",
    name: "熊老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/成吉中医/熊老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 春申路店 (store-028) - 3位
  {
    id: "therapist-146",
    storeId: "store-028",
    storeName: "名医堂•颈肩腰腿特色调理（春申路店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/春申店/张老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-147",
    storeId: "store-028",
    storeName: "名医堂•颈肩腰腿特色调理（春申路店）",
    name: "聂老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/春申店/聂老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "脏腑", "骨盆修复"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-148",
    storeId: "store-028",
    storeName: "名医堂•颈肩腰腿特色调理（春申路店）",
    name: "肖老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/春申店/肖老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "妇科"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 武宁南路店 (store-010) - 2位
  {
    id: "therapist-149",
    storeId: "store-010",
    storeName: "名医堂•颈肩腰腿特色调理（武宁南路店）",
    name: "陈老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/武宁南路店/陈老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-150",
    storeId: "store-010",
    storeName: "名医堂•颈肩腰腿特色调理（武宁南路店）",
    name: "鲍老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/武宁南路店/鲍老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 永康中医 (store-032) - 3位
  {
    id: "therapist-151",
    storeId: "store-032",
    storeName: "名医堂永康中医·推拿正骨·针灸·艾灸",
    name: "孙老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/永康中医/孙老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-152",
    storeId: "store-032",
    storeName: "名医堂永康中医·推拿正骨·针灸·艾灸",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/永康中医/杨老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-153",
    storeId: "store-032",
    storeName: "名医堂永康中医·推拿正骨·针灸·艾灸",
    name: "马老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/永康中医/马老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 汇融天地店 (store-021) - 3位
  {
    id: "therapist-154",
    storeId: "store-021",
    storeName: "名医堂•颈肩腰腿特色调理（汇融天地店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/汇融天地/张老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-155",
    storeId: "store-021",
    storeName: "名医堂•颈肩腰腿特色调理（汇融天地店）",
    name: "彭老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/汇融天地/彭老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-156",
    storeId: "store-021",
    storeName: "名医堂•颈肩腰腿特色调理（汇融天地店）",
    name: "李老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/汇融天地/李老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 浦三路店 (store-013) - 4位
  {
    id: "therapist-157",
    storeId: "store-013",
    storeName: "名医堂•颈肩腰腿特色调理（浦三路店）",
    name: "于老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦三路店/于老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-158",
    storeId: "store-013",
    storeName: "名医堂•颈肩腰腿特色调理（浦三路店）",
    name: "宁老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦三路店/宁老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[7],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-159",
    storeId: "store-013",
    storeName: "名医堂•颈肩腰腿特色调理（浦三路店）",
    name: "彭老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦三路店/彭老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-160",
    storeId: "store-013",
    storeName: "名医堂•颈肩腰腿特色调理（浦三路店）",
    name: "贺老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦三路店/贺老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 浦东大道店 (store-014) - 2位
  {
    id: "therapist-161",
    storeId: "store-014",
    storeName: "名医堂•颈肩腰腿特色调理（浦东大道店）",
    name: "尹老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦东大道店/尹老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-162",
    storeId: "store-014",
    storeName: "名医堂•颈肩腰腿特色调理（浦东大道店）",
    name: "金老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/浦东大道店/金老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 漕东里店 (store-029) - 3位
  {
    id: "therapist-163",
    storeId: "store-029",
    storeName: "名医堂•颈肩腰腿特色调理（漕东里店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/漕东里店/张老师.JPG",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["辩证", "推拿正骨艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-164",
    storeId: "store-029",
    storeName: "名医堂•颈肩腰腿特色调理（漕东里店）",
    name: "胡老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/漕东里店/胡老师 (1).jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿正骨艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-165",
    storeId: "store-029",
    storeName: "名医堂•颈肩腰腿特色调理（漕东里店）",
    name: "颜老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/漕东里店/颜老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿正骨艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 爱琴海店 (store-030) - 4位
  {
    id: "therapist-166",
    storeId: "store-030",
    storeName: "名医堂•颈肩腰腿特色调理（爱琴海店）",
    name: "于老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/爱琴海店/于老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-167",
    storeId: "store-030",
    storeName: "名医堂•颈肩腰腿特色调理（爱琴海店）",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/爱琴海店/杨老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-168",
    storeId: "store-030",
    storeName: "名医堂•颈肩腰腿特色调理（爱琴海店）",
    name: "肖老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/爱琴海店/肖老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "正骨", "颈椎病", "妇科"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-169",
    storeId: "store-030",
    storeName: "名医堂•颈肩腰腿特色调理（爱琴海店）",
    name: "邱老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/爱琴海店/邱老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "脏腑", "妇科", "宗筋根骶"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 联合大厦店 (store-036) - 1位
  {
    id: "therapist-170",
    storeId: "store-036",
    storeName: "名医堂•颈肩腰腿特色调理（联合大厦店）",
    name: "邵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/联合大厦店/邵老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 聚丰园路店 (store-034) - 2位
  {
    id: "therapist-171",
    storeId: "store-034",
    storeName: "名医堂•颈肩腰腿特色调理（聚丰园路店）",
    name: "侯老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/聚丰园路店/侯老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-172",
    storeId: "store-034",
    storeName: "名医堂•颈肩腰腿特色调理（聚丰园路店）",
    name: "关老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/聚丰园路店/关老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 莘庄店 (store-012) - 4位
  {
    id: "therapist-173",
    storeId: "store-012",
    storeName: "名医堂•颈肩腰腿特色调理（莘庄店）",
    name: "于老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/莘庄店/于老师.JPG",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "经络", "肩颈腰腿痛调理", "脏腑", "妇科"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-174",
    storeId: "store-012",
    storeName: "名医堂•颈肩腰腿特色调理（莘庄店）",
    name: "孟老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/莘庄店/孟老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-175",
    storeId: "store-012",
    storeName: "名医堂•颈肩腰腿特色调理（莘庄店）",
    name: "郭老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/莘庄店/郭老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-176",
    storeId: "store-012",
    storeName: "名医堂•颈肩腰腿特色调理（莘庄店）",
    name: "陈老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/莘庄店/陈老师.JPG",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "经络", "肩颈腰腿痛调理", "脏腑", "妇科"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 豫园店 (store-007) - 4位
  {
    id: "therapist-177",
    storeId: "store-007",
    storeName: "名医堂•颈肩腰腿特色调理（豫园店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/豫园路店/张老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-178",
    storeId: "store-007",
    storeName: "名医堂•颈肩腰腿特色调理（豫园店）",
    name: "李老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/豫园路店/李老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[7],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-179",
    storeId: "store-007",
    storeName: "名医堂•颈肩腰腿特色调理（豫园店）",
    name: "王老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/豫园路店/王老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-180",
    storeId: "store-007",
    storeName: "名医堂•颈肩腰腿特色调理（豫园店）",
    name: "靳老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/豫园路店/靳老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 长江西路店 (store-006) - 3位
  {
    id: "therapist-181",
    storeId: "store-006",
    storeName: "名医堂•颈肩腰腿特色调理（长江西路店）",
    name: "康老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/长江西路店/康老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-182",
    storeId: "store-006",
    storeName: "名医堂•颈肩腰腿特色调理（长江西路店）",
    name: "武老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/长江西路店/武老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-183",
    storeId: "store-006",
    storeName: "名医堂•颈肩腰腿特色调理（长江西路店）",
    name: "韩老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/长江西路店/韩老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 隆昌路店 (store-015) - 6位
  {
    id: "therapist-184",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "吴老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/吴老师.png",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "脏腑", "骨盆修复", "艾灸", "能量罐"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-185",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "唐老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/唐老师.png",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "腰肌劳损", "腰间盘突出"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-186",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "孙老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/孙老师.png",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "艾灸", "腰肌劳损", "腰间盘突出", "脏腑"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-187",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "葛老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/葛老师.png",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-188",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "裴老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/裴老师.png",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: ["推拿", "经络", "妇科", "艾灸"],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-189",
    storeId: "store-015",
    storeName: "名医堂•颈肩腰腿特色调理（隆昌路店）",
    name: "费老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/隆昌路店/费老师.png",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 静安寺店 (store-020) - 3位
  {
    id: "therapist-190",
    storeId: "store-020",
    storeName: "名医堂•颈肩腰腿特色调理（静安寺店）",
    name: "吕老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/静安寺店/吕老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-191",
    storeId: "store-020",
    storeName: "名医堂•颈肩腰腿特色调理（静安寺店）",
    name: "吴老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/静安寺店/吴老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-192",
    storeId: "store-020",
    storeName: "名医堂•颈肩腰腿特色调理（静安寺店）",
    name: "毛老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/静安寺店/毛老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[1],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 高岛屋店 (store-024) - 4位
  {
    id: "therapist-193",
    storeId: "store-024",
    storeName: "名医堂•颈肩腰腿特色调理（高岛屋店）",
    name: "宋老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/高岛屋/宋老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[2],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-194",
    storeId: "store-024",
    storeName: "名医堂•颈肩腰腿特色调理（高岛屋店）",
    name: "潘老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/高岛屋/潘老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[3],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-195",
    storeId: "store-024",
    storeName: "名医堂•颈肩腰腿特色调理（高岛屋店）",
    name: "邹老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/高岛屋/邹老师.jpg",
    rating: 4.7,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[4],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-196",
    storeId: "store-024",
    storeName: "名医堂•颈肩腰腿特色调理（高岛屋店）",
    name: "陈老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/高岛屋/陈老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[5],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 龙华路店 (store-016) - 3位
  {
    id: "therapist-197",
    storeId: "store-016",
    storeName: "名医堂•颈肩腰腿特色调理（龙华路店）",
    name: "张老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/龙华店/张老师.jpg",
    rating: 5,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[6],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-198",
    storeId: "store-016",
    storeName: "名医堂•颈肩腰腿特色调理（龙华路店）",
    name: "杨老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/龙华店/杨老师.jpg",
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[7],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  {
    id: "therapist-199",
    storeId: "store-016",
    storeName: "名医堂•颈肩腰腿特色调理（龙华路店）",
    name: "潘老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/龙华店/潘老师.jpg",
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[8],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 妙康中医 (store-031) - 1位（补充到至少2位）
  {
    id: "therapist-200",
    storeId: "store-031",
    storeName: "名医堂妙康中医·推拿正骨·针灸·艾灸",
    name: "赵老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/成吉中医/张老师.jpg",
    // 借用其他门店图片
    rating: 4.8,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[9],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  },
  // 斜土路店 (store-008) - 1位（补充）
  {
    id: "therapist-201",
    storeId: "store-008",
    storeName: "名医堂•颈肩腰腿特色调理（斜土路店）",
    name: "周老师",
    avatar: "http://8.133.16.64/static/XCXimage/老师收集中文原版/永康中医/杨老师.jpg",
    // 借用其他门店图片
    rating: 4.9,
    ratingCount: randomBetween(100, 500),
    expertise: expertisePool[0],
    yearsOfExperience: randomBetween(5, 15),
    serviceCount: randomBetween(500, 3e3),
    status: "available"
  }
];
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
      const services = common.getTherapistSymptomServices(therapistId);
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
      const storeTherapists = mockTherapists.filter((t) => t.storeId === storeId);
      const allServices = [];
      storeTherapists.forEach((therapist) => {
        const services = common.getTherapistSymptomServices(therapist.id);
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
      const allServices = common.getTherapistSymptomServices(therapistId);
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
  "navigationBarBackgroundColor": "#ffffff",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(SymptomPage, "pages/appointment/symptom/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
