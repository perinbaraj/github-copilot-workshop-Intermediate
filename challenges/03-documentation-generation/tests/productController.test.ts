import request from 'supertest';
import { ProductController } from '../src/controllers/productController';
import { DatabaseService } from '../src/utils/database';

jest.mock('../src/utils/database');

describe('ProductController', () => {
    let productController: ProductController;
    let mockDb: jest.Mocked<DatabaseService>;

    beforeEach(() => {
        mockDb = new DatabaseService() as jest.Mocked<DatabaseService>;
        productController = new ProductController();
        (productController as any).db = mockDb;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a new product successfully', async () => {
            const mockProduct = {
                id: 'prod_123',
                name: 'Test Product',
                sku: 'TEST-001',
                price: 99.99,
                category: 'Electronics',
                description: 'A test product',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockDb.findProductBySku.mockResolvedValue(null);
            mockDb.createProduct.mockResolvedValue(mockProduct);

            const req = {
                body: {
                    name: 'Test Product',
                    sku: 'TEST-001',
                    price: 99.99,
                    category: 'Electronics',
                    description: 'A test product'
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.createProduct(req, res);

            expect(mockDb.findProductBySku).toHaveBeenCalledWith('TEST-001');
            expect(mockDb.createProduct).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockProduct,
                message: 'Product created successfully'
            });
        });

        it('should return error when SKU already exists', async () => {
            const existingProduct = {
                id: 'prod_existing',
                name: 'Existing Product',
                sku: 'TEST-001',
                price: 50.00,
                category: 'Electronics'
            };

            mockDb.findProductBySku.mockResolvedValue(existingProduct as any);

            const req = {
                body: {
                    name: 'Test Product',
                    sku: 'TEST-001',
                    price: 99.99,
                    category: 'Electronics'
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Product with SKU TEST-001 already exists'
            });
        });

        it('should handle validation errors', async () => {
            const req = {
                body: {
                    name: 'Test Product'
                }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid product data',
                errors: expect.any(Array)
            });
        });
    });

    describe('getProducts', () => {
        it('should return paginated products', async () => {
            const mockProducts = [
                { id: 'prod_1', name: 'Product 1', sku: 'PROD-001', price: 10.00 },
                { id: 'prod_2', name: 'Product 2', sku: 'PROD-002', price: 20.00 }
            ];

            mockDb.findProducts.mockResolvedValue({
                products: mockProducts as any,
                total: 2
            });

            const req = {
                query: { page: '1', limit: '10' }
            } as any;

            const res = {
                json: jest.fn()
            } as any;

            await productController.getProducts(req, res);

            expect(mockDb.findProducts).toHaveBeenCalledWith(
                {},
                10,
                0
            );
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockProducts,
                total: 2,
                page: 1,
                limit: 10
            });
        });

        it('should apply search filters', async () => {
            mockDb.findProducts.mockResolvedValue({
                products: [],
                total: 0
            });

            const req = {
                query: {
                    category: 'Electronics',
                    minPrice: '10',
                    maxPrice: '100',
                    search: 'laptop'
                }
            } as any;

            const res = {
                json: jest.fn()
            } as any;

            await productController.getProducts(req, res);

            expect(mockDb.findProducts).toHaveBeenCalledWith({
                category: 'Electronics',
                minPrice: 10,
                maxPrice: 100,
                searchTerm: 'laptop'
            }, 10, 0);
        });
    });

    describe('getProductById', () => {
        it('should return product when found', async () => {
            const mockProduct = {
                id: 'prod_123',
                name: 'Test Product',
                sku: 'TEST-001',
                price: 99.99
            };

            mockDb.findProductById.mockResolvedValue(mockProduct as any);

            const req = { params: { id: 'prod_123' } } as any;
            const res = {
                json: jest.fn()
            } as any;

            await productController.getProductById(req, res);

            expect(mockDb.findProductById).toHaveBeenCalledWith('prod_123');
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockProduct
            });
        });

        it('should return 404 when product not found', async () => {
            mockDb.findProductById.mockResolvedValue(null);

            const req = { params: { id: 'nonexistent' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Product not found'
            });
        });
    });

    describe('updateProduct', () => {
        it('should update product successfully', async () => {
            const existingProduct = {
                id: 'prod_123',
                name: 'Old Name',
                sku: 'TEST-001',
                price: 50.00
            };

            const updatedProduct = {
                ...existingProduct,
                name: 'Updated Name',
                price: 75.00
            };

            mockDb.findProductById.mockResolvedValue(existingProduct as any);
            mockDb.updateProduct.mockResolvedValue(updatedProduct as any);

            const req = {
                params: { id: 'prod_123' },
                body: {
                    name: 'Updated Name',
                    price: 75.00
                }
            } as any;

            const res = {
                json: jest.fn()
            } as any;

            await productController.updateProduct(req, res);

            expect(mockDb.updateProduct).toHaveBeenCalledWith(
                'prod_123',
                expect.objectContaining({
                    name: 'Updated Name',
                    price: 75.00
                })
            );
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: updatedProduct,
                message: 'Product updated successfully'
            });
        });

        it('should return 404 when updating non-existent product', async () => {
            mockDb.findProductById.mockResolvedValue(null);

            const req = {
                params: { id: 'nonexistent' },
                body: { name: 'New Name' }
            } as any;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Product not found'
            });
        });
    });

    describe('deleteProduct', () => {
        it('should delete product successfully', async () => {
            const mockProduct = {
                id: 'prod_123',
                name: 'Test Product',
                isActive: true
            };

            mockDb.findProductById.mockResolvedValue(mockProduct as any);
            mockDb.deleteProduct.mockResolvedValue(true);

            const req = { params: { id: 'prod_123' } } as any;
            const res = {
                json: jest.fn()
            } as any;

            await productController.deleteProduct(req, res);

            expect(mockDb.deleteProduct).toHaveBeenCalledWith('prod_123');
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Product deleted successfully'
            });
        });

        it('should return 404 when deleting non-existent product', async () => {
            mockDb.findProductById.mockResolvedValue(null);

            const req = { params: { id: 'nonexistent' } } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Product not found'
            });
        });
    });

    describe('searchProducts', () => {
        it('should return search results', async () => {
            const mockResults = [
                { id: 'prod_1', name: 'Laptop Computer', score: 0.95 },
                { id: 'prod_2', name: 'Computer Mouse', score: 0.75 }
            ];

            mockDb.findProducts.mockResolvedValue({
                products: mockResults as any,
                total: 2
            });

            const req = {
                query: { q: 'computer', limit: '5' }
            } as any;

            const res = {
                json: jest.fn()
            } as any;

            await productController.searchProducts(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockResults,
                query: 'computer',
                total: 2
            });
        });

        it('should return 400 for empty search query', async () => {
            const req = { query: {} } as any;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            await productController.searchProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Search query is required'
            });
        });
    });
});