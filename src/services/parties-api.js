import axiosInstance from '@/lib/axios-instance';

export const createParty = (data) => {
  return axiosInstance.post('/party/create_party', data);
};

export const updateParty = (id, data) => {
  return axiosInstance.put(`/party/update_party?id=${id}`, data);
};

export const getPartyNames = () => {
  return axiosInstance.get('/party/get_party_names')
}

export const getPartiesListing = (params) => {
  return axiosInstance.get('/party/list_parties', {
    params,
  });
};

export const getParty = (id) => {
  return axiosInstance.get(`/party/get_party?id=${id}`);
};
