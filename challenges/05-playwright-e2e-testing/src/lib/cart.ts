// Cart management utilities
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
}

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const applyDiscount = (total: number, code: string): number => {
  const discounts: Record<string, number> = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'WELCOME': 0.15
  };
  
  const discountRate = discounts[code.toUpperCase()] || 0;
  return total * discountRate;
};

export const validateDiscountCode = (code: string): boolean => {
  const validCodes = ['SAVE10', 'SAVE20', 'WELCOME'];
  return validCodes.includes(code.toUpperCase());
};
