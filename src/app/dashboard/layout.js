'use client';

import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className='flex bg-lightPurple antialiased min-h-screen'>
      <div className='flex flex-col'>
        <Sidebar />
      </div>
      <main className='flex-1 pt-4'>{children}</main>
    </div>
  );
}
