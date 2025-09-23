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
const taro = require("../../taro.js");
const vendors = require("../../vendors.js");
const common = require("../../common.js");
const LogoImg = "data:image/png;base64,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";
const index = "";
const Mine = () => {
  const [balance, setBalance] = taro.useState(0);
  const [userInfo, setUserInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(false);
  const [showBindPhoneModal, setShowBindPhoneModal] = taro.useState(false);
  const [phoneInput, setPhoneInput] = taro.useState("");
  const [bindingPhone, setBingingPhone] = taro.useState(false);
  const [currentOpenid, setCurrentOpenid] = taro.useState("");
  taro.useEffect(() => {
    initUser();
  }, []);
  taro.taroExports.useDidShow(() => {
    refreshUserData();
  });
  const initUser = () => __async(exports, null, function* () {
    setLoading(true);
    try {
      const localUser = common.getCurrentUserInfo();
      if (localUser && localUser.phone) {
        setUserInfo(localUser);
        fetchBalance();
        common.checkAndAutoLogin().then((freshUser) => {
          if (freshUser) {
            setUserInfo(freshUser);
          }
        });
      } else {
        const userInfo2 = yield common.checkAndAutoLogin();
        if (userInfo2) {
          setUserInfo(userInfo2);
          fetchBalance();
        } else {
          console.log("需要用户手动登录");
          setUserInfo(null);
        }
      }
    } catch (error) {
      console.error("初始化用户失败:", error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  });
  const refreshUserData = () => __async(exports, null, function* () {
    if (userInfo == null ? void 0 : userInfo.phone) {
      fetchBalance();
    }
  });
  const fetchBalance = () => __async(exports, null, function* () {
    try {
      const currentBalance = yield common.walletService.getBalance();
      setBalance(currentBalance);
    } catch (error) {
      console.error("获取余额失败:", error);
    }
  });
  const menuItems = [
    {
      icon: "file-generic",
      title: "我的订单",
      path: "/pages/order/list/index",
      arrow: true
    },
    // {
    //   icon: 'money',
    //   title: '我的券包',
    //   path: '/pages/mine/coupons/index',
    //   badge: '3',
    //   arrow: true
    // },
    // {
    //   icon: 'gift',
    //   title: '邀请有奖',
    //   path: '/pages/mine/invite/index',
    //   arrow: true
    // },
    // {
    //   icon: 'phone',
    //   title: '联系客服',
    //   path: '/pages/mine/contact/index',
    //   arrow: true
    // },
    {
      icon: "help",
      title: "关于我们",
      path: "/pages/mine/about/index",
      arrow: true
    }
  ];
  const handleMenuClick = (item) => {
    taro.Taro.navigateTo({ url: item.path });
  };
  const handleLogin = () => __async(exports, null, function* () {
    if (loading)
      return;
    setLoading(true);
    try {
      const loginResult = yield common.wechatLogin();
      if (loginResult.needBindPhone) {
        setCurrentOpenid(loginResult.openid);
        setShowBindPhoneModal(true);
      } else if (loginResult.userInfo) {
        setUserInfo(loginResult.userInfo);
        fetchBalance();
        taro.Taro.showToast({
          title: "登录成功",
          icon: "success"
        });
      }
    } catch (error) {
      console.error("微信登录失败:", error);
      taro.Taro.showToast({
        title: "登录失败，请重试",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleBindPhone = () => __async(exports, null, function* () {
    if (!phoneInput.trim()) {
      taro.Taro.showToast({
        title: "请输入手机号",
        icon: "error"
      });
      return;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneInput.trim())) {
      taro.Taro.showToast({
        title: "手机号格式不正确",
        icon: "error"
      });
      return;
    }
    setBingingPhone(true);
    try {
      yield common.bindPhone(currentOpenid, phoneInput.trim());
      const latestUserInfo = common.getCurrentUserInfo();
      if (latestUserInfo) {
        setUserInfo(latestUserInfo);
        fetchBalance();
      }
      setShowBindPhoneModal(false);
      setPhoneInput("");
      taro.Taro.showToast({
        title: "绑定成功",
        icon: "success"
      });
    } catch (error) {
      console.error("手机号绑定失败:", error);
      taro.Taro.showToast({
        title: "绑定失败，请重试",
        icon: "error"
      });
    } finally {
      setBingingPhone(false);
    }
  });
  const handleCancelBindPhone = () => {
    setShowBindPhoneModal(false);
    setPhoneInput("");
    setCurrentOpenid("");
  };
  const handleBalanceClick = () => {
    taro.Taro.navigateTo({
      url: "/pages/mine/balance/index"
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "mine-page", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "header-section", children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "user-card", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "user-info", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "avatar",
            src: (userInfo == null ? void 0 : userInfo.avatar) || LogoImg,
            mode: "aspectFill"
          }
        ),
        userInfo ? /* @__PURE__ */ taro.jsx(taro.Text, { className: "phone", children: userInfo.nickname || userInfo.username || common.maskPhone(userInfo.phone) }) : /* @__PURE__ */ taro.jsx(
          taro.Button,
          {
            className: "login-btn",
            onClick: handleLogin,
            loading,
            disabled: loading,
            size: "mini",
            type: "primary",
            children: loading ? "登录中..." : "微信登录"
          }
        )
      ] }),
      userInfo && /* @__PURE__ */ taro.jsxs(taro.View, { className: "balance-info", onClick: handleBalanceClick, children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "balance-label", children: "余额: " }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "balance-amount", children: [
          "¥ ",
          balance.toFixed(2)
        ] }),
        /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "16", color: "#fff" })
      ] })
    ] }) }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "menu-section", children: menuItems.map(
      (item, index2) => /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: "menu-item",
          onClick: () => handleMenuClick(item),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "menu-left", children: [
              /* @__PURE__ */ taro.jsx(
                vendors.AtIcon,
                {
                  prefixClass: "icon",
                  value: item.icon,
                  size: "20",
                  color: "#666"
                }
              ),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "menu-title", children: item.title })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "menu-right", children: [
              item.badge && /* @__PURE__ */ taro.jsx(taro.View, { className: "badge", children: item.badge }),
              item.arrow && /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "16", color: "#999" })
            ] })
          ]
        },
        index2
      )
    ) }),
    /* @__PURE__ */ taro.jsxs(
      vendors.AtModal,
      {
        isOpened: showBindPhoneModal,
        onCancel: handleCancelBindPhone,
        onConfirm: handleBindPhone,
        children: [
          /* @__PURE__ */ taro.jsx(vendors.AtModalHeader, { children: "绑定手机号" }),
          /* @__PURE__ */ taro.jsx(vendors.AtModalContent, { children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "bind-phone-content", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "bind-phone-tips", children: "请输入您的手机号，用于账号登录和信息接收" }),
            /* @__PURE__ */ taro.jsx(
              taro.Input,
              {
                className: "phone-input",
                type: "number",
                placeholder: "请输入手机号",
                value: phoneInput,
                onInput: (e) => setPhoneInput(e.detail.value),
                maxlength: 11,
                disabled: bindingPhone
              }
            )
          ] }) }),
          /* @__PURE__ */ taro.jsxs(vendors.AtModalAction, { children: [
            /* @__PURE__ */ taro.jsx(taro.Button, { onClick: handleCancelBindPhone, children: "取消" }),
            /* @__PURE__ */ taro.jsx(taro.Button, { onClick: handleBindPhone, disabled: bindingPhone, children: bindingPhone ? "绑定中..." : "确认绑定" })
          ] })
        ]
      }
    )
  ] });
};
var config = {};
Page(taro.createPageConfig(Mine, "pages/mine/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
