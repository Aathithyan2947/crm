'use client';

import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import { activityTypeFormConfig } from '@/config/form-config/activity-type-config';
import { DASHBOARD_ROUTES } from '@/helpers/enums';
import {
  createActivityType,
  getActivityType,
  updateActivityType,
} from '@/services/activity-type-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ManageActivityType() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['actitvity-type', id],
    queryFn: () => getActivityType(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: createActivityType,
    onSuccess: () => {
      toast.success('Activity Type Created!');
      queryClient.invalidateQueries({
        queryKey: ['activity_type'],
      });
      router.push(DASHBOARD_ROUTES.ACTIVITY_TYPE);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to create activity type'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateActivityType(id, formData),
    onSuccess: () => {
      toast.success('Activity Type Updated!');
      queryClient.invalidateQueries({
        queryKey: ['activity_type'],
      });
      queryClient.invalidateQueries({
        queryKey: ['actitvity-type', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to update Activity type'
      );
    },
  });

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const formData = isEditMode && data?.data ? data?.data : {};

  return (
    <div className='px-4'>
      <PageHeader title={'Activity Type'} showBackButton={true} />
      <CustomForm
        title={'Actitvity Type'}
        formDetails={activityTypeFormConfig}
        data={formData}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isLoading || updateMutation.isLoading || isFetching
        }
      />
    </div>
  );
}
