<<<<<<< HEAD
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
const common = require("../../../common.js");
const index = "";
const OrderConfirmPage = () => {
  const router = taro.taroExports.useRouter();
  const params = router.params;
  const [cartItems, setCartItems] = taro.useState([]);
  const [therapistInfo, setTherapistInfo] = taro.useState(null);
  const [storeInfo, setStoreInfo] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [countdown, setCountdown] = taro.useState(180);
  const [paymentMethod, setPaymentMethod] = taro.useState("wechat");
  const timerRef = taro.useRef(null);
  taro.useEffect(() => {
    try {
      const items = JSON.parse(decodeURIComponent(params.items || "[]"));
      setCartItems(items);
      fetchTherapistAndStoreInfo();
    } catch (error) {
      taro.Taro.showToast({
        title: "数据解析失败",
        icon: "none"
      });
      setTimeout(() => taro.Taro.navigateBack(), 1500);
    }
  }, [params]);
  taro.useEffect(() => {
    if (!loading && cartItems.length > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            taro.Taro.showModal({
              title: "支付超时了呦",
              content: "快快重新下单吧~",
              showCancel: false,
              success: () => {
                taro.Taro.navigateBack();
              }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, cartItems]);
  const fetchTherapistAndStoreInfo = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      const therapistRes = yield common.therapistService.getTherapistDetail(params.therapistId);
      const therapistData = therapistRes.data;
      const storeRes = yield common.storeService.getStoreDetail(params.storeId);
      const storeData = storeRes.data;
      setTherapistInfo(therapistData);
      setStoreInfo(storeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      taro.Taro.showToast({
        title: "获取信息失败",
        icon: "none"
      });
    }
  });
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")}日`;
  };
  const calculateEndTime = (time, duration) => {
    const [hour, minute] = time.split(":").map(Number);
    const endMinute = minute + duration;
    const endHour = hour + Math.floor(endMinute / 60);
    const finalMinute = endMinute % 60;
    return `${endHour}:${finalMinute.toString().padStart(2, "0")}`;
  };
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  };
  const handlePayment = () => __async(exports, null, function* () {
    if (cartItems.length === 0 || !therapistInfo || !storeInfo) {
      taro.Taro.showToast({
        title: "订单信息不完整",
        icon: "none"
      });
      return;
    }
    try {
      taro.Taro.showLoading({
        title: "创建订单..."
      });
      const firstItem = cartItems[0];
      const orderParams = {
        therapistId: params.therapistId,
        storeId: params.storeId,
        serviceId: firstItem.serviceId,
        serviceName: firstItem.serviceName,
        duration: firstItem.duration,
        price: firstItem.price,
        discountPrice: firstItem.discountPrice,
        appointmentDate: firstItem.date,
        appointmentTime: firstItem.time,
        therapistName: firstItem.therapistName,
        therapistAvatar: firstItem.therapistAvatar || therapistInfo.avatar
      };
      const order = yield common.orderService.createOrder(orderParams);
      taro.Taro.hideLoading();
      taro.Taro.showLoading({
        title: "正在支付..."
      });
      const paymentParams = yield common.orderService.getPaymentParams(order.orderNo);
      taro.Taro.hideLoading();
      if (true) {
        yield common.orderService.updateOrderStatus(order.orderNo, "paid");
        taro.Taro.showToast({
          title: "支付成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          taro.Taro.redirectTo({
            url: `/pages/booking/success/index?orderNo=${order.orderNo}`
          });
        }, 1500);
      }
    } catch (error) {
      taro.Taro.hideLoading();
      taro.Taro.showToast({
        title: error.message || "订单创建失败",
        icon: "none"
      });
    }
  });
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "order-confirm-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  return /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "order-confirm-page", scrollY: true, children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: storeInfo == null ? void 0 : storeInfo.name }),
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "store-distance", children: [
        "📍 ",
        storeInfo == null ? void 0 : storeInfo.distance,
        "km"
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "booking-info", children: cartItems.map(
      (item, index2) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "booking-item", children: [
        /* @__PURE__ */ taro.jsx(
          taro.Image,
          {
            className: "therapist-avatar",
            src: item.therapistAvatar || (therapistInfo == null ? void 0 : therapistInfo.avatar)
          }
        ),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "booking-details", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-name", children: item.therapistName }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-time", children: [
            formatDate(item.date),
            " ",
            item.time,
            " 至 ",
            calculateEndTime(item.time, item.duration)
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "service-name", children: item.serviceName })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "service-price", children: [
          "¥",
          item.discountPrice || item.price
        ] })
      ] }, index2)
    ) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "refund-policy", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "policy-title", children: "退单说明" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "policy-list", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 下单15分钟内或距订单开始时间>6小时退单，退100%" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 距订单开始前<6小时退单，退实付金额90%" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "policy-item", children: "• 订单时间开始后退单，退实付金额80%" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "customer-note", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "note-title", children: "客户备注" }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "note-hint", children: "您对茶水、房间、按摩服等是否有特殊需求，我们将提前为您做好准备" })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "支付方式" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "payment-methods", children: /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: `payment-method ${paymentMethod === "wechat" ? "active" : ""}`,
          onClick: () => setPaymentMethod("wechat"),
          children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "method-info", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-icon", children: "✅" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "method-name", children: "微信支付" })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: `check-icon ${paymentMethod === "wechat" ? "checked" : ""}` })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "payment-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-info", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "total-price", children: [
          "¥ ",
          getTotalPrice()
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "countdown", children: [
          "支付倒计时: ",
          formatCountdown(countdown)
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "pay-button", onClick: handlePayment, children: "去支付" })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "订单确认"
};
Page(taro.createPageConfig(OrderConfirmPage, "pages/booking/confirm/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
=======
"use strict";var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,o=(t,s,r)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[s]=r,n=(e,t)=>{for(var s in t||(t={}))a.call(t,s)&&o(e,s,t[s]);if(r)for(var s of r(t))i.call(t,s)&&o(e,s,t[s]);return e},c=(e,r)=>t(e,s(r)),l=(e,t,s)=>new Promise((r,a)=>{var i=e=>{try{n(s.next(e))}catch(t){a(t)}},o=e=>{try{n(s.throw(e))}catch(t){a(t)}},n=e=>e.done?r(e.value):Promise.resolve(e.value).then(i,o);n((s=s.apply(e,t)).next())});const x=require("../../../taro.js"),m=require("../../../common.js"),p="",d=()=>{const e=x.taroExports.useRouter(),t=e.params,[s,r]=x.reactExports.useState([]),[a,i]=x.reactExports.useState(null),[o,p]=x.reactExports.useState(null),[d,u]=x.reactExports.useState(!0),[h,j]=x.reactExports.useState(180),[E,w]=x.reactExports.useState("wechat"),N=x.reactExports.useRef(null);x.reactExports.useEffect(()=>{try{const e=JSON.parse(decodeURIComponent(t.items||"[]"));r(e),g()}catch(e){x.Taro.showToast({title:"\u6570\u636e\u89e3\u6790\u5931\u8d25",icon:"none"}),setTimeout(()=>x.Taro.navigateBack(),1500)}},[t]),x.reactExports.useEffect(()=>(!d&&s.length>0&&(N.current=setInterval(()=>{j(e=>e<=1?(clearInterval(N.current),x.Taro.showModal({title:"\u652f\u4ed8\u8d85\u65f6\u4e86\u5466",content:"\u5feb\u5feb\u91cd\u65b0\u4e0b\u5355\u5427~",showCancel:!1,success:()=>{x.Taro.navigateBack()}}),0):e-1)},1e3)),()=>{N.current&&clearInterval(N.current)}),[d,s]);const g=()=>l(exports,null,function*(){try{if(u(!0),t.therapistId){const e=yield m.therapistService.getTherapistDetail(t.therapistId);i(e.data)}const e=yield m.storeService.getStoreDetail(t.storeId),s=e.data;p(s),u(!1)}catch(e){u(!1),x.Taro.showToast({title:"\u83b7\u53d6\u4fe1\u606f\u5931\u8d25",icon:"none"})}}),T=e=>{const t=Math.floor(e/60),s=e%60;return`${t.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`},v=e=>{const t=new Date(e),s=t.getMonth()+1,r=t.getDate();return`${s.toString().padStart(2,"0")}\u6708${r.toString().padStart(2,"0")}\u65e5`},R=(e,t)=>{const[s,r]=e.split(":").map(Number),a=r+t,i=s+Math.floor(a/60),o=a%60;return`${i}:${o.toString().padStart(2,"0")}`},y=()=>s.reduce((e,t)=>e+(t.discountPrice||t.price),0),f=()=>l(exports,null,function*(){const e="symptom"===t.from,r=!e&&!a;if(0!==s.length&&!r&&o)try{x.Taro.showLoading({title:"\u521b\u5efa\u8ba2\u5355..."});const e=s[0],r={therapistId:t.therapistId||"symptom-mode",storeId:t.storeId,serviceId:e.serviceId,serviceName:e.serviceName,duration:e.duration,price:e.price,discountPrice:e.discountPrice,appointmentDate:e.date,appointmentTime:e.time,therapistName:e.therapistName,therapistAvatar:e.therapistAvatar||(null==a?void 0:a.avatar)},i=yield m.orderService.createOrder(r);x.Taro.hideLoading(),x.Taro.showLoading({title:"\u6b63\u5728\u652f\u4ed8..."});const o=yield m.orderService.getPaymentParams(i.orderNo);x.Taro.hideLoading(),x.Taro.requestPayment(c(n({},o),{success:()=>l(exports,null,function*(){yield m.orderService.updateOrderStatus(i.orderNo,"paid"),x.Taro.showToast({title:"\u652f\u4ed8\u6210\u529f",icon:"success",duration:1500}),setTimeout(()=>{x.Taro.redirectTo({url:`/pages/booking/success/index?orderNo=${i.orderNo}`})},1500)}),fail:e=>{console.error("\u652f\u4ed8\u5931\u8d25:",e),"requestPayment:fail cancel"!==e.errMsg&&(e.errMsg&&e.errMsg.includes("total_fee")?x.Taro.showToast({title:"\u652f\u4ed8\u53c2\u6570\u9519\u8bef\uff1a\u7f3a\u5c11\u91d1\u989d\u4fe1\u606f",icon:"none",duration:2500}):x.Taro.showToast({title:"\u652f\u4ed8\u5931\u8d25",icon:"none"}))}}))}catch(i){x.Taro.hideLoading(),x.Taro.showToast({title:i.message||"\u8ba2\u5355\u521b\u5efa\u5931\u8d25",icon:"none"})}else x.Taro.showToast({title:"\u8ba2\u5355\u4fe1\u606f\u4e0d\u5b8c\u6574",icon:"none"})});return d?x.jsxRuntimeExports.jsx(x.View,{className:"order-confirm-page",children:x.jsxRuntimeExports.jsx(x.View,{className:"loading",children:"\u52a0\u8f7d\u4e2d..."})}):x.jsxRuntimeExports.jsxs(x.ScrollView,{className:"order-confirm-page",scrollY:!0,children:[x.jsxRuntimeExports.jsxs(x.View,{className:"store-section",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"store-name",children:null==o?void 0:o.name}),x.jsxRuntimeExports.jsxs(x.Text,{className:"store-distance",children:["\ud83d\udccd ",null==o?void 0:o.distance,"km"]})]}),x.jsxRuntimeExports.jsx(x.View,{className:"booking-info",children:s.map((e,t)=>x.jsxRuntimeExports.jsxs(x.View,{className:"booking-item",children:[x.jsxRuntimeExports.jsx(x.Image,{className:"therapist-avatar",src:e.therapistAvatar||(null==a?void 0:a.avatar)}),x.jsxRuntimeExports.jsxs(x.View,{className:"booking-details",children:[x.jsxRuntimeExports.jsx(x.View,{className:"therapist-name",children:e.therapistName}),x.jsxRuntimeExports.jsxs(x.View,{className:"service-time",children:[v(e.date)," ",e.time," \u81f3 ",R(e.time,e.duration)]}),x.jsxRuntimeExports.jsx(x.View,{className:"service-name",children:e.serviceName})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"service-price",children:["\xa5",e.discountPrice||e.price]})]},t))}),x.jsxRuntimeExports.jsxs(x.View,{className:"refund-policy",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"policy-title",children:"\u9000\u5355\u8bf4\u660e"}),x.jsxRuntimeExports.jsxs(x.View,{className:"policy-list",children:[x.jsxRuntimeExports.jsx(x.View,{className:"policy-item",children:"\u2022 \u4e0b\u535515\u5206\u949f\u5185\u6216\u8ddd\u8ba2\u5355\u5f00\u59cb\u65f6\u95f4>6\u5c0f\u65f6\u9000\u5355\uff0c\u9000100%"}),x.jsxRuntimeExports.jsx(x.View,{className:"policy-item",children:"\u2022 \u8ddd\u8ba2\u5355\u5f00\u59cb\u524d<6\u5c0f\u65f6\u9000\u5355\uff0c\u9000\u5b9e\u4ed8\u91d1\u989d90%"}),x.jsxRuntimeExports.jsx(x.View,{className:"policy-item",children:"\u2022 \u8ba2\u5355\u65f6\u95f4\u5f00\u59cb\u540e\u9000\u5355\uff0c\u9000\u5b9e\u4ed8\u91d1\u989d80%"})]})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"customer-note",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"note-title",children:"\u5ba2\u6237\u5907\u6ce8"}),x.jsxRuntimeExports.jsx(x.Text,{className:"note-hint",children:"\u60a8\u5bf9\u8336\u6c34\u3001\u623f\u95f4\u3001\u6309\u6469\u670d\u7b49\u662f\u5426\u6709\u7279\u6b8a\u9700\u6c42\uff0c\u6211\u4eec\u5c06\u63d0\u524d\u4e3a\u60a8\u505a\u597d\u51c6\u5907"})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"payment-section",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"section-title",children:"\u652f\u4ed8\u65b9\u5f0f"}),x.jsxRuntimeExports.jsx(x.View,{className:"payment-methods",children:x.jsxRuntimeExports.jsxs(x.View,{className:"payment-method "+("wechat"===E?"active":""),onClick:()=>w("wechat"),children:[x.jsxRuntimeExports.jsxs(x.View,{className:"method-info",children:[x.jsxRuntimeExports.jsx(x.Text,{className:"method-icon",children:"\u2705"}),x.jsxRuntimeExports.jsx(x.Text,{className:"method-name",children:"\u5fae\u4fe1\u652f\u4ed8"})]}),x.jsxRuntimeExports.jsx(x.View,{className:"check-icon "+("wechat"===E?"checked":"")})]})})]}),x.jsxRuntimeExports.jsxs(x.View,{className:"payment-bar",children:[x.jsxRuntimeExports.jsxs(x.View,{className:"price-info",children:[x.jsxRuntimeExports.jsxs(x.Text,{className:"total-price",children:["\xa5 ",y()]}),x.jsxRuntimeExports.jsxs(x.Text,{className:"countdown",children:["\u652f\u4ed8\u5012\u8ba1\u65f6: ",T(h)]})]}),x.jsxRuntimeExports.jsx(x.View,{className:"pay-button",onClick:f,children:"\u53bb\u652f\u4ed8"})]})]})};var u={navigationBarTitleText:"\u8ba2\u5355\u786e\u8ba4"};Page(x.createPageConfig(d,"pages/booking/confirm/index",{root:{cn:[]}},u||{}));
>>>>>>> recovery-branch
