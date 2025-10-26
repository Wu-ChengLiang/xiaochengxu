"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("../../../taro.js");
const vendors = require("../../../vendors.js");
const common = require("../../../common.js");
const index = "";
const VouchersPage = () => {
  const [current, setCurrent] = taro.useState(0);
  const [vouchers, setVouchers] = taro.useState([]);
  const [loading, setLoading] = taro.useState(true);
  const tabList = [
    { title: "可用券" },
    { title: "已使用" },
    { title: "已过期" }
  ];
  taro.useEffect(() => {
    loadVouchers();
  }, []);
  const loadVouchers = () => __async(exports, null, function* () {
    setLoading(true);
    try {
      const allVouchers = yield common.voucherService.getMyVouchers();
      setVouchers(allVouchers);
    } catch (error) {
      console.error("加载礼券失败:", error);
      taro.Taro.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const getFilteredVouchers = (status) => {
    const now = /* @__PURE__ */ new Date();
    return vouchers.filter((voucher) => {
      if (status === "expired") {
        const validTo = new Date(voucher.validTo);
        return validTo < now && voucher.status !== "used";
      }
      return voucher.status === status;
    });
  };
  const formatValidDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
  };
  const renderVoucherCard = (voucher) => {
    const isExpired = new Date(voucher.validTo) < /* @__PURE__ */ new Date();
    const isUsed = voucher.status === "used";
    return /* @__PURE__ */ taro.jsxs(
      taro.View,
      {
        className: `voucher-card ${isUsed ? "used" : ""} ${isExpired ? "expired" : ""}`,
        children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "voucher-left", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "discount-value", children: [
              voucher.type === "discount" && voucher.discountPercentage && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-number", children: voucher.discountPercentage }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-unit", children: "%" })
              ] }),
              voucher.type === "cash" && voucher.cashValue && /* @__PURE__ */ taro.jsxs(taro.Fragment, { children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-unit", children: "¥" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-number", children: (voucher.cashValue / 100).toFixed(0) })
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "discount-type", children: "优惠券" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "voucher-right", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "voucher-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "voucher-name", children: voucher.name }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "voucher-desc", children: voucher.description }),
              voucher.minAmount && voucher.minAmount > 0 && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "voucher-condition", children: [
                "满",
                (voucher.minAmount / 100).toFixed(0),
                "元可用"
              ] }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "voucher-validity", children: [
                "有效期至 ",
                formatValidDate(voucher.validTo)
              ] })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "voucher-status", children: [
              isUsed && /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-tag used", children: [
                /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "check-circle", size: "14" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { children: "已使用" })
              ] }),
              isExpired && !isUsed && /* @__PURE__ */ taro.jsxs(taro.View, { className: "status-tag expired", children: [
                /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "clock", size: "14" }),
                /* @__PURE__ */ taro.jsx(taro.Text, { children: "已过期" })
              ] }),
              !isUsed && !isExpired && /* @__PURE__ */ taro.jsx(
                taro.View,
                {
                  className: "use-btn",
                  onClick: () => {
                    taro.Taro.navigateTo({ url: "/pages/appointment/index" });
                  },
                  children: "立即使用"
                }
              )
            ] })
          ] })
        ]
      },
      voucher.id
    );
  };
  const renderEmptyState = (type) => {
    return /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty-state", children: [
      /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "tag", size: "60", color: "#ccc" }),
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "empty-text", children: [
        "暂无",
        type
      ] }),
      type === "可用券" && /* @__PURE__ */ taro.jsx(
        taro.View,
        {
          className: "go-shop-btn",
          onClick: () => {
            taro.Taro.switchTab({ url: "/pages/appointment/index" });
          },
          children: "去预约服务"
        }
      )
    ] });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "vouchers-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  const availableVouchers = getFilteredVouchers("unused");
  const usedVouchers = getFilteredVouchers("used");
  const expiredVouchers = getFilteredVouchers("expired");
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "vouchers-page", children: [
    /* @__PURE__ */ taro.jsxs(vendors.AtTabs, { current, tabList, onClick: setCurrent, children: [
      /* @__PURE__ */ taro.jsx(vendors.AtTabsPane, { current, index: 0, children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "voucher-list", children: availableVouchers.length > 0 ? availableVouchers.map(renderVoucherCard) : renderEmptyState("可用券") }) }),
      /* @__PURE__ */ taro.jsx(vendors.AtTabsPane, { current, index: 1, children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "voucher-list", children: usedVouchers.length > 0 ? usedVouchers.map(renderVoucherCard) : renderEmptyState("已使用的券") }) }),
      /* @__PURE__ */ taro.jsx(vendors.AtTabsPane, { current, index: 2, children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { scrollY: true, className: "voucher-list", children: expiredVouchers.length > 0 ? expiredVouchers.map(renderVoucherCard) : renderEmptyState("已过期的券") }) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-section", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "rules-title", children: "使用规则" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "rules-content", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "rule-item", children: "1. 优惠券在有效期内可用于预约服务" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "rule-item", children: "2. 每次预约仅可使用一张优惠券" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "rule-item", children: "3. 优惠券不可兑现、不可转让" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "rule-item", children: "4. 最终解释权归名医堂所有" })
      ] })
    ] })
  ] });
};
var config = {
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(VouchersPage, "pages/mine/vouchers/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
