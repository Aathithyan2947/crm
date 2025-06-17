import axios from 'axios';
import axiosInstance from './axios-instance';

export const makeCancelableFetcher = (key, fetcherFn, delay = 500) => {
  let timeoutId;

  return async (searchValue = '') => {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          const cancelToken = axiosInstance.generateCancelToken(key);
          const result = await fetcherFn(searchValue, { cancelToken });
          resolve(result);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error(`${key} fetch failed`, error);
          }
          resolve([]);
        }
      }, delay);
    });
  };
};
