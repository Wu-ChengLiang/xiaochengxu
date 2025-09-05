"use strict";
const taro = require("../../taro.js");
const vendors = require("../../vendors.js");
const index = "";
const Mine = () => {
  const menuItems = [
    {
      icon: "file-generic",
      title: "项目订单",
      path: "/pages/mine/orders/index",
      arrow: true
    },
    {
      icon: "shopping-bag",
      title: "好礼订单",
      path: "/pages/mine/gift-orders/index",
      arrow: true
    },
    {
      icon: "money",
      title: "我的券包",
      path: "/pages/mine/coupons/index",
      badge: "3",
      arrow: true
    },
    {
      icon: "gift",
      title: "邀请有奖",
      path: "/pages/mine/invite/index",
      arrow: true
    },
    {
      icon: "phone",
      title: "联系客服",
      path: "/pages/mine/contact/index",
      arrow: true
    },
    {
      icon: "help",
      title: "关于我们",
      path: "/pages/mine/about/index",
      arrow: true
    }
  ];
  const handleMenuClick = (item) => {
    taro.Taro.navigateTo({ url: item.path });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "mine-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "header-section", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "user-card", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "user-info", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "avatar",
            src: "https://via.placeholder.com/120x120?text=Avatar",
            mode: "aspectFill"
          }
        ),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "phone", children: "193****9506" })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "balance-info", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "balance-label", children: "余额: " }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "balance-amount", children: "¥ 0.00" }),
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "16", color: "#fff" })
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "menu-section", children: menuItems.map(
      (item, index2) => /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: "menu-item",
          onClick: () => handleMenuClick(item),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "menu-left", children: [
              /* @__PURE__ */ taro.jsx(
                vendors.AtIcon,
                {
                  prefixClass: "icon",
                  value: item.icon,
                  size: "20",
                  color: "#666"
                }
              ),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "menu-title", children: item.title })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "menu-right", children: [
              item.badge && /* @__PURE__ */ taro.jsx(taro.View, { className: "badge", children: item.badge }),
              item.arrow && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "16", color: "#999" })
            ] })
          ]
        },
        index2
      )
    ) })
  ] });
};
var config = {};
Page(taro.createPageConfig(Mine, "pages/mine/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
