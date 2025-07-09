'use client';

import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { getActivityOutcomeListing } from '@/services/activity-outcome-api';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ActivityOutcomePage() {
  const pathname = usePathname();
  const createActivityOutcome = `${pathname}/new`;

  const { data, isLoading } = useQuery({
    queryKey: ['activity_outcome'],
    queryFn: getActivityOutcomeListing,
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to fetch Activity outcome'
      );
    },
  });

  const mappedOutcomeGroups = (data?.data?.data || []).map((item) => ({
    ...item,
    types: item.types?.map((t) => t.name).join(', ') || '-',
    outcomes: item.outcomes?.map((o) => o.name).join(', ') || '-',
  }));

  return (
    <div className='px-4'>
      <PageHeader title={'Activity Outcome'} />
      <CustomTable
        tableName={'Activity Outcome listing'}
        buttonTitle={'Add Outcome'}
        buttonIcon={<Tag size={15} />}
        buttonPath={createActivityOutcome}
        actionPath={pathname}
        data={mappedOutcomeGroups}
        isLoading={isLoading}
      />
    </div>
  );
}