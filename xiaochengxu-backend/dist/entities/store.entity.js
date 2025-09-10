"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreEntity = void 0;
const typeorm_1 = require("typeorm");
let StoreEntity = class StoreEntity {
    id;
    name;
    address;
    phone;
    business_hours;
    status;
    manager_name;
    created_at;
    updated_at;
    // 转换为前端需要的 DTO 格式
    toDTO(distance) {
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
    mapStatus(dbStatus) {
        const statusMap = {
            'active': 'normal',
            'busy': 'busy',
            'full': 'full'
        };
        return statusMap[dbStatus] || 'normal';
    }
};
exports.StoreEntity = StoreEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StoreEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], StoreEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], StoreEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], StoreEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '09:00-21:00', name: 'business_hours' }),
    __metadata("design:type", String)
], StoreEntity.prototype, "business_hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'active' }),
    __metadata("design:type", String)
], StoreEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'manager_name' }),
    __metadata("design:type", String)
], StoreEntity.prototype, "manager_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StoreEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StoreEntity.prototype, "updated_at", void 0);
exports.StoreEntity = StoreEntity = __decorate([
    (0, typeorm_1.Entity)('stores')
], StoreEntity);
//# sourceMappingURL=store.entity.js.map