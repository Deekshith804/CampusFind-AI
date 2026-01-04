
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Item, ItemType, ItemStatus, Notification } from '../types';
import { findMatches } from '../services/geminiService';

interface AppContextType {
  items: Item[];
  addItem: (item: Item) => void;
  resolveItem: (id: string) => void;
  isLoading: boolean;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  
  // Modal Control
  activeModalNotification: Notification | null;
  setActiveModalNotification: (n: Notification | null) => void;
  
  // Manual AI Action
  manualMatch: (itemId: string) => Promise<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeModalNotification, setActiveModalNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track IDs that have been passively scanned to prevent redundant API calls and loops
  const scannedIds = useRef(new Set<string>());

  // Load items
  useEffect(() => {
    const stored = localStorage.getItem('campus_items');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems([]);
    }
    setIsLoading(false);
  }, []);

  // Save items
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('campus_items', JSON.stringify(items));
    }
  }, [items, isLoading]);

  // PASSIVE MONITORING: Run a background check on load for recent items
  useEffect(() => {
    // Ensure we don't run this if items are empty or just loaded
    if (!isLoading && items.length > 1) {
      const openLostItems = items.filter(i => i.type === ItemType.LOST && i.status === ItemStatus.OPEN);
      if (openLostItems.length > 0) {
        const latestLost = openLostItems[0];
        
        // Optimization: Skip if we've already scanned this item in this session
        if (scannedIds.current.has(latestLost.id)) return;

        const foundCandidates = items.filter(i => i.type === ItemType.FOUND && i.status === ItemStatus.OPEN);
        
        if (foundCandidates.length > 0) {
           // Mark as scanned immediately to prevent double-fire
           scannedIds.current.add(latestLost.id);

           findMatches(latestLost, foundCandidates).then(matches => {
             if (matches.length > 0) {
                const firstFound = foundCandidates.find(f => f.id === matches[0].itemId);
                const newNotification: Notification = {
                  id: crypto.randomUUID(),
                  type: 'MATCH_FOUND',
                  message: `hey! ${latestLost.contactName}, we found your ${latestLost.title} in ${firstFound?.location || 'the campus'}`,
                  matches: matches,
                  targetItemTitle: latestLost.title
                };
                setNotifications(prev => [newNotification, ...prev]);
             }
           }).catch(err => {
             console.error("Background match error:", err);
             // Optionally remove from scannedIds if you want to retry later, 
             // but for now keep it to prevent spamming on error.
           });
        }
      }
    }
  }, [isLoading, items]); // Removed notifications dependency to prevent re-scan loop

  const addItem = (item: Item) => {
    setItems(prev => [item, ...prev]);
    // Mark as scanned immediately since we are manually handling the scan below
    scannedIds.current.add(item.id);

    const targetType = item.type === ItemType.LOST ? ItemType.FOUND : ItemType.LOST;
    const candidates = items.filter(i => i.type === targetType && i.status === ItemStatus.OPEN);

    if (candidates.length > 0) {
      findMatches(item, candidates)
        .then(matches => {
          if (matches.length > 0) {
            const firstMatch = candidates.find(c => c.id === matches[0].itemId);
            const lostItem = item.type === ItemType.LOST ? item : firstMatch;
            const foundItem = item.type === ItemType.FOUND ? item : firstMatch;
            
            const msg = `hey! ${lostItem?.contactName || 'Owner'}, we found your ${lostItem?.title || 'item'} in ${foundItem?.location || 'the campus'}`;

            const newNotification: Notification = {
              id: crypto.randomUUID(),
              type: 'MATCH_FOUND',
              message: msg,
              matches: matches,
              targetItemTitle: item.title
            };
            setNotifications(prev => [newNotification, ...prev]);
          }
        })
        .catch(err => console.error("Background match failed", err));
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
            const firstMatch = candidates.find(c => c.id === matches[0].itemId);
            const lostItem = item.type === ItemType.LOST ? item : firstMatch;
            const foundItem = item.type === ItemType.FOUND ? item : firstMatch;
            
            const msg = `hey! ${lostItem?.contactName || 'Owner'}, we found your ${lostItem?.title || 'item'} in ${foundItem?.location || 'the campus'}`;

            const newNotification: Notification = {
              id: crypto.randomUUID(),
              type: 'MATCH_FOUND',
              message: msg,
              matches: matches,
              targetItemTitle: item.title
            };
            setNotifications(prev => [newNotification, ...prev]);
            setActiveModalNotification(newNotification);
        }
        return matches.length;
    } catch (e) {
        console.error(e);
        return 0;
    }
  };

  const resolveItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: ItemStatus.RESOLVED } : item
    ));
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
