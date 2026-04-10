import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Handcrafted Haven',
  description: 'Marketplace and artisan community for handmade goods.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
