import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Animated, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_URL = 'https://fakestoreapi.com/auth/login';

const GettingStartedScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Animation values
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        // Slide up effect
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = async () => {
        if (!username || !password) {
          Alert.alert('Error', 'Please enter both username and password.');
          return;
        }
      
        try {
          const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Login response error data:', errorData);
            throw new Error(errorData.message || `Login failed! HTTP status: ${response.status}`);
          }
      
          const json = await response.json();
          await AsyncStorage.setItem('token', json.token);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          console.log('Login successful');
      
          // Notify App component about the login
          navigation.navigate('Auth', { screen: 'Welcome', params: { triggerReload: true } });
        } catch (error) {
          console.error('Authentication failed:', error.message);
          Alert.alert('Error', error.message || 'An unexpected error occurred');
        }
    };

    return (
        <ImageBackground source={require('../assets/backgorund.jpg')} style={styles.background}>
            <Animated.View style={{ ...styles.container, transform: [{ translateY: slideAnim }] }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        placeholderTextColor="#ccc"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'repeat', // Repeat the background image
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for the form
        borderRadius: 10,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GettingStartedScreen;
