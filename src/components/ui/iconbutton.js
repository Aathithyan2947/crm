'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function IconButton({ children, onClick, count = 0 }) {
  return (
    <div className='relative'>
      <Button
        variant="outline"
        size="icon"
        className='h-10 w-10 rounded-full hover:scale-110 transition-all duration-200'
        onClick={onClick}
      >
        {children}
      </Button>
      {count > 0 && (
        <Badge 
          variant="destructive"
          className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs font-semibold'
        >
          {count}
        </Badge>
      )}
    </div>
  );
}
