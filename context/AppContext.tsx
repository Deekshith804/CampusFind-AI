
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Item, ItemType, ItemStatus, Notification } from '../types';
import { findMatches } from '../services/geminiService';
import { supabase } from '../lib/supabase';

interface AppContextType {
  items: Item[];
  addItem: (item: Item) => void;
  resolveItem: (id: string) => void;
  isLoading: boolean;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  activeModalNotification: Notification | null;
  setActiveModalNotification: (n: Notification | null) => void;
  manualMatch: (itemId: string) => Promise<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeModalNotification, setActiveModalNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          if (error.code === 'PGRST116' || error.message.includes('not found')) {
            console.error("DATABASE ERROR: Table 'items' does not exist. Please run the SQL script in your Supabase SQL Editor.");
          } else {
            console.error("SUPABASE ERROR:", error.message);
          }
          throw error;
        }
        
        if (data) {
          setItems(data as Item[]);
        }
      } catch (e: any) {
        // Fallback to local storage if Supabase fails or table is missing
        const stored = localStorage.getItem('campus_items');
        if (stored) {
          try {
            setItems(JSON.parse(stored));
          } catch (parseError) {
            setItems([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addItem = async (item: Item) => {
    setItems(prev => [item, ...prev]);

    try {
      const { error } = await supabase
        .from('items')
        .insert([{
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          location: item.location,
          contactName: item.contactName,
          contactInfo: item.contactInfo,
          imageUrl: item.imageUrl,
          tags: item.tags,
          aiDescription: item.aiDescription,
          date: item.date,
          status: item.status
        }]);
      
      if (error) throw error;
    } catch (e: any) {
      console.warn("SYNC WARNING: Failed to save to Supabase. Saving copy to LocalStorage.", e.message);
      const currentItems = JSON.parse(localStorage.getItem('campus_items') || '[]');
      localStorage.setItem('campus_items', JSON.stringify([item, ...currentItems]));
    }

    // AI Matching Logic
    const targetType = item.type === ItemType.LOST ? ItemType.FOUND : ItemType.LOST;
    const candidates = items.filter(i => i.type === targetType && i.status === ItemStatus.OPEN);

    if (candidates.length > 0) {
      findMatches(item, candidates)
        .then(matches => {
          if (matches.length > 0) {
            const firstMatch = candidates.find(c => c.id === matches[0].itemId);
            const newNotification: Notification = {
              id: Math.random().toString(36).substring(7),
              type: 'MATCH_FOUND',
              message: item.type === ItemType.LOST 
                ? `High confidence match! Your ${item.title} may have been found.`
                : `Registry Update: A reported lost "${firstMatch?.title}" matches your discovery.`,
              matches: matches,
              targetItemTitle: item.title
            };
            setNotifications(prev => [newNotification, ...prev]);
          }
        })
        .catch(err => console.error("Neural matching error:", err));
    }
  };

  const manualMatch = async (itemId: string): Promise<number> => {
    const item = items.find(i => i.id === itemId);
    if (!item) return 0;

    const targetType = item.type === ItemType.LOST ? ItemType.FOUND : ItemType.LOST;
    const candidates = items.filter(i => i.type === targetType && i.status === ItemStatus.OPEN);

    if (candidates.length === 0) return 0;

    try {
        const matches = await findMatches(item, candidates);
        if (matches.length > 0) {
            const newNotification: Notification = {
              id: Math.random().toString(36).substring(7),
              type: 'MATCH_FOUND',
              message: `Deep-scan successful: ${matches.length} probable match(es) for ${item.title}.`,
              matches: matches,
              targetItemTitle: item.title
            };
            setNotifications(prev => [newNotification, ...prev]);
            setActiveModalNotification(newNotification);
        }
        return matches.length;
    } catch (e) {
        console.error("Manual scan failed:", e);
        return 0;
    }
  };

  const resolveItem = async (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: ItemStatus.RESOLVED } : item
    ));

    try {
      const { error } = await supabase
        .from('items')
        .update({ status: ItemStatus.RESOLVED })
        .eq('id', id);
      
      if (error) throw error;
    } catch (e: any) {
      console.error("Status update sync failed:", e.message);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      items, 
      addItem, 
      resolveItem, 
      isLoading, 
      notifications, 
      dismissNotification,
      activeModalNotification,
      setActiveModalNotification,
      manualMatch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
