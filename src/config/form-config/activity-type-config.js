export const activityFormConfig = [
  {
    label: 'Name of the Activity Type',
    name: 'name',
    type: 'text',
    validation: { required: true },
  },
  {
    label: 'Description',
    name: 'description',
    type: 'text-area',
    validation: { required: true },
  },
  {
    label: 'Status',
    name: 'status',
    type: 'toggle',
    validation: { required: true },
  },
];
