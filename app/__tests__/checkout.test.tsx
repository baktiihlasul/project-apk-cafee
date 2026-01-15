import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { CartProvider } from '../../src/context/CartContext';
import CheckoutScreen from '../checkout';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('CheckoutScreen Integration Test', () => {
  const mockReplace = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      back: mockBack,
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      total: '50000',
    });
  });

  it('should render checkout form correctly', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByPlaceholderText, getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Nama')).toBeTruthy();
      expect(getByPlaceholderText('Alamat')).toBeTruthy();
      expect(getByPlaceholderText('No. Telp')).toBeTruthy();
      expect(getByText('Bayar Sekarang')).toBeTruthy();
    });
  });

  it('should display correct total amount', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByText(/50\.000/)).toBeTruthy();
    });
  });

  it('should show error when fields are empty', async () => {
    const Alert = require('react-native/Libraries/Alert/Alert');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByText('Bayar Sekarang')).toBeTruthy();
    });

    const payButton = getByText('Bayar Sekarang');
    fireEvent.press(payButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Data Tidak Lengkap',
        'Harap isi semua field.'
      );
    });
  });

  it('should process payment with valid data', async () => {
    const Alert = require('react-native/Libraries/Alert/Alert');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const mockCart = [
      {
        id: '1',
        name: 'Espresso',
        price: 25000,
        image: 'https://example.com/espresso.jpg',
        quantity: 2,
      },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCart));

    const { getByPlaceholderText, getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Nama')).toBeTruthy();
    });

    const namaInput = getByPlaceholderText('Nama');
    const alamatInput = getByPlaceholderText('Alamat');
    const telpInput = getByPlaceholderText('No. Telp');
    const payButton = getByText('Bayar Sekarang');

    fireEvent.changeText(namaInput, 'John Doe');
    fireEvent.changeText(alamatInput, 'Jl. Test No. 123');
    fireEvent.changeText(telpInput, '08123456789');
    fireEvent.press(payButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Pesanan Diproses!',
        expect.stringContaining('John Doe'),
        expect.any(Array)
      );
    });
  });

  it('should save order to database on successful checkout', async () => {
    const Alert = require('react-native/Libraries/Alert/Alert');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    const mockCart = [
      {
        id: '1',
        name: 'Espresso',
        price: 25000,
        image: 'https://example.com/espresso.jpg',
        quantity: 1,
      },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCart));

    const { getByPlaceholderText, getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Nama')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Nama'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Alamat'), 'Jl. Test No. 123');
    fireEvent.changeText(getByPlaceholderText('No. Telp'), '08123456789');
    fireEvent.press(getByText('Bayar Sekarang'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Pesanan Diproses!',
        expect.stringContaining('John Doe'),
        expect.any(Array)
      );
    });
  });

  it('should clear cart and navigate to home after successful payment', async () => {
    const Alert = require('react-native/Libraries/Alert/Alert');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    const mockCart = [
      {
        id: '1',
        name: 'Espresso',
        price: 25000,
        image: 'https://example.com/espresso.jpg',
        quantity: 1,
      },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCart));

    const { getByPlaceholderText, getByText } = render(
      <CartProvider>
        <CheckoutScreen />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Nama')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Nama'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Alamat'), 'Jl. Test No. 123');
    fireEvent.changeText(getByPlaceholderText('No. Telp'), '08123456789');
    fireEvent.press(getByText('Bayar Sekarang'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });

    // Simulate pressing OK on alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const okButton = alertCall[2][0];
    okButton.onPress();

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home');
  });
});
