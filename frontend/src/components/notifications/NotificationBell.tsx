'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  demandId?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Simular conexão em tempo real (em produção, usaria WebSocket ou SSE)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Carregar notificações iniciais
    loadNotifications(token);

    // Simular recebimento de notificações em tempo real
    const interval = setInterval(() => {
      checkForNewNotifications(token);
    }, 30000); // Checar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async (token: string) => {
    try {
      setIsLoading(true);
      // Em produção, isso viria de uma API real
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Urgent Demand',
          message: 'A new urgent demand was created: Medical License',
          type: 'warning',
          read: false,
          createdAt: new Date().toISOString(),
          demandId: 'demand-123'
        },
        {
          id: '2',
          title: 'Demand Updated',
          message: 'Your vacation request has been updated to "In Progress"',
          type: 'info',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
          demandId: 'demand-456'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewNotifications = async (token: string) => {
    // Simular checagem de novas notificações
    // Em produção, isso seria uma chamada WebSocket ou SSE
    const hasNew = Math.random() > 0.7; // 30% de chance de nova notificação
    
    if (hasNew) {
      const newNotification: Notification = {
        id: `new-${Date.now()}`,
        title: 'New Activity',
        message: 'There is a new update to your demands',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar notificação desktop
      if (Notification.permission === 'granted') {
        new Notification('HRFlow', {
          body: newNotification.message,
          icon: '/favicon.ico'
        });
      }
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const viewDemand = (demandId: string) => {
    setIsOpen(false);
    router.push(`/demands/${demandId}`);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.857a.75.75 0 00-1.214-.857L10 10.586 7.357 7.886a.75.75 0 10-1.06 1.061L9.293 12a.75.75 0 001.061 0l3.5-3.5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className="relative">
      {/* Sino de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 relative"
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400 dark:ring-gray-800"></span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notification</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tou're up to date!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`${getNotificationColor(notification.type)} ${!notification.read ? 'border-l-4 border-indigo-500' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          
                          {notification.demandId && (
                            <div className="mt-2">
                              <button
                                onClick={() => viewDemand(notification.demandId!)}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
                              >
                                See demand
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          >
                            <span className="sr-only">Marcar como lida</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.857a.75.75 0 00-1.214-.857L10 10.586 7.357 7.886a.75.75 0 10-1.06 1.06L8.94 12l-2.643 2.643a.75.75 0 101.06 1.061L10 13.06l2.643 2.643a.75.75 0 001.06-1.061L11.06 12l2.643-2.643z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
              See all notifications
            </button>
          </div>
        </div>
      )}

      {/* Fechar dropdown ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}