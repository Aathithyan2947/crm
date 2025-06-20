'use client';

import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import { activityPriorityFormConfig } from '@/config/form-config/activity-priority-config';
import { SETTINGS_MODULE_ROUTES } from '@/helpers/enums';
import {
  createActivityPriority,
  getActivityPriority,
  updateActivityPriority,
} from '@/services/activity-priority-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ManageActivityPriority() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['activity_priority', id],
    queryFn: () => getActivityPriority(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: createActivityPriority,
    onSuccess: () => {
      toast.success('Activity Priority Created!');
      queryClient.invalidateQueries({
        queryKey: ['activity_priority'],
      });
      router.push(SETTINGS_MODULE_ROUTES.ACTIVITY_PRIORITY);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to create activity priority'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateActivityPriority(id, formData),
    onSuccess: () => {
      toast.success('Activity Priority Updated!');
      queryClient.invalidateQueries({
        queryKey: ['activity_priority'],
      });
      queryClient.invalidateQueries({
        queryKey: ['activity_priority', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to update Activity priority'
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
      <PageHeader title={'Activity Priority'} showBackButton={true} />
      <CustomForm
        title={'Actitvity Priority'}
        formDetails={activityPriorityFormConfig}
        data={formData}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isLoading || updateMutation.isLoading || isFetching
        }
      />
    </div>
  );
}
