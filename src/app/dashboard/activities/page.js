'use client';

const CustomTable = dynamic(() => import('@/components/ui/custom-table'), {
  ssr: false,
});

import PageHeader from '@/components/ui/page-header';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { getActivityListing } from '@/services/activities-api';
import { getEmployeeNames } from '@/services/employees-api';
import { getPartyNames } from '@/services/parties-api';
import { makeCancelableFetcher } from '@/lib/cancel-token';
import { activitiesFilterConfig } from '@/config/filter-config/activities-filter-config';
import { getActivityTypeName } from '@/services/activity-type-api';
import { getDropdownConfigs } from '@/services/customization-api';
import { getActivityPriorityListing } from '@/services/activity-priority-api';

export default function ActivitiesPage() {
  const pathname = usePathname();
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState({});
  const createActivityPath = pathname + `/new`;

  const { isLoading, data } = useQuery({
    queryKey: ['activities_listing', currPage, filters],
    queryFn: () =>
      getActivityListing({ page: currPage, ...filters }).then(
        (res) => res.data
      ),
    onSuccess: (response) => {
      setTotalPage(response?.meta?.total_pages || 1);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to fetch activities');
    },
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrPage(1);
  };

  const fetchOptionsMap = {
    getEmployeeFilter: makeCancelableFetcher(
      'employee_filter',
      async (searchValue, config) => {
        const res = await getEmployeeNames({ search: searchValue }, config);
        return res?.data?.data?.map((employee) => ({
          label: `${employee.name} (${employee.emp_code})`,
          value: employee.id,
        }));
      }
    ),
    getPartyFilter: makeCancelableFetcher(
      'party_filter',
      async (searchValue, config) => {
        const res = await getPartyNames({ search: searchValue }, config);
        return res?.data?.data?.map((party) => ({
          label: `${party.party_name} (${party.party_code})`,
          value: party.id,
        }));
      }
    ),
    getActivityTypeFilter: makeCancelableFetcher(
      'activity_type',
      async (searchValue, config) => {
        const res = await getActivityTypeName({ search: searchValue }, config);
        return res?.data?.data?.map((activity_type) => ({
          label: `${activity_type.name}`,
          value: activity_type.id,
        }));
      }
    ),
    getActivityStatusFilter: makeCancelableFetcher(
      'activity_status',
      async () => {
        const res = await getDropdownConfigs('Activity', 'activity_status');
        return (
          res?.data?.data?.attributes?.activity_status?.map((status) => ({
            label: status.config_value,
            value: status.config_key,
          })) || []
        );
      }
    ),
    getActivityPriorityFilter: makeCancelableFetcher(
      'activity_priority',
      async (searchValue, config) => {
        const res = await getActivityPriorityListing(
          { search: searchValue },
          config
        );
        return (
          res?.data?.data?.map((act_priority) => ({
            label: act_priority.name,
            value: act_priority.id,
          })) || []
        );
      }
    ),
  };

  return (
    <div className='px-4'>
      <PageHeader title={'Activities'} />
      <CustomTable
        tableName={'Activities Listing'}
        buttonTitle={'Add New'}
        buttonIcon={<Activity size={15} />}
        buttonPath={createActivityPath}
        actionPath={pathname}
        data={data?.data}
        currPage={currPage}
        setCurrPage={setCurrPage}
        totalPages={totalPage}
        isLoading={isLoading}
        // Pass filter props
        filterConfig={activitiesFilterConfig}
        fetchOptionsMap={fetchOptionsMap}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
