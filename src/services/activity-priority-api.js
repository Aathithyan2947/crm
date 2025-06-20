import axiosInstance from '@/lib/axios-instance';

export const createActivityPriority = (data) => {
  return axiosInstance.post(
    '/activity_priority/create_activity_priority',
    data
  );
};

export const getActivityPriorityListing = () => {
  return axiosInstance.get('/activity_priority/list_activity_priorities');
};

export const getActivityPriority = (activity_id) => {
  return axiosInstance.get(
    `/activity_priority/get_activity_priority?id=${activity_id}`
  );
};

export const updateActivityPriority = (activity_id, data) => {
  return axiosInstance.put(
    `/activity_priority/${activity_id}/update_activity_priority`,
    data
  );
};
