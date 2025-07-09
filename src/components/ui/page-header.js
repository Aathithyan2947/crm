'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageHeader({ title, showBackButton = false }) {
  const router = useRouter();

  return (
    <div className='py-2 flex items-center gap-4'>
      {showBackButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className='rounded-full'
        >
          <ArrowLeft size={20} />
        </Button>
      )}
      <h1 className='text-foreground font-bold text-xl'>{title}</h1>
    </div>
  );
}