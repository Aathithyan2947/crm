'use client';

import { useMemo } from 'react';
import CustomForm from '@/components/ui/custom-form';
import PageHeader from '@/components/ui/page-header';
import Loader from '@/components/ui/loader';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DASHBOARD_ROUTES } from '@/helpers/enums';

import { partyFormConfig } from '@/config/form-config/parties-config';
import { createParty, getParty, updateParty } from '@/services/parties-api';
import { getDropdownConfigs } from '@/services/customization-api';

export default function ManagePartyPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = id !== 'new';

  // Fetch existing party data for edit
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['party', id],
    queryFn: () => getParty(id).then((res) => res.data),
    enabled: isEditMode,
  });

  // Create Party Mutation
  const createMutation = useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      toast.success('Party created successfully!');
      queryClient.invalidateQueries({ queryKey: ['parties_listing'] });
      router.push(DASHBOARD_ROUTES.PARTIES);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create party');
    },
  });

  // Update Party Mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => updateParty(id, formData),
    onSuccess: () => {
      toast.success('Party updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['parties_listing'] });
      queryClient.invalidateQueries({
        queryKey: ['party', id],
        exact: true,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update party');
    },
  });

  // Fetch all dropdowns in a single query on mount
  const { data: dropdowns, isLoading: isDropdownLoading } = useQuery({
    queryKey: ['party_dropdowns'],
    queryFn: async () => {
      const attributes = [
        'party_role',
        'work_type',
        'business_status',
        'business_type',
        'office_type',
      ];

      const result = {};
      for (const attr of attributes) {
        try {
          const res = await getDropdownConfigs('Party', attr);
          const items = res?.data?.data?.attributes?.[attr] || [];
          result[attr] = items.map((item) => ({
            label: item.config_value || item.config_key,
            value: item.config_key,
          }));
        } catch (err) {
          console.error(`Error fetching ${attr}:`, err);
          result[attr] = [];
        }
      }

      return result;
    },
  });

  // Provide fetchOptionsMap as static sources
  const fetchOptionsMap = useMemo(() => {
    if (!dropdowns) return {};

    return {
      getPartyRoles: () => dropdowns['party_role'] || [],
      getWorkTypes: () => dropdowns['work_type'] || [],
      getBusinessStatuses: () => dropdowns['business_status'] || [],
      getBusinessTypes: () => dropdowns['business_type'] || [],
      getOfficeTypes: () => dropdowns['office_type'] || [],
      getTeamMemberRoles: () => dropdowns['party_role'] || [],
    };
  }, [dropdowns]);

  const formData = isEditMode && data?.data ? data.data : {};

  const handleSubmit = (formData) => {
    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className='px-4'>
      <PageHeader title='Parties' showBackButton={true} />
      {isFetching || isDropdownLoading ? (
        <Loader />
      ) : (
        <CustomForm
          title='Party'
          formDetails={partyFormConfig}
          data={formData}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          fetchOptionsMap={fetchOptionsMap}
        />
      )}
    </div>
  );
}
