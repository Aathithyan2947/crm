'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, showBackButton = false }) {
  const router = useRouter();

  return (
    <div className='py-2 flex items-center gap-4'>
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className='p-1 cursor-pointer rounded-full bg-white border border-deepViolet text-deepViolet hover:bg-deepViolet hover:text-white transition-all'
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className='text-black font-bold text-xl'>{title}</h1>
    </div>
  );
}
