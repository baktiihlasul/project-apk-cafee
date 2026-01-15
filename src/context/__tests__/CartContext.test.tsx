import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { CartProvider, useCart } from '../CartContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCoffeeItem = {
    id: '1',
    name: 'Espresso',
    price: 25000,
    image: 'https://example.com/espresso.jpg',
  };

  const mockCoffeeItem2 = {
    id: '2',
    name: 'Latte',
    price: 30000,
    image: 'https://example.com/latte.jpg',
  };

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual({
        ...mockCoffeeItem,
        quantity: 1,
      });
    });

    it('should increase quantity if item already exists', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.addToCart(mockCoffeeItem);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('should add multiple different items', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.addToCart(mockCoffeeItem2);
      });

      expect(result.current.cartItems).toHaveLength(2);
      expect(result.current.cartItems[0].id).toBe('1');
      expect(result.current.cartItems[1].id).toBe('2');
    });

    it('should save to AsyncStorage after adding item', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'KopiKU_Cart',
          expect.any(String)
        );
      });
    });
  });

  describe('updateQuantity', () => {
    it('should increase quantity', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.updateQuantity('1', 2);
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('should decrease quantity', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.addToCart(mockCoffeeItem);
        result.current.updateQuantity('1', -1);
      });

      expect(result.current.cartItems[0].quantity).toBe(1);
    });

    it('should remove item when quantity becomes 0', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.updateQuantity('1', -1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('should not go below 0 quantity', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.updateQuantity('1', -5);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addToCart(mockCoffeeItem);
        result.current.addToCart(mockCoffeeItem2);
      });

      expect(result.current.cartItems).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('initialization', () => {
    it('should load cart from AsyncStorage on mount', async () => {
      const mockCart = [
        { ...mockCoffeeItem, quantity: 2 },
        { ...mockCoffeeItem2, quantity: 1 },
      ];
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCart)
      );

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cartItems).toEqual(mockCart);
    });

    it('should handle empty cart in AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cartItems).toEqual([]);
    });

    it('should handle AsyncStorage error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cartItems).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
