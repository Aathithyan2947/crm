'use client';

import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { getActivityPriorityListing } from '@/services/activity-priority-api';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ActivityPriorityPage() {
  const pathname = usePathname();
  const createActivityPriority = `${pathname}/new`;

  const { data, isLoading } = useQuery({
    queryKey: ['activity_priority'],
    queryFn: getActivityPriorityListing,
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Activity Priority'
      );
    },
  });

  const activityPriorityData = data?.data?.data || [];

  return (
    <div className='px-4'>
      <PageHeader title={'Activity Priority'} />
      <CustomTable
        tableName={'Activity Priority listing'}
        buttonTile={'Add priority'}
        buttonIcon={<Tag size={15} />}
        buttonPath={createActivityPriority}
        actionPath={pathname}
        data={activityPriorityData}
        isLoading={isLoading}
      />
    </div>
  );
}
