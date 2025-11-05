import { Product } from '../models/Product';
import { InventoryItem, StockMovement } from '../models/Inventory';
import { Order } from '../models/Order';

export interface User {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    tokenVersion: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface DatabaseQueryOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface OrderFilters {
    status?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ProductFilters {
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
}

export class DatabaseService {
    private connectionPool: any;
    private isConnected: boolean = false;

    constructor() {
        this.initializeConnection();
    }

    async initializeConnection(): Promise<void> {
        try {
            const config = {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                database: process.env.DB_NAME || 'inventory_db',
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000
            };

            console.log('Connecting to database...');
            this.isConnected = true;
        } catch (error) {
            console.error('Database connection failed:', error);
            throw new Error('Failed to connect to database');
        }
    }

    async executeQuery(query: string, params?: any[]): Promise<any> {
        if (!this.isConnected) {
            await this.initializeConnection();
        }

        try {
            console.log(`Executing query: ${query}`);
            if (params) {
                console.log('With parameters:', params);
            }

            return { rows: [], rowCount: 0 };
        } catch (error) {
            console.error('Query execution failed:', error);
            throw error;
        }
    }

    async beginTransaction(): Promise<any> {
        const client = await this.connectionPool.connect();
        await client.query('BEGIN');
        return client;
    }

    async commitTransaction(client: any): Promise<void> {
        await client.query('COMMIT');
        client.release();
    }

    async rollbackTransaction(client: any): Promise<void> {
        await client.query('ROLLBACK');
        client.release();
    }

    async createProduct(productData: Product): Promise<Product> {
        const query = `
            INSERT INTO products (id, name, sku, description, price, category, weight, dimensions, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        
        const params = [
            productData.id,
            productData.name,
            productData.sku,
            productData.description,
            productData.price,
            productData.category,
            productData.weight,
            JSON.stringify(productData.dimensions),
            productData.isActive,
            productData.createdAt,
            productData.updatedAt
        ];

        const result = await this.executeQuery(query, params);
        return this.mapRowToProduct(result.rows[0]);
    }

    async findProducts(filters: ProductFilters, options: DatabaseQueryOptions = {}): Promise<{ products: Product[], total: number }> {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params: any[] = [];
        let paramCount = 0;

        if (filters.category) {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            params.push(filters.category);
        }

        if (filters.isActive !== undefined) {
            paramCount++;
            query += ` AND is_active = $${paramCount}`;
            params.push(filters.isActive);
        }

        if (filters.minPrice !== undefined) {
            paramCount++;
            query += ` AND price >= $${paramCount}`;
            params.push(filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
            paramCount++;
            query += ` AND price <= $${paramCount}`;
            params.push(filters.maxPrice);
        }

        if (filters.searchTerm) {
            paramCount++;
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR sku ILIKE $${paramCount})`;
            params.push(`%${filters.searchTerm}%`);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await this.executeQuery(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        if (options.sortBy) {
            query += ` ORDER BY ${options.sortBy} ${options.sortOrder || 'ASC'}`;
        }

        if (options.limit) {
            paramCount++;
            query += ` LIMIT $${paramCount}`;
            params.push(options.limit);
        }

        if (options.offset) {
            paramCount++;
            query += ` OFFSET $${paramCount}`;
            params.push(options.offset);
        }

        const result = await this.executeQuery(query, params);
        const products = result.rows.map((row: any) => this.mapRowToProduct(row));

        return { products, total };
    }

    async findProductById(id: string): Promise<Product | null> {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await this.executeQuery(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToProduct(result.rows[0]);
    }

    async findProductBySku(sku: string): Promise<Product | null> {
        const query = 'SELECT * FROM products WHERE sku = $1';
        const result = await this.executeQuery(query, [sku]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToProduct(result.rows[0]);
    }

    async updateProduct(id: string, updateData: Partial<Product>): Promise<Product | null> {
        const setClause: string[] = [];
        const params: any[] = [];
        let paramCount = 0;

        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id') {
                paramCount++;
                if (key === 'dimensions') {
                    setClause.push(`${key} = $${paramCount}`);
                    params.push(JSON.stringify(value));
                } else {
                    setClause.push(`${key} = $${paramCount}`);
                    params.push(value);
                }
            }
        });

        if (setClause.length === 0) {
            return await this.findProductById(id);
        }

        paramCount++;
        params.push(new Date());
        setClause.push(`updated_at = $${paramCount}`);

        paramCount++;
        params.push(id);

        const query = `
            UPDATE products 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await this.executeQuery(query, params);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToProduct(result.rows[0]);
    }

    async deleteProduct(id: string): Promise<boolean> {
        const query = 'DELETE FROM products WHERE id = $1';
        const result = await this.executeQuery(query, [id]);
        return result.rowCount > 0;
    }

    async createInventoryItem(inventoryData: InventoryItem): Promise<InventoryItem> {
        const query = `
            INSERT INTO inventory (id, product_id, total_stock, available_stock, reserved_stock, location, 
                                 min_stock_level, max_stock_level, reorder_point, last_restocked, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        
        const params = [
            inventoryData.id,
            inventoryData.productId,
            inventoryData.totalStock,
            inventoryData.availableStock,
            inventoryData.reservedStock,
            inventoryData.location,
            inventoryData.minStockLevel,
            inventoryData.maxStockLevel,
            inventoryData.reorderPoint,
            inventoryData.lastRestocked,
            inventoryData.createdAt,
            inventoryData.updatedAt
        ];

        const result = await this.executeQuery(query, params);
        return this.mapRowToInventoryItem(result.rows[0]);
    }

    async findInventoryByProductId(productId: string): Promise<InventoryItem | null> {
        const query = 'SELECT * FROM inventory WHERE product_id = $1';
        const result = await this.executeQuery(query, [productId]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToInventoryItem(result.rows[0]);
    }

    async updateInventory(productId: string, updateData: Partial<InventoryItem>): Promise<InventoryItem | null> {
        const setClause: string[] = [];
        const params: any[] = [];
        let paramCount = 0;

        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'productId') {
                paramCount++;
                setClause.push(`${key} = $${paramCount}`);
                params.push(value);
            }
        });

