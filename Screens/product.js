import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, Animated, TouchableOpacity, ScrollView } from 'react-native';

const ProductScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProduct(data);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Error', 'Unable to fetch product details. Please try again later.');
      }
    };

    fetchProductDetails();
  }, [productId, fadeAnim]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        const response = await fetch('https://fakestoreapi.com/carts', {
          method: 'POST',
          body: JSON.stringify({
            userId: 1, // Replace with actual user ID
            date: new Date().toISOString(),
            products: [{ productId: product.id, quantity }]
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newCart = await response.json();
        console.log('Cart added:', newCart);
        Alert.alert('Success', 'Product added to cart');
        navigation.navigate('Cart'); // Navigate to CartScreen
      } catch (error) {
        console.error('Error adding product to cart:', error);
        Alert.alert('Error', 'Unable to add product to cart. Please try again later.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {product ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Button title="Add to Cart" onPress={handleAddToCart} />
        </Animated.View>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    color: '#e63946',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 8,
    color: '#333',
  },
  quantityButton: {
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  loading: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductScreen;
