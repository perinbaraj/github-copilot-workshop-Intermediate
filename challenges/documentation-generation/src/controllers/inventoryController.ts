import { Request, Response } from 'express';
import { InventoryItem, StockUpdateRequest, LowStockAlert, InventoryReport, StockMovement } from '../models/Inventory';
import { DatabaseService } from '../utils/database';
import { validateStockUpdate } from '../utils/validation';

export class InventoryController {
    private db: DatabaseService;

    constructor() {
        this.db = new DatabaseService();
    }

    async getInventoryItem(req: Request<{ productId: string }>, res: Response) {
        try {
            const inventory = await this.db.findInventoryByProductId(req.params.productId);
            
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }

            res.json({
                success: true,
                data: inventory
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve inventory'
            });
        }
    }

    async updateStock(req: Request<{}, {}, StockUpdateRequest>, res: Response) {
        try {
            const validation = validateStockUpdate(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid stock update data',
                    errors: validation.errors
                });
            }

            const { productId, quantity, type, reason, reference } = req.body;

            const inventory = await this.db.findInventoryByProductId(productId);
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found in inventory'
                });
            }

            const newStock = this.calculateNewStock(inventory, quantity, type);
            
            if (newStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock for this operation'
                });
            }

            const stockMovement: StockMovement = {
                id: this.generateId(),
                productId,
                type,
                quantity,
                reason,
                reference,
                timestamp: new Date(),
                userId: req.user?.id || 'system'
            };

            const updatedInventory = await this.db.updateInventoryStock(
                productId, 
                newStock, 
                stockMovement
            );

            if (this.shouldTriggerLowStockAlert(updatedInventory)) {
                await this.triggerLowStockAlert(updatedInventory);
            }

            res.json({
                success: true,
                data: updatedInventory,
                message: 'Stock updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update stock'
            });
        }
    }

    async reserveStock(req: Request<{}, {}, { productId: string; quantity: number; orderId: string }>, res: Response) {
        try {
            const { productId, quantity, orderId } = req.body;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid reservation data'
                });
            }

            const inventory = await this.db.findInventoryByProductId(productId);
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found in inventory'
                });
            }

            const availableStock = inventory.availableStock;
            if (availableStock < quantity) {
                return res.status(409).json({
                    success: false,
                    message: 'Insufficient available stock',
                    data: {
                        requested: quantity,
                        available: availableStock
                    }
                });
            }

            const stockMovement: StockMovement = {
                id: this.generateId(),
                productId,
                type: 'RESERVED',
                quantity,
                reason: 'Order reservation',
                reference: orderId,
                timestamp: new Date(),
                userId: req.user?.id || 'system'
            };

            const updatedInventory = await this.db.reserveStock(productId, quantity, stockMovement);

            res.json({
                success: true,
                data: updatedInventory,
                message: `Reserved ${quantity} units for order ${orderId}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to reserve stock'
            });
        }
    }

    async releaseReservedStock(req: Request<{}, {}, { productId: string; quantity: number; orderId: string }>, res: Response) {
        try {
            const { productId, quantity, orderId } = req.body;

            const inventory = await this.db.findInventoryByProductId(productId);
            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found in inventory'
                });
            }

            if (inventory.reservedStock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot release more stock than reserved'
                });
            }

            const stockMovement: StockMovement = {
                id: this.generateId(),
                productId,
                type: 'RELEASED',
                quantity,
                reason: 'Order cancellation',
                reference: orderId,
                timestamp: new Date(),
                userId: req.user?.id || 'system'
            };

            const updatedInventory = await this.db.releaseReservedStock(productId, quantity, stockMovement);

            res.json({
                success: true,
                data: updatedInventory,
                message: `Released ${quantity} reserved units from order ${orderId}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to release reserved stock'
            });
        }
    }

    async getLowStockAlerts(req: Request, res: Response) {
        try {
            const alerts = await this.db.getLowStockAlerts();
            
            res.json({
                success: true,
                data: alerts,
                total: alerts.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve low stock alerts'
            });
        }
    }

    async getInventoryReport(req: Request<{}, {}, {}, { startDate?: string; endDate?: string }>, res: Response) {
        try {
            const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

            const report = await this.generateInventoryReport(startDate, endDate);
            
            res.json({
                success: true,
                data: report,
                message: 'Inventory report generated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to generate inventory report'
            });
        }
    }

    private calculateNewStock(inventory: InventoryItem, quantity: number, type: string): number {
        switch (type) {
            case 'IN':
                return inventory.availableStock + quantity;
            case 'OUT':
                return inventory.availableStock - quantity;
            case 'ADJUSTMENT':
                return quantity;
            default:
                return inventory.availableStock;
        }
    }

    private shouldTriggerLowStockAlert(inventory: InventoryItem): boolean {
        return inventory.availableStock <= inventory.reorderLevel;
    }

    private async triggerLowStockAlert(inventory: InventoryItem): Promise<void> {
        const product = await this.db.findProductById(inventory.productId);
        if (!product) return;

        const alert: LowStockAlert = {
            productId: inventory.productId,
            productName: product.name,
            currentStock: inventory.availableStock,
            reorderLevel: inventory.reorderLevel,
            suggestedOrderQuantity: this.calculateSuggestedOrderQuantity(inventory),
            priority: this.calculateAlertPriority(inventory)
        };

        await this.db.createLowStockAlert(alert);
    }

    private calculateSuggestedOrderQuantity(inventory: InventoryItem): number {
        const deficit = inventory.reorderLevel - inventory.availableStock;
        const bufferStock = Math.ceil(inventory.reorderLevel * 0.5);
        return deficit + bufferStock;
    }

    private calculateAlertPriority(inventory: InventoryItem): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        const stockRatio = inventory.availableStock / inventory.reorderLevel;
        
        if (stockRatio <= 0) return 'CRITICAL';
        if (stockRatio <= 0.25) return 'HIGH';
        if (stockRatio <= 0.5) return 'MEDIUM';
        return 'LOW';
    }

    private async generateInventoryReport(startDate: Date, endDate: Date): Promise<InventoryReport> {
        const totalProducts = await this.db.getTotalProductCount();
        const totalStock = await this.db.getTotalStockValue();
        const lowStockItems = await this.db.getLowStockCount();
        const outOfStockItems = await this.db.getOutOfStockCount();
        const totalValue = await this.db.getTotalInventoryValue();
        const topSellingProducts = await this.db.getTopSellingProducts(startDate, endDate, 10);
        const slowMovingProducts = await this.db.getSlowMovingProducts(30, 10);

        return {
            totalProducts,
            totalStock,
            lowStockItems,
            outOfStockItems,
            totalValue,
            topSellingProducts,
            slowMovingProducts
        };
    }

    private generateId(): string {
        return 'mov_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}