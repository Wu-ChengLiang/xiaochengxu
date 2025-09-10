import { z } from 'zod';

// 获取附近门店的请求参数
export const GetNearbyStoresDto = z.object({
  lat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
  lng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
  page: z.string().optional().default('1'),
  pageSize: z.string().optional().default('10'),
});

export type GetNearbyStoresInput = z.infer<typeof GetNearbyStoresDto>;

// 搜索门店的请求参数
export const SearchStoresDto = z.object({
  keyword: z.string().min(1, '关键词不能为空'),
  page: z.string().optional().default('1'),
  pageSize: z.string().optional().default('10'),
});

export type SearchStoresInput = z.infer<typeof SearchStoresDto>;

// 门店ID参数
export const StoreIdDto = z.object({
  id: z.string().regex(/^\d+$/, '无效的门店ID'),
});

export type StoreIdInput = z.infer<typeof StoreIdDto>;