import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Clock, Users, Share2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { lightTheme, darkTheme } from '@/utils/theme';
import { exportRecipeToNotion } from '@/utils/notion';

const RECIPES = [
  {
    id: 1,
    title: 'Pasta Primavera',
    time: '30 mins',
    servings: 4,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500',
    ingredients: [
      '8 oz pasta',
      '2 cups mixed vegetables',
      '2 cloves garlic',
      '1/4 cup olive oil',
    ],
    instructions: [
      'Boil pasta according to package instructions',
      'Sauté vegetables and garlic in olive oil',
      'Combine pasta and vegetables',
      'Season to taste',
    ],
  },
  {
    id: 2,
    title: 'Chicken Stir Fry',
    time: '25 mins',
    servings: 3,
    image: 'https://source.unsplash.com/random/400x300?stirfry',
    ingredients: [
      '1 lb chicken breast',
      '2 cups mixed vegetables',
      '3 tbsp soy sauce',
      '1 tbsp oil',
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Stir-fry chicken until cooked',
      'Add vegetables and sauce',
      'Cook until vegetables are tender',
    ],
  },
  {
    id: 3,
    title: 'Vegetable Curry',
    time: '45 mins',
    servings: 4,
    image: 'https://source.unsplash.com/random/400x300?curry',
    ingredients: [
      '2 cups mixed vegetables',
      '1 can coconut milk',
      '2 tbsp curry paste',
      '1 cup rice',
    ],
    instructions: [
      'Cook rice according to package instructions',
      'Sauté curry paste in oil',
      'Add vegetables and coconut milk',
      'Simmer until vegetables are tender',
    ],
  },
];

export default function RecipesScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleExportToNotion = async (recipe) => {
    try {
      await exportRecipeToNotion(recipe);
      Alert.alert('Success', 'Recipe exported to Notion successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export recipe to Notion');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Recipe Suggestions</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Based on your inventory
        </Text>
      </View>

      <View style={styles.recipesContainer}>
        {RECIPES.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={[styles.recipeCard, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={[styles.recipeTitle, { color: theme.text }]}>{recipe.title}</Text>
              <View style={styles.recipeMetaContainer}>
                <View style={styles.recipeMeta}>
                  <Clock size={16} color={theme.textSecondary} />
                  <Text style={[styles.recipeMetaText, { color: theme.textSecondary }]}>
                    {recipe.time}
                  </Text>
                </View>
                <View style={styles.recipeMeta}>
                  <Users size={16} color={theme.textSecondary} />
                  <Text style={[styles.recipeMetaText, { color: theme.textSecondary }]}>
                    {recipe.servings} servings
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.viewButton, { backgroundColor: theme.primary }]}
                  onPress={() => handleExportToNotion(recipe)}>
                  <Share2 size={20} color="#FFFFFF" />
                  <Text style={styles.viewButtonText}>Export to Notion</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  recipesContainer: {
    padding: 20,
  },
  recipeCard: {
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  recipeMetaText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});