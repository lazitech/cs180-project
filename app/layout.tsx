import type { Metadata } from 'next';

import { sitePath } from '@/lib/site-path';

import './globals.css';

export const metadata: Metadata = {
  title: 'Project 0',
  description:
    'Anzhe Lyu explores perspective, focal length, and the dolly zoom through three camera experiments for CS 180.',
  icons: {
    icon: sitePath('/favicon.svg'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
