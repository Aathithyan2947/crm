'use client';

import { useMemo } from 'react';
import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import Loader from '@/components/ui/loader';
import { employeeFormConfig } from '@/config/form-config/employees-config';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createEmployee,
  getEmployee,
  getEmployeeGroupFilter,
  getSuperiorEmployeeFilter,
  updateEmployee,
} from '@/services/employees-api';
import { mapEmployeeDataToForm } from '@/helpers/data-format';
import { makeCancelableFetcher } from '@/lib/cancel-token';
import { DASHBOARD_ROUTES } from '@/helpers/enums';
import { getPartyNames } from '@/services/parties-api';

export default function ManageEmployee() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEditMode = id !== 'new';

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id).then((res) => res.data),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Employee Created!');
      queryClient.invalidateQueries({ queryKey: ['employees_listing'] });
      router.push(DASHBOARD_ROUTES.EMPLOYEES);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateEmployee(id, formData),
    onSuccess: () => {
      toast.success('Employee Updated!');
      queryClient.invalidateQueries({ queryKey: ['employees_listing'] });
      queryClient.invalidateQueries({
        queryKey: ['employee', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message, 'Failed to update employee');
    },
  });

  const fetchOptionsMap = useMemo(() => {
    return {
      getEmployeeGroup: makeCancelableFetcher(
        'groups',
        async (searchValue, config) => {
          const res = await getEmployeeGroupFilter(
            { search: searchValue },
            config
          );
          return res?.data?.data?.map((group) => ({
            label: group.name,
            value: group.id,
          }));
        }
      ),
      getPartyNames: makeCancelableFetcher(
        'parties',
        async (searchValue, config) => {
          const res = await getPartyNames(
            { search: searchValue },
            config
          );
          return res?.data?.data?.map((party) => ({
            label: `${party.party_name} (${party.party_code})`,
            value: party.id
          }))
        }
      ),
      getSuperiorName: makeCancelableFetcher(
        'superiors',
        async (searchValue, config) => {
          const res = await getSuperiorEmployeeFilter(
            { search: searchValue },
            config
          );
          return res?.data?.data?.map((sup) => ({
            label: sup.name,
            value: sup.id,
          }));
        }
      ),
    };
  }, []);

  const formData =
    isEditMode && data?.data ? mapEmployeeDataToForm(data.data) : {};

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className='px-4'>
      <PageHeader title={'Employees'} showBackButton={true} />
      {isFetching ? (
        <Loader />
      ) : (
        <CustomForm
          title={'Employee'}
          formDetails={employeeFormConfig}
          data={formData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          fetchOptionsMap={fetchOptionsMap}
        />
      )}
    </div>
  );
}
