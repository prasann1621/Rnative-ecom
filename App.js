import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screen components here
import HomeScreen from './Screens/Home';
import CartScreen from './Screens/cartscreen';
import WelcomeScreen from './Screens/welcome';
import ProductScreen from './Screens/product';
import ProfileScreen from './Screens/profile';
import GettingStartedScreen from './Screens/Gettingstarted';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const ProductStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} />
  </Stack.Navigator>
);

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const navigationRef = useRef();

    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    useEffect(() => {
      checkLoginStatus();
    }, []);

    const handleGuestLogin = () => {
      setIsLoggedIn(false);
      setIsGuest(true);
    };

    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userDetails');
        await AsyncStorage.setItem('isLoggedIn', 'false');
        setIsLoggedIn(false);
        setIsGuest(false);
        console.log('User logged out successfully');
        // Navigate to WelcomeScreen
        navigationRef.current?.navigate('Auth', { screen: 'Welcome' });
      } catch (error) {
        console.error('Logout failed:', error.message);
      }
    };

    const HomeTabs = () => (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'HomeScreen':
                iconName = 'home';
                break;
              case 'Cart':
                iconName = 'cart';
                break;
              case 'Profile':
                iconName = 'person';
                break;
              default:
                iconName = 'home';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeScreen" component={ProductStack} />
        <Tab.Screen 
          name="Cart" 
          component={CartScreen}
          initialParams={{ handleLogout: handleLogout }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          initialParams={{ handleLogout: handleLogout }} 
        />
      </Tab.Navigator>
    );

    const AuthStack = () => (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            initialParams={{ handleGuestLogin }}
            listeners={{
              focus: () => {
                checkLoginStatus();
              },
            }}
          />
          <Stack.Screen name="GettingStartedScreen" component={GettingStartedScreen} />
        </Stack.Navigator>
      );
    return (
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn || isGuest ? (
            <RootStack.Screen name="HomeTabs" component={HomeTabs} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthStack} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    );
};

export default App;