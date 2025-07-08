import axiosInstance from '@/lib/axios-instance';

export const getActivityListing = (params) => {
  return axiosInstance.get('/activity/list_activities', {
    params,
  });
};

export const updateActivity = (id, data) => {
  return axiosInstance.put(`/activity/update_activity/${id}`, data);
};

export const getActivity = (id) => {
  return axiosInstance.get(`/activity/get_activity/${id}`);
};

export const createActivity = (data) => {
  return axiosInstance.post('/activity/create_activity', data);
};
