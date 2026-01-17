'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cartContext';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </SessionProvider>
  );
}