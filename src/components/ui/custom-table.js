'use client';

import { FolderX, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Button as CustomButton from './button';
import Pagination from './pagination';
import Link from 'next/link';
import TableSkeleton from './table-skeleton-loading';
import CustomFilter from './custom-filter';
import { useState } from 'react';

const statusStyles = {
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  completed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  'over due': 'bg-red-100 text-red-800 hover:bg-red-100',
  overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
};

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
    const normalizedStatus = status?.toLowerCase();
    const chipStyle = statusStyles[normalizedStatus] || statusStyles.default;

    return (
      <Badge variant="secondary" className={`min-w-[80px] justify-center uppercase ${chipStyle}`}>
        {status}
      </Badge>
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
            <thead className='bg-muted'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider'
                  >
                    {column
                      .replace(/_/g, ' ')
                      .replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </th>
                ))}
                {showActions && (
                  <th className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column}`}
                      className='px-3 py-2 whitespace-normal break-words text-xs text-muted-foreground'
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`${actionPath}/${item.id}`}
                          className='flex items-center gap-1'
                        >
                          <span>Details</span>
                          <Eye size={15} />
                        </Link>
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currPage !== undefined && totalPages !== undefined && (
          <div className='mt-3 sticky bottom-0 bg-background py-2'>
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
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-base'>{tableName}</CardTitle>
          <div className='flex gap-2'>
            {filterConfig.length > 0 && (
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <span>Filters</span>
                <Filter size={15} />
              </Button>
            )}
            {buttonPath && (
              <CustomButton
                title={buttonTitle}
                icon={buttonIcon}
                routepath={buttonPath}
              />
            )}
          </div>
        </div>

        {filterConfig.length > 0 && showFilters && (
          <div className='mt-4'>
            <CustomFilter
              config={filterConfig}
              defaultValues={filterDefaultValues}
              onFilterChange={onFilterChange}
              fetchOptionsMap={fetchOptionsMap}
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}