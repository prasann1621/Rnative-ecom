import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();

  // Fetch cart and product data
  const fetchCartAndProducts = async () => {
    setLoading(true);
    try {
      const cartResponse = await fetch('https://fakestoreapi.com/carts/user/1');
      if (!cartResponse.ok) throw new Error('Network response was not ok');
      const cartData = await cartResponse.json();

      const productIds = cartData.flatMap(cartItem => cartItem.products.map(p => p.productId));
      const uniqueProductIds = [...new Set(productIds)];
      const productPromises = uniqueProductIds.map(id => fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json()));
      const productResponses = await Promise.all(productPromises);

      const productDict = productResponses.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      setCart(cartData);
      setProducts(productDict);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Unable to fetch cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCartAndProducts();
    }, [])
  );

  // Handle item removal
  const handleRemoveItem = async (cartId, productId) => {
    setProcessing(true);
    try {
      const updatedCart = cart.map(cartItem => {
        if (cartItem.id === cartId) {
          return {
            ...cartItem,
            products: cartItem.products.filter(p => p.productId !== productId),
          };
        }
        return cartItem;
      });

      // Update cart on server
      await fetch(`https://fakestoreapi.com/carts/${cartId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCart.find(item => item.id === cartId)),
        headers: { 'Content-Type': 'application/json' },
      });

      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      Alert.alert('Error', 'Unable to remove item from cart. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (cartId, productId, newQuantity) => {
    if (newQuantity < 1) return;

    setProcessing(true);
    try {
      const updatedCart = cart.map(cartItem => {
        if (cartItem.id === cartId) {
          return {
            ...cartItem,
            products: cartItem.products.map(p =>
              p.productId === productId ? { ...p, quantity: newQuantity } : p
            ),
          };
        }
        return cartItem;
      });

      // Update cart on server
      await fetch(`https://fakestoreapi.com/carts/${cartId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCart.find(item => item.id === cartId)),
        headers: { 'Content-Type': 'application/json' },
      });

      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      Alert.alert('Error', 'Unable to update item quantity. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    setProcessing(true);
    try {
      // Simulate checkout process
      console.log('Checkout complete');

      // Navigate to HomeScreen
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Checkout failed:', error.message);
      Alert.alert('Error', 'Unable to complete checkout. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
      ) : cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        cart.map(cartItem => (
          <View key={cartItem.id} style={styles.cartItem}>
            {cartItem.products.map(product => (
              <View key={product.productId} style={styles.product}>
                <Image source={{ uri: products[product.productId]?.image }} style={styles.image} />
                <View style={styles.productDetails}>
                  <Text style={styles.title}>{products[product.productId]?.title}</Text>
                  <Text style={styles.price}>${products[product.productId]?.price.toFixed(2)}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(cartItem.id, product.productId, product.quantity - 1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{product.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(cartItem.id, product.productId, product.quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveItem(cartItem.id, product.productId)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={processing}>
        {processing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.checkoutButtonText}>Checkout</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyCart: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
  cartItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    elevation: 1,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  removeButton: {
    color: 'red',
    marginTop: 8,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
