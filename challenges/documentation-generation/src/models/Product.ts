export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    tags: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    tags?: string[];
}

export interface ProductUpdateRequest {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    tags?: string[];
    isActive?: boolean;
}

export interface ProductSearchFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    isActive?: boolean;
    search?: string;
}

export interface ProductResponse {
    success: boolean;
    data?: Product | Product[];
    message?: string;
    total?: number;
    page?: number;
    limit?: number;
}