import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { useCart } from '../../src/context/CartContext';
import CustomButton from '../../src/components/CustomButton';

const API_BASE_URL = 'https://690aa9b41a446bb9cc234abf.mockapi.io/api/v1/coffee';

interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<CoffeeItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/${id}`);
          const data: CoffeeItem = await response.json();
          setProduct(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); 
      alert(`${product.name} telah ditambahkan ke keranjang!`);
      router.push('/cart');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }

  if (!product) {
    return <Text>Produk tidak ditemukan.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
        
        <CustomButton 
          title="Tambah ke Keranjang" 
          onPress={handleAddToCart}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
  }
});

export default ProductDetailScreen;