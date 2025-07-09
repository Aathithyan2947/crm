'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageWindow = 5;

  const pages = useMemo(() => {
    const currentGroup = Math.floor((currentPage - 1) / pageWindow);
    const startPage = currentGroup * pageWindow + 1;
    const endPage = Math.min(startPage + pageWindow - 1, totalPages);

    const pageList = [];
    for (let i = startPage; i <= endPage; i++) {
      pageList.push(i);
    }
    return pageList;
  }, [currentPage, totalPages]);

  return (
    <div className='flex justify-center items-center gap-1 mt-3'>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

      {pages.map((page) => (
        <Button
          key={`page-${page}`}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}