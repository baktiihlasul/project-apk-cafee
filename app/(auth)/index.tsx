import { Link } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/CustomButton';
import { COLORS } from '../../src/constants/colors';

const WelcomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fall in Love</Text>
        <Text style={styles.title}>with Coffee</Text>
        <Text style={styles.title}>in Blissful Delight</Text>
      </View>
      
      <Image
        source={require('../../assets/images/coffee_art.png')}
        style={styles.image}
      />
      
      {/* Navigasi ke rute /login */}
      <Link href="/login" asChild>
        <CustomButton title="Get Started" />
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
});

export default WelcomeScreen;