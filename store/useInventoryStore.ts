import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as UUID from 'react-native-uuid';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  expiryDate: string;
  dateAdded: string;
}

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'dateAdded'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  clearInventory: () => void;
}

function generateRandomId() {
  return Math.random().toString(36).substr(2, 9); // Generates a random string
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (existing) => existing.name.toLowerCase() === item.name.toLowerCase()
      );

      if (existingItem) {
        return {
          items: state.items.map((existing) =>
            existing.name.toLowerCase() === item.name.toLowerCase()
              ? { ...existing, quantity: existing.quantity + item.quantity }
              : existing
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            id: generateRandomId(), // Use the custom random ID generator
            dateAdded: new Date().toISOString(),
          },
        ],
      };
    }),
  updateItem: (id, updatedItem) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      AsyncStorage.setItem('inventory', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearInventory: () => {
    set({ items: [] });
    AsyncStorage.removeItem('inventory');
  },
}));

// Initialize inventory from storage
AsyncStorage.getItem('inventory').then((value) => {
  if (value !== null) {
    useInventoryStore.setState({ items: JSON.parse(value) });
  }
});