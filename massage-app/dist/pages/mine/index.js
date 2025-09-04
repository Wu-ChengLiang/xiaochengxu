"use strict";
const taro = require("../../taro.js");
const index = "";
const Mine = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "mine-page", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "content", children: [
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "title", children: "我的页面" }),
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "desc", children: "功能开发中..." })
  ] }) });
};
var config = {};
Page(taro.createPageConfig(Mine, "pages/mine/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
