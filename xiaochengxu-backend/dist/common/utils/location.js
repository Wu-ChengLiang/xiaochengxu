"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.getLocationFromAddress = getLocationFromAddress;
/**
 * 使用 Haversine 公式计算两个经纬度点之间的距离
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @returns 距离（公里）
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    // 保留一位小数
    return Math.round(distance * 10) / 10;
}
function toRad(deg) {
    return deg * (Math.PI / 180);
}
/**
 * 模拟根据地址获取经纬度
 * 实际应该调用地图 API
 */
function getLocationFromAddress(address) {
    // 上海市中心坐标作为基准
    const baseLocation = {
        latitude: 31.2304,
        longitude: 121.4737
    };
    // 简单的模拟：根据地址中的区域返回大概位置
    const locationMap = {
        '徐汇': { latitude: 31.1809, longitude: 121.4372 },
        '静安': { latitude: 31.2286, longitude: 121.4479 },
        '黄浦': { latitude: 31.2319, longitude: 121.4740 },
        '浦东': { latitude: 31.2214, longitude: 121.5447 },
        '长宁': { latitude: 31.2202, longitude: 121.4247 },
        '普陀': { latitude: 31.2495, longitude: 121.3976 },
        '闵行': { latitude: 31.1128, longitude: 121.3816 },
        '宝山': { latitude: 31.4051, longitude: 121.4892 },
        '杨浦': { latitude: 31.2595, longitude: 121.5260 },
    };
    // 查找地址中包含的区域
    for (const [area, location] of Object.entries(locationMap)) {
        if (address.includes(area)) {
            // 添加一些随机偏移，模拟不同的具体位置
            return {
                latitude: location.latitude + (Math.random() - 0.5) * 0.02,
                longitude: location.longitude + (Math.random() - 0.5) * 0.02
            };
        }
    }
    // 默认返回上海市中心坐标附近的随机位置
    return {
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.1,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.1
    };
}
//# sourceMappingURL=location.js.map