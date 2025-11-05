/**
 * Discount Engine
 * 
 * Handles discount code validation and discount calculations.
 * Current coverage: ~10% - needs extensive test coverage
 * 
 * Areas needing test coverage:
 * - Discount code validation logic
 * - Complex discount combinations
 * - Time-based discount expiration
 * - Customer-specific discount rules
 * - Error handling for invalid codes
 */

class DiscountEngine {
    constructor() {
        // Simulated discount codes database
        this.discountCodes = new Map([
            ['WELCOME10', { 
                type: 'percentage', 
                value: 0.10, 
                minAmount: 50, 
                maxDiscount: 25,
                expiresAt: new Date('2026-12-31'),
                customerRestriction: null,
                usageLimit: null,
                usedCount: 0
            }],
            ['SAVE20', { 
                type: 'percentage', 
                value: 0.20, 
                minAmount: 100, 
                maxDiscount: 50,
                expiresAt: new Date('2026-06-30'),
                customerRestriction: null,
                usageLimit: 100,
                usedCount: 45
            }],
            ['FIXED15', { 
                type: 'fixed', 
                value: 15, 
                minAmount: 75, 
                maxDiscount: 15,
                expiresAt: new Date('2026-03-31'),
                customerRestriction: null,
                usageLimit: null,
                usedCount: 0
            }],
            ['VIP25', { 
                type: 'percentage', 
                value: 0.25, 
                minAmount: 200, 
                maxDiscount: 100,
                expiresAt: new Date('2026-12-31'),
                customerRestriction: 'vip',
                usageLimit: 50,
                usedCount: 12
            }],
            ['EXPIRED', { 
                type: 'percentage', 
                value: 0.15, 
                minAmount: 0, 
                maxDiscount: null,
                expiresAt: new Date('2024-01-01'), // Expired
                customerRestriction: null,
                usageLimit: null,
                usedCount: 0
            }]
        ]);

        // Customer tiers for restriction validation
        this.customerTiers = new Map([
            ['customer1', 'regular'],
            ['customer2', 'vip'],
            ['customer3', 'premium'],
            ['customer4', 'regular']
        ]);
    }

    /**
     * Validate discount code
     * @param {string} code - Discount code to validate
     * @param {string} customerId - Customer ID for restriction checks
     */
    validateCode(code, customerId = null) {
        if (!code || typeof code !== 'string') {
            return false; // Invalid code format - needs testing
        }

        const discount = this.discountCodes.get(code.toUpperCase());
        
        if (!discount) {
            return false; // Code doesn't exist - needs testing
        }

        // Check expiration - this logic needs comprehensive testing
        if (discount.expiresAt && new Date() > discount.expiresAt) {
            return false; // Expired code
        }

        // Check usage limit - this logic needs testing
        if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
            return false; // Usage limit exceeded
        }

        // Check customer restrictions - complex logic needs testing
        if (discount.customerRestriction && customerId) {
            const customerTier = this.customerTiers.get(customerId);
            if (customerTier !== discount.customerRestriction) {
                return false; // Customer doesn't meet restriction
            }
        }

