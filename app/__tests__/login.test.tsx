import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import LoginScreen from '../(auth)/login';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(() => []),
  Link: ({ children }: { children: React.ReactNode }) => children,
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

describe('LoginScreen Integration Test', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    expect(getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(getByPlaceholderText(/Password/i)).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('CoffeeCat')).toBeTruthy();
  });

  it('should handle successful login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailInput = getByPlaceholderText(/Email/i);
    const passwordInput = getByPlaceholderText(/Password/i);
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'user@gmail.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Loading...')).toBeTruthy();
    }, { timeout: 100 });
  });

  it('should show error on failed login', async () => {
    const Alert = require('react-native/Libraries/Alert/Alert');
    
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailInput = getByPlaceholderText(/Email/i);
    const passwordInput = getByPlaceholderText(/Password/i);
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'wrong@email.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Gagal',
        expect.any(String)
      );
    });
  });

  it('should have pre-filled credentials', () => {
    const { getByDisplayValue } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    expect(getByDisplayValue('user@gmail.com')).toBeTruthy();
    expect(getByDisplayValue('password')).toBeTruthy();
  });
});
