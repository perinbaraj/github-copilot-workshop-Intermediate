export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}

export class ValidationUtils {
    static isEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isPhoneNumber(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    static isNumeric(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    static isPositiveNumber(value: any): boolean {
        return this.isNumeric(value) && parseFloat(value) > 0;
    }

    static isValidSku(sku: string): boolean {
        const skuRegex = /^[A-Z0-9\-_]{3,20}$/;
        return skuRegex.test(sku);
    }

    static isValidStatus(status: string, allowedStatuses: string[]): boolean {
        return allowedStatuses.includes(status);
    }

    static hasRequiredFields(obj: any, requiredFields: string[]): ValidationError[] {
        const errors: ValidationError[] = [];
        
        for (const field of requiredFields) {
            if (!obj.hasOwnProperty(field) || obj[field] === null || obj[field] === undefined || obj[field] === '') {
                errors.push({
                    field,
                    message: `${field} is required`,
                    value: obj[field]
                });
            }
        }
        
        return errors;
    }

    static validateStringLength(value: string, minLength?: number, maxLength?: number, fieldName: string = 'field'): ValidationError[] {
        const errors: ValidationError[] = [];
        
        if (typeof value !== 'string') {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be a string`,
                value
            });
            return errors;
        }

        if (minLength !== undefined && value.length < minLength) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be at least ${minLength} characters long`,
                value
            });
        }

        if (maxLength !== undefined && value.length > maxLength) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must not exceed ${maxLength} characters`,
                value
            });
        }

        return errors;
    }

    static validateNumberRange(value: number, min?: number, max?: number, fieldName: string = 'field'): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!this.isNumeric(value)) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be a valid number`,
                value
            });
            return errors;
        }

        const numValue = parseFloat(value.toString());

        if (min !== undefined && numValue < min) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be at least ${min}`,
                value
            });
        }

        if (max !== undefined && numValue > max) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must not exceed ${max}`,
                value
            });
        }

        return errors;
    }
}

