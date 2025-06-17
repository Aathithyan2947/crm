'use client';

import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  getEmployeeGroupFilter,
  getEmployeeListing,
} from '@/services/employees-api';
import { employeeFilterConfig } from '@/config/filter-config/employees-filter-config';
import { makeCancelableFetcher } from '@/lib/cancel-token';

export default function EmployeesPage() {
  const pathname = usePathname();
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState({});
  const createEmployeePath = pathname + `/new`;

  const { isLoading, data } = useQuery({
    queryKey: ['employees_listing', currPage, filters],
    queryFn: () =>
      getEmployeeListing({ page: currPage, ...filters }).then(
        (res) => res.data
      ),
    onSuccess: (response) => {
      setTotalPage(response?.meta?.total_pages || 1);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to fetch employees');
    },
  });

  const mappedEmployees = (data?.data || []).map((emp) => ({
    ...emp,
    superior: emp.superior?.name || '-',
    groups: emp.groups?.map((group) => group.name).join(', ') || '-',
  }));

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrPage(1);
  };

  const fetchOptionsMap = {
    getEmployeeGroupFilter: makeCancelableFetcher(
      'employeeGroup',
      async (searchValue, config) => {
        const res = await getEmployeeGroupFilter(
          { search: searchValue },
          config
        );
        return res?.data?.data?.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      }
    ),
  };

  return (
    <div className='px-4'>
      <PageHeader title={'Employees'} />
      <CustomTable
        tableName={'Employees Listing'}
        buttonTile={'Add New'}
        buttonIcon={<User size={15} />}
        buttonPath={createEmployeePath}
        actionPath={pathname}
        data={mappedEmployees}
        currPage={currPage}
        setCurrpage={setCurrPage}
        totalPages={totalPage}
        isLoading={isLoading}
        // Pass filter props
        filterConfig={employeeFilterConfig}
        fetchOptionsMap={fetchOptionsMap}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
