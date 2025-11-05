export interface InventoryItem {
    productId: string;
    availableStock: number;
    reservedStock: number;
    reorderLevel: number;
    maxStock: number;
    location: string;
    lastRestocked: Date;
    stockMovements: StockMovement[];
}

export interface StockMovement {
    id: string;
    productId: string;
    type: 'IN' | 'OUT' | 'RESERVED' | 'RELEASED' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
    reference?: string;
    timestamp: Date;
    userId: string;
}

export interface StockUpdateRequest {
    productId: string;
    quantity: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    reason: string;
    reference?: string;
}

export interface LowStockAlert {
    productId: string;
    productName: string;
    currentStock: number;
    reorderLevel: number;
    suggestedOrderQuantity: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface InventoryReport {
    totalProducts: number;
    totalStock: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
    topSellingProducts: Array<{
        productId: string;
        productName: string;
        unitsSold: number;
        revenue: number;
    }>;
    slowMovingProducts: Array<{
        productId: string;
        productName: string;
        daysSinceLastSale: number;
        currentStock: number;
    }>;
}