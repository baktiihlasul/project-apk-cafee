import React from 'react'; // Hapus 'useState' jika tidak dipakai lagi
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import CustomButton from '../src/components/CustomButton';
import { useCart } from '../src/context/CartContext';


const CartScreen: React.FC = () => {
  const router = useRouter();
  
  const { cartItems, updateQuantity } = useCart();


  const calculateTotal = (): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const renderItem: ListRenderItem<typeof cartItems[0]> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCheckout = () => {
    const total = calculateTotal();
    router.push({
      pathname: '/checkout',
      params: { total: total },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chart</Text>
      </View>
      
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Keranjang Anda kosong</Text>}
      />
      
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>Rp. {calculateTotal().toLocaleString('id-ID')}</Text>
      </View>
      
      <CustomButton
        title="Checkout"
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  itemQuantity: { marginHorizontal: 10, fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  totalText: { fontSize: 18 },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  }
});

export default CartScreen;