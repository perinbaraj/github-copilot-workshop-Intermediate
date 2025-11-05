/**
 * Test suite for the order processing system
 * These tests should pass both before and after refactoring
 * Use this to ensure your refactoring preserves functionality
 */

const { processOrder, validateCustomer, calcShip, processRefund } = require('../src/orderProcessor');
const fs = require('fs');

// Mock file system operations for testing
jest.mock('fs');

describe('Order Processing System', () => {
    beforeEach(() => {
        // Reset mocks
        fs.readFileSync.mockClear();
        fs.writeFileSync.mockClear();
        
        // Mock data files
        const mockInventory = {
            products: [
                { id: 'PROD001', stock: 50 },
                { id: 'PROD002', stock: 25 }
            ]
        };
        
        const mockCustomers = [
            { id: 'CUST12345', status: 'active' }
        ];
        
        const mockOrders = [];
        
        fs.readFileSync.mockImplementation((filename) => {
            if (filename === 'inventory.json') {
                return JSON.stringify(mockInventory);
            }
            if (filename === 'customers.json') {
                return JSON.stringify(mockCustomers);
            }
            if (filename === 'orders.json') {
                return JSON.stringify(mockOrders);
            }
        });
    });

    describe('processOrder', () => {
        test('should process valid order successfully', () => {
            const validOrder = {
                customerId: 'CUST12345',
                items: [
                    { productId: 'PROD001', quantity: 2, price: 29.99 }
                ],
                paymentMethod: 'credit_card',
                cardNumber: '1234567890123456',
                expiryDate: '12/25',
                cvv: '123'
            };
            
            const result = processOrder(validOrder);
            
            expect(result).toBeTruthy();
            expect(result.success).toBe(true);
            expect(result.orderId).toBeDefined();
            expect(result.total).toBeGreaterThan(0);
        });

        test('should reject order with no data', () => {
            const result = processOrder(null);
            expect(result).toBe(false);
        });

        test('should reject order with invalid customer ID', () => {
            const invalidOrder = {
                customerId: '123', // Too short
                items: [{ productId: 'PROD001', quantity: 1, price: 29.99 }]
            };
            
            const result = processOrder(invalidOrder);
            expect(result).toBe(false);
        });

        test('should reject order with no items', () => {
            const invalidOrder = {
                customerId: 'CUST12345',
                items: []
            };
            
            const result = processOrder(invalidOrder);
            expect(result).toBe(false);
        });
    });

    describe('validateCustomer', () => {
        test('should validate existing active customer', () => {
            const result = validateCustomer('CUST12345');
            expect(result).toBe(true);
        });

        test('should reject null customer ID', () => {
            const result = validateCustomer(null);
            expect(result).toBe(false);
        });

        test('should reject short customer ID', () => {
            const result = validateCustomer('123');
            expect(result).toBe(false);
        });
    });

    describe('calcShip', () => {
        test('should calculate shipping correctly for small orders', () => {
            expect(calcShip(25)).toBe(9.99);
        });

        test('should calculate shipping correctly for medium orders', () => {
            expect(calcShip(75)).toBe(4.99);
        });

        test('should provide free shipping for large orders', () => {
            expect(calcShip(150)).toBe(0);
        });
    });
});

describe('Integration Tests', () => {
    test('should handle complete order flow', () => {
        // This test should work both before and after refactoring
        const order = {
            customerId: 'CUST12345',
            items: [
                { productId: 'PROD001', quantity: 1, price: 29.99 },
                { productId: 'PROD002', quantity: 1, price: 89.99 }
            ],
            paymentMethod: 'credit_card',
            cardNumber: '1234567890123456',
            expiryDate: '12/25',
            cvv: '123',
            couponCode: 'SAVE10'
        };
        
        const result = processOrder(order);
        
        expect(result).toBeTruthy();
        expect(result.success).toBe(true);
        expect(result.total).toBeCloseTo(116.39, 2); // Calculated with tax, shipping, discount
    });
});