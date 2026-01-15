import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import CustomButton from '../src/components/CustomButton';
import { COLORS } from '../src/constants/colors';
import { useCart } from '../src/context/CartContext';
import { fontSize, moderateScale, spacing } from '../src/utils/responsive';


const CartScreen: React.FC = () => {
  const router = useRouter();
  
  const { cartItems, updateQuantity } = useCart();


  const calculateTotal = (): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const renderItem: ListRenderItem<typeof cartItems[0]> = ({ item, index }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      layout={Layout.springify()}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove-circle" size={moderateScale(28)} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add-circle" size={moderateScale(28)} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
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
  container: { 
    flex: 1, 
    backgroundColor: COLORS.backgroundDark, 
    paddingTop: spacing.xl 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.md 
  },
  headerTitle: { 
    fontSize: fontSize.xl, 
    fontWeight: 'bold', 
    marginLeft: spacing.sm,
    color: COLORS.white
  },
  itemContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: spacing.md, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.secondary,
    backgroundColor: COLORS.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: moderateScale(12)
  },
  itemImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(10),
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: { 
    fontSize: fontSize.base, 
    fontWeight: 'bold',
    color: COLORS.white 
  },
  itemPrice: {
    fontSize: fontSize.sm,
    color: COLORS.lightGray,
    marginTop: spacing.xs
  },
  quantityControl: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  itemQuantity: { 
    marginHorizontal: spacing.md, 
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: spacing.md, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.secondary,
    marginTop: spacing.sm
  },
  totalText: { 
    fontSize: fontSize.lg,
    color: COLORS.white 
  },
  totalAmount: { 
    fontSize: fontSize.xl, 
    fontWeight: 'bold',
    color: COLORS.primary 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: fontSize.base,
    color: COLORS.lightGray,
  }
});

export default CartScreen;