        if (setClause.length === 0) {
            return await this.findInventoryByProductId(productId);
        }

        paramCount++;
        params.push(new Date());
        setClause.push(`updated_at = $${paramCount}`);

        paramCount++;
        params.push(productId);

        const query = `
            UPDATE inventory 
            SET ${setClause.join(', ')}
            WHERE product_id = $${paramCount}
            RETURNING *
        `;

        const result = await this.executeQuery(query, params);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToInventoryItem(result.rows[0]);
    }

    async reserveStock(productId: string, quantity: number, movement: StockMovement): Promise<boolean> {
        const client = await this.beginTransaction();
        
        try {
            const inventoryQuery = 'SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE';
            const inventoryResult = await client.query(inventoryQuery, [productId]);
            
            if (inventoryResult.rows.length === 0) {
                throw new Error('Product not found in inventory');
            }

            const inventory = this.mapRowToInventoryItem(inventoryResult.rows[0]);
            
            if (inventory.availableStock < quantity) {
                throw new Error('Insufficient stock available');
            }

            const updateQuery = `
                UPDATE inventory 
                SET available_stock = available_stock - $1,
                    reserved_stock = reserved_stock + $1,
                    updated_at = $2
                WHERE product_id = $3
            `;
            
            await client.query(updateQuery, [quantity, new Date(), productId]);

            const movementQuery = `
                INSERT INTO stock_movements (id, product_id, type, quantity, reason, reference, timestamp, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            
            await client.query(movementQuery, [
                movement.id,
                movement.productId,
                movement.type,
                movement.quantity,
                movement.reason,
                movement.reference,
                movement.timestamp,
                movement.userId
            ]);

            await this.commitTransaction(client);
            return true;
        } catch (error) {
            await this.rollbackTransaction(client);
            throw error;
        }
    }

    async releaseReservedStock(productId: string, quantity: number, movement: StockMovement): Promise<boolean> {
        const client = await this.beginTransaction();
        
        try {
            const updateQuery = `
                UPDATE inventory 
                SET available_stock = available_stock + $1,
                    reserved_stock = reserved_stock - $1,
                    updated_at = $2
                WHERE product_id = $3 AND reserved_stock >= $1
            `;
            
            const result = await client.query(updateQuery, [quantity, new Date(), productId]);
            
            if (result.rowCount === 0) {
                throw new Error('Insufficient reserved stock to release');
            }

            const movementQuery = `
                INSERT INTO stock_movements (id, product_id, type, quantity, reason, reference, timestamp, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            
            await client.query(movementQuery, [
                movement.id,
                movement.productId,
                movement.type,
                movement.quantity,
                movement.reason,
                movement.reference,
                movement.timestamp,
                movement.userId
            ]);

            await this.commitTransaction(client);
            return true;
        } catch (error) {
            await this.rollbackTransaction(client);
            throw error;
        }
    }

    async createOrder(orderData: Order): Promise<Order> {
        const client = await this.beginTransaction();
        
        try {
            const orderQuery = `
                INSERT INTO orders (id, customer_id, status, total_amount, shipping_address, billing_address,
                                  payment_method, payment_status, shipping_method, notes, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *
            `;
            
            const orderParams = [
                orderData.id,
                orderData.customerId,
                orderData.status,
                orderData.totalAmount,
                JSON.stringify(orderData.shippingAddress),
                JSON.stringify(orderData.billingAddress),
                orderData.paymentMethod,
                orderData.paymentStatus,
                orderData.shippingMethod,
                orderData.notes,
                orderData.createdAt,
                orderData.updatedAt
            ];

            const orderResult = await client.query(orderQuery, orderParams);
            const order = this.mapRowToOrder(orderResult.rows[0]);

            for (const item of orderData.items) {
                const itemQuery = `
                    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price, sku)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;
                
                await client.query(itemQuery, [
                    order.id,
                    item.productId,
                    item.productName,
                    item.quantity,
                    item.unitPrice,
                    item.totalPrice,
                    item.sku
                ]);
            }

            await this.commitTransaction(client);
            return order;
        } catch (error) {
            await this.rollbackTransaction(client);
            throw error;
        }
    }

    async findOrders(filters: OrderFilters, limit: number, offset: number): Promise<{ orders: Order[], total: number }> {
        let query = 'SELECT * FROM orders WHERE 1=1';
        const params: any[] = [];
        let paramCount = 0;

        if (filters.status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(filters.status);
        }

        if (filters.customerId) {
            paramCount++;
            query += ` AND customer_id = $${paramCount}`;
            params.push(filters.customerId);
        }

        if (filters.startDate) {
            paramCount++;
            query += ` AND created_at >= $${paramCount}`;
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            paramCount++;
            query += ` AND created_at <= $${paramCount}`;
            params.push(filters.endDate);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await this.executeQuery(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        query += ' ORDER BY created_at DESC';

        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(limit);

        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(offset);

        const result = await this.executeQuery(query, params);
        const orders = await Promise.all(
            result.rows.map(async (row: any) => {
                const order = this.mapRowToOrder(row);
                order.items = await this.getOrderItems(order.id);
                return order;
            })
        );

        return { orders, total };
    }

    async findOrderById(id: string): Promise<Order | null> {
        const query = 'SELECT * FROM orders WHERE id = $1';
        const result = await this.executeQuery(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        const order = this.mapRowToOrder(result.rows[0]);
        order.items = await this.getOrderItems(order.id);
        return order;
    }

    async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
        const query = 'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC';
        const result = await this.executeQuery(query, [customerId]);
        
        return await Promise.all(
            result.rows.map(async (row: any) => {
                const order = this.mapRowToOrder(row);
                order.items = await this.getOrderItems(order.id);
                return order;
            })
        );
    }

    async updateOrder(id: string, updateData: Partial<Order>): Promise<Order | null> {
        const setClause: string[] = [];
        const params: any[] = [];
        let paramCount = 0;

        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'items') {
                paramCount++;
                if (key === 'shippingAddress' || key === 'billingAddress') {
                    setClause.push(`${key} = $${paramCount}`);
                    params.push(JSON.stringify(value));
                } else {
                    setClause.push(`${key} = $${paramCount}`);
                    params.push(value);
                }
            }
        });

        if (setClause.length === 0) {
            return await this.findOrderById(id);
        }

        paramCount++;
        params.push(new Date());
        setClause.push(`updated_at = $${paramCount}`);

        paramCount++;
        params.push(id);

        const query = `
            UPDATE orders 
            SET ${setClause.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await this.executeQuery(query, params);
        
        if (result.rows.length === 0) {
            return null;
        }

        const order = this.mapRowToOrder(result.rows[0]);
        order.items = await this.getOrderItems(order.id);
        return order;
    }

    async findUserById(id: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.executeQuery(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToUser(result.rows[0]);
    }

    async findCustomerById(id: string): Promise<Customer | null> {
        const query = 'SELECT * FROM customers WHERE id = $1';
        const result = await this.executeQuery(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToCustomer(result.rows[0]);
    }

    async incrementUserTokenVersion(userId: string): Promise<void> {
        const query = 'UPDATE users SET token_version = token_version + 1 WHERE id = $1';
        await this.executeQuery(query, [userId]);
    }

    private async getOrderItems(orderId: string): Promise<any[]> {
        const query = 'SELECT * FROM order_items WHERE order_id = $1';
        const result = await this.executeQuery(query, [orderId]);
        return result.rows;
    }

    private mapRowToProduct(row: any): Product {
        return {
            id: row.id,
            name: row.name,
            sku: row.sku,
            description: row.description,
            price: parseFloat(row.price),
            category: row.category,
            weight: row.weight ? parseFloat(row.weight) : undefined,
            dimensions: row.dimensions ? JSON.parse(row.dimensions) : undefined,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    private mapRowToInventoryItem(row: any): InventoryItem {
        return {
            id: row.id,
            productId: row.product_id,
            totalStock: row.total_stock,
            availableStock: row.available_stock,
            reservedStock: row.reserved_stock,
            location: row.location,
            minStockLevel: row.min_stock_level,
            maxStockLevel: row.max_stock_level,
            reorderPoint: row.reorder_point,
            lastRestocked: row.last_restocked,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    private mapRowToOrder(row: any): Order {
        return {
            id: row.id,
            customerId: row.customer_id,
            items: [],
            status: row.status,
            totalAmount: parseFloat(row.total_amount),
            shippingAddress: JSON.parse(row.shipping_address),
            billingAddress: JSON.parse(row.billing_address),
            paymentMethod: row.payment_method,
            paymentStatus: row.payment_status,
            shippingMethod: row.shipping_method,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            completedAt: row.completed_at
        };
    }

    private mapRowToUser(row: any): User {
        return {
            id: row.id,
            email: row.email,
            role: row.role,
            isActive: row.is_active,
            tokenVersion: row.token_version,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    private mapRowToCustomer(row: any): Customer {
        return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            phone: row.phone,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}