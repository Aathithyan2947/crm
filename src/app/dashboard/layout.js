'use client';

import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';

export default function DashboardLayout({ children }) {
  return (
    <div className='flex bg-lightPurple antialiased min-h-screen'>
      <div className='flex flex-col'>
        <Sidebar />
      </div>
      <main className='flex-1 p-5'>
        <Header />
        {children}
      </main>
    </div>
  );
}