        return true;
    }

    /**
     * Calculate discount amount for a single code
     * @param {Array} items - Cart items
     * @param {string} code - Discount code
     * @param {string} customerId - Customer ID
     */
    calculateSingleDiscount(items, code, customerId = null) {
        if (!this.validateCode(code, customerId)) {
            return 0; // Invalid code returns no discount
        }

        const discount = this.discountCodes.get(code.toUpperCase());
        const subtotal = this.calculateItemsSubtotal(items);

        // Check minimum amount requirement - needs testing
        if (discount.minAmount && subtotal < discount.minAmount) {
            return 0; // Doesn't meet minimum amount
        }

        let discountAmount = 0;

        if (discount.type === 'percentage') {
            discountAmount = subtotal * discount.value;
        } else if (discount.type === 'fixed') {
            discountAmount = discount.value;
        } else {
            return 0; // Unknown discount type - needs testing
        }

        // Apply maximum discount limit - this logic needs testing
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
            discountAmount = discount.maxDiscount;
        }

        // Ensure discount doesn't exceed subtotal
        return Math.min(discountAmount, subtotal);
    }

    /**
     * Calculate total discount from multiple codes
     * @param {Array} items - Cart items
     * @param {Array} codes - Array of discount codes
     * @param {string} customerId - Customer ID
     */
    calculateTotalDiscount(items, codes, customerId = null) {
        if (!Array.isArray(items) || items.length === 0) {
            return 0; // No items, no discount
        }

        if (!Array.isArray(codes) || codes.length === 0) {
            return 0; // No codes, no discount
        }

        let totalDiscount = 0;
        let remainingSubtotal = this.calculateItemsSubtotal(items);

        // Apply discounts in order, reducing remaining subtotal
        // This complex stacking logic needs comprehensive testing
        for (const code of codes) {
            if (!this.validateCode(code, customerId)) {
                continue; // Skip invalid codes
            }

            const discount = this.discountCodes.get(code.toUpperCase());
            
            // Check minimum amount against remaining subtotal
            if (discount.minAmount && remainingSubtotal < discount.minAmount) {
                continue; // Skip if remaining amount too low
            }

            let discountAmount = 0;

            if (discount.type === 'percentage') {
                discountAmount = remainingSubtotal * discount.value;
            } else if (discount.type === 'fixed') {
                discountAmount = Math.min(discount.value, remainingSubtotal);
            }

            // Apply maximum discount limit
            if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
                discountAmount = discount.maxDiscount;
            }

            // Ensure we don't discount more than remaining subtotal
            discountAmount = Math.min(discountAmount, remainingSubtotal);

            totalDiscount += discountAmount;
            remainingSubtotal -= discountAmount;

            // Stop if no remaining amount to discount
            if (remainingSubtotal <= 0) {
                break;
            }
        }

        return parseFloat(totalDiscount.toFixed(2));
    }

    /**
     * Calculate subtotal from items array
     * @param {Array} items - Cart items
     */
    calculateItemsSubtotal(items) {
        if (!Array.isArray(items)) {
            return 0; // Invalid items array - needs testing
        }

        return items.reduce((total, item) => {
            // Handle different item object formats - needs testing
            if (item && typeof item === 'object') {
                const price = item.price || 0;
                const quantity = item.quantity || 0;
                return total + (price * quantity);
            }
            return total;
        }, 0);
    }

    /**
     * Get discount code information
     * @param {string} code - Discount code
     */
    getDiscountInfo(code) {
        if (!code || typeof code !== 'string') {
            return null; // Invalid code - needs testing
        }

        const discount = this.discountCodes.get(code.toUpperCase());
        
        if (!discount) {
            return null; // Code doesn't exist - needs testing
        }

        // Return safe copy without internal tracking data
        return {
            code: code.toUpperCase(),
            type: discount.type,
            value: discount.value,
            minAmount: discount.minAmount,
            maxDiscount: discount.maxDiscount,
            expiresAt: discount.expiresAt ? discount.expiresAt.toISOString() : null,
            customerRestriction: discount.customerRestriction,
            isExpired: discount.expiresAt ? new Date() > discount.expiresAt : false,
            remainingUses: discount.usageLimit ? discount.usageLimit - discount.usedCount : null
        };
    }

    /**
     * Apply discount code (marks as used)
     * @param {string} code - Discount code to apply
     * @param {string} customerId - Customer ID
     */
    applyDiscountCode(code, customerId = null) {
        if (!this.validateCode(code, customerId)) {
            throw new Error('Invalid or expired discount code'); // This error path needs testing
        }

        const discount = this.discountCodes.get(code.toUpperCase());
        
        // Increment usage count - this logic needs testing
        discount.usedCount++;

        return true;
    }

    /**
     * Check if multiple codes can be combined
     * @param {Array} codes - Array of discount codes
     * @param {string} customerId - Customer ID
     */
    canCombineCodes(codes, customerId = null) {
        if (!Array.isArray(codes) || codes.length <= 1) {
            return true; // Single or no codes can always be "combined"
        }

        // Check if any codes have combination restrictions
        // This is simplified logic - real implementation would be more complex
        const hasPercentageDiscount = codes.some(code => {
            const discount = this.discountCodes.get(code.toUpperCase());
            return discount && discount.type === 'percentage' && discount.value >= 0.20;
        });

        const hasVipRestriction = codes.some(code => {
            const discount = this.discountCodes.get(code.toUpperCase());
            return discount && discount.customerRestriction === 'vip';
        });

        // Complex combination rules that need testing
        if (hasPercentageDiscount && codes.length > 2) {
            return false; // Can't combine high percentage discounts with multiple codes
        }

        if (hasVipRestriction && codes.length > 1) {
            const customerTier = this.customerTiers.get(customerId);
            if (customerTier !== 'vip') {
                return false; // Non-VIP customers can't combine VIP codes
            }
        }

        return true;
    }

    /**
     * Get best discount combination for given items
     * @param {Array} items - Cart items
     * @param {Array} availableCodes - Available discount codes
     * @param {string} customerId - Customer ID
     */
    getBestDiscountCombination(items, availableCodes, customerId = null) {
        if (!Array.isArray(availableCodes) || availableCodes.length === 0) {
            return { codes: [], discount: 0 };
        }

        // Filter valid codes
        const validCodes = availableCodes.filter(code => 
            this.validateCode(code, customerId)
        );

        if (validCodes.length === 0) {
            return { codes: [], discount: 0 };
        }

        // Try different combinations - this optimization logic needs comprehensive testing
        let bestCombination = { codes: [], discount: 0 };

        // Try single codes first
        for (const code of validCodes) {
            const discount = this.calculateTotalDiscount(items, [code], customerId);
            if (discount > bestCombination.discount) {
                bestCombination = { codes: [code], discount };
            }
        }

        // Try pairs of codes if combination is allowed
        for (let i = 0; i < validCodes.length; i++) {
            for (let j = i + 1; j < validCodes.length; j++) {
                const codePair = [validCodes[i], validCodes[j]];
                
                if (this.canCombineCodes(codePair, customerId)) {
                    const discount = this.calculateTotalDiscount(items, codePair, customerId);
                    if (discount > bestCombination.discount) {
                        bestCombination = { codes: codePair, discount };
                    }
                }
            }
        }

        // Try all codes if combination is allowed
        if (this.canCombineCodes(validCodes, customerId)) {
            const discount = this.calculateTotalDiscount(items, validCodes, customerId);
            if (discount > bestCombination.discount) {
                bestCombination = { codes: validCodes, discount };
            }
        }

        return {
            codes: bestCombination.codes,
            discount: parseFloat(bestCombination.discount.toFixed(2))
        };
    }
}

module.exports = DiscountEngine;