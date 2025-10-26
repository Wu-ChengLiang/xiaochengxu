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
const Balance = () => {
  const [balance, setBalance] = taro.useState(0);
  const [transactions, setTransactions] = taro.useState([]);
  const [loading, setLoading] = taro.useState(false);
  const [page, setPage] = taro.useState(1);
  const [hasMore, setHasMore] = taro.useState(true);
  const isInitialized = taro.react_production_min.useRef(false);
  taro.useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchBalance();
      fetchTransactions();
    }
  }, []);
  taro.taroExports.useReachBottom(() => {
    if (hasMore && !loading) {
      fetchTransactions(page + 1);
    }
  });
  const fetchBalance = () => __async(exports, null, function* () {
    const currentBalance = yield common.walletService.getBalance();
    setBalance(currentBalance / 100);
  });
  const fetchTransactions = (pageNum = 1) => __async(exports, null, function* () {
    if (loading)
      return;
    setLoading(true);
    try {
      const list = yield common.walletService.getTransactions(pageNum, 20);
      if (pageNum === 1) {
        setTransactions(list);
      } else {
        setTransactions((prev) => [...prev, ...list]);
      }
      setPage(pageNum);
      setHasMore(list.length === 20);
    } catch (error) {
      taro.Taro.showToast({
        title: "加载失败",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleRecharge = () => {
    taro.Taro.navigateTo({
      url: "/pages/mine/recharge/index"
    });
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const today = /* @__PURE__ */ new Date();
    const isToday = date.toDateString() === today.toDateString();
    const dateString = isToday ? "今天" : `${month}月${day}日`;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    return `${dateString} ${timeString}`;
  };
  const getTransactionIcon = (type) => {
    switch (type) {
      case "recharge":
        return "add-circle";
      case "consume":
        return "subtract-circle";
      case "refund":
        return "reload";
      default:
        return "money";
    }
  };
  const getTransactionColor = (type) => {
    switch (type) {
      case "recharge":
      case "refund":
        return "#52c41a";
      case "consume":
        return "#333";
      default:
        return "#999";
    }
  };
  const formatAmount = (amount) => {
    const yuan = amount / 100;
    return yuan > 0 ? `+${yuan.toFixed(2)}` : yuan.toFixed(2);
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "balance-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "balance-card", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "label", children: "当前余额" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "amount-wrapper", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "currency", children: "¥" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "amount", children: balance.toFixed(2) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "action-btn", onClick: handleRecharge, children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "add", size: "16", color: "#fff" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { children: "充值" })
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "transaction-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "交易记录" }),
      transactions.length === 0 ? /* @__PURE__ */ taro.jsxs(taro.View, { className: "empty", children: [
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "file-generic", size: "48", color: "#ccc" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "empty-text", children: "暂无交易记录" })
      ] }) : /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "transaction-list", scrollY: true, children: [
        transactions.map(
          (transaction) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "transaction-item", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "left", children: [
              /* @__PURE__ */ taro.jsx(
                vendors.AtIcon,
                {
                  value: getTransactionIcon(transaction.type),
                  size: "32",
                  color: getTransactionColor(transaction.type)
                }
              ),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "info", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "description", children: transaction.description }),
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "time", children: formatDate(transaction.createdAt) })
              ] })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "right", children: [
              /* @__PURE__ */ taro.jsx(
                taro.Text,
                {
                  className: `amount ${transaction.amount > 0 ? "income" : "expense"}`,
                  children: formatAmount(transaction.amount)
                }
              ),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "balance", children: [
                "余额: ",
                (transaction.balance / 100).toFixed(2)
              ] })
            ] })
          ] }, transaction.id)
        ),
        loading && /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "加载中..." }) }),
        !hasMore && transactions.length > 0 && /* @__PURE__ */ taro.jsx(taro.View, { className: "no-more", children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "没有更多了" }) })
      ] })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "余额明细",
  "usingComponents": {
    "comp": "../../../comp"
  }
};
Page(taro.createPageConfig(Balance, "pages/mine/balance/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
