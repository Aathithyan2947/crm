'use client';

const CustomTable = dynamic(() => import('@/components/ui/custom-table'), {
  ssr: false,
});

import PageHeader from '@/components/ui/page-header';
import { User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

// import { makeCancelableFetcher } from '@/lib/cancel-token';
import dynamic from 'next/dynamic';
import { getPartiesListing } from '@/services/parties-api';

export default function EmployeesPage() {
  const pathname = usePathname();
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState({});
  const createPartiesPath = pathname + `/new`;

  const { isLoading, data } = useQuery({
    queryKey: ['parties_listing'],
    queryFn: () => getPartiesListing().then((res) => res.data),
    onSuccess: (response) => {
      setTotalPage(response?.meta?.total_pages || 1);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to fetch parties');
    },
  });

  // const handleFilterChange = (newFilters) => {
  //   setFilters(newFilters);
  //   setCurrPage(1);
  // };

  // const fetchOptionsMap = {
  //   getEmployeeGroupFilter: makeCancelableFetcher(
  //     'employeeGroup',
  //     async (searchValue, config) => {
  //       const res = await getEmployeeGroupFilter(
  //         { search: searchValue },
  //         config
  //       );
  //       return res?.data?.data?.map((group) => ({
  //         label: group.name,
  //         value: group.id,
  //       }));
  //     }
  //   ),
  // };

  return (
    <div className='px-4'>
      <PageHeader title={'Parties'} />
      <CustomTable
        tableName={'Parties Listing'}
        buttonTitle={'Add New'}
        buttonIcon={<User size={15} />}
        buttonPath={createPartiesPath}
        actionPath={pathname}
        data={data?.data}
        currPage={currPage}
        setCurrPage={setCurrPage}
        totalPages={totalPage}
        isLoading={isLoading}
        // Pass filter props
        // filterConfig={employeeFilterConfig}
        // fetchOptionsMap={fetchOptionsMap}
        // onFilterChange={handleFilterChange}
      />
    </div>
  );
}
