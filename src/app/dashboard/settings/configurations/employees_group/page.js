'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import PageHeader from '@/components/ui/page-header';
import CustomTable from '@/components/ui/custom-table';
import { User } from 'lucide-react';
import { getEmployeeGroupListing } from '@/services/employees-group-api';
import { employeeGroupFilterConfig } from '@/config/filter-config/employees-group-filter-config';

export default function EmployeeGroupPage() {
  const pathname = usePathname();
  const createEmployeeGroup = pathname + `/new`;

  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['employees_group_listing', currPage, filters],
    queryFn: () =>
      getEmployeeGroupListing({
        page: currPage,
        ...filters,
      }),
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to fetch employee group'
      );
    },
  });

  const employeeGroupData = data?.data?.data || [];
  const totalPage = data?.meta?.total_pages || 1;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className='px-4'>
      <PageHeader title={'Employees Group'} />
      <CustomTable
        tableName={'Employees Group'}
        buttonTitle={'Add New'}
        buttonIcon={<User size={15} />}
        buttonPath={createEmployeeGroup}
        actionPath={pathname}
        currPage={currPage}
        setCurrPage={setCurrPage}
        totalPages={totalPage}
        data={employeeGroupData}
        isLoading={isLoading}
        filterConfig={employeeGroupFilterConfig}
        filterDefaultValues={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
