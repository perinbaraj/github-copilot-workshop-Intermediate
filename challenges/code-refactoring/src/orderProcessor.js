/**
 * E-Commerce Order Processing System
 * WARNING: This code intentionally contains issues for refactoring practice!
 * 
 * Issues to refactor:
 * - Monolithic functions with multiple responsibilities
 * - Poor error handling
 * - Code duplication
 * - Inconsistent naming
 * - Hard to test and maintain
 */

const fs = require('fs');
const crypto = require('crypto');

// Global variables (bad practice!)
let orderCount = 0;
let totalRevenue = 0;

// Monolithic order processing function - needs refactoring!
function processOrder(orderData) {
    console.log('Processing order...');
    
    // Validation (should be extracted)
    if (!orderData) {
        console.log('Error: No order data');
        return false;
    }
    
    if (!orderData.customerId || orderData.customerId.length < 5) {
        console.log('Invalid customer ID');
        return false;
    }
    
    if (!orderData.items || orderData.items.length === 0) {
        console.log('No items in order');
        return false;
    }
    
    // Check each item (duplicated validation logic)
    for (let i = 0; i < orderData.items.length; i++) {
        if (!orderData.items[i].productId) {
            console.log('Missing product ID');
            return false;
        }
        if (!orderData.items[i].quantity || orderData.items[i].quantity <= 0) {
            console.log('Invalid quantity');
            return false;
        }
        if (!orderData.items[i].price || orderData.items[i].price <= 0) {
            console.log('Invalid price');
            return false;
        }
    }
    
    // Price calculation (should be extracted)
    let subtotal = 0;
    for (let i = 0; i < orderData.items.length; i++) {
        subtotal += orderData.items[i].price * orderData.items[i].quantity;
    }
    
    // Tax calculation (hardcoded values)
    let tax = subtotal * 0.08; // 8% tax rate
    
    // Shipping calculation (complex logic mixed in)
    let shipping = 0;
    if (subtotal < 50) {
        shipping = 9.99;
    } else if (subtotal < 100) {
        shipping = 4.99;
    }
    // Free shipping over $100
    
    // Discount calculation (should be extracted)
    let discount = 0;
    if (orderData.couponCode) {
        if (orderData.couponCode === 'SAVE10') {
            discount = subtotal * 0.1;
        } else if (orderData.couponCode === 'SAVE20') {
            discount = subtotal * 0.2;
        } else if (orderData.couponCode === 'FREESHIP') {
            shipping = 0;
        }
    }
    
    let total = subtotal + tax + shipping - discount;
    
    // Inventory check (should be extracted)
    const inventory = JSON.parse(fs.readFileSync('inventory.json', 'utf8'));
    for (let i = 0; i < orderData.items.length; i++) {
        const item = orderData.items[i];
        const product = inventory.products.find(p => p.id === item.productId);
        if (!product) {
            console.log('Product not found: ' + item.productId);
            return false;
        }
        if (product.stock < item.quantity) {
            console.log('Insufficient stock for ' + item.productId);
            return false;
        }
    }
    
    // Payment processing (should be extracted)
    if (orderData.paymentMethod === 'credit_card') {
        // Simulate credit card processing
        if (!orderData.cardNumber || orderData.cardNumber.length !== 16) {
            console.log('Invalid card number');
            return false;
        }
        if (!orderData.expiryDate || !orderData.cvv) {
            console.log('Missing card details');
            return false;
        }
        // Simulate payment gateway call
        console.log('Processing credit card payment: $' + total);
    } else if (orderData.paymentMethod === 'paypal') {
        if (!orderData.paypalEmail) {
            console.log('PayPal email required');
            return false;
        }
        console.log('Processing PayPal payment: $' + total);
    } else {
        console.log('Unsupported payment method');
        return false;
    }
    
    // Update inventory (should be extracted)
    for (let i = 0; i < orderData.items.length; i++) {
        const item = orderData.items[i];
        const product = inventory.products.find(p => p.id === item.productId);
        product.stock -= item.quantity;
    }
    fs.writeFileSync('inventory.json', JSON.stringify(inventory, null, 2));
    
    // Generate order ID (should be extracted)
    const orderId = 'ORDER-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    
    // Create order record (should be extracted)
    const order = {
        id: orderId,
        customerId: orderData.customerId,
        items: orderData.items,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        discount: discount,
        total: total,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save order (should use proper database)
    const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    orders.push(order);
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
    
    // Update global counters (bad practice!)
    orderCount++;
    totalRevenue += total;
    
    // Send confirmation email (should be extracted)
    console.log('Sending confirmation email to customer...');
    // Simulate email sending
    
    // Log analytics (should be extracted)
    console.log('Recording analytics data...');
    const analytics = {
        orderId: orderId,
        revenue: total,
        itemCount: orderData.items.length,
        timestamp: Date.now()
    };
    // Should save to analytics database
    
    console.log('Order processed successfully: ' + orderId);
    return {
        success: true,
        orderId: orderId,
        total: total
    };
}

// Another problematic function - customer validation with duplication
function validateCustomer(customerId) {
    if (!customerId) {
        console.log('Customer ID required');
        return false;
    }
    
    if (customerId.length < 5) {
        console.log('Customer ID too short');
        return false;
    }
    
    // Load customers (should be cached)
    const customers = JSON.parse(fs.readFileSync('customers.json', 'utf8'));
    
    // Linear search (inefficient)
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === customerId) {
            if (customers[i].status === 'active') {
                return true;
            } else {
                console.log('Customer account inactive');
                return false;
            }
        }
    }
    
    console.log('Customer not found');
    return false;
}

// Utility function with poor naming and no error handling
function calcShip(amt) {
    if (amt < 50) return 9.99;
    if (amt < 100) return 4.99;
    return 0;
}

// Function with multiple responsibilities
function processRefund(orderId, reason) {
    // Find order
    const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    let order = null;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
            break;
        }
    }
    
    if (!order) {
        console.log('Order not found');
        return false;
    }
    
    // Check refund eligibility (hardcoded business rules)
    const orderDate = new Date(order.createdAt);
    const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceOrder > 30) {
        console.log('Refund period expired');
        return false;
    }
    
    if (order.status === 'refunded') {
        console.log('Order already refunded');
        return false;
    }
    
    // Process refund payment
    if (order.paymentMethod === 'credit_card') {
        console.log('Processing credit card refund...');
        // Should integrate with payment gateway
    } else if (order.paymentMethod === 'paypal') {
        console.log('Processing PayPal refund...');
        // Should integrate with PayPal API
    }
    
    // Update inventory (restore stock)
    const inventory = JSON.parse(fs.readFileSync('inventory.json', 'utf8'));
    for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const product = inventory.products.find(p => p.id === item.productId);
        if (product) {
            product.stock += item.quantity;
        }
    }
    fs.writeFileSync('inventory.json', JSON.stringify(inventory, null, 2));
    
    // Update order status
    order.status = 'refunded';
    order.refundReason = reason;
    order.refundedAt = new Date().toISOString();
    
    // Save updated order
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
    
    // Update global counters
    totalRevenue -= order.total;
    
    console.log('Refund processed successfully');
    return true;
}

module.exports = {
    processOrder,
    validateCustomer,
    calcShip,
    processRefund
};