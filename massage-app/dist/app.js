<<<<<<< HEAD
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
    "pages/mine/about/index"
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
=======
"use strict";const e=require("./taro.js"),n="";let t=class extends e.reactExports.Component{componentDidMount(){console.log("\u63a8\u62ff\u9884\u7ea6\u5c0f\u7a0b\u5e8f\u542f\u52a8")}componentDidShow(){}componentDidHide(){}render(){return this.props.children}};var i={pages:["pages/appointment/index","pages/gift/index","pages/mine/index","pages/appointment/store/index","pages/appointment/therapist/index","pages/appointment/symptom/index","pages/promotion/index","pages/booking/confirm/index","pages/booking/success/index","pages/order/list/index","pages/order/detail/index","pages/gift/card-detail/index","pages/gift/product-detail/index","pages/gift/purchase/index","pages/gift/order-confirm/index","pages/mine/about/index","pages/mine/recharge/index","pages/mine/balance/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#a40035",navigationBarTitleText:"\u75b2\u52b3\u9178\u75db\uff0c\u5230\u540d\u533b\u5802",navigationBarTextStyle:"white"},tabBar:{color:"#999999",selectedColor:"#a40035",backgroundColor:"#ffffff",borderStyle:"black",list:[{pagePath:"pages/appointment/index",text:"\u9884\u7ea6",iconPath:"./assets/icons/\u9884\u7ea6\u672a\u9009.png",selectedIconPath:"./assets/icons/\u9884\u7ea6\u9009\u62e9.png"},{pagePath:"pages/gift/index",text:"\u597d\u793c",iconPath:"./assets/icons/\u597d\u793c\u672a\u9009.png",selectedIconPath:"./assets/icons/\u597d\u793c\u9009\u4e2d.png"},{pagePath:"pages/mine/index",text:"\u6211\u7684",iconPath:"./assets/icons/\u6211\u7684\u672a\u9009.png",selectedIconPath:"./assets/icons/\u6211 \u7684\u9009\u62e9.png"}]},permission:{"scope.userLocation":{desc:"\u4f60\u7684\u4f4d\u7f6e\u4fe1\u606f\u5c06\u7528\u4e8e\u8ba1\u7b97\u9644\u8fd1\u95e8\u5e97\u8ddd\u79bb"}},requiredPrivateInfos:["getLocation"]};e.taroWindowProvider.__taroAppConfig=i,App(e.createReactApp(t,e.React$1,e.index,i)),e.taroExports.initPxTransform({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905}});
>>>>>>> recovery-branch
