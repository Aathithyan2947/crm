'use client';

import { useMemo } from 'react';
import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import Loader from '@/components/ui/loader';
import { activityOutcomeFormConfig } from '@/config/form-config/activity-outcome-config';
import { SETTINGS_MODULE_ROUTES } from '@/helpers/enums';
import {
  createActivityOutcome,
  getActivityOutcome,
  updateActivityOutcome,
} from '@/services/activity-outcome-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { makeCancelableFetcher } from '@/lib/cancel-token';
import { getActivityTypeName } from '@/services/activity-type-api';
import { mapActivityOutcomeDataToForm } from '@/helpers/data-format';

export default function ManageActivityOutcome() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['activity_outcome', id],
    queryFn: () => getActivityOutcome(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: createActivityOutcome,
    onSuccess: () => {
      toast.success('Activity Outcome Created!');
      queryClient.invalidateQueries({
        queryKey: ['activity_outcome'],
      });
      router.push(SETTINGS_MODULE_ROUTES.ACTIVITY_OUTCOME);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Failed to create activity outcome'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateActivityOutcome(id, formData),
    onSuccess: () => {
      toast.success('Activity Outcome Updated!');
      queryClient.invalidateQueries({
        queryKey: ['activity_outcome'],
      });
      queryClient.invalidateQueries({
        queryKey: ['activity_outcome', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to update Activity outcome'
      );
    },
  });

  const fetchOptionsMap = useMemo(() => {
    return {
      getActivityTypeNames: makeCancelableFetcher(
        'activity_types',
        async (searchValue, config) => {
          const res = await getActivityTypeName({
            params: { search: searchValue },
            ...config,
          });
          return res?.data?.data?.map((type) => ({
            label: type.name,
            value: type.id,
          }));
        }
      ),
    };
  }, []);

  const handleSubmit = (formData) => {
    const submissionData = {
      ...formData,
      outcomes: formData.outcomes.map((item) => item.value),
    };

    if (isEditMode) {
      updateMutation.mutate(submissionData);
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const formData =
    isEditMode && data ? mapActivityOutcomeDataToForm(data?.data) : {};

  return (
    <div className='px-4'>
      <PageHeader title={'Activity Outcome'} showBackButton={true} />
      {isFetching ? (
        <Loader />
      ) : (
        <CustomForm
          title={'Activity Outcome'}
          formDetails={activityOutcomeFormConfig}
          data={formData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          fetchOptionsMap={fetchOptionsMap}
        />
      )}
    </div>
  );
}
