'use client';

import { FolderX, Filter, Eye } from 'lucide-react';
import Button from './button';
import Pagination from './pagination';
import Link from 'next/link';
import TableSkeleton from './table-skeleton-loading';
import CustomFilter from './custom-filter';
import { useState } from 'react';

export default function CustomTable({
  tableName,
  buttonTitle,
  buttonIcon,
  buttonPath,
  actionPath,
  currPage,
  setCurrPage,
  totalPages,
  data,
  isLoading,
  showActions = true,
  filterConfig = [],
  filterDefaultValues = {},
  onFilterChange = () => { },
  fetchOptionsMap = {},
}) {
  const [showFilters, setShowFilters] = useState(false);
  const columns =
    data?.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'id') : [];

  const StatusChip = ({ status }) => {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center justify-center min-w-[80px] h-7 px-3 py-1.5 rounded-full text-[10px] font-medium text-center uppercase ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
      >
        {status}
      </span>
    );
  };

  let content;

  if (isLoading) {
    content = <TableSkeleton />;
  } else if (data?.length === 0) {
    content = (
      <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
        <FolderX className='w-10 h-10 text-gray-300 mb-3' />
        <p className='text-base font-semibold'>No Data Found</p>
        <p className='text-xs'>There are no records available right now.</p>
      </div>
    );
  } else {
    content = (
      <>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm table-auto'>
            <thead className='bg-lightViolet text-darkBlue font-semibold'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className='px-3 py-3 text-left text-xs uppercase tracking-wider'
                  >
                    {column
                      .replace(/_/g, ' ')
                      .replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </th>
                ))}
                {showActions && (
                  <th className='px-3 py-3 text-left text-xs uppercase tracking-wider'>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data?.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column}`}
                      className='px-3 py-2 whitespace-normal break-words text-xs text-gray-600'
                    >
                      {column === 'status' ? (
                        <StatusChip status={item[column]} />
                      ) : (
                        item[column]
                      )}
                    </td>
                  ))}
                  {showActions && (
                    <td className='px-3 py-2 whitespace-nowrap text-xs font-medium'>
                      <Link
                        className='flex items-center gap-1 text-deepViolet hover:text-blue-900 hover:scale-105 transition-all duration-200'
                        href={`${actionPath}/${item.id}`}
                      >
                        <span>Details</span>
                        <Eye size={15} />
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currPage !== undefined && totalPages !== undefined && (
          <div className='mt-3 sticky bottom-0 bg-white py-2'>
            <Pagination
              currentPage={currPage}
              totalPages={totalPages}
              onPageChange={setCurrPage}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className='flex flex-col gap-4 bg-white rounded-xl p-4 shadow-sm'>
      <div className='flex justify-between items-center mb-2'>
        <p className='text-black text-base font-semibold'>{tableName}</p>
        <div className='flex gap-2'>
          {filterConfig.length > 0 && (
            <button
              aria-labelledby='filter button'
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 text-xs px-3 cursor-pointer py-2 border rounded-3xl hover:scale-105 transition-all duration-300 ${showFilters
                ? 'bg-deepViolet text-white border-deepViolet'
                : 'border-gray-300 hover:bg-gray-100'
                }`}
            >
              <span>Filters</span>
              <Filter size={15} />
            </button>
          )}
          {buttonPath && (
            <Button
              title={buttonTitle}
              icon={buttonIcon}
              routepath={buttonPath}
            />
          )}
        </div>
      </div>

      {filterConfig.length > 0 && showFilters && (
        <div className='mb-4'>
          <CustomFilter
            config={filterConfig}
            defaultValues={filterDefaultValues}
            onFilterChange={onFilterChange}
            fetchOptionsMap={fetchOptionsMap}
          />
        </div>
      )}

      <div className='relative'>
        {content}
      </div>
    </div>
  );
}
