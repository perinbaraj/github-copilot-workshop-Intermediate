import { Request, Response } from 'express';
import { Product, ProductCreateRequest, ProductUpdateRequest, ProductSearchFilters } from '../models/Product';
import { validateProduct, validateProductUpdate } from '../utils/validation';
import { DatabaseService } from '../utils/database';

export class ProductController {
    private db: DatabaseService;

    constructor() {
        this.db = new DatabaseService();
    }

    async createProduct(req: Request<{}, {}, ProductCreateRequest>, res: Response) {
        try {
            const validation = validateProduct(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product data',
                    errors: validation.errors
                });
            }

            const existingProduct = await this.db.findProductBySku(req.body.sku);
            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message: 'Product with this SKU already exists'
                });
            }

            const productData: Product = {
                id: this.generateId(),
                ...req.body,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const product = await this.db.createProduct(productData);
            
            res.status(201).json({
                success: true,
                data: product,
                message: 'Product created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async getProducts(req: Request<{}, {}, {}, ProductSearchFilters & { page?: string; limit?: string }>, res: Response) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const offset = (page - 1) * limit;

            const filters: ProductSearchFilters = {
                category: req.query.category,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice.toString()) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice.toString()) : undefined,
                tags: req.query.tags,
                isActive: req.query.isActive,
                search: req.query.search
            };

            const result = await this.db.findProducts(filters, limit, offset);
            
            res.json({
                success: true,
                data: result.products,
                total: result.total,
                page,
                limit
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve products'
            });
        }
    }

    async getProductById(req: Request<{ id: string }>, res: Response) {
        try {
            const product = await this.db.findProductById(req.params.id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve product'
            });
        }
    }

    async updateProduct(req: Request<{ id: string }, {}, ProductUpdateRequest>, res: Response) {
        try {
            const validation = validateProductUpdate(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid update data',
                    errors: validation.errors
                });
            }

            const existingProduct = await this.db.findProductById(req.params.id);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const updateData = {
                ...req.body,
                updatedAt: new Date()
            };

            const updatedProduct = await this.db.updateProduct(req.params.id, updateData);
            
            res.json({
                success: true,
                data: updatedProduct,
                message: 'Product updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update product'
            });
        }
    }

    async deleteProduct(req: Request<{ id: string }>, res: Response) {
        try {
            const product = await this.db.findProductById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            await this.db.deleteProduct(req.params.id);
            
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete product'
            });
        }
    }

    async searchProducts(req: Request<{}, {}, { query: string; filters?: ProductSearchFilters }>, res: Response) {
        try {
            const { query, filters = {} } = req.body;
            
            if (!query || query.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query must be at least 2 characters'
                });
            }

            const searchFilters: ProductSearchFilters = {
                ...filters,
                search: query.trim()
            };

            const result = await this.db.searchProducts(searchFilters);
            
            res.json({
                success: true,
                data: result.products,
                total: result.total,
                message: `Found ${result.total} products matching "${query}"`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Search failed'
            });
        }
    }

    private generateId(): string {
        return 'prod_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
}