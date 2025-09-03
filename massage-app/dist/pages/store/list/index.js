"use strict";
const taro = require("../../../taro.js");
const StoreList = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { style: { padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "门店列表页面 - 开发中" }) });
};
var config = {};
Page(taro.createPageConfig(StoreList, "pages/store/list/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
