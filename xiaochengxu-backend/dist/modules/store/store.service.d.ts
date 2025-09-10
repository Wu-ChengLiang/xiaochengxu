import { Store, PageData } from '../../common/types';
export declare class StoreService {
    private storeRepository;
    constructor();
    /**
     * 获取附近门店
     */
    getNearbyStores(latitude: number, longitude: number, page?: number, pageSize?: number): Promise<PageData<Store>>;
    /**
     * 获取门店详情
     */
    getStoreDetail(storeId: string): Promise<Store>;
    /**
     * 搜索门店
     */
    searchStores(keyword: string, page?: number, pageSize?: number): Promise<PageData<Store>>;
}
//# sourceMappingURL=store.service.d.ts.map