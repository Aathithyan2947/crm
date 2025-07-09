'use client';

import CustomForm from '@/components/ui/custom-form';
import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { employeeGroupFormConfig } from '@/config/form-config/employees-group-config';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import {
  createEmployeeGroup,
  getEmployeeGroup,
  updateEmployeeGroup,
} from '@/services/employees-group-api';
import { SETTINGS_MODULE_ROUTES } from '@/helpers/enums';

export default function ManageEmployeeGroup() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['employee-group', id],
    queryFn: () => getEmployeeGroup(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: createEmployeeGroup,
    onSuccess: () => {
      toast.success('Employee Group Created!');
      queryClient.invalidateQueries({
        queryKey: ['employees_group_listing'],
      });
      router.push(SETTINGS_MODULE_ROUTES.EMPLOYEES_GROUP);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to create employee group'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateEmployeeGroup(id, formData),
    onSuccess: () => {
      toast.success('Employee Group Updated!');
      queryClient.invalidateQueries({
        queryKey: ['employees_group_listing'],
      });
      queryClient.invalidateQueries({
        queryKey: ['employee-group', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || 'Failed to update employee group'
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

  const tableData = isEditMode && data ? data?.data?.employees : [];

  return (
    <div className='px-4 space-y-6'>
      <PageHeader title={'Employees Group'} showBackButton={true} />

      <CustomForm
        title={'Employee Group'}
        formDetails={employeeGroupFormConfig}
        data={formData}
        onSubmit={handleSubmit}
        isLoading={
          createMutation.isLoading || updateMutation.isLoading || isFetching
        }
      />

      {isEditMode && !isFetching && (
        <CustomTable
          tableName='Employees'
          data={tableData}
          showActions={false}
          currPage={1}
          totalPages={1}
          setCurrPage={() => { }}
        />
      )}
    </div>
  );
}