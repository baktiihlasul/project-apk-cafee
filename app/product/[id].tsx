import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import CustomButton from '../../src/components/CustomButton';
import { COLORS } from '../../src/constants/colors';
import { useCart } from '../../src/context/CartContext';
import { fontSize, moderateScale, spacing } from '../../src/utils/responsive';

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
      <Animated.View entering={FadeIn.duration(300)}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        style={styles.detailsContainer}
        entering={SlideInDown.delay(200).springify()}
      >
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Animated.Text 
          style={styles.price}
          entering={FadeInUp.delay(400)}
        >
          Rp {product.price.toLocaleString('id-ID')}
        </Animated.Text>
        
        <CustomButton 
          title="Tambah ke Keranjang" 
          onPress={handleAddToCart}
          style={styles.button}
        />
      </Animated.View>
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
    height: moderateScale(300),
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: moderateScale(20),
    padding: spacing.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: moderateScale(20),
    padding: spacing.sm,
  },
  detailsContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  name: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.base,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
  }
});

export default ProductDetailScreen;