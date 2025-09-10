"use strict";
const taro = require("../../../taro.js");
const index = "";
const About = () => {
  const handleLogout = () => {
    taro.Taro.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          taro.Taro.showToast({
            title: "已退出登录",
            icon: "success",
            duration: 2e3,
            success: () => {
              setTimeout(() => {
                taro.Taro.switchTab({ url: "/pages/appointment/index" });
              }, 2e3);
            }
          });
        }
      }
    });
  };
  const handlePhoneCall = () => {
    taro.Taro.makePhoneCall({
      phoneNumber: "400-633-0933"
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "about-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "brand-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "logo-container", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "logo", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "logo-text", children: "常乐" }) }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "brand-name", children: "对症推拿" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "version", children: "版本号：5.1.20" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "culture-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "常乐文化" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "culture-item", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "bullet" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "culture-text", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "culture-label", children: "身份：" }),
          "中国对症推拿数字化平台开创者"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "culture-item", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "bullet" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "culture-text", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "culture-label", children: "主张：" }),
          "疲劳酸痛，到常乐对症推拿"
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "culture-item", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "bullet" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "culture-text", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "culture-label", children: "承诺：" }),
          "对症无效，一键退款"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "contact-section", onClick: handlePhoneCall, children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "contact-label", children: "客服电话：" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "contact-number", children: "400-633-0933" })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "button-section", children: /* @__PURE__ */ taro.jsx(taro.Button, { className: "logout-btn", onClick: handleLogout, children: "退出账户" }) })
  ] });
};
var config = {
  "navigationBarTitleText": "联系我们"
};
Page(taro.createPageConfig(About, "pages/mine/about/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
