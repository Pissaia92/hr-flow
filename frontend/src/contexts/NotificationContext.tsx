'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type Action = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

function notificationReducer(state: Notification[], action: Action): Notification[] {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [action.payload, ...state.slice(0, 4)]; // Manter apenas as 5 mais recentes
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    default:
      return state;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...notification
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
    }, 5000);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}