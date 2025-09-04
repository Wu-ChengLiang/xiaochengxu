"use strict";
const taro = require("../../taro.js");
const index = "";
const Gift = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "gift-page", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "content", children: [
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "title", children: "好礼页面" }),
    /* @__PURE__ */ taro.jsx(taro.Text, { className: "desc", children: "功能开发中..." })
  ] }) });
};
var config = {
  "usingComponents": {
    "comp": "../../comp"
  }
};
Page(taro.createPageConfig(Gift, "pages/gift/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
