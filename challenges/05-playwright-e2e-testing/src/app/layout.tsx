import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TechShop - Your Electronics Store',
  description: 'E-commerce application for Playwright testing challenge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
