import { fetchData } from './fetchInstance';

export const getUserProfile = async () => {
  const token = sessionStorage.getItem('accessToken');
  return fetchData('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfileDetails = async (profileData) => {
  const token = sessionStorage.getItem('accessToken');
  return fetchData('/users/me/profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
};
