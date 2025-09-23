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
  const handleJoinCall = () => {
    taro.Taro.makePhoneCall({
      phoneNumber: "13701757685"
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
      /* @__PURE__ */ taro.jsx(taro.View, { className: "culture-item", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "culture-text", children: "名医堂创立于2017年，汇聚非遗专家与中医师，融合正脊、推拿、艾灸等传统疗法，辨证施治，提供个性化医养结合服务，专注疼痛、亚健康及未病调理。" }) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "contact-section", onClick: handleJoinCall, children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "contact-label", children: "加盟热线：" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "contact-number", children: "13701757685" })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "button-section", children: /* @__PURE__ */ taro.jsx(taro.Button, { className: "logout-btn", onClick: handleLogout, children: "退出账户" }) })
  ] });
};
var config = {
  "navigationBarTitleText": "联系我们"
};
Page(taro.createPageConfig(About, "pages/mine/about/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
