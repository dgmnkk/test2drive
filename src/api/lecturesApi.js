import { fetchData } from './fetchInstance';


export const getLectureCategories = async () => {
  const token = sessionStorage.getItem('token');
  return fetchData('/lectures/categories', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getLectureById = async (lectureId) => {
  const token = sessionStorage.getItem('token');
  return fetchData(`/lectures/${lectureId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const markLectureAsRead = async (lectureId) => {
  const token = sessionStorage.getItem('token');
  return fetchData(`/lectures/${lectureId}/mark-as-read`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getReadLectures = async () => {
  const token = sessionStorage.getItem('token');
  return fetchData('/lectures/read', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
