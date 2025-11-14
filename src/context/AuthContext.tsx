import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface IUser {
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'KopiKU_Auth';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const authDataString = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (authDataString) {
          setUser(JSON.parse(authDataString));
        }
      } catch (e) {
        console.error("Gagal memuat data auth", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthData();
  }, []);

  // Fungsi Login
  const login = async (email: string, pass: string) => {
    
    if (email === 'user@gmail.com' && pass === 'password') {
      const fakeUser: IUser = { name: 'Bakti', email: 'user@gmail.com' };
      setUser(fakeUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fakeUser));
    } else {
      throw new Error('Email atau Password Salah');
    }
  };

  // Fungsi Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Hook Kustom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};