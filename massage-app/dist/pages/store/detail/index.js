"use strict";
const taro = require("../../../taro.js");
const StoreDetail = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { style: { padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "门店详情页面 - 开发中" }) });
};
var config = {
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(StoreDetail, "pages/store/detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
