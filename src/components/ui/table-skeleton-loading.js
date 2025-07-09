'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton({ columnsCount = 4, rowsCount = 5 }) {
  const columns = Array.from({ length: columnsCount });
  const rows = Array.from({ length: rowsCount });

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-border'>
        <thead className='bg-muted'>
          <tr>
            {columns.map((_, idx) => (
              <th
                key={idx}
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {rows.map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((_, colIdx) => (
                <td key={colIdx} className='px-6 py-4 whitespace-nowrap'>
                  <Skeleton className="h-4 w-3/4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}