import { fetchData } from './fetchInstance';

export const login = async (email, password) => {
  return fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};
