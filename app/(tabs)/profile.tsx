import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: () => {
          logout();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'Email tidak tersedia'}</Text>
      </View>

      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Riwayat Pesanan</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.optionButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    paddingTop: 40,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarLetter: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  optionButton: {
    backgroundColor: COLORS.lightGray,
    width: '90%',
    padding: 18,
    borderRadius: 30,
    marginVertical: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'red',
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
  }
});


export default ProfileScreen;