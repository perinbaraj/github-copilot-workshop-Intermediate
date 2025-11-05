/**
 * Cart Item Model
 * 
 * Represents individual items in a shopping cart.
 * Current coverage: ~40% - needs comprehensive testing
 * 
 * Areas needing test coverage:
 * - Validation edge cases
 * - Option handling
 * - JSON serialization
 * - Error conditions
 */

class CartItem {
    constructor(productId, quantity = 1, price = 0, options = {}) {
        // Basic validation
        if (!productId || typeof productId !== 'string') {
            throw new Error('Product ID must be a non-empty string');
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            throw new Error('Quantity must be a positive integer');
        }

        if (price < 0 || typeof price !== 'number') {
            throw new Error('Price must be a non-negative number');
        }

        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.options = this.validateOptions(options);
        this.addedAt = new Date();
        this.lastModified = new Date();
    }

    /**
     * Validate and normalize options
     * @param {Object} options - Item options (color, size, etc.)
     */
    validateOptions(options) {
        if (!options || typeof options !== 'object') {
            return {};
        }

        // Filter out invalid option values - this logic needs testing
        const validOptions = {};
        
        Object.keys(options).forEach(key => {
            const value = options[key];
            
            // Skip null, undefined, empty strings, and functions
            if (value != null && value !== '' && typeof value !== 'function') {
                validOptions[key] = value;
            }
        });

        return validOptions;
    }

    /**
     * Update item quantity
     * @param {number} newQuantity - New quantity value
     */
    updateQuantity(newQuantity) {
        if (newQuantity <= 0 || !Number.isInteger(newQuantity)) {
            throw new Error('Quantity must be a positive integer');
        }

        this.quantity = newQuantity;
        this.lastModified = new Date();
    }

    /**
     * Update item price
     * @param {number} newPrice - New price value
     */
    updatePrice(newPrice) {
        if (newPrice < 0 || typeof newPrice !== 'number') {
            throw new Error('Price must be a non-negative number');
        }

        this.price = newPrice;
        this.lastModified = new Date();
    }

    /**
     * Add or update an option
     * @param {string} key - Option key
     * @param {*} value - Option value
     */
    setOption(key, value) {
        if (!key || typeof key !== 'string') {
            throw new Error('Option key must be a non-empty string');
        }

        // This validation logic needs comprehensive testing
        if (value == null || value === '' || typeof value === 'function') {
            delete this.options[key];
        } else {
            this.options[key] = value;
        }

        this.lastModified = new Date();
    }

    /**
     * Remove an option
     * @param {string} key - Option key to remove
     */
    removeOption(key) {
        if (!key || typeof key !== 'string') {
            return false;
        }

        if (!(key in this.options)) {
            return false; // Option doesn't exist - needs testing
        }

        delete this.options[key];
        this.lastModified = new Date();
        return true;
    }

    /**
     * Get option value
     * @param {string} key - Option key
     * @param {*} defaultValue - Default value if key doesn't exist
     */
    getOption(key, defaultValue = null) {
        return this.options.hasOwnProperty(key) ? this.options[key] : defaultValue;
    }

    /**
     * Check if item has specific option
     * @param {string} key - Option key to check
     */
    hasOption(key) {
        return this.options.hasOwnProperty(key);
    }

    /**
     * Calculate total price for this item (price * quantity)
     */
    getTotalPrice() {
        return this.price * this.quantity;
    }

    /**
     * Check if this item matches another item (same product and options)
     * @param {CartItem} otherItem - Item to compare with
     */
    matches(otherItem) {
        if (!otherItem || !(otherItem instanceof CartItem)) {
            return false;
        }

        if (this.productId !== otherItem.productId) {
            return false;
        }

        // Deep comparison of options - this logic needs thorough testing
        return JSON.stringify(this.options) === JSON.stringify(otherItem.options);
    }

    /**
     * Clone this item with optional modifications
     * @param {Object} modifications - Properties to override in the clone
     */
    clone(modifications = {}) {
        const cloned = new CartItem(
            modifications.productId || this.productId,
            modifications.quantity || this.quantity,
            modifications.price || this.price,
            modifications.options || { ...this.options }
        );

        return cloned;
    }

    /**
     * Check if item is valid for checkout
     */
    isValid() {
        // Complex validation logic that needs comprehensive testing
        if (!this.productId || this.productId.trim() === '') {
            return false;
        }

        if (this.quantity <= 0 || this.price < 0) {
            return false;
        }

        // Check for required options based on product type
        // This is simplified logic - real implementation would be more complex
        if (this.productId.startsWith('clothing-') && !this.hasOption('size')) {
            return false; // Clothing items require size
        }

        if (this.productId.startsWith('custom-') && !this.hasOption('customization')) {
            return false; // Custom items require customization details
        }

        return true;
    }

    /**
     * Get human-readable description
     */
    getDescription() {
        let description = `${this.productId} (Qty: ${this.quantity})`;
        
        const optionKeys = Object.keys(this.options);
        if (optionKeys.length > 0) {
            const optionStrings = optionKeys.map(key => `${key}: ${this.options[key]}`);
            description += ` [${optionStrings.join(', ')}]`;
        }

        return description;
    }

    /**
     * Convert to JSON representation
     */
    toJSON() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            price: this.price,
            totalPrice: this.getTotalPrice(),
            options: { ...this.options },
            addedAt: this.addedAt.toISOString(),
            lastModified: this.lastModified.toISOString(),
            description: this.getDescription(),
            isValid: this.isValid()
        };
    }

    /**
     * Create CartItem from JSON data
     * @param {Object} data - JSON data to create item from
     */
    static fromJSON(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data for CartItem creation');
        }

        const item = new CartItem(
            data.productId,
            data.quantity,
            data.price,
            data.options
        );

        // Restore timestamps if available
        if (data.addedAt) {
            item.addedAt = new Date(data.addedAt);
        }
        if (data.lastModified) {
            item.lastModified = new Date(data.lastModified);
        }

        return item;
    }
}

module.exports = CartItem;