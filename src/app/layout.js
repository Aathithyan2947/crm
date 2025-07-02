// app/layout.jsx
import './globals.css';
import ClientLayout from '@/lib/client-layout';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

export const metadata = {
  title: 'Flaer CRM',
  description: 'Manage employees and workflows efficiently.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="bg-lightPurple antialiased flex">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
