'use client';

import CustomForm from '@/components/ui/custom-form';
import CustomTable from '@/components/ui/custom-table';
import PageHeader from '@/components/ui/page-header';
import { employeeGroupFormConfig } from '@/config/form-config/employees-group-config';
import { User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import {
  createEmployeeGroup,
  getEmployeeGroup,
  updateEmployeeGroup,
} from '@/services/employees-group-api';
import { ROUTES } from '@/helpers/enums';

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
      router.push(ROUTES.EMPLOYEES_GROUP);
    },
    onError: () => {
      toast.error('Failed to create employee group');
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
    onError: () => {
      toast.error('Failed to update employee group');
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
    <div>
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
        <div className='mt-5'>
          <CustomTable
            tableName='Employees'
            data={tableData}
            buttonTile={'Add New'}
            buttonIcon={<User size={16} />}
            buttonPath={`${ROUTES.EMPLOYEES}/new`}
            showActions={false}
            currPage={1}
            totalPages={1}
            setCurrpage={() => {}}
          />
        </div>
      )}
    </div>
  );
}
