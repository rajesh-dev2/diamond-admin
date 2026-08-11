import React from 'react';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PageLoaderProvider } from '@/components/providers/PageLoaderProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <PageLoaderProvider>{children}</PageLoaderProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
