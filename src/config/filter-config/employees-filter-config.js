export const employeeFilterConfig = [
  {
    type: 'text',
    name: 'name',
    label: 'Employee Name',
  },
  {
    type: 'text',
    name: 'emp_code',
    label: 'Employee Code',
  },
  {
    type: 'searchable-select',
    name: 'employee_group_id',
    label: 'Employee Group',
    fetchOptions: 'getEmployeeGroupFilter',
  },
];
