import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { StoreEntity } from '../../entities/store.entity';
import { Store, PageData } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response';
import { calculateDistance, getLocationFromAddress } from '../../common/utils/location';

export class StoreService {
  private storeRepository: Repository<StoreEntity>;

  constructor() {
    this.storeRepository = AppDataSource.getRepository(StoreEntity);
  }

  /**
   * 获取附近门店
   */
  async getNearbyStores(
    latitude: number,
    longitude: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
    // 获取所有门店（排除ID为0的通用门店）
    const stores = await this.storeRepository.find({
      where: { id: Not(0) },
      order: { id: 'ASC' }
    });

    // 计算每个门店的距离并转换为DTO
    const storesWithDistance = stores.map(store => {
      // 根据地址获取模拟的经纬度
      const location = getLocationFromAddress(store.address || '');
      const distance = calculateDistance(latitude, longitude, location.latitude, location.longitude);
      
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
    
    return ResponseUtil.paginate(list, storesWithDistance.length, page, pageSize);
  }

  /**
   * 获取门店详情
   */
  async getStoreDetail(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: parseInt(storeId) }
    });

    if (!store) {
      throw new Error('门店不存在');
    }

    // 获取门店位置
    const location = getLocationFromAddress(store.address || '');
    const dto = store.toDTO();
    dto.location = location;
    
    return dto;
  }

  /**
   * 搜索门店
   */
  async searchStores(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PageData<Store>> {
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
      const location = getLocationFromAddress(store.address || '');
      const dto = store.toDTO();
      dto.location = location;
      return dto;
    });

    return ResponseUtil.paginate(list, total, page, pageSize);
  }
}

// 导入需要的 TypeORM 操作符
import { Not } from 'typeorm';