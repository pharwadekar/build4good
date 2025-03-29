import { Tabs } from 'expo-router';
import { Chrome as Home, Refrigerator, Camera, Book as Book2, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

const TAB_ICON_SIZE = 24;
const TAB_ICON_COLOR = '#2E7D32';
const TAB_ICON_INACTIVE_COLOR = '#757575';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: TAB_ICON_COLOR,
        tabBarInactiveTintColor: TAB_ICON_INACTIVE_COLOR,
        headerStyle: {
          backgroundColor: '#F5F5F5',
        },
        headerTintColor: '#2E7D32',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Refrigerator size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <Camera size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <Book2 size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={TAB_ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}