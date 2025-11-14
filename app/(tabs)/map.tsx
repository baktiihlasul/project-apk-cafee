import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../src/components/CustomButton';
import { COLORS } from '../../src/constants/colors';

const MapScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Temukan</Text>
        <Text style={styles.title}>CoffeeCat Terdekat</Text>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={100} color={COLORS.primary} />
          <Text style={styles.mapText}>Map Placeholder</Text>
        </View>
      </View>
      
      <Link href="/cart" asChild>
        <CustomButton
          title="Pesan"
          style={styles.button}
        />
      </Link>
    </SafeAreaView>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  mapContainer: {
    width: '90%',
    height: windowHeight * 0.6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: 10,
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 20,
  }
});

export default MapScreen;