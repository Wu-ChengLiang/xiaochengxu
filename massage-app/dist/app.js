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
    "pages/store/list/index",
    "pages/store/detail/index",
    "pages/therapist/detail/index",
    "pages/booking/confirm/index",
    "pages/booking/select-time/index"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "推拿预约",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#d4237a",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/appointment/index",
        "text": "预约"
      },
      {
        "pagePath": "pages/gift/index",
        "text": "好礼"
      },
      {
        "pagePath": "pages/mine/index",
        "text": "我的"
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
