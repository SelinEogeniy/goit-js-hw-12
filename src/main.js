import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreButton = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  query = e.currentTarget.elements['search-text'].value.trim();
  if (!query) {
    iziToast.error({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  page = 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query.',
        position: 'bottomRight',
      });
      return;
    }

    createGallery(data.hits);
    if (data.hits.length < totalHits) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    e.currentTarget.elements['search-text'].value = '';
  }
});

loadMoreButton.addEventListener('click', async () => {
  page++;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / 15);
    if (page >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    } else {
      showLoadMoreButton();
    }

    scrollPage();
  } catch (error) {
    iziToast.error({
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
