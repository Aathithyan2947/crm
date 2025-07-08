'use client';

import { useMemo } from 'react';
import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import Loader from '@/components/ui/loader';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { DASHBOARD_ROUTES } from '@/helpers/enums';
import { activityFormConfig } from '@/config/form-config/activity-config';
import {
  createActivity,
  getActivity,
  updateActivity,
} from '@/services/activities-api';
import { getPartyNames } from '@/services/parties-api';
import { getActivityTypeListing } from '@/services/activity-type-api';
import { getEmployeeNames } from '@/services/employees-api';
import { getActivityPriorityListing } from '@/services/activity-priority-api';
import { getDropdownConfigs } from '@/services/customization-api';
import { mapActivityDataToForm } from '@/helpers/data-format';
import { makeCancelableFetcher } from '@/lib/cancel-token';
import { getActivityOutcomeByActivityType } from '@/services/activity-outcome-api';

export default function ManageActivity() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  // Fetch existing activity data for edit
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivity(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const { data: dropdowns, isLoading: isDropdownLoading } = useQuery({
    queryKey: ['activity_dropdowns'],
    queryFn: async () => {
      const attributes = ['activity_status'];
      const result = {};

      for (const attr of attributes) {
        try {
          const res = await getDropdownConfigs('Activity', attr);
          result[attr] =
            res?.data?.data?.attributes?.[attr]?.map((item) => ({
              label: item.config_value || item.config_key,
              value: item.config_key,
            })) || [];
        } catch (err) {
          console.error(`Error fetching ${attr}:`, err);
          result[attr] = [];
        }
      }

      return result;
    },
  });

  // Create Activity Mutation
  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      toast.success('Activity Created!');
      queryClient.invalidateQueries({ queryKey: ['activities_listing'] });
      router.push(DASHBOARD_ROUTES.ACTIVITIES);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create activity');
    },
  });

  // Update Activity Mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => updateActivity(id, formData),
    onSuccess: () => {
      toast.success('Activity Updated!');
      queryClient.invalidateQueries({ queryKey: ['activities_listing'] });
      queryClient.invalidateQueries({
        queryKey: ['activity', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update activity');
    },
  });

  const fetchOptionsMap = useMemo(() => {
    const optionsMap = {
      getPartyNames: makeCancelableFetcher(
        'parties',
        async (searchValue, config) => {
          const res = await getPartyNames({ search: searchValue }, config);
          return res?.data?.data?.map((party) => ({
            label: `${party.party_name} (${party.party_code})`,
            value: party.id,
          }));
        }
      ),
      getEmployeeNames: makeCancelableFetcher(
        'employee_names',
        async (searchValue, config) => {
          const res = await getEmployeeNames({ search: searchValue }, config);
          return res?.data?.data?.map((employee) => ({
            label: `${employee.name} (${employee.emp_code})`,
            value: employee.id,
          }));
        }
      ),
      getActivityPriorities: makeCancelableFetcher(
        'activity_priority',
        async (searchValue, config) => {
          const res = await getActivityPriorityListing(
            { search: searchValue },
            config
          );
          return res?.data?.data?.map((activity_priority) => ({
            label: `${activity_priority.name}`,
            value: activity_priority.id,
          }));
        }
      ),
      getActivityTypes: makeCancelableFetcher(
        'activity_type',
        async (searchValue, config) => {
          const res = await getActivityTypeListing(
            { search: searchValue },
            config
          );
          return res?.data?.data?.map((activity_type) => ({
            label: `${activity_type.name}`,
            value: activity_type.id,
          }));
        }
      ),
      getActivityOutcomes: makeCancelableFetcher(
        'activity_outcomes',
        async () => {
          const res = await getActivityOutcomeByActivityType(
            data?.data?.activity_type?.id
          );
          return res?.data?.data?.map((activity_outcome) => ({
            label: `${activity_outcome.name}`,
            value: activity_outcome.id,
          }));
        }
      ),
    };

    // Add static dropdown options
    if (dropdowns) {
      optionsMap.getActivityStatus = () => dropdowns['activity_status'] || [];
    }

    return optionsMap;
  }, [data?.data?.activity_type?.id, dropdowns]);

  const formData =
    isEditMode && data?.data ? mapActivityDataToForm(data.data, dropdowns) : {};

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className='px-4'>
      <PageHeader title={'Activities'} showBackButton={true} />
      {isFetching || isDropdownLoading ? (
        <Loader />
      ) : (
        <CustomForm
          title={'Activity'}
          formDetails={activityFormConfig}
          data={formData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          fetchOptionsMap={fetchOptionsMap}
        />
      )}
    </div>
  );
}
