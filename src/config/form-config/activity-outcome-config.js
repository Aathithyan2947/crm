export const activityOutcomeFormConfig = [
  {
    label: 'Name of the Group',
    name: 'group_name',
    type: 'text',
    validation: { required: true },
  },
  {
    label: 'Activity Types',
    name: 'activity_type_ids',
    type: 'multi-select',
    options: [],
    validation: { required: true },
    fetchOptions: 'getActivityTypeNames',
    debounceDelay: 300,
  },
  {
    label: 'Outcomes',
    name: 'outcomes',
    type: 'dynamic-input',
    validation: { required: true },
  },
];
