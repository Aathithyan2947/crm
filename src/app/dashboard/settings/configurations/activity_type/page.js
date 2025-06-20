'use client';

import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { getActivityTypeListing } from '@/services/activity-type-api';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ActivityTypePage() {
  const pathname = usePathname();
  const createActivityType = `${pathname}/new`;

  const { data, isLoading } = useQuery({
    queryKey: ['activity_type'],
    queryFn: getActivityTypeListing,
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Activity Type'
      );
    },
  });

  const activityTypeData = data?.data?.data || [];

  return (
    <div className='px-4'>
      <PageHeader title={'Activity Type'} />
      <CustomTable
        tableName={'Activity type listing'}
        buttonTitle={'Add type'}
        buttonIcon={<Tag size={15} />}
        buttonPath={createActivityType}
        actionPath={pathname}
        data={activityTypeData}
        isLoading={isLoading}
      />
    </div>
  );
}
