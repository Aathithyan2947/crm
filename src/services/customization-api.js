import axiosInstance from '@/lib/axios-instance';

export const getDropdownModels = () => {
  return axiosInstance.get('/config/dropdown_models');
};

export const getModelFields = (model) => {
  return axiosInstance.get(`/config/dropdown_fields?model=${model}`);
};

export const getDropdownConfigs = (modelName, attribute) => {
  const params = new URLSearchParams({ model_name: modelName });
  if (attribute !== undefined) {
    params.append('attribute', attribute);
  }
  return axiosInstance.get(
    `/app_config/list_app_configurations?${params.toString()}`
  );
};

export const updateDropdownConfig = (modelName, attribute, data) => {
  return axiosInstance.put(
    `/app_config/update_app_configurations?model_name=${modelName}&attribute=${attribute}`,
    { options: data }
  );
};

export const createDropdownConfig = (data) => {
  return axiosInstance.post('/app_config/create_app_configurations', data);
};
