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
import { COLORS } from '../../src/constants/colors';

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

  const renderBestsellerItem = ({ item }: { item: CoffeeItem }) => (
    <TouchableOpacity
      style={styles.bestsellerCard}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.image }} style={styles.bestsellerImage} />
      <Text style={styles.bestsellerName}>{item.name}</Text>
      <Text style={styles.bestsellerPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
    </TouchableOpacity>
  );

  const renderCoffeeItem = ({ item }: { item: CoffeeItem }) => (
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
  );

  

  return (
    <SafeAreaView style={styles.container}>
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

      <FlatList
        data={filteredMenu}
        renderItem={renderCoffeeItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text style={styles.listHeader}>Menu</Text>}
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
    paddingTop: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.white,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: COLORS.white,
    fontSize: 16,
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.lightGray,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row', 
  },
  menuItemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  menuItemText: {
    flex: 1, 
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  menuItemDesc: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginTop: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 8,
  },
  bestsellerContainer: {
    marginBottom: 15,
  },
  bestsellerList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  bestsellerCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 15,
    width: 150,
    marginRight: 15,
  },
  bestsellerImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  bestsellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bestsellerPrice: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
});

export default HomeScreen;