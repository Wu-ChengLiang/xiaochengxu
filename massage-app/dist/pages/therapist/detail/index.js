"use strict";
const taro = require("../../../taro.js");
const TherapistDetail = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { style: { padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "推拿师详情页面 - 开发中" }) });
};
var config = {
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(TherapistDetail, "pages/therapist/detail/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
