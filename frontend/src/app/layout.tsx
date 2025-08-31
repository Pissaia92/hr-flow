import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/notifications/NotificationToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HRFlow - Human Resources Demand Management System',
  description: 'Complete system for recording, prioritizing and tracking HR requests',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Se você tiver providers como NotificationProvider */}
        <NotificationProvider>
          {children}
          <NotificationToast />
        </NotificationProvider>
      </body>
    </html>
  );
}