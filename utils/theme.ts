import { StyleSheet } from 'react-native';

export const lightTheme = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#F44336',
};

export const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#4CAF50',
  primaryLight: '#81C784',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2C2C2C',
  error: '#EF5350',
};

export type Theme = typeof lightTheme;

export const createThemedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    surface: {
      backgroundColor: theme.surface,
    },
    text: {
      color: theme.text,
    },
    textSecondary: {
      color: theme.textSecondary,
    },
  });