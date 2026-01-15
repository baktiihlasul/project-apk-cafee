import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    Layout
} from 'react-native-reanimated';
import { COLORS } from '../../src/constants/colors';
import { fontSize, moderateScale, spacing } from '../../src/utils/responsive';

interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isBestseller: boolean;
}

const API_ENDPOINT = 'https://690aa9b41a446bb9cc234abf.mockapi.io/api/v1/coffee';

const HomeScreen: React.FC = () => {
  const router = useRouter(); 
  
  const [menu, setMenu] = useState<CoffeeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Coffee', 'Non-Coffee', 'Snacks'];

  const [bestsellers, setBestsellers] = useState<CoffeeItem[]>([]);

  const fetchCoffeeMenu = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error('Gagal mengambil data');
      }
      const data: CoffeeItem[] = await response.json();
      setMenu(data);

      const filteredBestsellers = data.filter(item => item.isBestseller === true);
      setBestsellers(filteredBestsellers);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoffeeMenu();
  }, []); 

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setError(null);
    fetchCoffeeMenu();
  }, []);

  const filteredMenu = menu.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === 'All'
        ? true
        : item.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const renderBestsellerItem = ({ item, index }: { item: CoffeeItem; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.bestsellerCard}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
      >
        <Image source={{ uri: item.image }} style={styles.bestsellerImage} />
        <Text style={styles.bestsellerName}>{item.name}</Text>
        <Text style={styles.bestsellerPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCoffeeItem = ({ item, index }: { item: CoffeeItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
      >
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDesc}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header} />

      <View style={styles.promoCard}>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Buy One</Text>
          <Text style={styles.promoTitle}>Get One Free</Text>
        </View>
        <Image source={require('../../assets/images/coffee_art.png')} style={styles.promoImage} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kopi..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          keyExtractor={(c) => c}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item: c }) => {
            const selected = c === selectedCategory;
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSelectedCategory(c)}
                style={[styles.categoryPill, selected && styles.categoryPillSelected]}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.bestsellerContainer}>
        <Text style={styles.listHeader}>Recommended</Text>
        <FlatList
          data={bestsellers}
          renderItem={renderBestsellerItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bestsellerList}
        />
      </View>

      <Text style={styles.listHeader}>Menu</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredMenu}
        renderItem={renderCoffeeItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.loadingText}>
              {searchQuery ? 'Kopi tidak ditemukan' : 'Menu kosong'}
            </Text>
          </View>
        }
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: COLORS.white,
    fontSize: fontSize.base,
  },
  errorText: {
    color: 'red',
    fontSize: fontSize.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(20),
    marginHorizontal: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  promoImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(25),
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: moderateScale(50),
    color: COLORS.white,
    fontSize: fontSize.base,
  },
  categoryContainer: {
    paddingVertical: spacing.sm,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(20),
    marginRight: spacing.sm,
    backgroundColor: 'transparent',
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.lightGray,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  listHeader: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  menuItem: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(15),
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row', 
  },
  menuItemImage: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(10),
    marginRight: spacing.md,
  },
  menuItemText: {
    flex: 1, 
  },
  menuItemName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  menuItemDesc: {
    fontSize: fontSize.md,
    color: COLORS.lightGray,
    marginTop: spacing.xs,
  },
  menuItemPrice: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: spacing.sm,
  },
  bestsellerContainer: {
    marginBottom: spacing.md,
  },
  bestsellerList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  bestsellerCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: moderateScale(15),
    padding: spacing.md,
    width: moderateScale(150),
    marginRight: spacing.md,
  },
  bestsellerImage: {
    width: '100%',
    height: moderateScale(100),
    borderRadius: moderateScale(10),
    marginBottom: spacing.sm,
  },
  bestsellerName: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bestsellerPrice: {
    fontSize: fontSize.md,
    color: COLORS.primary,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;