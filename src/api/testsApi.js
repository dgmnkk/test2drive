import { fetchData } from './fetchInstance';

export const getTests = async () => {
  return fetchData('/tests', {
    method: 'GET',
  });
};

export const getTestById = async (id) => {
  return fetchData(`/tests/${id}`, {
    method: 'GET',
  });
};