import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search, Plus, Trash } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useThemeStore } from '@/store/useThemeStore';
import { lightTheme, darkTheme } from '@/utils/theme';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Pantry', 'Detected'];

export default function InventoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeItem } = useInventoryStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Inventory</Text>
        <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
          <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search items..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.categoriesContainer, { backgroundColor: theme.surface }]}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.background },
              selectedCategory === category && { backgroundColor: theme.primary },
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                { color: theme.textSecondary },
                selectedCategory === category && { color: '#FFFFFF' },
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.surface }]}>
            <View>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemQuantity, { color: theme.textSecondary }]}>
                Quantity: {item.quantity}
              </Text>
              <Text style={[styles.itemExpiry, { color: theme.textSecondary }]}>
                Expires: {new Date(item.expiryDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary + '20' }]}
                onPress={() => removeItem(item.id)}>
                <Trash size={20} color={theme.error} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary + '20' }]}>
                <Plus size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  categoriesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  itemsContainer: {
    padding: 20,
  },
  itemCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 3,
  },
  itemExpiry: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
  },
});