import axiosInstance from '@/lib/axios-instance';

export const createActivityOutcome = (data) => {
  return axiosInstance.post('/activity_outcome/create_activity_outcome', data);
};

export const getActivityOutcomeListing = () => {
  return axiosInstance.get('/activity_outcome/list_activity_outcomes');
};

export const getActivityOutcome = (activity_id) => {
  return axiosInstance.get(
    `/activity_outcome/activity_outcome_group?id=${activity_id}`
  );
};

export const updateActivityOutcome = (activity_id, data) => {
  return axiosInstance.put(
    `/activity_outcome/${activity_id}/update_activity_outcome`,
    data
  );
};
