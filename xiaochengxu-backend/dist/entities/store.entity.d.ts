import { Store } from '../common/types';
export declare class StoreEntity {
    id: number;
    name: string;
    address: string;
    phone: string;
    business_hours: string;
    status: string;
    manager_name: string;
    created_at: Date;
    updated_at: Date;
    toDTO(distance?: number): Store;
    private mapStatus;
}
//# sourceMappingURL=store.entity.d.ts.map