export const mapEmployeeDataToForm = (data) => {
  if (!data) return {};

  return {
    ...data,
    date_of_birth: data.date_of_birth ? data.date_of_birth.slice(0, 10) : '',
    superior_id: data.superior?.id || null,
    employee_group_ids: data.groups?.map((group) => group.id) || [],
  };
};
