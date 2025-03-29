import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const newItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        dateAdded: new Date().toISOString(),
      };
      const newItems = [...state.items, newItem];
      AsyncStorage.setItem('inventory', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  updateItem: (id, updatedItem) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      AsyncStorage.setItem('inventory', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      AsyncStorage.setItem('inventory', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
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