import axiosInstance from '@/lib/axios-instance';

export const createActivityType = (data) => {
  return axiosInstance.post('/activity_type/create_activity_type', data);
};

export const getActivityTypeListing = () => {
  return axiosInstance.get('/activity_type/list_activity_types');
};

export const getActivityType = (activity_id) => {
  return axiosInstance.get(
    `/activity_type/get_activity_type?id=${activity_id}`
  );
};

export const updateActivityType = (activity_id) => {
  return axiosInstance.post(
    `/activity_type/${activity_id}/update_activity_type`,
    data
  );
};
