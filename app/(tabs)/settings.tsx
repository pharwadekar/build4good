import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, Moon, Trash2, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { lightTheme, darkTheme } from '@/utils/theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const clearInventory = useInventoryStore((state) => state.clearInventory);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleClearInventory = () => {
  Alert.alert(
    'Clear Inventory',
    'Are you sure you want to clear all items from your inventory?', // Fix the multiline string here
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: clearInventory,
      },
    ]
  );
};


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Bell size={24} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: theme.textSecondary, true: theme.primaryLight }}
            thumbColor={notifications ? theme.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Moon size={24} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.textSecondary, true: theme.primaryLight }}
            thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.button, { borderBottomColor: theme.border }]}
          onPress={handleClearInventory}>
          <Trash2 size={24} color={theme.error} />
          <Text style={[styles.buttonText, styles.deleteText, { color: theme.error }]}>
            Clear Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { borderBottomColor: theme.border }]}>
          <HelpCircle size={24} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.text }]}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { borderBottomColor: theme.border }]}>
          <LogOut size={24} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.text }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
      </View>
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
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  deleteText: {
    color: '#F44336',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});