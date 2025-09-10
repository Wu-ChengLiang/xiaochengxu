import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Store } from '../common/types';

@Entity('stores')
export class StoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: '09:00-21:00', name: 'business_hours' })
  business_hours: string;

  @Column({ type: 'text', default: 'active' })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'manager_name' })
  manager_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // 转换为前端需要的 DTO 格式
  toDTO(distance?: number): Store {
    const [start, end] = this.business_hours.split('-');
    
    return {
      id: this.id.toString(),
      name: this.name,
      images: [], // TODO: 从 store_images 表加载
      address: this.address || '',
      phone: this.phone || '',
      businessHours: {
        start: start || '09:00',
        end: end || '21:00'
      },
      location: {
        latitude: 0, // TODO: 需要添加位置字段或从地址解析
        longitude: 0
      },
      distance,
      status: this.mapStatus(this.status),
      services: [] // TODO: 从关联表加载
    };
  }

  private mapStatus(dbStatus: string): 'normal' | 'busy' | 'full' {
    const statusMap: { [key: string]: 'normal' | 'busy' | 'full' } = {
      'active': 'normal',
      'busy': 'busy',
      'full': 'full'
    };
    return statusMap[dbStatus] || 'normal';
  }
}