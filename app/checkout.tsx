import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInput from '../src/components/CustomTextInput';
import CustomButton from '../src/components/CustomButton';
import { COLORS } from '../src/constants/colors';
import { useCart } from '../src/context/CartContext';

const CheckoutScreen: React.FC = () => {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();
  const totalAmount = total ? parseFloat(total) : 0;

  const { clearCart } = useCart();

  const [nama, setNama] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [noTelp, setNoTelp] = useState<string>('');

  const handleBayar = () => {
    if (!nama || !alamat || !noTelp) {
      Alert.alert('Data Tidak Lengkap', 'Harap isi semua field.');
      return;
    }

    console.log('Data Checkout:', { nama, alamat, noTelp, total: totalAmount });
    Alert.alert(
      'Pesanan Diproses!',
      `Pesanan Anda atas nama ${nama} sedang disiapkan.`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.replace('/(tabs)/home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <CustomTextInput
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
        style={styles.input}
      />
      <CustomTextInput
        placeholder="Alamat"
        value={alamat}
        onChangeText={setAlamat}
        style={styles.input}
      />
      <CustomTextInput
        placeholder="No. Telp"
        value={noTelp}
        onChangeText={setNoTelp}
        style={styles.input}
        keyboardType="phone-pad"
      />
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Bayar:</Text>
        <Text style={styles.totalAmount}>Rp. {totalAmount.toLocaleString('id-ID')}</Text>
      </View>
      
      <CustomButton
        title="Bayar Sekarang"
        onPress={handleBayar}
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    width: '90%',
    color: COLORS.black,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
  },
  totalText: {
    color: COLORS.white,
    fontSize: 16,
  },
  totalAmount: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
  }
});


export default CheckoutScreen;