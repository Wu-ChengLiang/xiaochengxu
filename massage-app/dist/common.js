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
const taro = require("./taro.js");
class LocationService {
  // 获取用户当前位置
  getCurrentLocation() {
    return __async(this, null, function* () {
      var _a;
      try {
        const {
          authSetting
        } = yield taro.Taro.getSetting();
        if (!authSetting["scope.userLocation"]) {
          yield taro.Taro.authorize({
            scope: "scope.userLocation"
          });
        }
        const res = yield taro.Taro.getLocation({
          type: "gcj02",
          // 返回可用于 openLocation 的坐标
          isHighAccuracy: true
          // 开启高精度
        });
        return {
          latitude: res.latitude,
          longitude: res.longitude
        };
      } catch (error) {
        console.error("获取位置失败:", error);
        if ((_a = error == null ? void 0 : error.errMsg) == null ? void 0 : _a.includes("auth deny")) {
          taro.Taro.showModal({
            title: "提示",
            content: "需要获取您的位置信息来推荐附近门店",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                taro.Taro.openSetting();
              }
            }
          });
          return {
            latitude: 31.2304,
            longitude: 121.4737
          };
        }
        throw error;
      }
    });
  }
  // 计算两点之间的距离（单位：公里）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const rad = Math.PI / 180;
    const R = 6371;
    const dLat = (lat2 - lat1) * rad;
    const dLng = (lng2 - lng1) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }
  // 格式化距离显示
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1e3)}m`;
    }
    return `${distance}km`;
  }
}
const getLocationService = new LocationService();
exports.getLocationService = getLocationService;
//# sourceMappingURL=common.js.map
