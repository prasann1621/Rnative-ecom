import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { handleGuestLogin } = route.params || {};

  const onLoginPress = () => {
    console.log("Navigating to GettingStartedScreen");
    navigation.navigate('GettingStartedScreen');
  };

  const onGuestPress = () => {
    console.log("Handling guest login");
    if (handleGuestLogin) {
      handleGuestLogin();
    } else {
      console.error("handleGuestLogin function is not defined");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Our App</Text>
      <Text style={styles.subHeader}>Please login or continue as a guest.</Text>
      <TouchableOpacity style={styles.button} onPress={onLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.guestButton]} onPress={onGuestPress}>
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: '#6c757d',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
