export interface User {
    id: string;
    nickname: string;
    avatar: string;
    phone: string;
    memberLevel: number;
    points: number;
    createdAt: string;
    updatedAt: string;
}
export interface Store {
    id: string;
    name: string;
    images: string[];
    address: string;
    phone: string;
    businessHours: {
        start: string;
        end: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    distance?: number;
    status: 'normal' | 'busy' | 'full';
    services: string[];
}
export interface Therapist {
    id: string;
    storeId: string;
    storeName?: string;
    name: string;
    avatar: string;
    rating: number;
    ratingCount: number;
    expertise: string[];
    yearsOfExperience: number;
    serviceCount: number;
    status: 'available' | 'busy' | 'rest';
    distance?: number;
}
export interface Appointment {
    id: string;
    userId: string;
    storeId: string;
    storeName: string;
    therapistId: string;
    therapistName: string;
    serviceId: string;
    serviceName: string;
    appointmentTime: string;
    duration: number;
    price: number;
    discountPrice?: number;
    status: 'pending' | 'confirmed' | 'serving' | 'completed' | 'cancelled';
    createdAt: string;
    qrCode?: string;
}
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    popular?: boolean;
}
export interface Campaign {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    type: 'discount' | 'coupon' | 'gift';
    startTime: string;
    endTime: string;
    rules: any;
}
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    timestamp: number;
}
export interface PageData<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
//# sourceMappingURL=index.d.ts.map