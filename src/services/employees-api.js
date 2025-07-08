import axiosInstance from '@/lib/axios-instance';

export const createEmployee = (data) => {
  return axiosInstance.post('/employee/create_employee', data);
};

export const getEmployeeListing = (params) => {
  return axiosInstance.get('/employee/list_employees', {
    params,
  });
};

export const getEmployee = (employeeId, data) => {
  return axiosInstance.get(`/employee/get_employee?id=${employeeId}`, data);
};

export const updateEmployee = (employeeId, data) => {
  return axiosInstance.put(`/employee/${employeeId}/update_employee`, data);
};

export const getEmployeeNames = () => {
  return axiosInstance.get('/employee/get_employee_names');
};

export const getSuperiorEmployeeFilter = (params = {}, config = {}) => {
  return axiosInstance.get('/employee/list_superior_employees', {
    params,
    ...config,
  });
};

export const getEmployeeGroupFilter = (params = {}, config = {}) => {
  return axiosInstance.get('/employee_groups/get_employee_group_names', {
    params,
    ...config,
  });
};
