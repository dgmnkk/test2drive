import { fetchData } from './fetchInstance';

export const login = async (email, password) => {
  return fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async ({firstName, lastName, email, password}) => {
  return fetchData('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstName, lastName}),
  });
};