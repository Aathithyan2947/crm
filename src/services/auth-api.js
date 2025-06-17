import axiosInstance from '@/lib/axios-instance';

export const initiateLogin = (data) => {
  return axiosInstance.post('auth/initiate', data);
};

export const verifyAuth = (data) => {
  return axiosInstance.post('auth/verify_or_login', data);
};

export const resetPassword = (data) => {
  return axiosInstance.post('auth/reset_password', data);
};
