/**
 * 使用 Haversine 公式计算两个经纬度点之间的距离
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @returns 距离（公里）
 */
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * 模拟根据地址获取经纬度
 * 实际应该调用地图 API
 */
export declare function getLocationFromAddress(address: string): {
    latitude: number;
    longitude: number;
};
//# sourceMappingURL=location.d.ts.map