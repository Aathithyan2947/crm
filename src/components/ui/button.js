'use client';
import Link from 'next/link';

export default function Button({ title, icon, routepath }) {
  return (
    <div className='border border-gray-400 bg-deepViolet text-white shadow-sm rounded-3xl hover:scale-105 hover:font-bold transition-all duration-300'>
      <Link href={routepath} className='flex gap-2 items-center p-3'>
        <p className='text-xs'>{title}</p>
        {icon}
      </Link>
    </div>
  );
}
