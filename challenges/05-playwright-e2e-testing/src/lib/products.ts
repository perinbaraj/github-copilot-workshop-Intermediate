// Product data for the e-commerce application
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    category: 'Electronics',
    image: '/images/headphones.jpg',
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor',
    price: 199.99,
    category: 'Electronics',
    image: '/images/smartwatch.jpg',
    inStock: true,
    rating: 4.3,
    reviews: 95
  },
  {
    id: '3',
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand for better posture',
    price: 49.99,
    category: 'Accessories',
    image: '/images/laptop-stand.jpg',
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with cherry MX switches',
    price: 149.99,
    category: 'Accessories',
    image: '/images/keyboard.jpg',
    inStock: false,
    rating: 4.6,
    reviews: 157
  },
  {
    id: '5',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and card reader',
    price: 39.99,
    category: 'Accessories',
    image: '/images/usb-hub.jpg',
    inStock: true,
    rating: 4.4,
    reviews: 89
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 59.99,
    category: 'Accessories',
    image: '/images/mouse.jpg',
    inStock: true,
    rating: 4.2,
    reviews: 76
  },
  {
    id: '7',
    name: 'Portable SSD',
    description: '1TB portable SSD with USB-C connectivity',
    price: 129.99,
    category: 'Storage',
    image: '/images/ssd.jpg',
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '8',
    name: 'Webcam HD',
    description: '1080p HD webcam with auto-focus and built-in microphone',
    price: 79.99,
    category: 'Electronics',
    image: '/images/webcam.jpg',
    inStock: false,
    rating: 4.1,
    reviews: 64
  }
];

export const categories = ['All', 'Electronics', 'Accessories', 'Storage'];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
};
