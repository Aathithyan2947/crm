'use client';
import Link from 'next/link';
import { Button as ShadcnButton } from '@/components/ui/button';

export default function Button({ title, icon, routepath }) {
  return (
    <ShadcnButton asChild size="sm" className="gap-2">
      <Link href={routepath}>
        <span className='text-xs'>{title}</span>
        {icon}
      </Link>
    </ShadcnButton>
  );
}