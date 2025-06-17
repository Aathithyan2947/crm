import axiosInstance from '@/lib/axios-instance';

export const createEmployeeGroup = (data) => {
  return axiosInstance.post('/employee_groups/create_employee_group', data);
};

export const getEmployeeGroupListing = (params = {}, config = {}) => {
  return axiosInstance.get('/employee_groups/list_employee_groups', {
    ...config,
    params,
  });
};

export const getEmployeeGroup = (groupId) => {
  return axiosInstance.get(`/employee_groups/get_employee_group?id=${groupId}`);
};

export const updateEmployeeGroup = (groupId, data) => {
  return axiosInstance.put(
    `/employee_groups/${groupId}/update_employee_group`,
    data
  );
};
