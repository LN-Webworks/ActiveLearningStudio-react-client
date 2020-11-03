import axios from 'axios';

const gapiBaseUrl = 'https://classroom.googleapis.com/v1';

const getStudentCourses = (token) => {
  return axios({
    method: 'get',
    url: `${gapiBaseUrl}/courses`,
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then(function (response) {
    return response;
  });
}

export default {
    getStudentCourses
};
