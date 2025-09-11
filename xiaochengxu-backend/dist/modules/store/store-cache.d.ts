/**
 * 简单的内存缓存实现
 * 用于缓存门店信息，避免短时间内重复查询
 */
export declare class SimpleCache<T> {
    private cache;
    private ttl;
    constructor(ttlSeconds?: number);
    get(key: string): T | undefined;
    set(key: string, data: T): void;
    cleanExpired(): void;
    clear(): void;
}
//# sourceMappingURL=store-cache.d.ts.map