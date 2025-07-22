import axios from 'axios';

const API_KEY = '51376871-d210e7f13e39905b8a62b8cdf';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query, page = 1) {
  return axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: page,
      },
    })
    .then(response => response.data);
}
