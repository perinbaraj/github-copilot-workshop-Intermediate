export interface Order {
    id: string;
    customerId: string;
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    shippingMethod: string;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sku: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export type OrderStatus = 
    | 'PENDING'
    | 'CONFIRMED' 
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export type PaymentStatus = 
    | 'PENDING'
    | 'AUTHORIZED'
    | 'CAPTURED'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED';

export interface OrderCreateRequest {
    customerId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod: string;
    shippingMethod: string;
    notes?: string;
}

export interface OrderUpdateRequest {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    notes?: string;
}