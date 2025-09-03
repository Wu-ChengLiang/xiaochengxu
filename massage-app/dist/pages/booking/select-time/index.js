"use strict";
const taro = require("../../../taro.js");
const SelectTime = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { style: { padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "选择时间页面 - 开发中" }) });
};
var config = {};
Page(taro.createPageConfig(SelectTime, "pages/booking/select-time/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
