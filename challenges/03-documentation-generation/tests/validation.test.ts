import { ValidationUtils } from '../src/utils/validation';

describe('ValidationUtils', () => {
    describe('isEmail', () => {
        it('should validate correct email addresses', () => {
            expect(ValidationUtils.isEmail('test@example.com')).toBe(true);
            expect(ValidationUtils.isEmail('user.name@domain.co.uk')).toBe(true);
            expect(ValidationUtils.isEmail('user+tag@example.org')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(ValidationUtils.isEmail('invalid-email')).toBe(false);
            expect(ValidationUtils.isEmail('test@')).toBe(false);
            expect(ValidationUtils.isEmail('@domain.com')).toBe(false);
            expect(ValidationUtils.isEmail('')).toBe(false);
        });
    });

    describe('isPhoneNumber', () => {
        it('should validate correct phone numbers', () => {
            expect(ValidationUtils.isPhoneNumber('1234567890')).toBe(true);
            expect(ValidationUtils.isPhoneNumber('+1-234-567-8900')).toBe(true);
            expect(ValidationUtils.isPhoneNumber('(123) 456-7890')).toBe(true);
        });

        it('should reject invalid phone numbers', () => {
            expect(ValidationUtils.isPhoneNumber('123')).toBe(false);
            expect(ValidationUtils.isPhoneNumber('abc123')).toBe(false);
            expect(ValidationUtils.isPhoneNumber('')).toBe(false);
        });
    });

    describe('isNumeric', () => {
        it('should validate numeric values', () => {
            expect(ValidationUtils.isNumeric(123)).toBe(true);
            expect(ValidationUtils.isNumeric('123')).toBe(true);
            expect(ValidationUtils.isNumeric(12.34)).toBe(true);
            expect(ValidationUtils.isNumeric('12.34')).toBe(true);
        });

        it('should reject non-numeric values', () => {
            expect(ValidationUtils.isNumeric('abc')).toBe(false);
            expect(ValidationUtils.isNumeric('')).toBe(false);
            expect(ValidationUtils.isNumeric(null)).toBe(false);
            expect(ValidationUtils.isNumeric(undefined)).toBe(false);
        });
    });

    describe('isPositiveNumber', () => {
        it('should validate positive numbers', () => {
            expect(ValidationUtils.isPositiveNumber(1)).toBe(true);
            expect(ValidationUtils.isPositiveNumber(0.1)).toBe(true);
            expect(ValidationUtils.isPositiveNumber('100')).toBe(true);
        });

        it('should reject non-positive numbers', () => {
            expect(ValidationUtils.isPositiveNumber(0)).toBe(false);
            expect(ValidationUtils.isPositiveNumber(-1)).toBe(false);
            expect(ValidationUtils.isPositiveNumber('abc')).toBe(false);
        });
    });

    describe('isValidSku', () => {
        it('should validate correct SKU formats', () => {
            expect(ValidationUtils.isValidSku('ABC123')).toBe(true);
            expect(ValidationUtils.isValidSku('PROD-001')).toBe(true);
            expect(ValidationUtils.isValidSku('TEST_SKU_123')).toBe(true);
        });

        it('should reject invalid SKU formats', () => {
            expect(ValidationUtils.isValidSku('ab')).toBe(false);
            expect(ValidationUtils.isValidSku('toolongskuthatexceedstwentycharacters')).toBe(false);
            expect(ValidationUtils.isValidSku('invalid@sku')).toBe(false);
            expect(ValidationUtils.isValidSku('lowercase')).toBe(false);
        });
    });

    describe('hasRequiredFields', () => {
        it('should return no errors when all required fields are present', () => {
            const obj = {
                name: 'Test Product',
                sku: 'TEST-001',
                price: 99.99
            };
            
            const errors = ValidationUtils.hasRequiredFields(obj, ['name', 'sku', 'price']);
            expect(errors).toHaveLength(0);
        });

        it('should return errors for missing required fields', () => {
            const obj = {
                name: 'Test Product'
            };
            
            const errors = ValidationUtils.hasRequiredFields(obj, ['name', 'sku', 'price']);
            expect(errors).toHaveLength(2);
            expect(errors[0].field).toBe('sku');
            expect(errors[1].field).toBe('price');
        });

        it('should treat empty strings as missing', () => {
            const obj = {
                name: '',
                sku: null,
                price: undefined
            };
            
            const errors = ValidationUtils.hasRequiredFields(obj, ['name', 'sku', 'price']);
            expect(errors).toHaveLength(3);
        });
    });

    describe('validateStringLength', () => {
        it('should pass validation for valid string lengths', () => {
            const errors = ValidationUtils.validateStringLength('test', 2, 10, 'name');
            expect(errors).toHaveLength(0);
        });

        it('should return error for string too short', () => {
            const errors = ValidationUtils.validateStringLength('a', 2, 10, 'name');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('at least 2 characters');
        });

        it('should return error for string too long', () => {
            const errors = ValidationUtils.validateStringLength('verylongstring', 2, 5, 'name');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('not exceed 5 characters');
        });

        it('should return error for non-string values', () => {
            const errors = ValidationUtils.validateStringLength(123 as any, 2, 10, 'name');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('must be a string');
        });
    });

    describe('validateNumberRange', () => {
        it('should pass validation for numbers within range', () => {
            const errors = ValidationUtils.validateNumberRange(5, 1, 10, 'quantity');
            expect(errors).toHaveLength(0);
        });

        it('should return error for number below minimum', () => {
            const errors = ValidationUtils.validateNumberRange(0, 1, 10, 'quantity');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('at least 1');
        });

        it('should return error for number above maximum', () => {
            const errors = ValidationUtils.validateNumberRange(15, 1, 10, 'quantity');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('not exceed 10');
        });

        it('should return error for non-numeric values', () => {
            const errors = ValidationUtils.validateNumberRange('abc' as any, 1, 10, 'quantity');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('must be a valid number');
        });
    });
});