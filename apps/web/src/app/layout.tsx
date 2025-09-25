import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../index.css';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/header';
import Providers from '@/components/providers';
import { SkipLink } from '@/components/skip-link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Purple - Accountability Buddy Network',
  description:
    'Transform your goals into achievements with accountability partners. Track progress, invite buddies, and stay motivated on your journey to success.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SkipLink />
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            <main id="main-content">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
