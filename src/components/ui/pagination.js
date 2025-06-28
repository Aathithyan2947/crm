'use client';

import { useMemo } from 'react';

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
    <div className='flex justify-center items-center gap-1 mt-3 text-sm'>
      <button
        className='px-2.5 cursor-pointer py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={`page-${page}`}
          className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-md border border-gray-300 transition-all duration-200 text-sm ${page === currentPage
            ? 'bg-deepViolet text-white border-deepViolet scale-105 shadow'
            : 'text-gray-700 hover:bg-gray-100'
            }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className='px-2.5 cursor-pointer py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
