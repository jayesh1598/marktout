export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  category: string;
  description?: string;
  inStock?: boolean;
  colors?: string[];
  sizes?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1708363390847-b4af54f45273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjB3b21lbnxlbnwxfHx8fDE3NTk5MzkyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Women's Fashion Blazer",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 124,
    category: "Women's Fashion",
    description: "Elegant and professional blazer perfect for office wear or special occasions. Made with premium materials for comfort and durability.",
    inStock: true,
    colors: ['Black', 'Navy', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTg0MDM4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luxury Perfume Collection",
    price: 149.99,
    originalPrice: 199.99,
    rating: 5,
    reviews: 89,
    category: "Beauty & Care",
    description: "Exquisite fragrance with long-lasting scent. A perfect blend of floral and woody notes.",
    inStock: true
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5OTMwNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Beauty Cosmetics Set",
    price: 79.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 156,
    category: "Beauty & Care",
    description: "Complete makeup set with everything you need for a flawless look. High-quality, cruelty-free products.",
    inStock: true
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1696654149334-aa3703479bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaGFpciUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTk5MDE4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Designer Chair",
    price: 299.99,
    originalPrice: 449.99,
    rating: 4.7,
    reviews: 67,
    category: "Furniture",
    description: "Contemporary design meets comfort. Perfect for home office or living room. Ergonomic support for long hours.",
    inStock: true,
    colors: ['Beige', 'Gray', 'Black']
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NTk4NjcyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luxury Wrist Watch",
    price: 399.99,
    originalPrice: 599.99,
    rating: 4.9,
    reviews: 201,
    category: "Accessories",
    description: "Premium timepiece with precision movement. Water-resistant and scratch-proof. Comes with 2-year warranty.",
    inStock: true,
    colors: ['Silver', 'Gold', 'Rose Gold']
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1751522937993-46b83342398b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kYmFnJTIwcHVyc2V8ZW58MXx8fHwxNzU5ODk4MjkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Designer Handbag",
    price: 189.99,
    originalPrice: 279.99,
    rating: 4.6,
    reviews: 134,
    category: "Accessories",
    description: "Spacious and stylish handbag with multiple compartments. Genuine leather with premium hardware.",
    inStock: true,
    colors: ['Black', 'Brown', 'Burgundy']
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1623644772025-96e33bc6ea95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzU5OTM5MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Gold Necklace Set",
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 92,
    category: "Jewelry",
    description: "Elegant 18k gold-plated necklace set. Perfect for weddings and special occasions. Includes earrings.",
    inStock: true
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1465077751796-1e7f7fae5031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBpdGVtc3xlbnwxfHx8fDE3NTk5MTc4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Home Decor Items",
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.4,
    reviews: 78,
    category: "Home & Living",
    description: "Beautiful decorative pieces to enhance your living space. Handcrafted with attention to detail.",
    inStock: true
  },
  {
    id: 9,
    image: "https://images.unsplash.com/flagged/photo-1552708068-ddef64d75aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5ODQ4MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Men's Casual Jacket",
    price: 119.99,
    originalPrice: 179.99,
    rating: 4.6,
    reviews: 143,
    category: "Men's Fashion",
    description: "Versatile jacket perfect for any casual occasion. Comfortable fit with modern styling.",
    inStock: true,
    colors: ['Blue', 'Black', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc1OTkxMjkyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Premium Sneakers",
    price: 139.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 267,
    category: "Footwear",
    description: "High-performance sneakers with superior comfort. Perfect for sports and everyday wear.",
    inStock: true,
    colors: ['White', 'Black', 'Red'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1729496293008-0794382070c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NTk5MzAxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Ultra Slim Laptop",
    price: 899.99,
    originalPrice: 1199.99,
    rating: 4.8,
    reviews: 412,
    category: "Electronics",
    description: "Powerful and portable laptop with stunning display. Perfect for work and entertainment.",
    inStock: true
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzU5OTMyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Wireless Headphones",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviews: 534,
    category: "Electronics",
    description: "Premium noise-canceling headphones with exceptional sound quality. 30-hour battery life.",
    inStock: true,
    colors: ['Black', 'White', 'Silver']
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1759227922040-0ca4d3cbe42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5ODYyNjgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Designer Sunglasses",
    price: 159.99,
    originalPrice: 229.99,
    rating: 4.5,
    reviews: 98,
    category: "Accessories",
    description: "UV protection with style. Premium lenses and durable frames. Comes with protective case.",
    inStock: true
  }
];

export const categories = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1708363390847-b4af54f45273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjB3b21lbnxlbnwxfHx8fDE3NTk5MzkyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Women's Fashion",
    productCount: 1234
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1602260395251-0fe691861b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5OTMwNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Beauty & Care",
    productCount: 856
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1696654149334-aa3703479bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaGFpciUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTk5MDE4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Furniture",
    productCount: 645
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1623644772025-96e33bc6ea95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzU5OTM5MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Jewelry",
    productCount: 423
  },
  {
    id: 5,
    image: "https://images.unsplash.com/flagged/photo-1552708068-ddef64d75aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5ODQ4MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Men's Fashion",
    productCount: 1089
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1729496293008-0794382070c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NTk5MzAxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Electronics",
    productCount: 732
  }
];
