import { Request, Response } from 'express';
import { Order, OrderCreateRequest, OrderUpdateRequest, OrderItem, OrderStatus } from '../models/Order';
import { DatabaseService } from '../utils/database';
import { validateOrderCreate, validateOrderUpdate } from '../utils/validation';
import { InventoryController } from './inventoryController';

export class OrderController {
    private db: DatabaseService;
    private inventoryController: InventoryController;

    constructor() {
        this.db = new DatabaseService();
        this.inventoryController = new InventoryController();
    }

    async createOrder(req: Request<{}, {}, OrderCreateRequest>, res: Response) {
        try {
            const validation = validateOrderCreate(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order data',
                    errors: validation.errors
                });
            }

            const customer = await this.db.findCustomerById(req.body.customerId);
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            const orderItems: OrderItem[] = [];
            let totalAmount = 0;

            for (const item of req.body.items) {
                const product = await this.db.findProductById(item.productId);
                if (!product || !product.isActive) {
                    return res.status(404).json({
                        success: false,
                        message: `Product ${item.productId} not found or inactive`
                    });
                }

                const inventory = await this.db.findInventoryByProductId(item.productId);
                if (!inventory || inventory.availableStock < item.quantity) {
                    return res.status(409).json({
                        success: false,
                        message: `Insufficient stock for product ${product.name}`,
                        data: {
                            productId: item.productId,
                            requested: item.quantity,
                            available: inventory?.availableStock || 0
                        }
                    });
                }

                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    productId: item.productId,
                    productName: product.name,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: itemTotal,
                    sku: product.sku
                });
            }

            const shippingCost = this.calculateShippingCost(totalAmount, req.body.shippingMethod);
            const taxAmount = this.calculateTax(totalAmount);
            const finalTotal = totalAmount + shippingCost + taxAmount;

            const orderData: Order = {
                id: this.generateOrderId(),
                customerId: req.body.customerId,
                items: orderItems,
                status: 'PENDING',
                totalAmount: finalTotal,
                shippingAddress: req.body.shippingAddress,
                billingAddress: req.body.billingAddress || req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                paymentStatus: 'PENDING',
                shippingMethod: req.body.shippingMethod,
                notes: req.body.notes,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const order = await this.db.createOrder(orderData);

            for (const item of req.body.items) {
                await this.reserveInventoryForOrder(item.productId, item.quantity, order.id);
            }

            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create order'
            });
        }
    }

    async getOrders(req: Request<{}, {}, {}, { 
        page?: string; 
        limit?: string; 
        status?: OrderStatus;
        customerId?: string;
        startDate?: string;
        endDate?: string;
    }>, res: Response) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const offset = (page - 1) * limit;

            const filters = {
                status: req.query.status,
                customerId: req.query.customerId,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined
            };

            const result = await this.db.findOrders(filters, limit, offset);
            
            res.json({
                success: true,
                data: result.orders,
                total: result.total,
                page,
                limit
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve orders'
            });
        }
    }

    async getOrderById(req: Request<{ id: string }>, res: Response) {
        try {
            const order = await this.db.findOrderById(req.params.id);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve order'
            });
        }
    }

    async updateOrderStatus(req: Request<{ id: string }, {}, OrderUpdateRequest>, res: Response) {
        try {
            const validation = validateOrderUpdate(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid update data',
                    errors: validation.errors
                });
            }

            const order = await this.db.findOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            const isValidTransition = this.isValidStatusTransition(order.status, req.body.status);
            if (req.body.status && !isValidTransition) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status transition from ${order.status} to ${req.body.status}`
                });
            }

            const updateData = {
                ...req.body,
                updatedAt: new Date()
            };

            if (req.body.status === 'DELIVERED') {
                updateData.completedAt = new Date();
            }

            if (req.body.status === 'CANCELLED') {
                await this.releaseReservedInventory(order);
            }

            const updatedOrder = await this.db.updateOrder(req.params.id, updateData);
            
            res.json({
                success: true,
                data: updatedOrder,
                message: 'Order updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update order'
            });
        }
    }

    async cancelOrder(req: Request<{ id: string }>, res: Response) {
        try {
            const order = await this.db.findOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (!this.canCancelOrder(order.status)) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot cancel order with status ${order.status}`
                });
            }

            await this.releaseReservedInventory(order);

            const cancelledOrder = await this.db.updateOrder(req.params.id, {
                status: 'CANCELLED',
                updatedAt: new Date()
            });

            res.json({
                success: true,
                data: cancelledOrder,
                message: 'Order cancelled successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to cancel order'
            });
        }
    }

    async getOrdersByCustomer(req: Request<{ customerId: string }>, res: Response) {
        try {
            const customer = await this.db.findCustomerById(req.params.customerId);
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            const orders = await this.db.findOrdersByCustomerId(req.params.customerId);
            
            res.json({
                success: true,
                data: orders,
                total: orders.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve customer orders'
            });
        }
    }

    private calculateShippingCost(orderTotal: number, shippingMethod: string): number {
        const shippingRates = {
            'standard': orderTotal > 50 ? 0 : 5.99,
            'express': 12.99,
            'overnight': 24.99,
            'pickup': 0
        };

        return shippingRates[shippingMethod as keyof typeof shippingRates] || 5.99;
    }

    private calculateTax(subtotal: number): number {
        const TAX_RATE = 0.08;
        return Math.round(subtotal * TAX_RATE * 100) / 100;
    }

    private isValidStatusTransition(currentStatus: OrderStatus, newStatus?: OrderStatus): boolean {
        if (!newStatus) return true;

        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            'PENDING': ['CONFIRMED', 'CANCELLED'],
            'CONFIRMED': ['PROCESSING', 'CANCELLED'],
            'PROCESSING': ['SHIPPED', 'CANCELLED'],
            'SHIPPED': ['DELIVERED'],
            'DELIVERED': ['REFUNDED'],
            'CANCELLED': [],
            'REFUNDED': []
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    private canCancelOrder(status: OrderStatus): boolean {
        return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(status);
    }

    private async reserveInventoryForOrder(productId: string, quantity: number, orderId: string): Promise<void> {
        await this.db.reserveStock(productId, quantity, {
            id: this.generateId(),
            productId,
            type: 'RESERVED',
            quantity,
            reason: 'Order reservation',
            reference: orderId,
            timestamp: new Date(),
            userId: 'system'
        });
    }

    private async releaseReservedInventory(order: Order): Promise<void> {
        for (const item of order.items) {
            await this.db.releaseReservedStock(item.productId, item.quantity, {
                id: this.generateId(),
                productId: item.productId,
                type: 'RELEASED',
                quantity: item.quantity,
                reason: 'Order cancellation',
                reference: order.id,
                timestamp: new Date(),
                userId: 'system'
            });
        }
    }

    private generateOrderId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `ORD-${timestamp}-${random}`.toUpperCase();
    }

    private generateId(): string {
        return 'mov_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}