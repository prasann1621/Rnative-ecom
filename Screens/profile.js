import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route, navigation }) => {
  const { handleLogout } = route.params || {}; // Fetch handleLogout from route params if provided

  const handleLogoutPress = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
      console.log('Token removed successfully');
      
      if (handleLogout) {
        handleLogout(); // Call handleLogout function if available
      }
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'WelcomeScreen' }], // Navigate to WelcomeScreen
      });
    } catch (error) {
      console.error('Logout failed:', error); // Log error to the console
      Alert.alert('Error', 'Failed to log out. Please try again.'); // Display an error alert
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Button title="Logout" onPress={handleLogoutPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ProfileScreen;
