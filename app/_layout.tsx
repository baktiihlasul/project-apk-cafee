import React, { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router'; 
import { CartProvider } from '../src/context/CartContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../src/constants/colors';

const RootLayoutNav = () => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isAuthScreen = pathname === '/' || pathname === '/login';

    if (user) {
      if (isAuthScreen) {
        router.replace('/home'); 
      }
    } else {
      if (!isAuthScreen) {
        router.replace('/');
      }
    }
    
  }, [user, isLoading, pathname, router]); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.backgroundDark }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" /> 
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="checkout" />
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          headerShown: true, 
          title: "Detail Kopi",
          headerStyle: { backgroundColor: COLORS.backgroundDark },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}