import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(() => []),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await act(async () => {
        await result.current.login('user@gmail.com', 'password');
      });

      expect(result.current.user).toEqual({
        name: 'Bakti',
        email: 'user@gmail.com',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'KopiKU_Auth',
        JSON.stringify({ name: 'Bakti', email: 'user@gmail.com' })
      );
    });

    it('should throw error with incorrect credentials', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await expect(
        act(async () => {
          await result.current.login('wrong@email.com', 'wrongpassword');
        })
      ).rejects.toThrow('Email atau Password Salah');

      expect(result.current.user).toBeNull();
    });

    it('should throw error with incorrect email', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await expect(
        act(async () => {
          await result.current.login('wrong@email.com', 'password');
        })
      ).rejects.toThrow('Email atau Password Salah');
    });

    it('should throw error with incorrect password', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await expect(
        act(async () => {
          await result.current.login('user@gmail.com', 'wrongpassword');
        })
      ).rejects.toThrow('Email atau Password Salah');
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      // First login
      await act(async () => {
        await result.current.login('user@gmail.com', 'password');
      });

      expect(result.current.user).not.toBeNull();

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('KopiKU_Auth');
    });
  });

  describe('initialization', () => {
    it('should load user from AsyncStorage on mount', async () => {
      const mockUser = { name: 'Bakti', email: 'user@gmail.com' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUser)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle null user in AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('should handle AsyncStorage error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
