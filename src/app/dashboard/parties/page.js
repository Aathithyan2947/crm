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

import dynamic from 'next/dynamic';
import { getPartiesListing } from '@/services/parties-api';

export default function PartiesPage() {
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
      />
    </div>
  );
}