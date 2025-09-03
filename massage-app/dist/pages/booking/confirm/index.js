"use strict";
const taro = require("../../../taro.js");
const BookingConfirm = () => {
  return /* @__PURE__ */ taro.jsx(taro.View, { style: { padding: "20px", textAlign: "center" }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "预约确认页面 - 开发中" }) });
};
var config = {};
Page(taro.createPageConfig(BookingConfirm, "pages/booking/confirm/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