export function validateProduct(productData: any): ValidationResult {
    const errors: ValidationError[] = [];

    errors.push(...ValidationUtils.hasRequiredFields(productData, ['name', 'sku', 'price', 'category']));

    if (productData.name) {
        errors.push(...ValidationUtils.validateStringLength(productData.name, 2, 100, 'name'));
    }

    if (productData.sku) {
        if (!ValidationUtils.isValidSku(productData.sku)) {
            errors.push({
                field: 'sku',
                message: 'SKU must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores',
                value: productData.sku
            });
        }
    }

    if (productData.price !== undefined) {
        if (!ValidationUtils.isPositiveNumber(productData.price)) {
            errors.push({
                field: 'price',
                message: 'Price must be a positive number',
                value: productData.price
            });
        }
    }

    if (productData.description) {
        errors.push(...ValidationUtils.validateStringLength(productData.description, 0, 1000, 'description'));
    }

    if (productData.weight !== undefined) {
        errors.push(...ValidationUtils.validateNumberRange(productData.weight, 0, 10000, 'weight'));
    }

    if (productData.dimensions) {
        const { length, width, height } = productData.dimensions;
        if (length !== undefined) {
            errors.push(...ValidationUtils.validateNumberRange(length, 0, 1000, 'dimensions.length'));
        }
        if (width !== undefined) {
            errors.push(...ValidationUtils.validateNumberRange(width, 0, 1000, 'dimensions.width'));
        }
        if (height !== undefined) {
            errors.push(...ValidationUtils.validateNumberRange(height, 0, 1000, 'dimensions.height'));
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateInventoryUpdate(updateData: any): ValidationResult {
    const errors: ValidationError[] = [];

    if (updateData.quantity !== undefined) {
        if (!ValidationUtils.isNumeric(updateData.quantity) || updateData.quantity < 0) {
            errors.push({
                field: 'quantity',
                message: 'Quantity must be a non-negative number',
                value: updateData.quantity
            });
        }
    }

    if (updateData.location) {
        errors.push(...ValidationUtils.validateStringLength(updateData.location, 1, 50, 'location'));
    }

    if (updateData.minStockLevel !== undefined) {
        if (!ValidationUtils.isNumeric(updateData.minStockLevel) || updateData.minStockLevel < 0) {
            errors.push({
                field: 'minStockLevel',
                message: 'Minimum stock level must be a non-negative number',
                value: updateData.minStockLevel
            });
        }
    }

    if (updateData.maxStockLevel !== undefined) {
        if (!ValidationUtils.isNumeric(updateData.maxStockLevel) || updateData.maxStockLevel < 0) {
            errors.push({
                field: 'maxStockLevel',
                message: 'Maximum stock level must be a non-negative number',
                value: updateData.maxStockLevel
            });
        }
    }

    if (updateData.minStockLevel !== undefined && updateData.maxStockLevel !== undefined) {
        if (updateData.minStockLevel > updateData.maxStockLevel) {
            errors.push({
                field: 'stockLevels',
                message: 'Minimum stock level cannot be greater than maximum stock level',
                value: { min: updateData.minStockLevel, max: updateData.maxStockLevel }
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateOrderCreate(orderData: any): ValidationResult {
    const errors: ValidationError[] = [];

    errors.push(...ValidationUtils.hasRequiredFields(orderData, ['customerId', 'items', 'shippingAddress', 'paymentMethod']));

    if (orderData.items && Array.isArray(orderData.items)) {
        if (orderData.items.length === 0) {
            errors.push({
                field: 'items',
                message: 'Order must contain at least one item',
                value: orderData.items
            });
        }

        orderData.items.forEach((item: any, index: number) => {
            if (!item.productId) {
                errors.push({
                    field: `items[${index}].productId`,
                    message: 'Product ID is required for each item',
                    value: item.productId
                });
            }

            if (!ValidationUtils.isPositiveNumber(item.quantity)) {
                errors.push({
                    field: `items[${index}].quantity`,
                    message: 'Quantity must be a positive number',
                    value: item.quantity
                });
            }
        });
    }

    if (orderData.shippingAddress) {
        const address = orderData.shippingAddress;
        const requiredAddressFields = ['street', 'city', 'postalCode', 'country'];
        
        requiredAddressFields.forEach(field => {
            if (!address[field]) {
                errors.push({
                    field: `shippingAddress.${field}`,
                    message: `${field} is required in shipping address`,
                    value: address[field]
                });
            }
        });
    }

    const allowedPaymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];
    if (orderData.paymentMethod && !allowedPaymentMethods.includes(orderData.paymentMethod)) {
        errors.push({
            field: 'paymentMethod',
            message: `Invalid payment method. Allowed values: ${allowedPaymentMethods.join(', ')}`,
            value: orderData.paymentMethod
        });
    }

    const allowedShippingMethods = ['standard', 'express', 'overnight', 'pickup'];
    if (orderData.shippingMethod && !allowedShippingMethods.includes(orderData.shippingMethod)) {
        errors.push({
            field: 'shippingMethod',
            message: `Invalid shipping method. Allowed values: ${allowedShippingMethods.join(', ')}`,
            value: orderData.shippingMethod
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateOrderUpdate(updateData: any): ValidationResult {
    const errors: ValidationError[] = [];

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (updateData.status && !ValidationUtils.isValidStatus(updateData.status, allowedStatuses)) {
        errors.push({
            field: 'status',
            message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
            value: updateData.status
        });
    }

    if (updateData.trackingNumber) {
        errors.push(...ValidationUtils.validateStringLength(updateData.trackingNumber, 5, 50, 'trackingNumber'));
    }

    if (updateData.notes) {
        errors.push(...ValidationUtils.validateStringLength(updateData.notes, 0, 500, 'notes'));
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}