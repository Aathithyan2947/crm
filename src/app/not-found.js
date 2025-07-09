'use client';

import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@/helpers/enums';
import { ArrowLeftCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1f2a38] to-[#2c3e50] text-white p-6'>
      <Card className='max-w-md text-center bg-[#263040]/80 border-[#3c4c63] backdrop-blur-md'>
        <CardContent className="pt-10 pb-10">
          <h1 className='text-5xl font-bold text-red-500 mb-4 drop-shadow-lg'>
            404
          </h1>
          <h2 className='text-2xl font-semibold mb-2'>Page Not Found</h2>
          <p className='text-gray-300 mb-6'>
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={() => router.push(DASHBOARD_ROUTES.EMPLOYEES)}
            className='gap-2 hover:scale-105 transition-all duration-300'
          >
            <ArrowLeftCircle size={20} />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}