import React, { createContext, useContext, useState } from 'react';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

interface AdminContextType {
  orders: Order[];
  customers: Customer[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: '2025-10-08',
    total: 299.97,
    status: 'delivered',
    items: [
      { productId: 1, productName: 'Polo Shirt', quantity: 2, price: 99.99 },
      { productId: 2, productName: 'Casual T-Shirt', quantity: 1, price: 99.99 }
    ],
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Smith',
    customerEmail: 'sarah@example.com',
    date: '2025-10-07',
    total: 179.98,
    status: 'shipped',
    items: [
      { productId: 3, productName: 'Formal Shirt', quantity: 2, price: 89.99 }
    ],
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    date: '2025-10-06',
    total: 449.97,
    status: 'processing',
    items: [
      { productId: 1, productName: 'Polo Shirt', quantity: 3, price: 99.99 },
      { productId: 4, productName: 'Denim Jeans', quantity: 1, price: 149.99 }
    ],
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 'ORD-004',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    date: '2025-10-05',
    total: 199.98,
    status: 'pending',
    items: [
      { productId: 5, productName: 'Sneakers', quantity: 1, price: 199.98 }
    ],
    shippingAddress: '321 Elm St, Houston, TX 77001'
  },
  {
    id: 'ORD-005',
    customerName: 'David Wilson',
    customerEmail: 'david@example.com',
    date: '2025-10-04',
    total: 329.97,
    status: 'delivered',
    items: [
      { productId: 2, productName: 'Casual T-Shirt', quantity: 3, price: 99.99 }
    ],
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001'
  },
  {
    id: 'ORD-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa@example.com',
    date: '2025-10-03',
    total: 249.98,
    status: 'shipped',
    items: [
      { productId: 6, productName: 'Summer Dress', quantity: 2, price: 124.99 }
    ],
    shippingAddress: '987 Cedar Ln, Philadelphia, PA 19101'
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 1899.88,
    status: 'active'
  },
  {
    id: 'CUST-002',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 1299.92,
    status: 'active'
  },
  {
    id: 'CUST-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2024-03-10',
    totalOrders: 15,
    totalSpent: 2499.85,
    status: 'active'
  },
  {
    id: 'CUST-004',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2024-04-05',
    totalOrders: 5,
    totalSpent: 799.95,
    status: 'active'
  },
  {
    id: 'CUST-005',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+1 (555) 567-8901',
    joinDate: '2024-05-12',
    totalOrders: 20,
    totalSpent: 3299.80,
    status: 'active'
  },
  {
    id: 'CUST-006',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    phone: '+1 (555) 678-9012',
    joinDate: '2023-12-01',
    totalOrders: 3,
    totalSpent: 449.97,
    status: 'inactive'
  }
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers] = useState<Customer[]>(initialCustomers);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  return (
    <AdminContext.Provider value={{ orders, customers, updateOrderStatus, addOrder }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
