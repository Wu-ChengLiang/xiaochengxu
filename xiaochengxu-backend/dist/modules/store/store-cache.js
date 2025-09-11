"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCache = void 0;
/**
 * 简单的内存缓存实现
 * 用于缓存门店信息，避免短时间内重复查询
 */
class SimpleCache {
    cache = new Map();
    ttl; // 毫秒
    constructor(ttlSeconds = 5) {
        this.ttl = ttlSeconds * 1000;
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return undefined;
        }
        // 检查是否过期
        if (Date.now() > item.expireAt) {
            this.cache.delete(key);
            return undefined;
        }
        return item.data;
    }
    set(key, data) {
        this.cache.set(key, {
            data,
            expireAt: Date.now() + this.ttl
        });
    }
    // 定期清理过期数据（可选）
    cleanExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expireAt) {
                this.cache.delete(key);
            }
        }
    }
    clear() {
        this.cache.clear();
    }
}
exports.SimpleCache = SimpleCache;
//# sourceMappingURL=store-cache.js.map