import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CoffeeItem {
  id: string;
  name: string;
  price: number;
  image: string;
}
interface CartItem extends CoffeeItem {
  quantity: number;
}
interface ICartContext {
  cartItems: CartItem[];
  addToCart: (item: CoffeeItem) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  isLoading: boolean; 
}

const CartContext = createContext<ICartContext | undefined>(undefined);

const CART_STORAGE_KEY = 'KopiKU_Cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const cartDataString = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartDataString) {
          setCartItems(JSON.parse(cartDataString));
        }
      } catch (e) {
        console.error("Gagal memuat keranjang dari storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    const saveCartToStorage = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (e) {
          console.error("Gagal menyimpan keranjang ke storage", e);
        }
      }
    };
    
    saveCartToStorage();
  }, [cartItems, isLoading]);

  const addToCart = (item: CoffeeItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(0, item.quantity + amount) };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};