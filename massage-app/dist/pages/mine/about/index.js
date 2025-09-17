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
        /* @__PURE__ */ taro.jsx(taro.View, { className: "logo", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "logo-text", children: "名医堂" }) }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "brand-name", children: "上海名医堂" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "version", children: "版本号：5.1.20" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "culture-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "关于我们" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "culture-item", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "culture-text", children: "上海名医堂是黄浦区中西医结合医院的精品门诊品牌，专注于中西医结合治疗，尤其擅长中医特色理疗（针灸、推拿）、骨伤康复及老年常见病调理，为市中心患者提供专家级、一站式的中医诊疗服务。" }) })
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
