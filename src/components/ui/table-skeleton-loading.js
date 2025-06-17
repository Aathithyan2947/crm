'use client';

export default function TableSkeleton({ columnsCount = 4, rowsCount = 5 }) {
  const columns = Array.from({ length: columnsCount });
  const rows = Array.from({ length: rowsCount });

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-lightViolet text-darkBlue font-semibold'>
          <tr>
            {columns.map((_, idx) => (
              <th
                key={idx}
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                &nbsp;
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200 text-sm'>
          {rows.map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((_, colIdx) => (
                <td key={colIdx} className='px-6 py-4 whitespace-nowrap'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
