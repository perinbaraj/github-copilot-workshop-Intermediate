/**
 * Shopping Cart Implementation
 * 
 * This shopping cart has basic functionality but needs comprehensive test coverage.
 * Current coverage: ~60% - needs improvement to 80%+
 * 
 * Areas needing test coverage:
 * - Error handling paths
 * - Edge cases (empty cart, invalid inputs)
 * - Complex discount scenarios
 * - Tax calculation edge cases
 */

const CartItem = require('./CartItem');
const PriceCalculator = require('./PriceCalculator');
const DiscountEngine = require('./DiscountEngine');

class ShoppingCart {
    constructor(customerId = null) {
        this.customerId = customerId;
        this.items = [];
        this.discountCodes = [];
        this.taxRate = 0.08; // 8% default tax rate
        this.createdAt = new Date();
    }

    /**
     * Add item to cart
     * @param {string} productId - Product identifier
     * @param {number} quantity - Quantity to add
     * @param {number} price - Price per item
     * @param {Object} options - Additional options (color, size, etc.)
     */
    addItem(productId, quantity = 1, price = 0, options = {}) {
        // Basic validation - but missing edge case handling
        if (!productId) {
            throw new Error('Product ID is required');
        }

        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }

        // Check if item already exists
        const existingItem = this.findItem(productId, options);
        
        if (existingItem) {
            existingItem.updateQuantity(existingItem.quantity + quantity);
        } else {
            const newItem = new CartItem(productId, quantity, price, options);
            this.items.push(newItem);
        }

        return this.items.length;
    }

    /**
     * Remove item from cart
     * @param {string} productId - Product to remove
     * @param {Object} options - Item options to match
     */
    removeItem(productId, options = {}) {
        const index = this.items.findIndex(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (index === -1) {
            return false; // Item not found - this path needs testing
        }

        this.items.splice(index, 1);
        return true;
    }

    /**
     * Update item quantity
     * @param {string} productId - Product to update
     * @param {number} newQuantity - New quantity
     * @param {Object} options - Item options to match
     */
    updateItemQuantity(productId, newQuantity, options = {}) {
        if (newQuantity < 0) {
            throw new Error('Quantity cannot be negative');
        }

        const item = this.findItem(productId, options);
        
        if (!item) {
            throw new Error('Item not found in cart');
        }

        if (newQuantity === 0) {
            return this.removeItem(productId, options);
        }

        item.updateQuantity(newQuantity);
        return true;
    }

    /**
     * Find item in cart
     * @param {string} productId - Product to find
     * @param {Object} options - Item options to match
     */
    findItem(productId, options = {}) {
        return this.items.find(item => 
            item.productId === productId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
    }

    /**
     * Apply discount code
     * @param {string} code - Discount code to apply
     */
    applyDiscountCode(code) {
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid discount code');
        }

        // Check if code already applied
        if (this.discountCodes.includes(code)) {
            return false; // Already applied - needs testing
        }

        // Validate discount code (this logic needs comprehensive testing)
        const discountEngine = new DiscountEngine();
        const isValid = discountEngine.validateCode(code, this.customerId);
        
        if (!isValid) {
            throw new Error('Invalid or expired discount code');
        }

        this.discountCodes.push(code);
        return true;
    }

    /**
     * Remove discount code
     * @param {string} code - Discount code to remove
     */
    removeDiscountCode(code) {
        const index = this.discountCodes.indexOf(code);
        if (index === -1) {
            return false; // Code not found - needs testing
        }

        this.discountCodes.splice(index, 1);
        return true;
    }

    /**
     * Get cart summary with totals
     */
    getSummary() {
        const calculator = new PriceCalculator(this.taxRate);
        const discountEngine = new DiscountEngine();

        const subtotal = this.calculateSubtotal();
        const discountAmount = discountEngine.calculateTotalDiscount(
            this.items, 
            this.discountCodes, 
            this.customerId
        );
        
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const taxAmount = calculator.calculateTax(discountedSubtotal);
        const total = discountedSubtotal + taxAmount;

        return {
            itemCount: this.getTotalItems(),
            subtotal: parseFloat(subtotal.toFixed(2)),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            items: this.items.map(item => item.toJSON())
        };
    }

    /**
     * Calculate subtotal of all items
     */
    calculateSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get total number of items in cart
     */
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Check if cart is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Clear all items from cart
     */
    clear() {
        this.items = [];
        this.discountCodes = [];
    }

    /**
     * Merge another cart into this one
     * @param {ShoppingCart} otherCart - Cart to merge
     */
    merge(otherCart) {
        if (!otherCart || !(otherCart instanceof ShoppingCart)) {
            throw new Error('Invalid cart to merge');
        }

        // This method has complex logic that needs thorough testing
        otherCart.items.forEach(item => {
            this.addItem(item.productId, item.quantity, item.price, item.options);
        });

        // Merge discount codes (avoid duplicates)
        otherCart.discountCodes.forEach(code => {
            if (!this.discountCodes.includes(code)) {
                this.discountCodes.push(code);
            }
        });
    }

    /**
     * Validate cart before checkout
     */
    validate() {
        if (this.isEmpty()) {
            throw new Error('Cannot checkout empty cart');
        }

        // Check for invalid items (this validation logic needs testing)
        const invalidItems = this.items.filter(item => 
            item.price <= 0 || item.quantity <= 0
        );

        if (invalidItems.length > 0) {
            throw new Error('Cart contains invalid items');
        }

        // Check total doesn't exceed maximum allowed
        const summary = this.getSummary();
        if (summary.total > 10000) {
            throw new Error('Cart total exceeds maximum allowed amount');
        }

        return true;
    }

    /**
     * Convert cart to JSON
     */
    toJSON() {
        return {
            customerId: this.customerId,
            items: this.items.map(item => item.toJSON()),
            discountCodes: [...this.discountCodes],
            taxRate: this.taxRate,
            createdAt: this.createdAt.toISOString(),
            summary: this.getSummary()
        };
    }
}

module.exports = ShoppingCart;