'use client';

import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@/helpers/enums';
import { ArrowLeftCircle } from 'lucide-react'; // ✅ Lucide icon import

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1f2a38] to-[#2c3e50] text-white p-6'>
      <div className='max-w-md text-center shadow-2xl bg-[#263040]/80 rounded-2xl p-10 border border-[#3c4c63] backdrop-blur-md'>
        <h1 className='text-5xl font-bold text-red-500 mb-4 drop-shadow-lg'>
          404
        </h1>
        <h2 className='text-2xl font-semibold mb-2'>Page Not Found</h2>
        <p className='text-gray-300 mb-6'>
          Oops! The page you are looking for doesnt exist or has been moved.
        </p>
        <button
          onClick={() => router.push(DASHBOARD_ROUTES.EMPLOYEES)}
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-deepViolet hover:bg-violet-700 transition-all duration-300 shadow-lg hover:scale-105'
        >
          <ArrowLeftCircle size={20} className='text-white' />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
