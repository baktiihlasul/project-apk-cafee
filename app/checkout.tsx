import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CustomButton from '../src/components/CustomButton';
import CustomTextInput from '../src/components/CustomTextInput';
import { COLORS } from '../src/constants/colors';
import { useCart } from '../src/context/CartContext';
import { fontSize, moderateScale, spacing } from '../src/utils/responsive';

const CheckoutScreen: React.FC = () => {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total: string }>();
  const totalAmount = total ? parseFloat(total) : 0;

  const { clearCart, cartItems } = useCart();

  const [nama, setNama] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [noTelp, setNoTelp] = useState<string>('');

  const handleBayar = async () => {
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

      <Animated.View 
        style={styles.formContainer}
        entering={FadeInDown.delay(100).springify()}
      >
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
      </Animated.View>
      
      <Animated.View 
        style={styles.totalContainer}
        entering={FadeInDown.delay(300).springify()}
      >
        <Text style={styles.totalText}>Total Bayar:</Text>
        <Text style={styles.totalAmount}>Rp. {totalAmount.toLocaleString('id-ID')}</Text>
      </Animated.View>
      
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
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    width: '100%',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: spacing.sm,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  input: {
    backgroundColor: COLORS.secondary,
    width: '100%',
    color: COLORS.white,
    marginBottom: spacing.md,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: spacing.md,
    marginHorizontal: '5%',
    padding: spacing.md,
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(10),
  },
  totalText: {
    color: COLORS.white,
    fontSize: fontSize.base,
  },
  totalAmount: {
    color: COLORS.primary,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  button: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
  }
});


export default CheckoutScreen;