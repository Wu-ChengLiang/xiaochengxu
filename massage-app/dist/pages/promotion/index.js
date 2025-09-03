"use strict";
const taro = require("../../taro.js");
const vendors = require("../../vendors.js");
const common = require("../../common.js");
const index = "";
const mockPromotions = [
  {
    id: "promo-001",
    title: "晚安好眠套餐",
    subtitle: "深度放松，一夜好眠",
    originalPrice: 398,
    discountPrice: 298,
    discount: "7.5折",
    image: common.bannerGoodnight,
    validUntil: "2024-12-31",
    remainingQuota: 86,
    totalQuota: 200,
    description: [
      "60分钟专业推拿服务",
      "针对性睡眠改善方案",
      "赠送香薰精油一份",
      "可选时段：晚7点-10点"
    ]
  },
  {
    id: "promo-002",
    title: "肩颈理疗套餐",
    subtitle: "告别肩颈疼痛",
    originalPrice: 298,
    discountPrice: 198,
    discount: "6.6折",
    image: common.bannerGoodnight,
    validUntil: "2024-12-31",
    remainingQuota: 142,
    totalQuota: 300,
    description: [
      "45分钟专业肩颈推拿",
      "热敷理疗服务",
      "专业推拿师一对一服务",
      "适用所有门店"
    ]
  },
  {
    id: "promo-003",
    title: "新客专享套餐",
    subtitle: "首次体验优惠",
    originalPrice: 198,
    discountPrice: 99,
    discount: "5折",
    image: common.bannerGoodnight,
    validUntil: "2024-12-31",
    remainingQuota: 58,
    totalQuota: 100,
    description: [
      "30分钟基础推拿服务",
      "专业体质评估一次",
      "仅限新用户购买",
      "每人限购一次"
    ]
  }
];
const PromotionPage = () => {
  const [currentTab, setCurrentTab] = taro.useState(0);
  const [promotions, setPromotions] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    setTimeout(() => {
      setPromotions(mockPromotions);
      setLoading(false);
    }, 500);
  }, []);
  const handlePurchase = (promotion) => {
    taro.Taro.navigateTo({
      url: `/pages/booking/confirm/index?type=promotion&id=${promotion.id}`
    });
  };
  const tabList = [
    { title: "全部优惠" },
    { title: "限时特惠" },
    { title: "新客专享" }
  ];
  const filterPromotions = (tabIndex) => {
    switch (tabIndex) {
      case 1:
        return promotions.filter((p) => p.discount && parseFloat(p.discount) < 8);
      case 2:
        return promotions.filter((p) => p.title.includes("新客"));
      default:
        return promotions;
    }
  };
  const renderPromotion = (promotion) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-card", children: [
    /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "promotion-image",
        src: promotion.image,
        mode: "aspectFill"
      }
    ),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-content", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-header", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "title-section", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "promotion-title", children: promotion.title }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "promotion-subtitle", children: promotion.subtitle })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "discount-badge", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-text", children: promotion.discount }) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "prices", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "discount-price", children: [
            "¥",
            promotion.discountPrice
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "original-price", children: [
            "¥",
            promotion.originalPrice
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "quota-info", children: [
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "quota-text", children: [
            "剩余",
            promotion.remainingQuota,
            "份"
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "quota-progress", children: /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: "quota-progress-fill",
              style: { width: `${promotion.remainingQuota / promotion.totalQuota * 100}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "description-section", children: promotion.description.map(
        (desc, index2) => /* @__PURE__ */ taro.jsxs(taro.Text, { className: "description-item", children: [
          "• ",
          desc
        ] }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-footer", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "valid-date", children: [
          "有效期至 ",
          promotion.validUntil
        ] }),
        /* @__PURE__ */ taro.jsx(
          vendors.AtButton,
          {
            type: "primary",
            size: "small",
            className: "purchase-btn",
            onClick: () => handlePurchase(promotion),
            children: "立即抢购"
          }
        )
      ] })
    ] })
  ] }, promotion.id);
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "page-header", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "page-title", children: "优惠专区" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "page-subtitle", children: "限时特惠，手慢无" })
    ] }),
    /* @__PURE__ */ taro.jsx(
      vendors.AtTabs,
      {
        current: currentTab,
        tabList,
        onClick: setCurrentTab,
        className: "promotion-tabs",
        children: tabList.map(
          (_, index2) => /* @__PURE__ */ taro.jsx(vendors.AtTabsPane, { current: currentTab, index: index2, children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "promotion-list", children: loading ? /* @__PURE__ */ taro.jsx(taro.View, { className: "loading-container", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "loading-text", children: "加载中..." }) }) : filterPromotions(index2).map((promotion) => renderPromotion(promotion)) }) }, index2)
        )
      }
    )
  ] });
};
var config = {
  "navigationBarTitleText": "优惠专区",
  "navigationBarBackgroundColor": "#d4237a",
  "navigationBarTextStyle": "white"
};
Page(taro.createPageConfig(PromotionPage, "pages/promotion/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
