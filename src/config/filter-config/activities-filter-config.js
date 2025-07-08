export const activitiesFilterConfig = [
  {
    type: 'searchable-select',
    name: 'employee_id',
    label: 'Employee Name',
    fetchOptions: 'getEmployeeFilter',
  },
  {
    type: 'searchable-select',
    name: 'party_id',
    label: 'Party Name',
    fetchOptions: 'getPartyFilter',
  },
  {
    type: 'searchable-select',
    name: 'activity_type_id',
    label: 'Activity Name',
    fetchOptions: 'getActivityTypeFilter',
  },
  {
    type: 'searchable-select',
    name: 'activity_status',
    label: 'Activity Status',
    fetchOptions: 'getActivityStatusFilter',
  },
  {
    type: 'searchable-select',
    name: 'activity_priority_id',
    label: 'Activity Priority',
    fetchOptions: 'getActivityPriorityFilter',
  },
];
