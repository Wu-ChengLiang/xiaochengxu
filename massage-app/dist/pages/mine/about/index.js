<<<<<<< HEAD
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
=======
"use strict";const s=require("../../../taro.js"),e="",t=()=>{const e=()=>{s.Taro.showModal({title:"\u63d0\u793a",content:"\u786e\u5b9a\u8981\u9000\u51fa\u767b\u5f55\u5417\uff1f",success:e=>{e.confirm&&s.Taro.showToast({title:"\u5df2\u9000\u51fa\u767b\u5f55",icon:"success",duration:2e3,success:()=>{setTimeout(()=>{s.Taro.switchTab({url:"/pages/appointment/index"})},2e3)}})}})},t=()=>{s.Taro.makePhoneCall({phoneNumber:"13701757685"})};return s.jsxRuntimeExports.jsxs(s.View,{className:"about-page",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"brand-section",children:[s.jsxRuntimeExports.jsxs(s.View,{className:"logo-container",children:[s.jsxRuntimeExports.jsx(s.View,{className:"logo",children:s.jsxRuntimeExports.jsx(s.Text,{className:"logo-text",children:"\u540d\u533b\u5802"})}),s.jsxRuntimeExports.jsx(s.Text,{className:"brand-name",children:"\u4e0a\u6d77\u540d\u533b\u5802"})]}),s.jsxRuntimeExports.jsx(s.Text,{className:"version",children:"\u7248\u672c\u53f7\uff1a5.1.20"})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"culture-section",children:[s.jsxRuntimeExports.jsx(s.Text,{className:"section-title",children:"\u5173\u4e8e\u6211\u4eec"}),s.jsxRuntimeExports.jsx(s.View,{className:"culture-item",children:s.jsxRuntimeExports.jsx(s.Text,{className:"culture-text",children:"\u540d\u533b\u5802\u521b\u7acb\u4e8e2017\u5e74\uff0c\u6c47\u805a\u975e\u9057\u4e13\u5bb6\u4e0e\u4e2d\u533b\u5e08\uff0c\u878d\u5408\u6b63\u810a\u3001\u63a8\u62ff\u3001\u827e\u7078\u7b49\u4f20\u7edf\u7597\u6cd5\uff0c\u8fa8\u8bc1\u65bd\u6cbb\uff0c\u63d0\u4f9b\u4e2a\u6027\u5316\u533b\u517b\u7ed3\u5408\u670d\u52a1\uff0c\u4e13\u6ce8\u75bc\u75db\u3001\u4e9a\u5065\u5eb7\u53ca\u672a\u75c5\u8c03\u7406\u3002"})})]}),s.jsxRuntimeExports.jsxs(s.View,{className:"contact-section",onClick:t,children:[s.jsxRuntimeExports.jsx(s.Text,{className:"contact-label",children:"\u52a0\u76df\u70ed\u7ebf\uff1a"}),s.jsxRuntimeExports.jsx(s.Text,{className:"contact-number",children:"13701757685"})]}),s.jsxRuntimeExports.jsx(s.View,{className:"button-section",children:s.jsxRuntimeExports.jsx(s.Button,{className:"logout-btn",onClick:e,children:"\u9000\u51fa\u8d26\u6237"})})]})};var n={navigationBarTitleText:"\u8054\u7cfb\u6211\u4eec"};Page(s.createPageConfig(t,"pages/mine/about/index",{root:{cn:[]}},n||{}));
>>>>>>> recovery-branch
