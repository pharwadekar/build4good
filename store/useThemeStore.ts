import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: async () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
      return { isDarkMode: newMode };
    });
  },
}));

// Initialize theme from storage
AsyncStorage.getItem('isDarkMode').then((value) => {
  if (value !== null) {
    useThemeStore.setState({ isDarkMode: JSON.parse(value) });
  }
});