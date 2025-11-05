/**
 * Price Calculator
 * 
 * Handles price calculations, tax calculations, and price formatting.
 * Current coverage: ~20% - needs significant test coverage improvement
 * 
 * Areas needing test coverage:
 * - Tax calculation edge cases
 * - Currency conversion
 * - Bulk pricing calculations
 * - Error handling for invalid inputs
 */

class PriceCalculator {
    constructor(taxRate = 0.08, currency = 'USD') {
        this.taxRate = taxRate;
        this.currency = currency;
        this.bulkDiscounts = new Map([
            [10, 0.05],  // 5% off for 10+ items
            [25, 0.10],  // 10% off for 25+ items
            [50, 0.15],  // 15% off for 50+ items
            [100, 0.20]  // 20% off for 100+ items
        ]);
    }

    /**
     * Calculate tax amount
     * @param {number} amount - Amount to calculate tax on
     */
    calculateTax(amount) {
        if (typeof amount !== 'number' || amount < 0) {
            throw new Error('Amount must be a non-negative number');
        }

        if (this.taxRate < 0 || this.taxRate > 1) {
            throw new Error('Tax rate must be between 0 and 1');
        }

        return amount * this.taxRate;
    }

    /**
     * Calculate bulk discount based on total items
     * @param {number} totalItems - Total number of items
     * @param {number} amount - Amount before discount
     */
    calculateBulkDiscount(totalItems, amount) {
        if (typeof totalItems !== 'number' || totalItems < 0) {
            return 0; // This path needs testing
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return 0; // This path needs testing
        }

        let discountRate = 0;

        // Find the highest applicable bulk discount - complex logic needs testing
        for (const [minItems, rate] of this.bulkDiscounts) {
            if (totalItems >= minItems) {
                discountRate = Math.max(discountRate, rate);
            }
        }

        return amount * discountRate;
    }

    /**
     * Calculate shipping cost based on total weight and amount
     * @param {number} totalWeight - Total weight of items
     * @param {number} totalAmount - Total cart amount
     */
    calculateShippingCost(totalWeight, totalAmount) {
        // Free shipping for orders over $100 - needs testing
        if (totalAmount >= 100) {
            return 0;
        }

        if (typeof totalWeight !== 'number' || totalWeight <= 0) {
            throw new Error('Total weight must be a positive number');
        }

        let shippingCost = 5.99; // Base shipping cost

        // Additional cost for heavy items - this logic needs comprehensive testing
        if (totalWeight > 10) {
            shippingCost += Math.ceil((totalWeight - 10) / 5) * 2.50;
        }

        // Express shipping multiplier (not implemented but affects calculation)
        // This is intentionally incomplete to create a testing opportunity
        
        return parseFloat(shippingCost.toFixed(2));
    }

    /**
     * Apply loyalty discount based on customer tier
     * @param {string} customerTier - Customer tier (bronze, silver, gold, platinum)
     * @param {number} amount - Amount to apply discount to
     */
    applyLoyaltyDiscount(customerTier, amount) {
        if (typeof amount !== 'number' || amount <= 0) {
            return 0;
        }

        const tierDiscounts = {
            'bronze': 0.02,   // 2%
            'silver': 0.05,   // 5%
            'gold': 0.08,     // 8%
            'platinum': 0.12  // 12%
        };

        const discountRate = tierDiscounts[customerTier?.toLowerCase()];
        
        if (!discountRate) {
            return 0; // Invalid tier - needs testing
        }

        return amount * discountRate;
    }

    /**
     * Convert price between currencies
     * @param {number} amount - Amount to convert
     * @param {string} fromCurrency - Source currency
     * @param {string} toCurrency - Target currency
     */
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (typeof amount !== 'number' || amount < 0) {
            throw new Error('Amount must be a non-negative number');
        }

        // Simplified exchange rates - in real app, this would call an API
        const exchangeRates = {
            'USD': { 'EUR': 0.85, 'GBP': 0.73, 'CAD': 1.25 },
            'EUR': { 'USD': 1.18, 'GBP': 0.86, 'CAD': 1.47 },
            'GBP': { 'USD': 1.37, 'EUR': 1.16, 'CAD': 1.71 },
            'CAD': { 'USD': 0.80, 'EUR': 0.68, 'GBP': 0.58 }
        };

