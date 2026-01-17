"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  placeOrder: (userId: string) => Promise<string>;
  getUserOrders: (userId: string) => Promise<Order[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("revollution-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("revollution-cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id);
      if (existingItem) {
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Load orders from localStorage
  const loadOrders = (): Order[] => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem("revollution-orders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    return [];
  };

  // Save orders to localStorage
  const saveOrders = (orders: Order[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("revollution-orders", JSON.stringify(orders));
    }
  };

  // Place an order - This is now primarily for demo purposes
  // The actual order placement happens in the cart page via API
  const placeOrder = async (userId: string): Promise<string> => {
    // For demo purposes only - real orders go through API in cart page
    const orderId = `ORD-${Date.now()}`;
    
    // Clear the cart after 'placing' order
    clearCart();
    
    return orderId;
  };

  // Get user orders
  const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
      // First try to fetch from the API
      const response = await fetch(`/api/orders?email=${encodeURIComponent(userId)}`);
      const data = await response.json();

      if (data.success && data.data) {
        // Transform API response to our Order format
        return data.data.map((apiOrder: any) => ({
          id: apiOrder.orderNumber,
          userId: userId,
          items: apiOrder.items.map((item: any) => ({
            _id: item.productId,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
          })),
          total: apiOrder.totalAmount,
          date: apiOrder.createdAt,
          status: apiOrder.status,
        }));
      }
    } catch (error) {
      console.error('Error fetching orders from API:', error);
      // Fallback to localStorage
    }
    
    // Fallback to localStorage
    const orders = loadOrders();
    return orders.filter(order => order.userId === userId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        placeOrder,
        getUserOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
