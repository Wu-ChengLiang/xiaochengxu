"use strict";
const taro = require("./taro.js");
const app = "";
let App$1 = class App2 extends taro.Component {
  componentDidMount() {
    console.log("推拿预约小程序启动");
  }
  componentDidShow() {
  }
  componentDidHide() {
  }
  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
};
var config = {
  "pages": [
    "pages/appointment/index",
    "pages/gift/index",
    "pages/mine/index",
    "pages/appointment/store/index",
    "pages/appointment/therapist/index",
    "pages/appointment/symptom/index",
    "pages/promotion/index",
    "pages/booking/confirm/index",
    "pages/booking/success/index",
    "pages/order/list/index",
    "pages/order/detail/index",
    "pages/gift/card-detail/index",
    "pages/gift/product-detail/index",
    "pages/gift/purchase/index",
    "pages/gift/order-confirm/index",
    "pages/mine/about/index",
    "pages/mine/recharge/index",
    "pages/mine/balance/index"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#a40035",
    "navigationBarTitleText": "疲劳酸痛，到名医堂",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#a40035",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/appointment/index",
        "text": "预约",
        "iconPath": "./assets/icons/预约未选.png",
        "selectedIconPath": "./assets/icons/预约选择.png"
      },
      {
        "pagePath": "pages/gift/index",
        "text": "好礼",
        "iconPath": "./assets/icons/好礼未选.png",
        "selectedIconPath": "./assets/icons/好礼选中.png"
      },
      {
        "pagePath": "pages/mine/index",
        "text": "我的",
        "iconPath": "./assets/icons/我的未选.png",
        "selectedIconPath": "./assets/icons/我 的选择.png"
      }
    ]
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于计算附近门店距离"
    }
  },
  "requiredPrivateInfos": [
    "getLocation"
  ]
};
taro.taroWindowProvider.__taroAppConfig = config;
App(taro.createReactApp(App$1, taro.React, taro.index, config));
taro.taroExports.initPxTransform({
  designWidth: 750,
  deviceRatio: { "375": 2, "640": 1.17, "750": 1, "828": 0.905 }
});
//# sourceMappingURL=app.js.map