        if (fromCurrency === toCurrency) {
            return amount; // Same currency - needs testing
        }

        const rate = exchangeRates[fromCurrency]?.[toCurrency];
        
        if (!rate) {
            throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
        }

        return parseFloat((amount * rate).toFixed(2));
    }

    /**
     * Calculate installment payment amount
     * @param {number} totalAmount - Total amount to finance
     * @param {number} months - Number of months
     * @param {number} interestRate - Annual interest rate (as decimal)
     */
    calculateInstallmentPayment(totalAmount, months, interestRate = 0.0599) {
        if (totalAmount <= 0 || months <= 0 || interestRate < 0) {
            throw new Error('Invalid parameters for installment calculation');
        }

        if (months === 1) {
            return totalAmount; // No interest for single payment - needs testing
        }

        const monthlyRate = interestRate / 12;
        
        // Complex installment calculation - needs comprehensive testing
        const monthlyPayment = totalAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);

        return parseFloat(monthlyPayment.toFixed(2));
    }

    /**
     * Format price for display
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     */
    formatPrice(amount, currency = this.currency) {
        if (typeof amount !== 'number') {
            throw new Error('Amount must be a number');
        }

        const formatters = {
            'USD': new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
            'EUR': new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
            'GBP': new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
            'CAD': new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })
        };

        const formatter = formatters[currency];
        
        if (!formatter) {
            // Fallback formatting - needs testing
            return `${currency} ${amount.toFixed(2)}`;
        }

        return formatter.format(amount);
    }

    /**
     * Calculate total with all applicable discounts and fees
     * @param {Object} params - Calculation parameters
     */
    calculateTotal(params) {
        const {
            subtotal,
            totalItems = 0,
            totalWeight = 0,
            customerTier = null,
            includeShipping = true,
            currency = this.currency
        } = params;

        if (typeof subtotal !== 'number' || subtotal < 0) {
            throw new Error('Subtotal must be a non-negative number');
        }

        let total = subtotal;

        // Apply bulk discount
        const bulkDiscount = this.calculateBulkDiscount(totalItems, total);
        total -= bulkDiscount;

        // Apply loyalty discount
        const loyaltyDiscount = this.applyLoyaltyDiscount(customerTier, total);
        total -= loyaltyDiscount;

        // Calculate tax on discounted amount
        const taxAmount = this.calculateTax(total);

        // Add shipping if applicable
        let shippingCost = 0;
        if (includeShipping) {
            shippingCost = this.calculateShippingCost(totalWeight, subtotal);
        }

        const finalTotal = total + taxAmount + shippingCost;

        // Return detailed breakdown - this object structure needs testing
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            bulkDiscount: parseFloat(bulkDiscount.toFixed(2)),
            loyaltyDiscount: parseFloat(loyaltyDiscount.toFixed(2)),
            discountedSubtotal: parseFloat(total.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            total: parseFloat(finalTotal.toFixed(2)),
            formattedTotal: this.formatPrice(finalTotal, currency)
        };
    }

    /**
     * Update tax rate
     * @param {number} newTaxRate - New tax rate (0-1)
     */
    updateTaxRate(newTaxRate) {
        if (typeof newTaxRate !== 'number' || newTaxRate < 0 || newTaxRate > 1) {
            throw new Error('Tax rate must be a number between 0 and 1');
        }

        this.taxRate = newTaxRate;
    }

    /**
     * Add or update bulk discount tier
     * @param {number} minItems - Minimum items for discount
     * @param {number} discountRate - Discount rate (0-1)
     */
    setBulkDiscount(minItems, discountRate) {
        if (typeof minItems !== 'number' || minItems <= 0) {
            throw new Error('Minimum items must be a positive number');
        }

        if (typeof discountRate !== 'number' || discountRate < 0 || discountRate > 1) {
            throw new Error('Discount rate must be between 0 and 1');
        }

        this.bulkDiscounts.set(minItems, discountRate);
    }
}

module.exports = PriceCalculator;