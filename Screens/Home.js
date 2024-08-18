import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-elements';
import { FontAwesome5 } from 'react-native-vector-icons';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('none');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Unable to fetch products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products;
    if (category !== 'all') {
      results = results.filter(product => product.category === category);
    }
    if (search) {
      results = results.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      results.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(results);
  }, [search, category, sort, products]);

  const handleProductClick = (productId) => {
    navigation.navigate('ProductScreen', { productId });
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.filterContainer}>
          {['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"].map(cat => (
            <Button
              key={cat}
              title={cat.charAt(0).toUpperCase() + cat.slice(1)}
              onPress={() => handleCategoryChange(cat)}
              buttonStyle={[styles.filterButton, category === cat ? styles.activeFilter : null]}
              titleStyle={styles.filterButtonText}
            />
          ))}
        </View>
        <View style={styles.sortContainer}>
          <Button
            icon={<FontAwesome5 name="sort-amount-up" size={15} color="white" />}
            title="Price Low to High"
            onPress={() => setSort('asc')}
            buttonStyle={[styles.sortButton, sort === 'asc' ? styles.activeSort : null]}
            titleStyle={styles.sortButtonText}
          />
          <Button
            icon={<FontAwesome5 name="sort-amount-down" size={15} color="white" />}
            title="Price High to Low"
            onPress={() => setSort('desc')}
            buttonStyle={[styles.sortButton, sort === 'desc' ? styles.activeSort : null]}
            titleStyle={styles.sortButtonText}
          />
          <Button
            title="Reset"
            onPress={() => setSort('none')}
            buttonStyle={[styles.resetButton, sort === 'none' ? styles.activeSort : null]}
            titleStyle={styles.resetButtonText}
          />
        </View>
      </View>
      <View style={styles.productContainer}>
        {filteredProducts.map(product => (
          <TouchableOpacity key={product.id} onPress={() => handleProductClick(product.id)} style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  price: {
    fontSize: 14,
    color: '#e63946',
  },
  filterButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  sortButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#e63946',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  activeFilter: {
    backgroundColor: '#0056b3',
  },
  activeSort: {
    backgroundColor: '#0056b3',
  },
});

export default HomeScreen;
