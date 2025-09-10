import { z } from 'zod';
export declare const GetNearbyStoresDto: z.ZodObject<{
    lat: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>;
    lng: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>;
    page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type GetNearbyStoresInput = z.infer<typeof GetNearbyStoresDto>;
export declare const SearchStoresDto: z.ZodObject<{
    keyword: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type SearchStoresInput = z.infer<typeof SearchStoresDto>;
export declare const StoreIdDto: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type StoreIdInput = z.infer<typeof StoreIdDto>;
//# sourceMappingURL=store.dto.d.ts.map