import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import CustomTextInput from '../../src/components/CustomTextInput';
import CustomButton from '../../src/components/CustomButton';
import { COLORS } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';
import { Link } from 'expo-router';

const LoginScreen: React.FC = () => {
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState<string>('user@gmail.com');
  const [password, setPassword] = useState<string>('password');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login Gagal', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CoffeeCat</Text>
      
      <CustomTextInput
        placeholder="Email (cth: user@gmail.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomTextInput
        placeholder="Password (cth: password)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <CustomButton 
        title={isLoading ? "Loading..." : "Login"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
      
      <Link href="/" asChild>
        <Text style={styles.registerText}>Belum punya akun? Kembali</Text>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 40,
  },
  registerText: {
    marginTop: 20,
    color: COLORS.primary,
  }
});

export default LoginScreen;