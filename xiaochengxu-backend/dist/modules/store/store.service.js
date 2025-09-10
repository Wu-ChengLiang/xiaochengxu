"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const database_1 = require("../../config/database");
const store_entity_1 = require("../../entities/store.entity");
const response_1 = require("../../common/utils/response");
const location_1 = require("../../common/utils/location");
class StoreService {
    storeRepository;
    constructor() {
        this.storeRepository = database_1.AppDataSource.getRepository(store_entity_1.StoreEntity);
    }
    /**
     * 获取附近门店
     */
    async getNearbyStores(latitude, longitude, page = 1, pageSize = 10) {
        // 获取所有门店（排除ID为0的通用门店）
        const stores = await this.storeRepository.find({
            where: { id: (0, typeorm_1.Not)(0) },
            order: { id: 'ASC' }
        });
        // 计算每个门店的距离并转换为DTO
        const storesWithDistance = stores.map(store => {
            // 根据地址获取模拟的经纬度
            const location = (0, location_1.getLocationFromAddress)(store.address || '');
            const distance = (0, location_1.calculateDistance)(latitude, longitude, location.latitude, location.longitude);
            // 更新实体的位置信息并转换为DTO
            const dto = store.toDTO(distance);
            dto.location = location;
            return dto;
        });
        // 按距离排序
        storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        // 分页处理
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const list = storesWithDistance.slice(start, end);
        return response_1.ResponseUtil.paginate(list, storesWithDistance.length, page, pageSize);
    }
    /**
     * 获取门店详情
     */
    async getStoreDetail(storeId) {
        const store = await this.storeRepository.findOne({
            where: { id: parseInt(storeId) }
        });
        if (!store) {
            throw new Error('门店不存在');
        }
        // 获取门店位置
        const location = (0, location_1.getLocationFromAddress)(store.address || '');
        const dto = store.toDTO();
        dto.location = location;
        return dto;
    }
    /**
     * 搜索门店
     */
    async searchStores(keyword, page = 1, pageSize = 10) {
        // 使用查询构建器进行模糊搜索
        const queryBuilder = this.storeRepository.createQueryBuilder('store');
        queryBuilder
            .where('store.id != :excludeId', { excludeId: 0 })
            .andWhere('(store.name LIKE :keyword OR store.address LIKE :keyword)', {
            keyword: `%${keyword}%`
        });
        // 获取总数
        const total = await queryBuilder.getCount();
        // 分页查询
        const stores = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        // 转换为DTO
        const list = stores.map(store => {
            const location = (0, location_1.getLocationFromAddress)(store.address || '');
            const dto = store.toDTO();
            dto.location = location;
            return dto;
        });
        return response_1.ResponseUtil.paginate(list, total, page, pageSize);
    }
}
exports.StoreService = StoreService;
// 导入需要的 TypeORM 操作符
const typeorm_1 = require("typeorm");
//# sourceMappingURL=store.service.js.map