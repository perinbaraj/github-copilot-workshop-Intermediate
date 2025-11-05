/**
 * Demo script to test the order processing system
 * Run with: npm start
 */

const { processOrder, validateCustomer, processRefund } = require('./orderProcessor');

console.log('🛒 E-Commerce Order Processing Demo');
console.log('=====================================\n');

// Sample order data for testing
const sampleOrder = {
    customerId: 'CUST12345',
    items: [
        {
            productId: 'PROD001',
            quantity: 2,
            price: 29.99
        },
        {
            productId: 'PROD002', 
            quantity: 1,
            price: 89.99
        }
    ],
    paymentMethod: 'credit_card',
    cardNumber: '1234567890123456',
    expiryDate: '12/25',
    cvv: '123',
    couponCode: 'SAVE10'
};

console.log('📦 Processing sample order...');
console.log('Order data:', JSON.stringify(sampleOrder, null, 2));
console.log('\n--- Processing Order ---');

try {
    const result = processOrder(sampleOrder);
    
    if (result && result.success) {
        console.log('\n✅ Order processed successfully!');
        console.log(`Order ID: ${result.orderId}`);
        console.log(`Total: $${result.total.toFixed(2)}`);
    } else {
        console.log('\n❌ Order processing failed');
    }
} catch (error) {
    console.error('\n💥 Error occurred:', error.message);
}

console.log('\n--- Testing Customer Validation ---');
console.log('Validating customer ID: CUST12345');
const isValidCustomer = validateCustomer('CUST12345');
console.log('Customer valid:', isValidCustomer);

console.log('\n--- Demo Complete ---');
console.log('💡 This code needs refactoring! Use GitHub Copilot to improve it.');
console.log('🎯 Focus areas: error handling, function decomposition, design patterns');