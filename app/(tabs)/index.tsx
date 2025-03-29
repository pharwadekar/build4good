import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to PantryPal</Text>
        <Text style={styles.headerSubtitle}>Your smart kitchen assistant</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Items in Pantry</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Items Low</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Suggestions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScroll}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.recipeCard}>
              <Image
                source={{ uri: `https://source.unsplash.com/random/400x300?food=${item}` }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeTitle}>Delicious Recipe {item}</Text>
              <Text style={styles.recipeSubtitle}>Ready to cook • 30 mins</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expiring Soon</Text>
        {[1, 2].map((item) => (
          <View key={item} style={styles.expiringItem}>
            <Text style={styles.itemName}>Item {item}</Text>
            <Text style={styles.expiryDate}>Expires in {item} days</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#E8F5E9',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#757575',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#212121',
    marginBottom: 15,
  },
  recipeScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#212121',
    padding: 15,
    paddingBottom: 5,
  },
  recipeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#757575',
    padding: 15,
    paddingTop: 5,
  },
  expiringItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#212121',
  },
  expiryDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#F44336',
  },
});